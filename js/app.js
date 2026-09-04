/* app.js — hash 路由 + 渲染（docs/SCHEMA.md §5）
 * 五个视图渲染进同一 #app 容器，hashchange 驱动：
 *   #/            学习地图
 *   #/lesson/{id} 知识点页（8 要素 + 费曼 + 判题 + 朗读 + 上一课/下一课）
 *   #/review      今日复习队列
 *   #/quiz/{moduleId} 模块混排测验（结果不计入 ProgressStore）
 *   #/graph       全站知识关联图谱
 * 约定：无 setInterval；无外部请求；内容 HTML 来自受信数据文件直接渲染，
 * 但属性值与用户输入文本一律 escAttr 转义；事件统一 addEventListener（含委托）。
 */
(function () {
  'use strict';

  // ===================== 小工具 =====================

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* 属性值/纯文本插值用转义（内容正文的受信 HTML 不经此处理） */
  function escAttr(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function optionLabel(i) { return String.fromCharCode(65 + i); }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  var TYPE_NAMES = { single: '单选', judge: '判断', fill: '填空', order: '排序', code: '代码' };
  function typeName(t) { return TYPE_NAMES[t] || String(t); }

  function stars(d) {
    var s = '';
    for (var i = 1; i <= 3; i++) s += (i <= d ? '★' : '☆');
    return s;
  }

  function fmtDue(ts) {
    if (!ts) return '已到期';
    var d = new Date(ts);
    var now = new Date();
    var hm = pad2(d.getHours()) + ':' + pad2(d.getMinutes());
    if (d.toDateString() === now.toDateString()) return '今天 ' + hm;
    var tomorrow = new Date(now.getTime() + 86400000);
    if (d.toDateString() === tomorrow.toDateString()) return '明天 ' + hm;
    return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm;
  }

  // ===================== 模块级状态 =====================

  var app = null;                 // #app 容器
  var expandedModules = {};       // moduleId → 是否展开课程树（会话内记忆）
  var injectedAnimCss = {};       // lessonId → 动画私有 CSS 是否已注入（一次性 <style>）

  // ===================== 路由 =====================

  function parseRoute() {
    var h = window.location.hash || '#/';
    if (h === '#' || h === '') h = '#/';
    var m;
    if (h === '#/') return { name: 'map' };
    if (h === '#/review') return { name: 'review' };
    if (h === '#/graph') return { name: 'graph' };
    m = h.match(/^#\/lesson\/(.+)$/);
    if (m) return { name: 'lesson', id: decodeURIComponent(m[1]) };
    m = h.match(/^#\/quiz\/(.+)$/);
    if (m) return { name: 'quiz', id: decodeURIComponent(m[1]) };
    return null; // 未知 hash
  }

  function render() {
    // 离开课程页时停掉可能在进行的朗读
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* 忽略 */ }
    }
    app.innerHTML = ''; // 每次渲染前清空容器，旧监听随节点一起丢弃，不残留

    var route = parseRoute();
    if (!route) { window.location.replace('#/'); return; } // 未知 hash → 回地图

    setActiveNav(route);
    if (route.name === 'map') renderMap();
    else if (route.name === 'lesson') renderLesson(route.id);
    else if (route.name === 'review') renderReview();
    else if (route.name === 'quiz') renderQuiz(route.id);
    else if (route.name === 'graph') renderGraph();
    refreshNavBadge();
    window.scrollTo(0, 0);
  }

  function setActiveNav(route) {
    var links = $all('.nav-links a');
    links.forEach(function (a) { a.classList.remove('active'); });
    var name = route && (route.name === 'lesson' || route.name === 'quiz') ? 'map' : (route && route.name);
    var hrefMap = { map: '#/', review: '#/review', graph: '#/graph' };
    if (hrefMap[name]) {
      links.forEach(function (a) {
        if (a.getAttribute('href') === hrefMap[name]) a.classList.add('active');
      });
    }
  }

  function refreshNavBadge() {
    var badge = document.getElementById('nav-progress');
    if (!badge) return;
    var s = window.ProgressStore.stats();
    badge.textContent = s.mastered + '/' + s.total;
    badge.classList.toggle('nav-badge--active', s.mastered > 0);
  }

  // ===================== 全局点击委托（导航类动作） =====================

  function bindDelegation() {
    app.addEventListener('click', function (ev) {
      if (!ev.target || typeof ev.target.closest !== 'function') return;
      var el = ev.target.closest('[data-lesson],[data-quiz],[data-nav],[data-toggle-module]');
      if (!el || !app.contains(el)) return;
      if (el.hasAttribute('data-lesson')) {
        window.location.hash = '#/lesson/' + el.getAttribute('data-lesson');
      } else if (el.hasAttribute('data-quiz')) {
        window.location.hash = '#/quiz/' + el.getAttribute('data-quiz');
      } else if (el.hasAttribute('data-nav')) {
        window.location.hash = el.getAttribute('data-nav');
      } else if (el.hasAttribute('data-toggle-module')) {
        toggleModule(el.getAttribute('data-toggle-module'));
      }
    });
    // 键盘可达：模块头 role=button 支持 Enter/Space 展开
    app.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      if (!ev.target || typeof ev.target.closest !== 'function') return;
      var el = ev.target.closest('[data-toggle-module]');
      if (el && app.contains(el)) {
        ev.preventDefault();
        toggleModule(el.getAttribute('data-toggle-module'));
      }
    });
  }

  function toggleModule(moduleId) {
    expandedModules[moduleId] = !expandedModules[moduleId];
    var head = $('[data-toggle-module="' + escAttr(moduleId) + '"]', app);
    var card = head ? head.closest('.module-card') : null;
    if (!card) { renderMap(); return; }
    var open = !!expandedModules[moduleId];
    var tree = $('.lesson-tree', card);
    if (tree) tree.hidden = !open;
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
    var caret = $('.module-caret', card);
    if (caret) caret.textContent = open ? '▾' : '▸';
  }

  // ===================== 公共小部件 =====================

  function placeholderHTML(msg) {
    return '<div class="placeholder"><span class="placeholder-icon">🚧</span>' +
      '<p>' + msg + '</p>' +
      '<p><a class="btn btn-ghost" href="#/">返回学习地图</a></p></div>';
  }

  function hasData() {
    return !!(window.SITE_DATA && window.SITE_DATA.modules && window.SITE_DATA.modules.length);
  }

  function dotHTML(lessonId) {
    var cls = 'dot dot-todo';
    var label = '未学';
    if (window.ProgressStore.mastered(lessonId)) {
      cls = 'dot dot-done'; label = '已掌握';
    } else if (window.ProgressStore.get(lessonId)) {
      cls = 'dot dot-doing'; label = '进行中';
    }
    return '<span class="' + cls + '" role="img" aria-label="' + label + '" title="' + label + '"></span>';
  }

  function lessonLink(lessonId) {
    var l = window.SITE_DATA.getLesson(lessonId);
    if (!l) return '<span class="chip chip-ghost">' + escAttr(lessonId) + '</span>';
    return '<button type="button" class="chip chip-link" data-lesson="' + escAttr(l.id) + '">' + escAttr(l.title || l.id) + '</button>';
  }

  function lessonLinkChips(list, emptyText) {
    if (!Array.isArray(list) || !list.length) {
      return '<span class="chip chip-empty">' + emptyText + '</span>';
    }
    return list.map(lessonLink).join('');
  }

  function confusableHTML(c) {
    return '<div class="confusable-card"><span class="confusable-label">易混</span>' +
      lessonLink(c.other) + '<p class="confusable-tip">' + (c.tip || '') + '</p></div>';
  }

  // ===================== 视图 1：学习地图 #/ =====================

  function renderMap() {
    if (!hasData()) {
      app.innerHTML = '<section class="view">' +
        placeholderHTML('内容加载中 / 暂无数据：还没有任何模块注册（data/*.js 尚未提供内容）。') +
        '</section>';
      return;
    }
    var s = window.ProgressStore.stats();
    var due = window.ProgressStore.dueForReview();
    var pct = s.total ? Math.round((s.mastered / s.total) * 100) : 0;

    var html = '<section class="view view-map">';
    html += '<header class="map-head"><h1>学习地图</h1>' +
      '<p class="view-sub">从数学地基到面试实战，把大模型算法岗拆成一口口吃得完的小课。</p>' +
      '<div class="progress-line">' +
      '<div class="progress-bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100">' +
      '<div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="progress-text">已掌握 <b>' + s.mastered + '</b>/' + s.total + ' · 已访问 ' + s.visited + ' 课</span>' +
      '</div></header>';

    if (due.length) {
      html += '<a class="due-card" href="#/review">⏰ <b>今日复习</b>：有 ' + due.length +
        ' 课到了复习时间，点击进入 →</a>';
    } else {
      html += '<div class="due-card due-card--empty">🌱 今日暂无到期复习，按地图顺序继续推进吧</div>';
    }

    html += '<div class="module-grid">';
    window.SITE_DATA.modules.forEach(function (mod) {
      var lessons = mod.lessons || [];
      var masteredCount = lessons.filter(function (l) {
        return window.ProgressStore.mastered(l.id);
      }).length;
      var open = !!expandedModules[mod.module];
      html += '<article class="module-card" data-module="' + escAttr(mod.module) + '" style="--module-color:' + escAttr(mod.color || '#6366f1') + '">';
      html += '<div class="module-head" data-toggle-module="' + escAttr(mod.module) + '" role="button" tabindex="0" aria-expanded="' + open + '">' +
        '<span class="module-icon" aria-hidden="true">' + escAttr(mod.icon || '📘') + '</span>' +
        '<span class="module-titles"><span class="module-title">' + escAttr(mod.title || mod.module) + '</span>' +
        '<span class="module-summary">' + escAttr(mod.summary || '') + '</span></span>' +
        '<span class="module-progress">' + masteredCount + '/' + lessons.length + '</span>' +
        '<span class="module-caret" aria-hidden="true">' + (open ? '▾' : '▸') + '</span></div>';
      html += '<div class="module-actions"><button type="button" class="btn btn-small btn-quiz" data-quiz="' + escAttr(mod.module) + '">🎲 混排测验</button></div>';
      html += '<div class="lesson-tree"' + (open ? '' : ' hidden') + '>';
      if (!lessons.length) {
        html += '<p class="lesson-tree-empty">本模块内容整理中，敬请期待</p>';
      }
      lessons.forEach(function (l) {
        html += '<button type="button" class="lesson-row" data-lesson="' + escAttr(l.id) + '">' +
          dotHTML(l.id) +
          '<span class="lesson-row-title">' + escAttr(l.title || l.id) + '</span>' +
          '<span class="lesson-row-meta">约 ' + escAttr(l.estMinutes || 10) + ' 分钟</span></button>';
      });
      html += '</div></article>';
    });
    html += '</div></section>';
    app.innerHTML = html;
  }

  // ===================== 视图 2：知识点页 #/lesson/{id} =====================

  function renderLesson(id) {
    var lesson = hasData() ? window.SITE_DATA.getLesson(id) : null;
    if (!lesson) {
      app.innerHTML = '<section class="view">' +
        placeholderHTML('内容加载中 / 暂无数据：课程「' + escAttr(id) + '」尚未收录。') +
        '</section>';
      return;
    }
    var mod = window.SITE_DATA.moduleOf(id) || {};
    var color = mod.color || '#6366f1';
    window.ProgressStore.markVisited(id);

    var html = '<article class="view view-lesson" style="--module-color:' + escAttr(color) + '">';

    // 面包屑
    html += '<nav class="breadcrumb" aria-label="面包屑"><a href="#/">学习地图</a>' +
      '<span class="crumb-sep">/</span><span class="crumb-module">' + escAttr(mod.title || '') + '</span>' +
      '<span class="crumb-sep">/</span><span class="crumb-here">' + escAttr(lesson.title || id) + '</span></nav>';

    // 头部：模块色带 + 标题 + 朗读
    html += '<header class="lesson-hero"><div class="lesson-hero-band" aria-hidden="true"></div>' +
      '<div class="lesson-hero-main">' +
      '<p class="lesson-kicker">' + escAttr(mod.icon || '') + ' ' + escAttr(mod.title || '') + ' · 约 ' + escAttr(lesson.estMinutes || 10) + ' 分钟</p>' +
      '<h1 class="lesson-title">' + escAttr(lesson.title || id) + '</h1>' +
      '<p class="lesson-oneliner">' + (lesson.oneLiner || '') + '</p></div>' +
      '<button type="button" id="speak-btn" class="btn btn-small">🔊 朗读本课</button>' +
      '</header>';

    // ① 生活类比
    var an = lesson.analogy || {};
    html += '<section class="lesson-sec sec-analogy"><h2 class="sec-title"><span class="sec-no">①</span> 生活类比' +
      (an.title ? ' · ' + escAttr(an.title) : '') + '</h2>' +
      '<blockquote class="analogy-card speak-part">' + (an.body || '') + '</blockquote></section>';

    // ② 小白直觉
    html += '<section class="lesson-sec sec-intuition"><h2 class="sec-title"><span class="sec-no">②</span> 小白直觉</h2>';
    (lesson.intuition || []).forEach(function (sub) {
      html += '<div class="sub-sec speak-part"><h3 class="sub-title">' + (sub.heading || '') + '</h3><p>' + (sub.body || '') + '</p></div>';
    });
    html += '</section>';

    // ③ 原理拆解（formula 公式块居中 + formulaNote 列表）
    html += '<section class="lesson-sec sec-principle"><h2 class="sec-title"><span class="sec-no">③</span> 原理拆解</h2>';
    (lesson.principle || []).forEach(function (sub) {
      html += '<div class="sub-sec speak-part"><h3 class="sub-title">' + (sub.heading || '') + '</h3><p>' + (sub.body || '') + '</p>';
      if (sub.formula) html += '<div class="formula-block"><code class="formula">' + sub.formula + '</code></div>';
      if (sub.formulaNote) html += '<div class="formula-note">' + sub.formulaNote + '</div>';
      html += '</div>';
    });
    html += '</section>';

    // ④ 动画区
    var anim = lesson.animation || {};
    html += '<section class="lesson-sec sec-animation"><h2 class="sec-title"><span class="sec-no">④</span> 动画演示' +
      (anim.title ? ' · ' + escAttr(anim.title) : '') + '</h2>' +
      '<div class="anim-container anim-root">' + (anim.html || '<p class="muted">本课动画整理中…</p>') + '</div></section>';

    // ⑤ 例题区
    html += '<section class="lesson-sec sec-exercises"><h2 class="sec-title"><span class="sec-no">⑤</span> 例题闯关</h2>';
    html += '<div id="mastered-banner" class="mastered-banner" hidden>🎉 已掌握本课！全部例题都答对过，记得按复习计划回来巩固。</div>';
    html += '<div class="ex-list">';
    var record = window.ProgressStore.get(id);
    var answers = (record && record.answers) || {};
    var exercises = lesson.exercises || [];
    exercises.forEach(function (ex, i) {
      html += exerciseCardHTML(ex, i, { prev: answers[i] || null });
    });
    if (!exercises.length) html += '<p class="muted">本课例题整理中…</p>';
    html += '</div></section>';

    // ⑥ 费曼挑战
    var fy = lesson.feynman || {};
    html += '<section class="lesson-sec sec-feynman"><h2 class="sec-title"><span class="sec-no">⑥</span> 费曼挑战</h2>' +
      '<div class="feynman-card"><p class="feynman-prompt">' + (fy.prompt || '') + '</p>' +
      '<textarea id="feynman-input" class="feynman-input" rows="4" placeholder="用你自己的话写下来，写得越白话越好…"></textarea>' +
      '<div class="feynman-actions"><button type="button" id="feynman-toggle" class="btn">📋 对照参考</button></div>' +
      '<div id="feynman-reference" class="feynman-reference" hidden><b>参考表述：</b>' + (fy.reference || '') + '</div>' +
      '</div></section>';

    // ⑦ 知识关联卡
    var rel = lesson.relations || {};
    html += '<section class="lesson-sec sec-relations"><h2 class="sec-title"><span class="sec-no">⑦</span> 知识关联</h2>' +
      '<div class="rel-row"><span class="rel-label">⬅️ 前置</span><span class="rel-chips">' + lessonLinkChips(rel.prerequisites, '无（这是起点课程）') + '</span></div>' +
      '<div class="rel-row"><span class="rel-label">➡️ 后继</span><span class="rel-chips">' + lessonLinkChips(rel.successors, '暂无（可以安心结课）') + '</span></div>';
    (rel.confusables || []).forEach(function (c) { html += confusableHTML(c); });
    html += '</section>';

    // ⑧ 记忆锚点
    var mem = lesson.memory || {};
    html += '<section class="lesson-sec sec-memory"><h2 class="sec-title"><span class="sec-no">⑧</span> 记忆锚点</h2>';
    if (mem.mnemonic) html += '<div class="mnemonic-card"><span class="mnemonic-tag">口诀</span>' + escAttr(mem.mnemonic) + '</div>';
    html += '<div class="selftest-list">';
    (mem.selfTest || []).forEach(function (c, i) {
      html += '<button type="button" class="selftest-card" aria-pressed="false">' +
        '<span class="selftest-q">Q' + (i + 1) + ' · ' + (c.q || '') + '</span>' +
        '<span class="selftest-a">💡 ' + (c.a || '') + '</span></button>';
    });
    html += '</div></section>';

    // 底部：上一课 / 返回地图 / 下一课
    var idx = window.SITE_DATA.lessonIndex(id);
    var all = window.SITE_DATA.allLessons();
    var prevL = idx > 0 ? all[idx - 1] : null;
    var nextL = (idx > -1 && idx < all.length - 1) ? all[idx + 1] : null;
    html += '<footer class="lesson-footer">' +
      (prevL ? '<button type="button" class="btn" data-nav="#/lesson/' + escAttr(prevL.id) + '">← 上一课 · ' + escAttr(prevL.title) + '</button>' : '<span></span>') +
      '<button type="button" class="btn btn-ghost" data-nav="#/">返回地图</button>' +
      (nextL ? '<button type="button" class="btn" data-nav="#/lesson/' + escAttr(nextL.id) + '">下一课 · ' + escAttr(nextL.title) + ' →</button>' : '<span></span>') +
      '</footer>';

    html += '</article>';
    app.innerHTML = html;

    // 动画：css 一次性注入 <style>，js 以动画容器为 root 初始化
    ensureAnimCss(lesson);
    var animRoot = $('.anim-root', app);
    if (animRoot && typeof anim.js === 'function') {
      try { anim.js(animRoot); } catch (err) {
        if (window.console && window.console.warn) window.console.warn('[app] 动画初始化失败：', err);
      }
    }

    // 例题绑定（记录进 ProgressStore）
    $all('.ex-card', app).forEach(function (card) {
      var i = Number(card.getAttribute('data-ex-index'));
      var ex = exercises[i];
      if (!ex) return;
      bindExerciseCard(card, ex, i, {
        record: true,
        lessonId: id,
        onResult: function () {
          refreshMastered(id);
          refreshNavBadge();
        }
      });
    });

    bindLessonExtras();
    refreshMastered(id);
  }

  function ensureAnimCss(lesson) {
    var anim = lesson.animation || {};
    if (!anim.css || injectedAnimCss[lesson.id]) return;
    var st = document.createElement('style');
    st.setAttribute('data-anim-css', lesson.id);
    st.textContent = String(anim.css);
    document.head.appendChild(st);
    injectedAnimCss[lesson.id] = true;
  }

  function refreshMastered(lessonId) {
    var banner = $('#mastered-banner', app);
    if (banner && window.ProgressStore.mastered(lessonId)) banner.hidden = false;
  }

  function bindLessonExtras() {
    // 朗读本课（Web Speech API，不可用时按钮移除）
    var speakBtn = $('#speak-btn', app);
    if (speakBtn) {
      if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') {
        if (speakBtn.parentNode) speakBtn.parentNode.removeChild(speakBtn);
      } else {
        bindSpeak(speakBtn);
      }
    }
    // 费曼参考展开
    var fBtn = $('#feynman-toggle', app);
    var fRef = $('#feynman-reference', app);
    if (fBtn && fRef) {
      fBtn.addEventListener('click', function () {
        fRef.hidden = !fRef.hidden;
        fBtn.textContent = fRef.hidden ? '📋 对照参考' : '🙈 收起参考';
      });
    }
    // 记忆自测卡：点击翻转显示答案
    $all('.selftest-card', app).forEach(function (card) {
      card.addEventListener('click', function () {
        var flipped = card.classList.toggle('flipped');
        card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
      });
    });
  }

  function collectSpeakText() {
    // 用 DOM textContent 取纯文本，避免把 HTML 标签读出来
    var parts = [];
    var title = $('.lesson-title', app);
    if (title) parts.push(title.textContent);
    $all('.speak-part', app).forEach(function (el) {
      var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (t) parts.push(t);
    });
    return parts.join('。');
  }

  function bindSpeak(btn) {
    var synth = window.speechSynthesis;
    var speaking = false;
    function stop() {
      speaking = false;
      btn.textContent = '🔊 朗读本课';
      btn.classList.remove('speaking');
    }
    btn.addEventListener('click', function () {
      if (speaking) {
        try { synth.cancel(); } catch (e) { /* 忽略 */ }
        stop();
        return;
      }
      var text = collectSpeakText();
      if (!text) return;
      var u;
      try { u = new window.SpeechSynthesisUtterance(text); } catch (e) { return; }
      u.lang = 'zh-CN';
      u.rate = 1;
      try {
        var voices = synth.getVoices() || [];
        for (var i = 0; i < voices.length; i++) {
          if (/^zh([-_]|$)/i.test(voices[i].lang || '')) { u.voice = voices[i]; break; }
        }
      } catch (e) { /* 忽略 */ }
      u.onend = stop;
      u.onerror = stop;
      speaking = true;
      btn.textContent = '⏹ 停止朗读';
      btn.classList.add('speaking');
      try { synth.speak(u); } catch (e) { stop(); }
    });
  }

  // ===================== 例题（学习页 / 混排测验共用） =====================

  function exerciseCardHTML(ex, i, opts) {
    opts = opts || {};
    var lastChip = '';
    if (opts.prev) {
      lastChip = '<span class="ex-last ' + (opts.prev.correct ? 'ex-last--ok' : 'ex-last--bad') + '">上次：' +
        (opts.prev.correct ? '答对 ✓' : '答错 ✗') + '</span>';
    }

    var body = '';
    switch (ex.type) {
      case 'single':
        body = '<div class="ex-options">' + (ex.options || []).map(function (opt, oi) {
          return '<label class="ex-option"><input type="radio" name="ex-' + i + '" value="' + oi + '">' +
            '<span class="ex-option-text"><b class="ex-option-key">' + optionLabel(oi) + '</b>' + opt + '</span></label>';
        }).join('') + '</div>';
        break;
      case 'judge':
        body = '<div class="judge-btns">' +
          '<button type="button" class="btn judge-btn" data-judge="true">对 ✓</button>' +
          '<button type="button" class="btn judge-btn" data-judge="false">错 ✗</button></div>';
        break;
      case 'fill':
        body = '<input type="text" class="ex-fill" placeholder="输入你的答案">';
        break;
      case 'order':
        body = '<div class="order-play">' +
          '<div class="order-answer" data-order-answer></div>' +
          '<p class="order-hint-text">点击下方候选项，按正确顺序依次加入；点答案序列中的项可移除。</p>' +
          '<div class="order-pool" data-order-pool>' + (ex.items || []).map(function (it, ii) {
            return '<button type="button" class="order-item" data-idx="' + ii + '">' + it + '</button>';
          }).join('') + '</div></div>';
        break;
      case 'code':
        body = (ex.template ? '<pre class="code-template">' + ex.template + '</pre>' : '') +
          '<textarea class="ex-code" rows="8" spellcheck="false" placeholder="在此补全代码…"></textarea>';
        break;
      default:
        body = '<p class="muted">未知题型</p>';
    }

    return '<article class="ex-card" data-ex-index="' + i + '" data-ex-type="' + escAttr(ex.type) + '">' +
      '<header class="ex-head"><span class="ex-no">第 ' + (i + 1) + ' 题</span>' +
      '<span class="ex-type ex-type--' + escAttr(ex.type) + '">' + escAttr(typeName(ex.type)) + '</span>' +
      '<span class="ex-diff" title="难度">' + stars(ex.difficulty || 1) + '</span>' + lastChip + '</header>' +
      '<div class="ex-question">' + (ex.question || '') + '</div>' + body +
      '<div class="ex-actions"><button type="button" class="btn btn-primary ex-submit">提交</button></div>' +
      '<div class="ex-hint" hidden></div>' +
      '<div class="ex-feedback" hidden></div></article>';
  }

  /*
   * ctx: {
   *   record:   是否写入 ProgressStore（学习页 true，测验 false）
   *   lessonId: 学习页课程 id
   *   onResult: function(ok, userAnswer) 提交判定后回调
   * }
   */
  function bindExerciseCard(card, ex, i, ctx) {
    var submitted = false;
    var judgeSel = null;   // judge 已选布尔
    var picked = [];       // order 已排下标序列
    var submitBtn = $('.ex-submit', card);
    var hintEl = $('.ex-hint', card);
    var fbEl = $('.ex-feedback', card);

    function hint(msg) {
      if (!hintEl) return;
      hintEl.hidden = false;
      hintEl.textContent = msg;
    }

    function renderOrder() {
      var ansEl = $('[data-order-answer]', card);
      var poolEl = $('[data-order-pool]', card);
      if (!ansEl || !poolEl) return;
      ansEl.innerHTML = picked.length
        ? picked.map(function (pi) {
          return '<button type="button" class="order-item order-item--picked" data-idx="' + pi + '">' +
            '<span class="order-seq">' + (picked.indexOf(pi) + 1) + '</span>' + ex.items[pi] + '</button>';
        }).join('')
        : '<span class="order-empty">尚未作答，从下方候选项开始点选</span>';
      poolEl.innerHTML = (ex.items || []).map(function (it, ii) {
        return picked.indexOf(ii) === -1
          ? '<button type="button" class="order-item" data-idx="' + ii + '">' + it + '</button>'
          : '';
      }).join('');
    }

    card.addEventListener('click', function (ev) {
      if (submitted) return;
      if (!ev.target || typeof ev.target.closest !== 'function') return;
      var jb = ev.target.closest('.judge-btn');
      if (jb) {
        judgeSel = jb.getAttribute('data-judge') === 'true';
        $all('.judge-btn', card).forEach(function (b) {
          b.classList.toggle('selected', b === jb);
          b.setAttribute('aria-pressed', b === jb ? 'true' : 'false');
        });
        return;
      }
      var oi = ev.target.closest('.order-item');
      if (oi) {
        var ii = Number(oi.getAttribute('data-idx'));
        if (oi.closest('[data-order-pool]')) {
          if (picked.indexOf(ii) === -1) picked.push(ii);
        } else {
          var k = picked.indexOf(ii);
          if (k > -1) picked.splice(k, 1);
        }
        renderOrder();
      }
    });

    card.addEventListener('input', function () {
      if (hintEl) hintEl.hidden = true;
    });

    function collect() {
      switch (ex.type) {
        case 'single': {
          var r = $('input[type="radio"]:checked', card);
          return r ? Number(r.value) : null;
        }
        case 'judge':
          return judgeSel;
        case 'fill': {
          var inp = $('.ex-fill', card);
          return inp && inp.value.trim() ? inp.value : null;
        }
        case 'order':
          return picked.length === (ex.items || []).length ? picked.slice() : { incomplete: picked.length };
        case 'code': {
          var ta = $('.ex-code', card);
          return ta && ta.value.trim() ? ta.value : null;
        }
        default:
          return null;
      }
    }

    if (ex.type === 'order') renderOrder();

    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        if (submitted) return;
        var ua = collect();
        if (ua === null) { hint('请先作答再提交'); return; }
        if (ua && typeof ua === 'object' && ua.incomplete !== undefined) {
          hint('还差 ' + ((ex.items || []).length - ua.incomplete) + ' 项没排完，请继续点击候选项');
          return;
        }
        if (hintEl) hintEl.hidden = true;
        var ok = window.Judge.check(ex, ua);
        submitted = true;
        if (ctx.record) window.ProgressStore.recordAnswer(ctx.lessonId, i, ok);
        showFeedback(card, ex, ok, ua);
        if (typeof ctx.onResult === 'function') ctx.onResult(ok, ua);
      });
    }
  }

  function showFeedback(card, ex, ok, ua) {
    var fb = $('.ex-feedback', card);
    if (fb) {
      fb.hidden = false;
      fb.className = 'ex-feedback ' + (ok ? 'ex-feedback--ok' : 'ex-feedback--bad');
      var html = '<p class="fb-title">' + (ok ? '✓ 回答正确' : '✗ 回答错误') + '</p>' +
        '<div class="fb-explain"><b>解析：</b>' + (ex.explanation || '') + '</div>';
      if (!ok) html += '<div class="fb-answer"><b>正确答案：</b>' + formatCorrectAnswer(ex) + '</div>';
      fb.innerHTML = html;
    }
    markSelection(card, ex, ua, ok);
    $all('input,textarea,button', card).forEach(function (el) { el.disabled = true; });
    var submitBtn = $('.ex-submit', card);
    if (submitBtn) submitBtn.textContent = ok ? '已提交 ✓' : '已提交 ✗';
  }

  function markSelection(card, ex, ua, ok) {
    if (ex.type === 'single') {
      $all('.ex-option', card).forEach(function (lab, li) {
        if (li === ua) lab.classList.add(ok ? 'chosen-ok' : 'chosen-bad');
        if (!ok && li === ex.answer) lab.classList.add('chosen-ok');
      });
    } else if (ex.type === 'judge') {
      $all('.judge-btn', card).forEach(function (b) {
        var val = b.getAttribute('data-judge') === 'true';
        if (val === ua) b.classList.add(ok ? 'chosen-ok' : 'chosen-bad');
        if (!ok && val === ex.answer) b.classList.add('chosen-ok');
      });
    } else if (ex.type === 'order') {
      var ansEl = $('[data-order-answer]', card);
      if (ansEl) ansEl.classList.add(ok ? 'order-ok' : 'order-bad');
    }
  }

  function formatCorrectAnswer(ex) {
    switch (ex.type) {
      case 'single':
        return optionLabel(ex.answer) + '. ' + ((ex.options || [])[ex.answer] || '');
      case 'judge':
        return ex.answer === true ? '对' : '错';
      case 'fill':
        return escAttr((ex.accept || []).join('  /  '));
      case 'order':
        return (ex.answer || []).map(function (pi) { return (ex.items || [])[pi]; }).join(' → ');
      case 'code':
        return '<pre class="code-solution">' + (ex.solution || '') + '</pre>';
      default:
        return '';
    }
  }

  function formatUserAnswer(ex, ua) {
    if (ua === null || ua === undefined) return '<span class="muted">（未作答）</span>';
    switch (ex.type) {
      case 'single':
        return (typeof ua === 'number' && (ex.options || [])[ua] !== undefined)
          ? optionLabel(ua) + '. ' + ex.options[ua]
          : escAttr(String(ua));
      case 'judge':
        return ua === true ? '对' : (ua === false ? '错' : escAttr(String(ua)));
      case 'fill':
        return escAttr(String(ua));
      case 'order':
        return Array.isArray(ua)
          ? ua.map(function (pi) { return (ex.items || [])[pi]; }).join(' → ')
          : escAttr(String(ua));
      case 'code':
        return '<pre class="code-answer">' + escAttr(ua) + '</pre>';
      default:
        return escAttr(String(ua));
    }
  }

  // ===================== 视图 3：今日复习 #/review =====================

  function renderReview() {
    var html = '<section class="view view-review"><h1>⏰ 今日复习</h1>';
    if (!hasData()) {
      html += placeholderHTML('内容加载中 / 暂无数据。') + '</section>';
      app.innerHTML = html;
      return;
    }
    var due = window.ProgressStore.dueForReview();
    if (!due.length) {
      html += '<div class="empty-card"><p class="empty-emoji">🌱</p>' +
        '<p><b>今天没有到期的复习，太棒了！</b></p>' +
        '<p class="muted">记忆曲线会把学过的课在最该忘的时候带回来。趁现在，去学点新东西吧。</p></div>';
      var next = nextRecommendation();
      if (next) {
        html += '<div class="recommend-card"><h2 class="section-sub">👉 推荐下一课</h2>' +
          '<button type="button" class="lesson-row lesson-row--big" data-lesson="' + escAttr(next.id) + '">' +
          '<span class="dot dot-todo"></span>' +
          '<span class="lesson-row-main"><span class="lesson-row-title">' + escAttr(next.title || next.id) + '</span>' +
          '<span class="lesson-row-sub">' + escAttr(next.oneLiner || '') + '</span></span>' +
          '<span class="lesson-row-meta">约 ' + escAttr(next.estMinutes || 10) + ' 分钟 →</span></button></div>';
      }
    } else {
      html += '<p class="view-sub">以下 ' + due.length + ' 课到了复习时间，点进去答题即可巩固记忆：</p>';
      html += '<div class="review-list">';
      due.forEach(function (id) {
        var l = window.SITE_DATA.getLesson(id);
        if (!l) return;
        var mod = window.SITE_DATA.moduleOf(id) || {};
        var rec = window.ProgressStore.get(id);
        html += '<button type="button" class="lesson-row lesson-row--big" data-lesson="' + escAttr(id) + '">' +
          '<span class="dot ' + (window.ProgressStore.mastered(id) ? 'dot-done' : 'dot-doing') + '"></span>' +
          '<span class="lesson-row-main"><span class="lesson-row-title">' + escAttr(l.title || id) + '</span>' +
          '<span class="lesson-row-sub">' + escAttr(mod.title || '') + ' · 到期 ' + fmtDue(rec && rec.due) + '</span></span>' +
          '<span class="lesson-row-meta">去复习 →</span></button>';
      });
      html += '</div>';
    }
    html += '</section>';
    app.innerHTML = html;
  }

  function nextRecommendation() {
    var all = window.SITE_DATA.allLessons();
    var i;
    for (i = 0; i < all.length; i++) {
      if (!window.ProgressStore.get(all[i].id)) return all[i]; // 从未访问过
    }
    for (i = 0; i < all.length; i++) {
      if (!window.ProgressStore.mastered(all[i].id)) return all[i]; // 未掌握
    }
    return null;
  }

  // ===================== 视图 4：模块混排测验 #/quiz/{moduleId} =====================

  function renderQuiz(moduleId) {
    var mod = null;
    if (hasData()) {
      window.SITE_DATA.modules.forEach(function (m) {
        if (m.module === moduleId) mod = m;
      });
    }
    if (!mod) {
      app.innerHTML = '<section class="view">' +
        placeholderHTML('内容加载中 / 暂无数据：模块「' + escAttr(moduleId) + '」不存在或尚未加载。') +
        '</section>';
      return;
    }

    var wrap = document.createElement('section');
    wrap.className = 'view view-quiz';
    wrap.style.setProperty('--module-color', mod.color || '#6366f1');
    app.appendChild(wrap);

    function start() {
      var pool = [];
      (mod.lessons || []).forEach(function (l) {
        (l.exercises || []).forEach(function (ex) { pool.push({ ex: ex, lesson: l }); });
      });
      shuffle(pool);
      var items = pool.slice(0, 10); // 不足 10 全取
      var n = items.length;
      var qi = 0;
      var results = [];

      if (!n) {
        wrap.innerHTML = '<header class="quiz-head"><div><h1>🎲 混排测验 · ' + escAttr(mod.title || mod.module) + '</h1></div></header>' +
          placeholderHTML('该模块还没有题目（内容整理中）。');
        return;
      }

      function drawQuestion() {
        var it = items[qi];
        var pct = Math.round((qi / n) * 100);
        wrap.innerHTML =
          '<header class="quiz-head"><div><h1>🎲 混排测验 · ' + escAttr(mod.title || mod.module) + '</h1>' +
          '<p class="view-sub">从本模块随机抽题，测验结果不计入复习计划。</p></div>' +
          '<span class="quiz-count">' + (qi + 1) + ' / ' + n + '</span></header>' +
          '<div class="progress-bar quiz-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
          '<div class="quiz-meta">来自课程：' + escAttr(it.lesson.title || it.lesson.id) + ' · 难度 ' + stars(it.ex.difficulty || 1) + '</div>' +
          '<div class="quiz-body" id="quiz-body"></div>';
        var body = $('#quiz-body', wrap);
        body.innerHTML = exerciseCardHTML(it.ex, qi, null);
        var card = $('.ex-card', body);
        bindExerciseCard(card, it.ex, qi, {
          record: false,
          onResult: function (ok, ua) {
            results[qi] = { item: it, ua: ua, ok: ok };
            var nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.className = 'btn btn-primary quiz-next';
            nextBtn.textContent = qi === n - 1 ? '查看成绩 🏁' : '下一题 →';
            nextBtn.addEventListener('click', function () {
              qi += 1;
              if (qi < n) drawQuestion();
              else drawResult();
            });
            body.appendChild(nextBtn);
          }
        });
      }

      function drawResult() {
        var score = results.filter(function (r) { return r && r.ok; }).length;
        var verdict;
        if (score === n) verdict = '满分！这个模块已经被你拿下了 🎉';
        else if (score >= Math.ceil(n * 0.7)) verdict = '不错！错题就是下一次的复习清单 💪';
        else verdict = '别灰心，把错题对应的课程回去再过一遍 🌱';
        var html =
          '<header class="quiz-head"><div><h1>🎲 混排测验 · ' + escAttr(mod.title || mod.module) + '</h1></div></header>' +
          '<div class="quiz-result"><div class="quiz-score">' + score + '<span> / ' + n + '</span></div>' +
          '<p class="quiz-verdict">' + verdict + '</p></div>' +
          '<div class="quiz-actions">' +
          '<button type="button" id="quiz-retry" class="btn btn-primary">🔄 再测一次（重新随机）</button>' +
          '<button type="button" class="btn btn-ghost" data-nav="#/">返回地图</button></div>' +
          '<h2 class="section-sub">逐题回顾</h2><div class="quiz-review-list">';
        results.forEach(function (r, ri) {
          if (!r) return;
          html += '<article class="quiz-review-card ' + (r.ok ? 'quiz-review-card--ok' : 'quiz-review-card--bad') + '">' +
            '<header class="qr-head"><span class="qr-no">第 ' + (ri + 1) + ' 题</span>' +
            '<span class="qr-verdict">' + (r.ok ? '✓ 答对' : '✗ 答错') + '</span>' +
            '<span class="qr-lesson">' + escAttr(r.item.lesson.title || '') + '</span></header>' +
            '<div class="qr-question">' + (r.item.ex.question || '') + '</div>' +
            '<div class="qr-row"><b>你的答案：</b>' + formatUserAnswer(r.item.ex, r.ua) + '</div>' +
            (r.ok ? '' : '<div class="qr-row"><b>正确答案：</b>' + formatCorrectAnswer(r.item.ex) + '</div>') +
            '<div class="qr-row qr-explain"><b>解析：</b>' + (r.item.ex.explanation || '') + '</div>' +
            '</article>';
        });
        html += '</div>';
        wrap.innerHTML = html;
        var retry = $('#quiz-retry', wrap);
        if (retry) retry.addEventListener('click', start);
      }

      drawQuestion();
    }

    start();
  }

  // ===================== 视图 5：知识图谱 #/graph =====================

  function renderGraph() {
    if (!hasData()) {
      app.innerHTML = '<section class="view">' + placeholderHTML('内容加载中 / 暂无数据。') + '</section>';
      return;
    }
    var all = window.SITE_DATA.allLessons();
    var html = '<section class="view view-graph"><h1>🕸️ 知识图谱</h1>' +
      '<p class="view-sub">大纲顺序即推荐学习路径（拓扑有序）；点卡片标题进入课程，点关联芯片直接跳转。</p>';

    // 推荐学习路径 = 大纲顺序
    html += '<div class="graph-path"><h2 class="section-sub">🧭 推荐学习路径</h2><ol class="path-list">';
    all.forEach(function (l, i) {
      html += '<li><button type="button" class="path-chip" data-lesson="' + escAttr(l.id) + '">' +
        '<span class="path-no">' + (i + 1) + '</span>' + escAttr(l.title || l.id) + '</button></li>';
    });
    html += '</ol></div>';

    window.SITE_DATA.modules.forEach(function (mod) {
      html += '<div class="graph-module" style="--module-color:' + escAttr(mod.color || '#6366f1') + '">' +
        '<h2 class="graph-module-title">' + escAttr(mod.icon || '') + ' ' + escAttr(mod.title || mod.module) + '</h2>' +
        '<div class="graph-cards">';
      (mod.lessons || []).forEach(function (l) {
        var rel = l.relations || {};
        html += '<article class="graph-card">' +
          '<h3 class="graph-card-title"><button type="button" class="graph-card-link" data-lesson="' + escAttr(l.id) + '">' + escAttr(l.title || l.id) + '</button></h3>' +
          '<div class="rel-row"><span class="rel-label">前置</span><span class="rel-chips">' + lessonLinkChips(rel.prerequisites, '无') + '</span></div>' +
          '<div class="rel-row"><span class="rel-label">后继</span><span class="rel-chips">' + lessonLinkChips(rel.successors, '无') + '</span></div>';
        (rel.confusables || []).forEach(function (c) { html += confusableHTML(c); });
        html += '</article>';
      });
      if (!(mod.lessons || []).length) html += '<p class="muted">本模块内容整理中…</p>';
      html += '</div></div>';
    });

    html += '</section>';
    app.innerHTML = html;
  }

  // ===================== 启动 =====================

  function init() {
    app = document.getElementById('app');
    if (!app) return;
    bindDelegation();
    window.addEventListener('hashchange', render);
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* SW 注册（推广自标杆 architect-exam-learning app.js:996-998，OPT-01） */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  try { var __swUrl = new URL('../sw.js', (document.currentScript && document.currentScript.src) || location.href).pathname;
    navigator.serviceWorker.register(__swUrl).catch(function () {}); } catch (e) {}
}
