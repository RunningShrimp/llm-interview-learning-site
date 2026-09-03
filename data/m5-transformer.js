/* M5 Transformer 与 LLM 架构 —— 6 个知识点内容数据（契约见 docs/SCHEMA.md v1）
   事实核查（2026-09 联网核实）：
   - Vaswani et al., "Attention Is All You Need", NeurIPS 2017（arXiv:1706.03762）；
     base 配置：Encoder/Decoder 各 6 层，d_model=512，8 头，d_k=d_v=64，d_ff=2048（4 倍扩展），正弦位置编码，Post-LN。
   - RoPE 出自 Su et al., "RoFormer: Enhanced Transformer with Rotary Position Embedding", arXiv:2104.09864（2021）；
     LLaMA / Mistral / Qwen 等现代 LLM 采用 RoPE + Pre-Norm（或 RMSNorm 变体）。
   - BERT: Devlin et al. 2018（MLM+NSP，双向 Encoder）；GPT: Radford et al. 2018 起（因果 Decoder-only）；T5: Raffel et al. 2019（text-to-text，span corruption）。 */
window.SITE_DATA.registerModule({
  module: 'M5',
  title: 'Transformer 与 LLM 架构',
  icon: '⚡',
  color: '#f59e0b',
  lessons: [
  {
    id: 'm5-01',
    title: '自注意力机制',
    oneLiner: '开会时挑重点听：Q/K/V 全解',
    estMinutes: 16,
    analogy: {
      title: '部门例会上的提问与采纳',
      body: '把一句话想象成一场部门例会，每个词都是一位参会者。「小猫」发言时，先在心里列出想弄清的问题——"谁在做动作？动作对象是谁？"，这是它的<b>查询（Query, Q）</b>；其他词各自挂着一块"我能回答什么"的<b>键（Key, K）</b>名牌：「追」是动作本身、「老鼠」是宾语候选。小猫环顾全场，按"名牌与问题的匹配度"决定听谁多一点、听谁少一点，最后按比例采纳大家发言里的<b>实质内容（Value, V）</b>，更新自己的理解。整场会议没有主持人、没有发言顺序，所有人同时提问、同时被参考——这就是<b>自注意力（Self-Attention）</b>。'
    },
    intuition: [
      { heading: '词义不再是"一词一向量"', body: '在 Word2Vec（见 m4-02）里，一个词只有一个固定向量，"苹果手机"和"吃苹果"里的"苹果"长得一模一样。自注意力让表示动起来：每个词的新向量 = 按相关度混合全句所有词的内容。同一个词在不同句子里会"吸收"不同的上下文，得到不同的表示——这是大模型能理解语言的第一块基石。' },
      { heading: '三步走：打分 → 归一化 → 加权混合', body: '第一步，我的提问 Q 和每个人的名牌 K 两两做点积，得到一堆相关度原始分；第二步，用 softmax（见 m1-06）把分数变成一组加起来等于 1 的注意力权重；第三步，按权重把所有人的发言 V 加权求和。下面的动画里，你可以亲手把这三步各走一遍，看清数字怎么流动。' },
      { heading: '为什么叫"自"注意力？', body: '因为 Q、K、V 全部来自同一个句子自己——自己人之间开圆桌会议。对比 m4-04 里 seq2seq 的注意力：那是解码器拿自己的 Q，去问编码器（另一句话）的 K 和 V，叫<b>交叉注意力（Cross-Attention）</b>。一旦不再依赖 RNN 逐词传话（见 m3-07），所有词就能并行计算——这是 Transformer 训练快的根源。' }
    ],
    principle: [
      {
        heading: '核心公式逐项拆解（面试第一名句）',
        body: '别急着背符号，对照下面的翻译逐个理解：矩阵 Q、K、V 是全句词向量分别乘三个<b>可学习</b>权重矩阵 W_Q、W_K、W_V 得到的——同一个句子，换三副"眼镜"去看，就得到提问、名牌、内容三份角色不同的材料。整个公式的产出，是每个词融合了全句信息的新表示。',
        formula: 'Attention(Q, K, V) = softmax(QKᵀ / √d_k) · V',
        formulaNote: '<ul><li><b>Q（Query，查询）</b>：每个词的"提问向量"——我想弄清楚什么</li><li><b>K（Key，键）</b>：每个词的"名牌向量"——我能回答什么，用来被别人匹配</li><li><b>V（Value，值）</b>：每个词的"内容向量"——真被选中后交付的干货</li><li><b>QKᵀ</b>：Q 与 K 的转置相乘，一次算出所有词两两之间的点积相关度，得到 n×n 打分矩阵（n 是句子长度）</li><li><b>√d_k</b>：除以键向量维度的平方根，防止分数过大（下一节专门讲，面试必考）</li><li><b>softmax</b>：把每一行分数变成非负、总和为 1 的权重，即"该听谁多少"</li><li><b>· V</b>：权重矩阵乘 V，对每个词做一次加权求和，输出它融合全句信息后的新表示</li></ul>'
      },
      {
        heading: '面试高频：为什么除以 √d_k？',
        body: '两个随机向量的点积均值约为 0，但方差随维度 d_k 增大而变大——维度是 64、512 时，点积动辄几十上百。分数一悬殊，softmax 就会变成"一家独大"的近似 one-hot：最大分逼近 1、其余逼近 0，此时 softmax 的梯度几乎为 0，训练信号消失（梯度消失，见 m3-02）。除以 √d_k 恰好把点积方差拉回约 1，让 softmax 保持在"坡度健康"的区间。记忆口径：<b>维度越大 → 点积方差越大 → 越要除；除的是键的维度 d_k</b>。',
        formula: 'Var(q·k) ∝ d_k　→　(q·k)/√d_k 的方差 ≈ 1',
        formulaNote: '<ul><li><b>Var(q·k)</b>：Q 与 K 点积结果的方差（波动幅度），随维度 d_k 增大而增大</li><li><b>∝ d_k</b>：读作"正比于"——维度翻倍，点积的波动大约也翻倍</li><li><b>除以 √d_k</b>：方差变为约 1/d_k 倍，把分数稳定在 softmax 的舒适区，梯度不至于饱和消失</li><li><b>常见误区</b>：不是为了"数值好看"或"防过拟合"，本质是防 softmax 饱和、保住梯度</li></ul>'
      },
      {
        heading: '复杂度 O(n²·d)：长文本的阿喀琉斯之踵',
        body: '打分矩阵 QKᵀ 是 n×n（n 为序列长度），生成它需要约 O(n²·d) 次乘加：序列长度翻倍，这部分计算量约变 4 倍。这是面试必考的复杂度结论，也是一切长上下文优化的出发点——KV Cache 优化推理端的重复计算（见 m7-01），稀疏注意力、滑动窗口则直接砍掉 n² 里的无效配对。',
        formula: '自注意力计算量 ≈ O(n² · d)；　RNN 需串行 n 步、无法并行',
        formulaNote: '<ul><li><b>n</b>：序列长度（token 数）</li><li><b>d</b>：每个 token 的表示维度（d_model）</li><li><b>n²</b>：来自"每个词都要与所有词配对打分"的 n×n 矩阵——这是用计算换并行与全局视野的代价</li><li><b>RNN 对比</b>：RNN 计算量约 O(n·d²) 但必须逐词串行；自注意力一步算完全部配对，训练时可充分并行</li></ul>'
      }
    ],
    animation: {
      title: '注意力三步走：打分 → softmax → 加权求和',
      html: '<div class="anim-m5-01">' +
        '<p class="anim-m5-01-tip">点击任意词作为"提问者"（Query），再点【下一步】走完三步：</p>' +
        '<div class="anim-m5-01-words">' +
          '<button type="button" class="anim-m5-01-word" data-i="0">小猫</button>' +
          '<button type="button" class="anim-m5-01-word" data-i="1">追</button>' +
          '<button type="button" class="anim-m5-01-word" data-i="2">老鼠</button>' +
        '</div>' +
        '<svg class="anim-m5-01-svg" viewBox="0 0 360 92">' +
          '<line class="anim-m5-01-l" data-j="0"></line>' +
          '<line class="anim-m5-01-l" data-j="1"></line>' +
          '<line class="anim-m5-01-l" data-j="2"></line>' +
          '<circle class="anim-m5-01-nd" data-j="0" cx="60" cy="42" r="24"></circle>' +
          '<circle class="anim-m5-01-nd" data-j="1" cx="180" cy="42" r="24"></circle>' +
          '<circle class="anim-m5-01-nd" data-j="2" cx="300" cy="42" r="24"></circle>' +
          '<text x="60" y="47" text-anchor="middle">小猫</text>' +
          '<text x="180" y="47" text-anchor="middle">追</text>' +
          '<text x="300" y="47" text-anchor="middle">老鼠</text>' +
        '</svg>' +
        '<div class="anim-m5-01-step anim-m5-01-s0"><b>第 1 步 · 打分：Q·K 点积 ÷ √d_k</b><span class="anim-m5-01-cap"></span><div class="anim-m5-01-bars anim-m5-01-b0"></div></div>' +
        '<div class="anim-m5-01-step anim-m5-01-s1"><b>第 2 步 · softmax 归一化</b><span>把打分变成非负、总和为 1 的"注意力配比"：</span><div class="anim-m5-01-bars anim-m5-01-b1"></div></div>' +
        '<div class="anim-m5-01-step anim-m5-01-s2"><b>第 3 步 · 加权求和（乘 V）</b><span>按配比混合全句内容，得到提问者的新表示：</span><div class="anim-m5-01-out"></div></div>' +
        '<div class="anim-m5-01-ctrl"><button type="button" class="anim-m5-01-next">下一步</button><button type="button" class="anim-m5-01-reset">换个人提问</button></div>' +
        '</div>',
      css: '.anim-m5-01 { font-size: 13px; }\n' +
        '.anim-m5-01-tip { margin: 0 0 6px; color: #475569; }\n' +
        '.anim-m5-01-words { display: flex; gap: 8px; }\n' +
        '.anim-m5-01-word { padding: 4px 14px; border: 1px solid #cbd5e1; border-radius: 16px; background: #fff; cursor: pointer; transition: background .3s, color .3s, border-color .3s; }\n' +
        '.anim-m5-01-word.anim-m5-01-on { background: #f59e0b; border-color: #f59e0b; color: #fff; }\n' +
        '.anim-m5-01-svg { width: 100%; max-width: 420px; height: auto; display: block; }\n' +
        '.anim-m5-01-l { stroke: #f59e0b; opacity: .2; transition: stroke-width .45s ease, opacity .45s ease; }\n' +
        '.anim-m5-01-nd { fill: #fef3c7; stroke: #f59e0b; stroke-width: 1.5; transition: fill .3s, stroke .3s; }\n' +
        '.anim-m5-01-nd.anim-m5-01-q { fill: #f59e0b; stroke: #b45309; }\n' +
        '.anim-m5-01-svg text { font-size: 13px; fill: #1e293b; }\n' +
        '.anim-m5-01-step { display: none; margin-top: 8px; padding: 8px 10px; border: 1px dashed #cbd5e1; border-radius: 8px; }\n' +
        '.anim-m5-01-step.anim-m5-01-show { display: block; }\n' +
        '.anim-m5-01-step b { display: block; margin-bottom: 4px; color: #b45309; }\n' +
        '.anim-m5-01-step span { color: #475569; font-size: 12px; }\n' +
        '.anim-m5-01-bar { display: flex; align-items: center; gap: 6px; margin: 3px 0; }\n' +
        '.anim-m5-01-bar span { width: 36px; flex: none; }\n' +
        '.anim-m5-01-bar i { display: block; height: 10px; border-radius: 5px; transition: width .45s ease; }\n' +
        '.anim-m5-01-bar em { font-style: normal; font-family: monospace; font-size: 11px; color: #334155; }\n' +
        '.anim-m5-01-out { font-family: monospace; font-size: 12px; color: #0f766e; }\n' +
        '.anim-m5-01-ctrl { display: flex; gap: 8px; margin-top: 10px; }\n' +
        '.anim-m5-01-ctrl button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n' +
        '.anim-m5-01-ctrl button:disabled { opacity: .5; cursor: default; }',
      js: function (root) {
        var WORDS = ['小猫', '追', '老鼠'];
        var SCORES = [[0.2, 1.1, 0.9], [1.2, 0.1, 1.15], [1.0, 1.05, 0.15]];
        var XS = [60, 180, 300];
        var Y = 42;
        var lines = root.querySelectorAll('.anim-m5-01-l');
        var nodes = root.querySelectorAll('.anim-m5-01-nd');
        var wordBtns = root.querySelectorAll('.anim-m5-01-word');
        var stepEls = [root.querySelector('.anim-m5-01-s0'), root.querySelector('.anim-m5-01-s1'), root.querySelector('.anim-m5-01-s2')];
        var cap0 = root.querySelector('.anim-m5-01-cap');
        var bars0 = root.querySelector('.anim-m5-01-b0');
        var bars1 = root.querySelector('.anim-m5-01-b1');
        var outBox = root.querySelector('.anim-m5-01-out');
        var nextBtn = root.querySelector('.anim-m5-01-next');
        var qi = 0, stage = 0, i, k;
        function softmax(a) {
          var m = Math.max(a[0], a[1], a[2]);
          var e = [Math.exp(a[0] - m), Math.exp(a[1] - m), Math.exp(a[2] - m)];
          var s = e[0] + e[1] + e[2];
          return [e[0] / s, e[1] / s, e[2] / s];
        }
        function barRow(label, pct, color, txt) {
          return '<div class="anim-m5-01-bar"><span>' + label + '</span><i style="width:' + pct + '%;background:' + color + '"></i><em>' + txt + '</em></div>';
        }
        function render() {
          var row = SCORES[qi], w = softmax(row);
          for (k = 0; k < 3; k++) {
            nodes[k].classList.toggle('anim-m5-01-q', k === qi);
            wordBtns[k].classList.toggle('anim-m5-01-on', k === qi);
            if (k === qi) {
              lines[k].style.opacity = '0';
            } else {
              lines[k].setAttribute('x1', XS[qi]); lines[k].setAttribute('y1', Y);
              lines[k].setAttribute('x2', XS[k]); lines[k].setAttribute('y2', Y);
              lines[k].style.strokeWidth = (1 + w[k] * 9).toFixed(2);
              lines[k].style.opacity = stage >= 1 ? String(0.25 + w[k] * 0.75) : '0.18';
            }
          }
          for (k = 0; k < 3; k++) stepEls[k].classList.toggle('anim-m5-01-show', stage >= k);
          cap0.textContent = '提问者【' + WORDS[qi] + '】对每个词的原始打分：';
          var h0 = '', h1 = '';
          for (k = 0; k < 3; k++) {
            h0 += barRow(WORDS[k], Math.max(4, row[k] * 40).toFixed(0), '#f59e0b', row[k].toFixed(2));
            h1 += barRow(WORDS[k], Math.max(3, w[k] * 100).toFixed(1), '#22c55e', (w[k] * 100).toFixed(1) + '%');
          }
          bars0.innerHTML = h0;
          bars1.innerHTML = h1;
          outBox.textContent = WORDS[qi] + ' 的新表示 ≈ ' + w[0].toFixed(2) + '·V(小猫) + ' + w[1].toFixed(2) + '·V(追) + ' + w[2].toFixed(2) + '·V(老鼠)';
          nextBtn.disabled = stage >= 2;
          nextBtn.textContent = stage >= 2 ? '三步完成，可换人再来' : '下一步';
        }
        for (i = 0; i < 3; i++) {
          (function (idx) {
            wordBtns[idx].addEventListener('click', function () { qi = idx; stage = 0; render(); });
          })(i);
        }
        nextBtn.addEventListener('click', function () { if (stage < 2) { stage += 1; render(); } });
        root.querySelector('.anim-m5-01-reset').addEventListener('click', function () {
          qi = (qi + 1) % 3; stage = 0; render();
        });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '在注意力公式 <code>softmax(QKᵀ/√d_k)·V</code> 中，矩阵 V（Value）的作用是？',
        options: ['存放每个词的实质内容，被权重加权求和后形成新表示', '用来与其他词计算相关度打分', '把打分归一化成总和为 1 的权重', '决定每个词的位置先后顺序'],
        answer: 0,
        explanation: 'V 是"被采纳的发言内容"：注意力权重算好后，输出就是对这些 V 的加权求和。用来打分匹配的是 Q 与 K（B 错），做归一化的是 softmax（C 错），位置先后由位置编码负责、与 V 无关（D 错）。面试常拿 Q/K/V 三者职责互相设错，务必分清：Q 提问、K 对号、V 给料。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '注意力打分除以 √d_k 的主要目的，是防止维度增大时点积分数过大，导致 softmax 饱和、梯度接近 0。',
        answer: true,
        explanation: '点积的方差随维度 d_k 增大，分数悬殊会让 softmax 趋近 one-hot，此时梯度几乎为 0，训练难以进行；除以 √d_k 把方差拉回约 1。常见误区：以为这是为了"数值好看"或"防过拟合"——都不是，本质是保住 softmax 的梯度。这是 Transformer 面试出现率最高的问题之一。'
      },
      {
        type: 'fill', difficulty: 3,
        question: '长度为 n、维度为 d 的序列做自注意力，仅"两两配对打分"（计算 QKᵀ）这部分的计算量级是 O(____)（用 n、d 表示，参考写法 <code>n^2*d</code>）。',
        accept: ['o(n^2*d)', 'o(n²*d)', 'o(n²·d)', 'o(n^2·d)', 'o(n^2 d)', 'o(n2*d)', 'o(n*n*d)', 'o(n^2d)', 'o(n²d)'],
        explanation: '每个词都要与全部 n 个词配对打分，共 n² 个点积，每个点积耗 d 次乘加，故为 O(n²·d)。常见误区：答 O(n·d²)（那是 RNN 每步的量级）或 O(n·d)（忽略了配对数是平方级）。n² 正是长文本昂贵、KV Cache 与稀疏注意力等优化出现的原因，属于面试必考结论。'
      }
    ],
    relations: {
      prerequisites: ['m4-04'],
      successors: ['m5-02', 'm5-03', 'm5-04', 'm5-05', 'm7-01', 'm9-04'],
      confusables: [
        { other: 'm4-04', tip: '同是"注意力"：m4-04 是 seq2seq 的交叉注意力（Q 来自解码器、K/V 来自编码器，问的是另一句话）；m5-01 的自注意力 Q/K/V 全部来自同一序列，自己问自己——这是 Transformer 的关键新意。' },
        { other: 'm3-07', tip: 'RNN 靠隐藏状态逐词串行传话，远距离信息易衰减且无法并行；自注意力任意两词一步直连、全句并行，但付出 O(n²·d) 代价——"接力赛 vs 圆桌会议"的对比是高频面试题。' },
        { other: 'm7-01', tip: '训练时每步都要重算打分，而推理生成时历史 token 的 K/V 不变、可缓存复用（KV Cache）——本课的复杂度视角在推理端的第一个优化落点就是 m7-01。' }
      ]
    },
    memory: {
      mnemonic: 'Q 提问、K 对号、V 给料；除以根号 d_k 防独大。',
      selfTest: [
        { q: '自注意力的三步计算是什么？为什么第二步必须用 softmax，而不是直接用原始点积当权重？', a: '三步：QKᵀ 打分 → 除以 √d_k 后逐行 softmax → 权重乘 V 求和。原始点积没有"非负且总和为 1"的语义，大小也不可控；softmax 把分数变成一组注意力配比，可导、能放大差异形成明确取舍，且与除以 √d_k 配合避免饱和。' },
        { q: '为什么说自注意力让词义"动态化"，但它自己反而天生是词袋？', a: '它通过加权混合全句 V，让每个词的表示依赖上下文（不再是静态词向量）；但加权求和只看内容匹配、与词的先后无关——打乱词序，每词吸收的信息不变，所以才需要位置编码（m5-03）补上顺序。' },
        { q: 'n=1024 的序列加长一倍，自注意力打分部分的计算量变为几倍？为什么？', a: '约 4 倍。打分矩阵是 n×n，n 翻倍则元素数变为 4 倍（每个元素仍是 d 维点积）。这是长上下文推理成本高的根源。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：自注意力在干什么？',
      reference: '读一句话时，每个词都环顾全句、判断谁跟自己最相关，再按相关度把别人的意思按比例"抄"进自己的理解里——于是每个词的含义都由整句话共同决定，而不是查一本死词典。'
    }
  },
  {
    id: 'm5-02',
    title: '多头注意力',
    oneLiner: '八个小组从不同角度看同一份材料',
    estMinutes: 12,
    analogy: {
      title: '项目评审会的八个专家组',
      body: '一份产品方案（整句话）提交评审，公司不请一位全才独断，而是同时派出 8 个专家组并行评审：<b>语法组</b>盯主谓搭配、<b>指代组</b>追"它"指谁、<b>语义组</b>找主题关联……每组自带一套专属的提问模板与名牌模板（各自的 W_Q、W_K、W_V），按自己的角度打分、采纳、写出一页 64 维的小组意见。最后 8 页意见<b>拼接成 8×64=512 维的汇总稿</b>，再由秘书长统一润色一次（线性投影 W^O），得到最终评审结论。这就是多头注意力（Multi-Head Attention）。'
    },
    intuition: [
      { heading: '为什么一个头不够', body: '单头注意力的权重是一组配比，一次只能表达一种"该看谁"的模式：盯住指代就顾不上句法，抓住语义就漏掉搭配。注意力权重矩阵本质是一张"关系表"，而一句话里同时存在指代、句法、语义等多种关系——多张表并行，才能都照顾到。' },
      { heading: '每头变小，总账不变', body: 'd_model=512、8 头时每头 64 维：8×64=512，拼接后正好还原。每头的三个小投影矩阵加起来，与"一个用满 512 维的大单头"参数量基本相同。所以多头不是加大模型，而是把同样的预算拆成多个"专科视角"。' },
      { heading: '不同头真的学到了不同关系', body: '对训练好的模型做可视化，能观察到：有的头稳定地连向指代对象，有的头连向前一个词（句法依赖），有的头捕捉语义相似。后续研究还发现许多头是冗余的，剪掉相当一部分、性能只轻微下降——多头更像给模型上的"多视角保险"。' }
    ],
    principle: [
      {
        heading: '两行公式看清多头',
        body: '多头注意力 = "h 次单头注意力并行 + 一次拼接融合"。每个头先用自己的三个小矩阵把 512 维向量投影到 64 维空间，独立做一遍与 m5-01 完全相同的缩放点积注意力，再把 h 份结果拼接、统一投影回去。',
        formula: 'head_i = Attention(Q·W_i^Q, K·W_i^K, V·W_i^V)　　MultiHead = Concat(head_1, …, head_8) · W^O',
        formulaNote: '<ul><li><b>W_i^Q / W_i^K / W_i^V</b>：第 i 头私有的三个投影矩阵，把 512 维投到该头的 64 维——相当于给第 i 组专家发专属的提问模板、名牌模板、笔记模板</li><li><b>head_i</b>：第 i 头独立做一次缩放点积注意力（公式与 m5-01 完全相同），输出 64 维"小组意见"</li><li><b>Concat（拼接）</b>：把 8 个 64 维输出首尾相接，恢复成 512 维</li><li><b>W^O</b>：输出投影矩阵，让 8 组视角互相"通气"后融合成最终结论</li></ul>'
      },
      {
        heading: '参数量账本：多头并没有变贵',
        body: '把账算清楚，面试被问"多头为什么不多花钱"就不慌：每头 3 个投影是 3×(512×64)，8 头合计 3×512×512；再加输出投影 512×512，总计约 4×d_model²——与"单头但用满 512 维"完全相同。头数改变的是视角数，不是预算。',
        formula: '多头总参数 = h × 3·d_model·d_head + d_model² = 4·d_model²（与头数 h 无关）',
        formulaNote: '<ul><li><b>d_head = d_model / h</b>：每头分到的维度，512÷8=64，是"均分式"切分</li><li><b>h × 3·d_model·d_head</b>：h 个头各配 Q/K/V 三个投影；因 d_head 随 h 缩小，总量恰为 3·d_model²</li><li><b>+ d_model²</b>：拼接后的输出投影 W^O</li><li><b>结论</b>：参数量守恒，多头用同样的参数维护多套"相关性标准"</li></ul>'
      },
      {
        heading: '面试加分：头不是越多越好',
        body: '原论文（Vaswani 等，2017）用 8 头：d_model=512，每头 d_k=d_v=64。头太多则每头维度太窄、单视角表达力不足；头太少则视角不够多样，实验上适中头数效果最好。被追问"为什么不是 64 头"就答这个折中：每头维度 = d_model/h，头数翻倍，每头的表达空间就减半。'
      }
    ],
    animation: {
      title: '同一个句子，三个头看到三种关系',
      html: '<div class="anim-m5-02">' +
        '<p class="anim-m5-02-tip">先选一个"头"，再点击任意词作为提问者，观察连线模式的差别：</p>' +
        '<div class="anim-m5-02-heads">' +
          '<button type="button" class="anim-m5-02-hb" data-h="0">指代头</button>' +
          '<button type="button" class="anim-m5-02-hb" data-h="1">句法头</button>' +
          '<button type="button" class="anim-m5-02-hb" data-h="2">语义头</button>' +
        '</div>' +
        '<svg class="anim-m5-02-svg" viewBox="0 0 360 158">' +
          '<line class="anim-m5-02-l"></line>' +
          '<line class="anim-m5-02-l"></line>' +
          '<line class="anim-m5-02-l"></line>' +
          '<line class="anim-m5-02-l"></line>' +
          '<line class="anim-m5-02-l"></line>' +
          '<circle class="anim-m5-02-nd" cx="55" cy="40" r="25"></circle>' +
          '<circle class="anim-m5-02-nd" cx="180" cy="40" r="25"></circle>' +
          '<circle class="anim-m5-02-nd" cx="305" cy="40" r="25"></circle>' +
          '<circle class="anim-m5-02-nd" cx="55" cy="122" r="25"></circle>' +
          '<circle class="anim-m5-02-nd" cx="180" cy="122" r="25"></circle>' +
          '<circle class="anim-m5-02-nd" cx="305" cy="122" r="25"></circle>' +
          '<text x="55" y="45" text-anchor="middle">小猫</text>' +
          '<text x="180" y="45" text-anchor="middle">跳上</text>' +
          '<text x="305" y="45" text-anchor="middle">桌子</text>' +
          '<text x="55" y="127" text-anchor="middle">因为</text>' +
          '<text x="180" y="127" text-anchor="middle">它</text>' +
          '<text x="305" y="127" text-anchor="middle">饿了</text>' +
        '</svg>' +
        '<div class="anim-m5-02-legend"></div>' +
        '<div class="anim-m5-02-bars"></div>' +
        '<p class="anim-m5-02-note">每头只拿 d_model ÷ h = 64 维（512÷8）；8 个头各出一份 64 维意见，拼接后乘 W^O 投影回 512 维——总参数量与单头相当。</p>' +
        '</div>',
      css: '.anim-m5-02 { font-size: 13px; }\n' +
        '.anim-m5-02-tip { margin: 0 0 6px; color: #475569; }\n' +
        '.anim-m5-02-heads { display: flex; gap: 8px; margin-bottom: 4px; }\n' +
        '.anim-m5-02-hb { padding: 4px 14px; border: 1px solid #cbd5e1; border-radius: 16px; background: #fff; cursor: pointer; transition: all .3s; }\n' +
        '.anim-m5-02-hb.anim-m5-02-on { background: #f59e0b; border-color: #f59e0b; color: #fff; }\n' +
        '.anim-m5-02-svg { width: 100%; max-width: 420px; height: auto; display: block; }\n' +
        '.anim-m5-02-l { stroke: #f59e0b; opacity: .3; transition: stroke-width .4s ease, opacity .4s ease; }\n' +
        '.anim-m5-02-nd { fill: #fef3c7; stroke: #f59e0b; stroke-width: 1.5; transition: fill .3s, stroke .3s; cursor: pointer; }\n' +
        '.anim-m5-02-nd.anim-m5-02-qnd { fill: #f59e0b; stroke: #b45309; }\n' +
        '.anim-m5-02-svg text { font-size: 13px; fill: #1e293b; pointer-events: none; }\n' +
        '.anim-m5-02-legend { margin: 6px 0 2px; font-weight: 600; color: #b45309; }\n' +
        '.anim-m5-02-bar { display: flex; align-items: center; gap: 6px; margin: 2px 0; }\n' +
        '.anim-m5-02-bar span { width: 36px; flex: none; }\n' +
        '.anim-m5-02-bar i { display: block; height: 9px; border-radius: 5px; background: #f59e0b; transition: width .4s ease; }\n' +
        '.anim-m5-02-bar em { font-style: normal; font-family: monospace; font-size: 11px; color: #334155; width: 34px; }\n' +
        '.anim-m5-02-note { margin: 8px 0 0; font-size: 12px; color: #64748b; }',
      js: function (root) {
        var W = ['小猫', '跳上', '桌子', '因为', '它', '饿了'];
        var POS = [[55, 40], [180, 40], [305, 40], [55, 122], [180, 122], [305, 122]];
        var HEADS = [
          { name: '指代头', cap: '指代头盯"谁指代谁"：它 → 小猫', w: [[0.45, 0.05, 0.10, 0.05, 0.30, 0.05], [0.35, 0.10, 0.35, 0.05, 0.10, 0.05], [0.10, 0.30, 0.40, 0.05, 0.10, 0.05], [0.10, 0.10, 0.05, 0.10, 0.15, 0.50], [0.60, 0.05, 0.10, 0.05, 0.10, 0.10], [0.45, 0.05, 0.05, 0.10, 0.30, 0.05]] },
          { name: '句法头', cap: '句法头盯"谁和谁搭配成短语"：动词 ↔ 主语/宾语、相邻衔接', w: [[0.20, 0.55, 0.05, 0.05, 0.10, 0.05], [0.40, 0.10, 0.30, 0.05, 0.10, 0.05], [0.05, 0.55, 0.20, 0.05, 0.10, 0.05], [0.05, 0.05, 0.05, 0.10, 0.30, 0.45], [0.10, 0.10, 0.05, 0.25, 0.15, 0.35], [0.05, 0.05, 0.05, 0.35, 0.35, 0.15]] },
          { name: '语义头', cap: '语义头盯"因果与主题"：因为 … 饿了、跳上 ↔ 桌子', w: [[0.15, 0.30, 0.10, 0.10, 0.05, 0.30], [0.30, 0.10, 0.30, 0.05, 0.05, 0.20], [0.25, 0.35, 0.15, 0.05, 0.05, 0.15], [0.20, 0.10, 0.05, 0.10, 0.15, 0.40], [0.30, 0.05, 0.05, 0.10, 0.10, 0.40], [0.40, 0.10, 0.05, 0.25, 0.15, 0.05]] }
        ];
        var lines = root.querySelectorAll('.anim-m5-02-l');
        var nodes = root.querySelectorAll('.anim-m5-02-nd');
        var hbtns = root.querySelectorAll('.anim-m5-02-hb');
        var legend = root.querySelector('.anim-m5-02-legend');
        var bars = root.querySelector('.anim-m5-02-bars');
        var hi = 0, qi = 4, i, k;
        function targets() {
          var t = [], j;
          for (j = 0; j < 6; j++) if (j !== qi) t.push(j);
          return t;
        }
        function render() {
          var head = HEADS[hi], row = head.w[qi], tg = targets();
          for (k = 0; k < 6; k++) nodes[k].classList.toggle('anim-m5-02-qnd', k === qi);
          for (k = 0; k < 3; k++) hbtns[k].classList.toggle('anim-m5-02-on', k === hi);
          for (k = 0; k < 5; k++) {
            var j = tg[k], wt = row[j];
            lines[k].setAttribute('x1', POS[qi][0]); lines[k].setAttribute('y1', POS[qi][1]);
            lines[k].setAttribute('x2', POS[j][0]); lines[k].setAttribute('y2', POS[j][1]);
            lines[k].style.strokeWidth = (0.8 + wt * 12).toFixed(2);
            lines[k].style.opacity = wt < 0.12 ? '0.07' : String(0.2 + wt * 0.8);
          }
          legend.textContent = head.cap + '（提问者：' + W[qi] + '）';
          var h = '';
          for (k = 0; k < 6; k++) {
            if (k === qi) continue;
            var wt2 = row[k];
            h += '<div class="anim-m5-02-bar"><span>' + W[k] + '</span><i style="width:' + Math.max(2, wt2 * 100).toFixed(0) + '%"></i><em>' + (wt2 * 100).toFixed(0) + '%</em></div>';
          }
          bars.innerHTML = h;
        }
        for (i = 0; i < 3; i++) {
          (function (idx) {
            hbtns[idx].addEventListener('click', function () { hi = idx; render(); });
          })(i);
        }
        for (i = 0; i < 6; i++) {
          (function (idx) {
            nodes[idx].addEventListener('click', function () { qi = idx; render(); });
          })(i);
        }
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'd_model=512、注意力头数 h=8 时，每个注意力头的维度 d_head 是多少？',
        options: ['64', '8', '512', '4096'],
        answer: 0,
        explanation: 'd_head = d_model / h = 512 ÷ 8 = 64；8 个头的输出（8×64）拼接回 512 维。常见误区：以为每头仍是 512 维（那样参数会翻 8 倍），或把头数 8 误当维度。正因每头缩小，多头的总参数量才与同规模单头相当——这是"多头不多花钱"的关键。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '多头注意力通过"每头维度变小"的切分方式，使总参数量与用全部 d_model 维度的单头注意力大致相当。',
        answer: true,
        explanation: 'h 个头各配 3 个 d_model×d_head 投影（d_head=d_model/h），合计 3·d_model²，再加 d_model² 的输出投影 W^O，总计 4·d_model²，与单头全维注意力相同。常见误区：以为 8 个头就是 8 倍参数——每头只分到 1/h 的维度，预算守恒，只是视角变多。'
      },
      {
        type: 'order', difficulty: 3,
        question: '将多头注意力内部的计算步骤排成正确顺序（页面上的卡片已打乱）：',
        items: ['每个头独立做缩放点积注意力（打分→softmax→加权 V）', '乘输出矩阵 W^O，融合各头视角', '输入向量分别乘每头私有的 W_Q、W_K、W_V', '注意力结果送入 Add&Norm 与前馈网络', '把 8 个头的 64 维输出拼接成 512 维'],
        answer: [2, 0, 4, 1, 3],
        explanation: '正确流程：先投影出每头的 Q/K/V（第 2 项）→ 各头独立算注意力（第 0 项）→ 拼接 8 份输出（第 4 项）→ 乘 W^O 融合（第 1 项）→ 送入 Add&Norm 与 FFN（第 3 项）。常见误区：把拼接放在 W^O 之后（顺序颠倒），或漏掉 W^O 这步"合议"。'
      }
    ],
    relations: {
      prerequisites: ['m5-01'],
      successors: ['m5-05'],
      confusables: [
        { other: 'm5-01', tip: '单头注意力是一场"圆桌会议"，只有一张权重表；多头是 h 组并行小会再合议——同时维护 h 张关系表，但每头维度缩为 d_model/h，总参数守恒。' },
        { other: 'm9-04', tip: 'm9-04 手撕的是"单头"缩放点积注意力；面试被要求写多头时，只需在外面套"分头投影 → 各头注意力 → 拼接 → 乘 W^O"，核心公式完全不变。' }
      ]
    },
    memory: {
      mnemonic: '八仙过海各看一角，拼接合议回归原维。',
      selfTest: [
        { q: '为什么说多头注意力"不多花钱"？', a: '每头维度 d_head=d_model/h，h 个头的 Q/K/V 投影合计 3·d_model²，加输出投影 d_model²，总参数 4·d_model²，与同规模单头相同——头数改变的是"视角数"，不是预算。' },
        { q: '训练好的模型里，不同的头通常学到了什么不同模式？', a: '常见可观测模式：指代解析头（代词→先行词）、句法头（动词↔主宾、相邻词衔接）、语义相关头（同主题/因果关联）。多头让模型同时维护多种关系，也带来冗余——部分头可剪枝而性能仅微降。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：为什么要把注意力分成多个"头"？',
      reference: '一个人看文章只能盯一条线索；让 8 个专家各盯一条——谁指代谁、谁修饰谁、谁和谁同主题——最后把 8 份笔记合并，比任何单人视角都全面，而且总工作量并没有增加。'
    }
  },
  {
    id: 'm5-03',
    title: '位置编码',
    oneLiner: '句子语序的秘密档案',
    estMinutes: 13,
    analogy: {
      title: '一排不同频率的钟表',
      body: '想象一排走速不同的钟：秒针每几秒一圈、分针每小时一圈、时针每半天一圈……任何一刻，所有指针的角度组合起来都是独一无二的"时间指纹"。正弦位置编码（Sinusoidal Positional Encoding）就是给句子里每个位置发一套这样的钟：低维是快钟（高频正弦），高维是慢钟（低频正弦），把不同频率的 sin/cos 值拼在一起，每个位置都得到一条独一无二、又与相邻位置平滑相连的"指纹向量"。'
    },
    intuition: [
      { heading: '自注意力天生是"词袋"', body: '做个思想实验：把"猫追老鼠"打乱成"老鼠追猫"，完全不带位置信息的自注意力给每个词算出的新表示内容一点不变（只是输出跟着词挪了位置）——因为加权求和与顺序无关。也就是说，光靠自注意力，模型分不清"谁追谁"。要读懂语序，必须额外把"你排第几"告诉模型，这就是<b>位置编码（Positional Encoding）</b>存在的理由。' },
      { heading: '好指纹的两个标准', body: '一是不同位置的指纹不能撞车（可区分）；二是相邻位置的指纹应该相似（模型才能学到"挨着""隔两个"这类相对概念）。多频率正弦恰好同时满足：快钟区分近处的位置，慢钟区分远处的位置，且 sin/cos 随位置平滑变化。' },
      { heading: '三大门派', body: '① 正弦编码：规则固定、零参数、理论上可外推到更长序列（2017 原论文采用）；② 可学习位置编码：把每个位置的向量当参数一起训练，灵活但最大长度在训练时就定死（BERT、GPT-2 采用）；③ <b>RoPE 旋转位置编码</b>：不加向量，而是把 Q/K 按位置"旋转"，让点积自动依赖相对距离——LLaMA、Qwen 等现代 LLM 的主流选择，长度外推更好，面试提一句就是加分项。' }
    ],
    principle: [
      {
        heading: '正弦位置编码公式逐项拆解',
        body: '位置 pos 的编码是一个 d 维向量，奇偶维交替使用 sin 和 cos，频率随维度指数变慢——低维像秒针，高维像时针。用法很简单：把 PE(pos) 直接加到第 pos 个词的词向量上，位置信息随之进入后续所有计算。',
        formula: 'PE(pos, 2i) = sin( pos / 10000^(2i/d) )　　PE(pos, 2i+1) = cos( pos / 10000^(2i/d) )',
        formulaNote: '<ul><li><b>pos</b>：词在句子中的位置序号（0,1,2,…），是唯一输入</li><li><b>i</b>：维度编号；2i 是偶数维用 sin，2i+1 是奇数维用 cos</li><li><b>d</b>：编码总维度（与词向量维度相同，两段直接相加）</li><li><b>10000^(2i/d)</b>：波长控制项——i 越大分母越大、正弦变化越"慢"，低维秒针、高维时针</li><li><b>sin/cos 成对出现</b>：像钟表指针的横纵坐标，既保证指纹唯一，又让相对位置可由线性变换表达</li></ul>'
      },
      {
        heading: '为什么要"很多种频率"',
        body: '只用一种频率会撞指纹：sin(pos) 的周期是 2π，位置 0 和位置 2π 的编码完全一样。多频率组合就像多位数字：个位每 10 个数循环，十位每 100 个才循环——合起来在很长范围内都不重复。波长最长的维度周期达 10000×2π，足以覆盖很长的序列；而最短的维度保证相邻位置也能区分。'
      },
      {
        heading: '三种方案一张表',
        body: '正弦编码：零参数、可外推，但表达固定；可学习编码：表达灵活、随任务优化，但受最大长度限制、外推无保证；RoPE：作用在注意力的 Q·K 内积上，天然编码相对位置、无额外参数、外推性好，已成为现代 LLM 的事实标准。面试口径：原始 Transformer 用正弦，BERT/GPT-2 用可学习，LLaMA 系用 RoPE。'
      }
    ],
    animation: {
      title: '拖动滑块，看每个位置的正弦"指纹"',
      html: '<div class="anim-m5-03">' +
        '<p class="anim-m5-03-tip">三条曲线是三个不同频率的维度（快钟→慢钟）。拖动 A、B 两个位置，对比它们的 6 维指纹：</p>' +
        '<svg class="anim-m5-03-svg" viewBox="0 0 360 116">' +
          '<line class="anim-m5-03-axis" x1="12" y1="60" x2="348" y2="60"></line>' +
          '<path class="anim-m5-03-curve anim-m5-03-c0"></path>' +
          '<path class="anim-m5-03-curve anim-m5-03-c1"></path>' +
          '<path class="anim-m5-03-curve anim-m5-03-c2"></path>' +
          '<line class="anim-m5-03-ia" y1="6" y2="112"></line>' +
          '<line class="anim-m5-03-ib" y1="6" y2="112"></line>' +
          '<text class="anim-m5-03-t0" x="14" y="14">快钟</text>' +
          '<text class="anim-m5-03-t2" x="14" y="110">慢钟</text>' +
        '</svg>' +
        '<div class="anim-m5-03-sliders">' +
          '<label>位置 A <input class="anim-m5-03-pa" type="range" min="0" max="63" step="1" value="8"></label>' +
          '<label>位置 B <input class="anim-m5-03-pb" type="range" min="0" max="63" step="1" value="33"></label>' +
        '</div>' +
        '<div class="anim-m5-03-bars"></div>' +
        '<div class="anim-m5-03-info"></div>' +
        '</div>',
      css: '.anim-m5-03 { font-size: 13px; }\n' +
        '.anim-m5-03-tip { margin: 0 0 6px; color: #475569; }\n' +
        '.anim-m5-03-svg { width: 100%; max-width: 440px; height: auto; display: block; background: #fffbeb; border-radius: 8px; }\n' +
        '.anim-m5-03-axis { stroke: #d6d3d1; stroke-width: 1; }\n' +
        '.anim-m5-03-curve { fill: none; stroke-width: 1.6; }\n' +
        '.anim-m5-03-c0 { stroke: #ef4444; }\n' +
        '.anim-m5-03-c1 { stroke: #f59e0b; }\n' +
        '.anim-m5-03-c2 { stroke: #3b82f6; }\n' +
        '.anim-m5-03-ia { stroke: #ea580c; stroke-width: 2; }\n' +
        '.anim-m5-03-ib { stroke: #2563eb; stroke-width: 2; stroke-dasharray: 4 3; }\n' +
        '.anim-m5-03-svg text { font-size: 11px; fill: #78716c; }\n' +
        '.anim-m5-03-sliders { display: flex; gap: 16px; flex-wrap: wrap; margin: 6px 0; }\n' +
        '.anim-m5-03-bars { margin: 4px 0; }\n' +
        '.anim-m5-03-bar { display: flex; align-items: center; gap: 6px; margin: 2px 0; }\n' +
        '.anim-m5-03-bar span { width: 46px; font-family: monospace; font-size: 11px; color: #334155; }\n' +
        '.anim-m5-03-bar b { flex: 1; height: 9px; background: #f1f5f9; border-radius: 5px; position: relative; overflow: hidden; }\n' +
        '.anim-m5-03-bar u { position: absolute; top: 0; bottom: 0; left: 50%; border-radius: 5px; transition: left .25s ease, width .25s ease; }\n' +
        '.anim-m5-03-bar em { font-style: normal; font-family: monospace; font-size: 11px; color: #334155; width: 88px; text-align: right; }\n' +
        '.anim-m5-03-info { font-family: monospace; font-size: 12px; color: #0f766e; }',
      js: function (root) {
        var L = [6.3, 16, 42];
        var DIMS = [['d0 sin', 'sin', 0], ['d1 cos', 'cos', 0], ['d2 sin', 'sin', 1], ['d3 cos', 'cos', 1], ['d4 sin', 'sin', 2], ['d5 cos', 'cos', 2]];
        var curves = [root.querySelector('.anim-m5-03-c0'), root.querySelector('.anim-m5-03-c1'), root.querySelector('.anim-m5-03-c2')];
        var ia = root.querySelector('.anim-m5-03-ia');
        var ib = root.querySelector('.anim-m5-03-ib');
        var pa = root.querySelector('.anim-m5-03-pa');
        var pb = root.querySelector('.anim-m5-03-pb');
        var bars = root.querySelector('.anim-m5-03-bars');
        var info = root.querySelector('.anim-m5-03-info');
        function xOf(pos) { return 12 + pos * (336 / 63); }
        function pe(pos, dimIdx) {
          var d = DIMS[dimIdx], v = pos / L[d[2]];
          return d[1] === 'sin' ? Math.sin(v) : Math.cos(v);
        }
        var k, p, d, y;
        for (k = 0; k < 3; k++) {
          d = '';
          for (p = 0; p <= 63.01; p += 0.5) {
            y = 60 - Math.sin(2 * Math.PI * p / L[k]) * 24;
            d += (p === 0 ? 'M' : 'L') + xOf(p).toFixed(1) + ' ' + y.toFixed(1);
          }
          curves[k].setAttribute('d', d);
        }
        function render() {
          var A = Number(pa.value), B = Number(pb.value), i;
          ia.setAttribute('x1', xOf(A)); ia.setAttribute('x2', xOf(A));
          ib.setAttribute('x1', xOf(B)); ib.setAttribute('x2', xOf(B));
          var h = '', diff = 0;
          for (i = 0; i < 6; i++) {
            var va = pe(A, i), vb = pe(B, i);
            diff += Math.abs(va - vb);
            var side = va >= 0 ? 'left:50%;background:#22c55e;width:' + (Math.abs(va) * 50).toFixed(1) + '%'
                               : 'right:50%;left:auto;background:#ef4444;width:' + (Math.abs(va) * 50).toFixed(1) + '%';
            h += '<div class="anim-m5-03-bar"><span>' + DIMS[i][0] + '</span><b><u style="' + side + '"></u></b><em>A=' + va.toFixed(2) + ' B=' + vb.toFixed(2) + '</em></div>';
          }
          bars.innerHTML = h;
          diff /= 6;
          info.textContent = A === B
            ? 'A=B=' + A + '：指纹完全相同（相似度 100%）——同一位置必得同一指纹'
            : 'A=' + A + '，B=' + B + '：6 维指纹平均差 ' + diff.toFixed(2) + ' → 相似度约 ' + ((1 - diff / 2) * 100).toFixed(0) + '%，两个位置可区分';
        }
        pa.addEventListener('input', render);
        pb.addEventListener('input', render);
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'Transformer 必须引入位置编码，最根本的原因是？',
        options: ['自注意力对词序不敏感，打乱句子不改变每个词吸收的信息', '词向量维度太高，需要压缩', 'softmax 输出的总和不为 1', '模型参数太少，需要额外补充'],
        answer: 0,
        explanation: '注意力权重只由 Q、K 的内容匹配决定，加权求和与顺序无关——自注意力天然是"词袋"，"猫追老鼠"与"老鼠追猫"无法区分，所以必须显式注入位置信息。B 与维度无关；C 恰好说反（softmax 的输出和恰好为 1）；正弦式位置编码甚至一个参数都不加，D 不成立。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '把"猫追老鼠"打乱成"老鼠追猫"，在完全不带位置编码的自注意力中，每个词得到的新表示（内容）保持不变。',
        answer: true,
        explanation: '每个词的新表示 = 对全句 V 的加权求和，权重只取决于词对之间的内容匹配，与排列顺序无关；打乱后每个词"吸收到的信息"完全一样，只是输出的行顺序跟着词挪动。这正是必须引入位置编码的根本原因。注意审题：若说"输出的整个矩阵都不变"才是错的。'
      },
      {
        type: 'code', difficulty: 3,
        question: '补全正弦位置编码：偶数维用 sin、奇数维用 cos，波长基准为 10000（横线处填一个数）。',
        template: 'import math, torch\n\ndef sinusoid_pe(max_len, d_model):\n    pe = torch.zeros(max_len, d_model)\n    for pos in range(max_len):\n        for i in range(0, d_model, 2):\n            angle = pos / (____ ** (2 * i / d_model))\n            pe[pos, i]     = math.sin(angle)\n            pe[pos, i + 1] = math.cos(angle)\n    return pe',
        checks: ['10000', 'sin', 'cos'],
        solution: 'import math, torch\n\ndef sinusoid_pe(max_len, d_model):\n    pe = torch.zeros(max_len, d_model)\n    for pos in range(max_len):\n        for i in range(0, d_model, 2):\n            angle = pos / (10000 ** (2 * i / d_model))\n            pe[pos, i]     = math.sin(angle)\n            pe[pos, i + 1] = math.cos(angle)\n    return pe',
        explanation: '波长控制项 10000^(2i/d_model)：i=0 时为 1（最快），i 增大时分母指数增大（最慢），形成"秒针到时针"的频率梯队。偶数维 sin、奇数维 cos 成对出现，构成钟表指针式的唯一指纹。常见错误：把 2i/d_model 写成 i/d_model（频率衰减过快），或漏掉奇数维 cos 只留 sin（相对位置信息减半）。'
      }
    ],
    relations: {
      prerequisites: ['m5-01'],
      successors: ['m5-05'],
      confusables: [
        { other: 'm5-01', tip: '自注意力"天生词袋"这一缺陷，正是位置编码存在的原因：注意力只看内容匹配，不看先后顺序——先懂缺陷，再懂补丁。' },
        { other: 'm4-01', tip: '分词决定"有哪些 token"，位置编码决定"每个 token 排第几"：一个是内容单元，一个是顺序档案，二者在输入端相加后一起进入模型。' },
        { other: 'm4-02', tip: 'Word2Vec 的静态词向量既无上下文也无位置；位置编码补的是"顺序"这一维——词向量回答"你是谁"，位置编码回答"你在第几"。' }
      ]
    },
    memory: {
      mnemonic: '秒针分针时针齐转，每个位置一枚指纹。',
      selfTest: [
        { q: '正弦位置编码为什么要在不同维度使用从快到慢的多种频率？', a: '单一频率会周期性撞指纹（sin 周期 2π）；多频率像多位计数器：快钟区分邻近位置，慢钟区分远距离，组合起来在很长范围内每个位置都唯一，且相邻位置编码平滑相似，便于模型学到"远近"概念。' },
        { q: 'RoPE 与正弦/可学习位置编码的核心区别是什么？', a: '前两者把位置向量"加"在词向量上、作用在输入端；RoPE 不加向量，而是在注意力计算时把 Q/K 按位置旋转，使 Q·K 点积只依赖两个位置的相对距离——天然表达相对位置、无额外参数、长度外推更好，是 LLaMA/Qwen 等现代 LLM 的主流（Su 等，2021）。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：为什么 AI 读句子还要额外知道"词的先后顺序"？',
      reference: '因为注意力是"圆桌会议"，谁先谁后它根本不在乎；所以要给每个词发一枚按位置变化的"指纹手环"，模型一看手环就知道词序，才能分清"猫追老鼠"和"老鼠追猫"。'
    }
  },
  {
    id: 'm5-04',
    title: '残差连接与 LayerNorm',
    oneLiner: '高速路上的应急车道与限速牌',
    estMinutes: 12,
    analogy: {
      title: '百层高架的两个保命设计',
      body: '一条上百层的高速公路（深层网络），每层都是一段施工中的路段（子层变换）。如果车辆（信息与梯度）只能走主路，任何一段塌方（梯度消失、分布漂移）都会让后面全线瘫痪。工程师修了两样东西：<b>应急车道</b>——主干道旁一条直通终点的辅路（残差连接），车辆以"原样通过＋小幅加工"（x + F(x)）的方式通行，某段塌方也不影响直达；<b>限速牌</b>——每个出口立标杆（LayerNorm），把车速（数值分布）统一拉回安全区间，防止越开越快（数值爆炸）或越开越慢（数值坍缩）。有了这两件套，百层高架才修得起来。'
    },
    intuition: [
      { heading: '残差的本质：最坏也不比浅网络差', body: '没有残差时，深网络的每一层都被迫"重新发明"完整变换，学不好反而拖累整体（退化问题）。有残差后，每层只需学习"在原有基础上补一点修正"：x + F(x)。只要让 F(x)→0，这一层就退化成恒等映射——深层网络至少不输给浅层。这与 ResNet（CNN，见 m3-06）是同一个思想，Transformer 全靠它才能堆几十上百层。' },
      { heading: '梯度为什么能穿 100 层', body: '反向传播沿链式法则逐层相乘（见 m3-02）。对 x + F(x) 求导得到 1 + ∂F/∂x：那个写死的 "1" 就是一条梯度高速路——不管 F 学得多差，梯度都至少原封不动地通过，不会被几十个小于 1 的系数连乘到消失。下面的动画让你亲眼对比"有/无应急车道"的差别。' },
      { heading: 'LayerNorm：按"每个词"归一化', body: 'LayerNorm 对同一个 token 的特征向量（d_model 维）求均值方差并归一化，与 batch 大小无关——这正适合长度可变的文本（对比 CV 里跨样本统计的 BatchNorm，见 m3-05）。它让每层输出分布稳定，后面的层不必不断适应"漂移的输入"。' }
    ],
    principle: [
      {
        heading: '两种摆法：Post-LN 与 Pre-LN',
        body: '原始 Transformer（2017）把 LayerNorm 放在残差之后，称 <b>Post-LN</b>；GPT-2 之后的主流把归一化挪到子层之前，称 <b>Pre-LN</b>。Pre-LN 的主路上没有任何变换挡路，梯度更顺畅、深模型训练更稳，现代 LLM（含 LLaMA 的 RMSNorm 变体）几乎都用它。面试一句话：「Post-LN 是原版摆法，Pre-LN 是现代 LLM 的标配，因为更稳。」',
        formula: 'Post-LN：x′ = LayerNorm( x + Sublayer(x) )　　Pre-LN：x′ = x + Sublayer( LayerNorm(x) )',
        formulaNote: '<ul><li><b>x</b>：进入本子层的表示（每个 token 一个向量）</li><li><b>Sublayer(·)</b>：子层变换，可以是注意力，也可以是 FFN</li><li><b>x + Sublayer(x)</b>：残差——原表示直通，加上子层的"修正量"</li><li><b>LayerNorm(·)</b>：对每个 token 的向量归一化（减均值、除标准差，再乘可学习的 γ 加 β），把分布拉回稳定区间</li><li><b>Post vs Pre</b>：归一化挡在主路上（Post）还是挂在子层前（Pre）——Pre-LN 主路畅通，梯度直通底层，训练更稳</li></ul>'
      },
      {
        heading: '残差求导：那条写死的 "1"',
        body: '对 y = x + F(x) 求梯度得 ∂y/∂x = 1 + ∂F/∂x。反向传播时每层都乘上这个系数，"1" 保证了梯度有一条不衰减的直通路径；相比之下，无残差的深层网络每层系数往往小于 1，60 层连乘后梯度可能缩小到十万分之一以下——这就是"百层可训"的数学底气。',
        formula: '∂( x + F(x) ) / ∂x = 1 + ∂F/∂x',
        formulaNote: '<ul><li><b>1</b>：恒等映射的导数——这就是"应急车道"，与层数、参数无关，永不衰减</li><li><b>∂F/∂x</b>：子层自己的导数，可以很小甚至为 0，都不影响那条 "1"</li><li><b>直觉</b>：梯度 = 直通份(1) + 加工份(∂F/∂x)；百层连乘时直通份始终是 1，信息与梯度都不迷路</li></ul>'
      },
      {
        heading: 'LayerNorm 到底在归一化什么',
        body: 'LayerNorm 只看当前这一个 token 的 d_model 维向量：算出它自己的均值 μ 和方差 σ²，归一化后再用可学习的 γ、β 微调。统计范围是"层内单条向量"，因此句子长短、batch 大小都不影响它——这就是 NLP 弃 BatchNorm 选 LayerNorm 的核心原因。',
        formula: 'LN(x) = γ · (x − μ) / √(σ² + ε) + β',
        formulaNote: '<ul><li><b>x</b>：同一个 token 的 d_model 维特征向量（归一化范围仅此一条向量）</li><li><b>μ、σ²</b>：这条向量自己的均值与方差——按特征维统计，与 batch、句长无关</li><li><b>ε</b>：极小常数，防止除零</li><li><b>γ、β</b>：可学习的缩放与平移，让网络在"规整"与"保留特性"之间自由取舍</li><li><b>效果</b>：每层输出分布稳定，深层训练不易发散</li></ul>'
      }
    ],
    animation: {
      title: '梯度高速路：有/无应急车道穿层对比',
      html: '<div class="anim-m5-04">' +
        '<div class="anim-m5-04-row"><label>网络层数 <input class="anim-m5-04-layers" type="range" min="5" max="60" step="1" value="24"></label><span class="anim-m5-04-lab"></span></div>' +
        '<div class="anim-m5-04-row"><button type="button" class="anim-m5-04-toggle"></button><button type="button" class="anim-m5-04-go">重新传播一次</button></div>' +
        '<div class="anim-m5-04-track"></div>' +
        '<div class="anim-m5-04-verdict"></div>' +
        '<hr class="anim-m5-04-hr">' +
        '<p class="anim-m5-04-tip2">限速牌小实验：向量 [1, 2, 3, <b class="anim-m5-04-vv"></b>]，拖动第 4 个分量，看 LayerNorm 如何把分布拉回均值 0、方差 1：</p>' +
        '<div class="anim-m5-04-row"><input class="anim-m5-04-v" type="range" min="1" max="40" step="1" value="20"></div>' +
        '<div class="anim-m5-04-chips"></div>' +
        '<div class="anim-m5-04-note"></div>' +
        '</div>',
      css: '.anim-m5-04 { font-size: 13px; }\n' +
        '.anim-m5-04-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin: 6px 0; }\n' +
        '.anim-m5-04-row button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n' +
        '.anim-m5-04-row button.anim-m5-04-on { background: #f59e0b; border-color: #f59e0b; color: #fff; }\n' +
        '.anim-m5-04-lab { font-family: monospace; color: #334155; }\n' +
        '.anim-m5-04-track { display: flex; align-items: flex-end; gap: 3px; height: 96px; padding: 4px; background: #fffbeb; border-radius: 8px; }\n' +
        '.anim-m5-04-track i { flex: 1; background: #f59e0b; border-radius: 2px 2px 0 0; transition: height .45s ease, background .45s ease; }\n' +
        '.anim-m5-04-verdict { font-family: monospace; font-size: 12px; color: #0f766e; margin-top: 4px; }\n' +
        '.anim-m5-04-hr { border: none; border-top: 1px dashed #cbd5e1; margin: 12px 0 8px; }\n' +
        '.anim-m5-04-tip2 { margin: 0 0 4px; color: #475569; }\n' +
        '.anim-m5-04-chips { display: flex; gap: 8px; flex-wrap: wrap; }\n' +
        '.anim-m5-04-chips b { font-family: monospace; font-size: 12px; padding: 3px 8px; border-radius: 6px; background: #eef2ff; color: #3730a3; transition: background .3s; }\n' +
        '.anim-m5-04-note { font-size: 12px; color: #64748b; margin-top: 6px; }',
      js: function (root) {
        var layers = root.querySelector('.anim-m5-04-layers');
        var lab = root.querySelector('.anim-m5-04-lab');
        var toggle = root.querySelector('.anim-m5-04-toggle');
        var goBtn = root.querySelector('.anim-m5-04-go');
        var track = root.querySelector('.anim-m5-04-track');
        var verdict = root.querySelector('.anim-m5-04-verdict');
        var vs = root.querySelector('.anim-m5-04-v');
        var vv = root.querySelector('.anim-m5-04-vv');
        var chips = root.querySelector('.anim-m5-04-chips');
        var note = root.querySelector('.anim-m5-04-note');
        var residual = true, i;
        var NBARS = 30;
        for (i = 0; i < NBARS; i++) {
          var bar = document.createElement('i');
          track.appendChild(bar);
        }
        var barEls = track.querySelectorAll('i');
        function renderGrad() {
          var K = Number(layers.value);
          var f = residual ? 0.995 : 0.85;
          lab.textContent = K + ' 层';
          toggle.textContent = residual ? '残差连接：开（点击关闭）' : '残差连接：关（点击开启）';
          toggle.classList.toggle('anim-m5-04-on', residual);
          for (i = 0; i < NBARS; i++) {
            var depth = Math.round(i * (K - 1) / (NBARS - 1));
            var mag = Math.pow(f, depth);
            var pct = Math.max(1.5, Math.pow(mag, 0.35) * 96);
            barEls[i].style.height = pct.toFixed(1) + '%';
            barEls[i].style.background = residual ? '#f59e0b' : '#ef4444';
          }
          var last = Math.pow(f, K - 1);
          verdict.textContent = residual
            ? '开应急车道：梯度传到第 1 层还剩约 ' + (last * 100).toFixed(0) + '%（基本无损，靠那条写死的 1 直通）'
            : '关应急车道：梯度传到第 1 层只剩 ' + (last * 100).toFixed(4) + '%——几十层连乘后几乎消失（梯度消失）';
        }
        function renderLN() {
          var v = Number(vs.value);
          vv.textContent = v;
          var xs = [1, 2, 3, v], mu = (1 + 2 + 3 + v) / 4, i2, s2 = 0;
          for (i2 = 0; i2 < 4; i2++) s2 += (xs[i2] - mu) * (xs[i2] - mu);
          var sd = Math.sqrt(s2 / 4);
          var h = '';
          for (i2 = 0; i2 < 4; i2++) {
            var z = (xs[i2] - mu) / sd;
            h += '<b>' + z.toFixed(2) + '</b>';
          }
          chips.innerHTML = h;
          note.textContent = '归一化后均值 = 0、标准差 = 1：极端分量被拉回正常范围，但大小次序不变（γ、β 还能让网络按需微调）；统计只在这 4 个数内部进行，与 batch 无关。';
        }
        layers.addEventListener('input', renderGrad);
        toggle.addEventListener('click', function () { residual = !residual; renderGrad(); });
        goBtn.addEventListener('click', renderGrad);
        vs.addEventListener('input', renderLN);
        renderGrad();
        renderLN();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '残差连接 <code>x + Sublayer(x)</code> 带来的最直接好处是？',
        options: ['信息与梯度拥有一条不衰减的直通路径，可以训练很深的网络', '减少了模型的参数量', '让注意力可以关注未来位置', '取代了激活函数'],
        answer: 0,
        explanation: '残差把"学完整变换"改成"学修正量"，求导时多出恒等的 1，梯度可直通深层——这是 Transformer 能堆几十上百层的前提。参数量不会减少（B）；与关注未来无关，那是掩码的事（C）；激活函数依然存在（D）。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'LayerNorm 的统计范围是同一个 token 的特征向量（按特征维求均值方差），与 batch 里其他样本无关，因此天然适合长度可变的文本序列。',
        answer: true,
        explanation: 'LayerNorm 对每条 d_model 维向量独立归一化，不需要跨样本统计，batch 大小、句长都不影响它——这也是 NLP 模型弃 BatchNorm 用 LayerNorm 的核心原因（对比见 m3-05）。常见误区：以为 LayerNorm 像 BatchNorm 一样跨 batch 统计，那会带来训练/推理不一致与变长句子的麻烦。'
      },
      {
        type: 'single', difficulty: 3,
        question: '关于 Post-LN 与 Pre-LN，下列说法正确的是？',
        options: ['原始 Transformer 用 Post-LN；现代 LLM 多用 Pre-LN（或 RMSNorm 变体），因为主路无阻、训练更稳', 'Pre-LN 是原始论文的摆法，后来为了省参数改成 Post-LN', '两者只影响推理速度，与训练稳定性无关', 'Post-LN 取消了残差连接'],
        answer: 0,
        explanation: '2017 原论文是 Post-LN（LayerNorm 在残差之后），网络深了以后训练不稳、需要 warmup；GPT-2 起主流改用 Pre-LN，主路只剩 "x +" 直通，梯度顺畅。两者参数量相同（B 错），差异在训练稳定性（C 错），Post-LN 同样保留残差（D 错）。面试常追问"现代 LLM 用哪种、为什么"。'
      }
    ],
    relations: {
      prerequisites: ['m3-05', 'm5-01'],
      successors: ['m5-05'],
      confusables: [
        { other: 'm3-05', tip: 'BatchNorm 跨 batch 维统计（训练/推理不一致、怕变长序列），LayerNorm 只在单条特征向量内部统计——NLP 与 Transformer 选后者的原因在本课讲透。' },
        { other: 'm3-02', tip: '反向传播链式相乘导致梯度消失是"病因"（m3-02），残差提供的恒等 1 是"特效药"：本课是该结论在百层网络上的直接应用。' }
      ]
    },
    memory: {
      mnemonic: '残差是应急车道，梯度不塞车；LN 是限速牌，分布不漂移。',
      selfTest: [
        { q: '为什么说有了残差，深网络"最坏也不会比浅网络差"？', a: '每层学的只是修正量 F(x)：让 F(x)→0，该层就退化为恒等映射，信息原样通过。堆再多层，最坏也只是"白加几层"，不会像无残差网络那样因某一层学不好而拖垮整体（退化问题被化解）。' },
        { q: '一句话说清 Pre-LN 为什么比 Post-LN 稳？', a: 'Post-LN 的主路上有 LayerNorm 挡路，梯度要穿过归一化变换，深了容易失稳；Pre-LN 把归一化挂在子层之前，主路只剩 "x +" 的直通加法，梯度可无损直达底层——所以现代深层 LLM 几乎都用 Pre-LN。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：残差连接是什么？',
      reference: '改作业时不把原稿扔掉重写，而是在原稿上批注修改——原稿永远保底，批注只是加分项；梯度也能沿着"原稿"这条直路一路走回第一层，百层网络才训得动。'
    }
  },
  {
    id: 'm5-05',
    title: 'Transformer 整体结构',
    oneLiner: '积木总装图：从输入到输出',
    estMinutes: 15,
    analogy: {
      title: '智能工厂的总装流水线',
      body: '把一句话送进 Transformer，就像原料进入智能工厂：<b>入库登记</b>——每个 token 领到工牌（词嵌入），并盖章注明排班顺序（位置编码）；<b>核心车间</b>——N 个一模一样的车间串联，每个车间两道工序：先开圆桌会议互通信息（多头注意力），再各回工位独立深加工（FFN 前馈网络），每道工序后都有质检加固（Add&amp;Norm）；<b>成品打包</b>——最后过一遍线性层 + softmax，把表示变成词表上每个候选词的概率。记住这张总装图，BERT、GPT 都只是它的"裁剪版"。'
    },
    intuition: [
      { heading: '一图流：数据怎么走', body: '输入嵌入+位置编码 → [ 多头注意力 → Add&amp;Norm → FFN → Add&amp;Norm ] × N → 线性+softmax。除 N 层堆叠外没有任何花活：<b>注意力管"交流"，FFN 管"加工"，Add&amp;Norm 管"稳定"</b>，循环 N 次，表示被提炼得越来越抽象。下面的动画让你亲手把流水线装起来。' },
      { heading: 'FFN：每个词的私人加工车间', body: 'FFN 是两层全连接：先把 512 维升到 4 倍的 2048 维做非线性变换，再压回 512。它与注意力最大的不同是<b>逐位置独立</b>——每个 token 各自进舱加工，词与词之间不通信。分工十分明确：注意力负责横向交流，FFN 负责纵向深加工，且模型的大量事实知识主要储存在 FFN 权重里，参数上也占大头（每层约 2/3）。' },
      { heading: 'Decoder 的掩码：考试不许偷看后面的词', body: '训练时 Decoder 一次并行处理整句，但生成任务必须"只知道过去"：掩码注意力把"未来位置"的打分置成 −∞，softmax 后权重为 0，等价于每个位置只能看自己和之前。这既保证了因果性（与逐词生成一致），又保留了训练的并行性——一次前向同时拿到所有位置的训练信号，这正是对比 RNN 逐步生成的高效之处。' }
    ],
    principle: [
      {
        heading: '逐层结构清单（面试默写级）',
        body: 'Encoder 每层 = 多头自注意力 + Add&amp;Norm + FFN + Add&amp;Norm；Decoder 每层 = 掩码多头自注意力 + Add&amp;Norm + 交叉注意力（Q 来自 Decoder，K/V 来自 Encoder，即 m4-04 的机制）+ Add&amp;Norm + FFN + Add&amp;Norm。原论文 base 配置：Encoder/Decoder 各 N=6 层、d_model=512、8 头、d_ff=2048（FFN 升维 4 倍）。GPT 这类 Decoder-only 模型砍掉交叉注意力，只留"掩码自注意力 + FFN"。'
      },
      {
        heading: 'FFN 公式与"4 倍"约定',
        body: 'FFN 先升维 4 倍、过非线性、再压回，是每个 token 的私人加工车间。"4 倍"（512→2048）是 2017 年定下、沿用至今的行业默认；现代 LLM 常把 ReLU 换成 SwiGLU 等更平滑的激活，但"升维—非线性—降维"的骨架不变。',
        formula: 'FFN(x) = max(0, x·W₁ + b₁)·W₂ + b₂',
        formulaNote: '<ul><li><b>x</b>：某个 token 的 512 维表示（FFN 对每个位置独立处理）</li><li><b>W₁ (512×2048)、b₁</b>：升维 4 倍的投影——2048 = 4×512</li><li><b>max(0, ·)</b>：ReLU 非线性；没有它，两层线性叠加仍等价于一层线性</li><li><b>W₂ (2048×512)、b₂</b>：压回 512 维，交给下一个 Add&amp;Norm</li><li><b>记忆点</b>：注意力=词间横向交流，FFN=逐词纵向深加工；知识主要存在 FFN 参数里</li></ul>'
      },
      {
        heading: '因果掩码：并行训练的钥匙',
        body: '给打分矩阵加一个掩码 M：允许看的位置填 0，禁止看的位置（未来）填 −∞。softmax 里 e^(−∞)=0，未来位置的权重严格为 0——"未来"被彻底挡住。价值在于：一次前向就同时得到全部位置"只看过去"的训练信号，训练并行、语义又与逐词生成完全一致，这是 GPT 高效的根基。',
        formula: 'Attention(Q,K,V) = softmax( QKᵀ/√d_k + M )·V，　M 的上三角（j &gt; i 处）为 −∞',
        formulaNote: '<ul><li><b>M（掩码矩阵）</b>：与打分矩阵同形的 n×n 表；0 表示放行，−∞ 表示屏蔽</li><li><b>加 −∞ 再 softmax</b>：e^(−∞) = 0，未来位置的注意力权重严格为 0，不是"变小"而是"归零"</li><li><b>j &gt; i</b>：第 i 个词不许看它后面的第 j 个词；对角线及以下（自己与过去）全部放行</li><li><b>为什么伟大</b>：训练并行 + 推理因果，一套掩码同时满足两件事</li></ul>'
      }
    ],
    animation: {
      title: '把 Transformer 流水线亲手装起来',
      html: '<div class="anim-m5-05">' +
        '<p class="anim-m5-05-tip">按数据流过的顺序，依次点击下方打乱的积木卡，把它装进流水线：</p>' +
        '<div class="anim-m5-05-slots"></div>' +
        '<div class="anim-m5-05-tray"></div>' +
        '<div class="anim-m5-05-msg"></div>' +
        '<div class="anim-m5-05-ctrl"><button type="button" class="anim-m5-05-reset">拆掉重装</button></div>' +
        '</div>',
      css: '.anim-m5-05 { font-size: 13px; }\n' +
        '.anim-m5-05-tip { margin: 0 0 6px; color: #475569; }\n' +
        '.anim-m5-05-slots { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }\n' +
        '.anim-m5-05-slot { flex: 1 1 108px; min-height: 46px; border: 2px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 4px 6px; font-size: 12px; color: #94a3b8; transition: background .4s ease, color .4s ease, border-color .4s ease; }\n' +
        '.anim-m5-05-slot.anim-m5-05-lit { background: #dcfce7; border-color: #22c55e; color: #166534; font-weight: 600; }\n' +
        '.anim-m5-05-tray { display: flex; flex-wrap: wrap; gap: 6px; }\n' +
        '.anim-m5-05-card { padding: 8px 12px; border: 1px solid #f59e0b; border-radius: 8px; background: #fffbeb; cursor: pointer; transition: opacity .3s, transform .3s; }\n' +
        '.anim-m5-05-card.anim-m5-05-used { opacity: .25; pointer-events: none; }\n' +
        '.anim-m5-05-card.anim-m5-05-bad { background: #fee2e2; border-color: #ef4444; }\n' +
        '.anim-m5-05-msg { min-height: 20px; margin-top: 8px; color: #b45309; font-weight: 600; }\n' +
        '.anim-m5-05-ctrl button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; margin-top: 4px; }',
      js: function (root) {
        var CARDS = [
          { t: 'FFN 前馈网络（逐词深加工）', k: 3 },
          { t: '线性层 + softmax（输出概率）', k: 5 },
          { t: '词嵌入 + 位置编码', k: 0 },
          { t: 'Add & Norm（质检加固）', k: 2 },
          { t: '多头注意力（词间交流）', k: 1 },
          { t: 'Add & Norm（再次加固）', k: 4 }
        ];
        var EXPECT = ['词嵌入 + 位置编码', '多头注意力（词间交流）', 'Add & Norm', 'FFN 前馈网络（逐词深加工）', 'Add & Norm', '线性层 + softmax（输出概率）'];
        var slotsBox = root.querySelector('.anim-m5-05-slots');
        var tray = root.querySelector('.anim-m5-05-tray');
        var msg = root.querySelector('.anim-m5-05-msg');
        var progress = 0, slotEls = [], i;
        function build() {
          progress = 0;
          slotsBox.innerHTML = '';
          tray.innerHTML = '';
          slotEls = [];
          for (i = 0; i < 6; i++) {
            var s = document.createElement('div');
            s.className = 'anim-m5-05-slot';
            s.textContent = '？';
            s.style.transitionDelay = (i * 0.15) + 's';
            slotsBox.appendChild(s);
            slotEls.push(s);
          }
          CARDS.forEach(function (c) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'anim-m5-05-card';
            b.textContent = c.t;
            b.addEventListener('click', function () {
              if (b.classList.contains('anim-m5-05-used')) return;
              if (c.k === progress) {
                slotEls[progress].textContent = EXPECT[progress];
                slotEls[progress].classList.add('anim-m5-05-lit');
                b.classList.add('anim-m5-05-used');
                progress += 1;
                msg.textContent = progress < 6 ? '装对了！下一格：?' : '流水线点亮！注意第 3、5 格是两个 Add&Norm；这一整块还要 ×N 层堆叠，末端才是线性+softmax。';
              } else {
                b.classList.remove('anim-m5-05-bad');
                void b.offsetWidth;
                b.classList.add('anim-m5-05-bad');
                msg.textContent = '顺序不对：想想数据先经过什么？提示——先有输入，才有交流与加工。';
              }
            });
            tray.appendChild(b);
          });
        }
        root.querySelector('.anim-m5-05-reset').addEventListener('click', build);
        build();
      }
    },
    exercises: [
      {
        type: 'order', difficulty: 1,
        question: '把 GPT 型（Decoder-only）Transformer 处理输入的数据流排成正确顺序（卡片已打乱）：',
        items: ['经过 N 层相同的块反复提炼', '词嵌入并加上位置编码', '线性层投影到词表大小', '每层内先做掩码多头注意力（Add&Norm）再做 FFN（Add&Norm）', 'softmax 得到词表上的概率分布'],
        answer: [1, 3, 0, 2, 4],
        explanation: '标准流程：嵌入+位置编码（第 1 项）→ 每层"掩码注意力 + FFN"（第 3 项）→ 重复 N 层（第 0 项）→ 线性层投到词表维度（第 2 项）→ softmax 出概率（第 4 项）。常见误区：把线性+softmax 放进每一层（它们只在最后出现一次），或忘记位置编码要先加上。'
      },
      {
        type: 'single', difficulty: 2,
        question: 'Decoder 掩码注意力把"未来位置"的打分加上 −∞ 再 softmax，效果是？',
        options: ['未来位置的注意力权重变为 0，每个位置只能关注自己及之前', '未来位置的词被从输入中删除', '注意力权重变成负数', '让模型训练更慢但更准'],
        answer: 0,
        explanation: 'softmax 里 e^(−∞)=0，未来位置的权重严格归零，信息被彻底屏蔽；输入本身不删除（B 错），softmax 输出恒非负（C 错），掩码反而让训练更快因为可以并行（D 错）。掩码的价值：一次前向并行拿到所有位置"只看过去"的监督信号，同时保证与逐词生成的因果性一致——GPT 训练高效的根基。'
      },
      {
        type: 'judge', difficulty: 3,
        question: 'Transformer 的参数大头在 FFN 而不是注意力：每层注意力约 4d² 个参数，FFN 约 8d² 个，FFN 约占每层的 2/3。',
        answer: true,
        explanation: '注意力的 Q/K/V/O 四个投影各 d²，共 4d²；FFN 两个矩阵 d×4d 与 4d×d 共 8d²；合计 12d² 中 FFN 占 2/3。常见误区：以为"注意力是主角所以参数最多"——横向交流重要，但存储知识的容量主要在 FFN。顺带的面试加分点：LoRA 等微调常优先挂在注意力投影上，因为改动小而有效。'
      }
    ],
    relations: {
      prerequisites: ['m5-01', 'm5-02', 'm5-03', 'm5-04'],
      successors: ['m5-06', 'm7-02', 'm7-03'],
      confusables: [
        { other: 'm4-03', tip: 'seq2seq 时代 Encoder/Decoder 靠 RNN 串联；本课的 Transformer 用注意力把两者重造：Encoder 双向看、Decoder 掩码单向写——结构同源，机制全换。' },
        { other: 'm5-06', tip: '本课的"完整版"同时包含 Encoder 与 Decoder；下一课的 BERT/GPT/T5 就是三种裁剪方式：只留 Encoder、只留 Decoder、两者都留。' },
        { other: 'm7-02', tip: '流水线最后一格 softmax 给出的是整张概率表，"挑哪个词"（贪心/top-p/温度）是采样策略的事——那是 m7-02 的主题，两件事别混。' }
      ]
    },
    memory: {
      mnemonic: '一交流二加工，AddNorm 护航，N 层轮回，softmax 收官。',
      selfTest: [
        { q: '默写 Transformer 一个层内的组件顺序，并说出每个组件的职责。', a: '多头注意力（词间横向交流）→ Add&Norm（残差加固 + 分布稳定）→ FFN（逐词独立深加工，知识仓库）→ Add&Norm。整块堆叠 N 次；流水线首端是嵌入+位置编码，末端是线性+softmax。Decoder 的注意力换成带因果掩码的版本，另有一个交叉注意力子层（完整 Encoder-Decoder 场景）。' },
        { q: '为什么"掩码 + 并行训练"不矛盾？', a: '掩码在打分矩阵上加 −∞，保证每个位置的输出只依赖自己及之前；因此一次前向传播中，n 个位置可以同时各自计算"只看过去"的预测，互不泄露未来——训练是并行的，语义上却与逐词生成完全一致。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：一句话进入 Transformer 后经历了什么？',
      reference: '每个词先领到"身份牌+座位号"，然后进 N 个相同的车间：先开圆桌会互相通报（注意力），再回工位独自深加工（FFN），每步都留底稿保平安（残差）；最后过一道打包机（softmax），变成"下一个词是谁"的概率表。'
    }
  },
  {
    id: 'm5-06',
    title: 'BERT/GPT/T5 架构对比',
    oneLiner: '三种"读书方式"决定三种用途',
    estMinutes: 14,
    analogy: {
      title: '同一本书的三种读法',
      body: '同一本书，三种读法：<b>完形填空式（BERT）</b>——盖住一句话里的某个词，逼你结合前文<b>和</b>后文一起猜，读得又透又稳，擅长"理解题"；<b>文字接龙式（GPT）</b>——只许看已读过的部分，逐字往后续写，天生擅长"写作文"；<b>翻译官式（T5）</b>——先通读原文（Encoder），再口译输出（Decoder），并且把所有任务都改写成"输入一段话 → 输出一段话"的统一格式。三种读法的差别，源头只有一个：<b>注意力掩码是双向还是单向</b>。'
    },
    intuition: [
      { heading: '掩码差异是根本区别', body: 'BERT 用无掩码的<b>双向</b>自注意力：每个词全场环顾，最擅长判断"这个词在上下文里什么意思"，做分类、抽取、语义匹配又准又省；GPT 用因果掩码的<b>单向</b>自注意力：第 t 个词只见 1..t，与"逐词生成"的使用方式完全一致；T5 的 Encoder 双向读、Decoder 单向写，两头都占，代价是要养两套参数、推理也多一跳。' },
      { heading: '预训练目标是读法的配套练习', body: 'BERT 的练习册是掩码语言模型 MLM（随机盖约 15% 的词猜答案）+ 下一句预测 NSP；GPT 的练习册是因果语言模型 CLM：预测下一个词，全句每个位置都是一道题；T5 的练习册是 span corruption（盖住一段而非一个词），并把一切任务统一成 text-to-text。练习什么，就擅长什么：练猜词的擅长理解，练接龙的擅长生成。' },
      { heading: '为什么 LLM 主流是 Decoder-only（面试必考）', body: '三点核心：① <b>任务匹配</b>——对话与写作本质是逐词生成，CLM 的训练目标与使用方式零转换；② <b>训练效率</b>——因果掩码下一次前向，每个位置都贡献一个"预测下一词"的监督信号（100% 密度），且结构单一、工程简单，推理可配 KV Cache；③ <b>Scaling 友好</b>——结构越简单，放大规模时性能增长越稳定、能力随规模涌现（见 m6-02）。' }
    ],
    principle: [
      {
        heading: '一张表看懂三家',
        body: '结构：BERT = Encoder-only（双向），GPT = Decoder-only（单向因果），T5 = Encoder-Decoder（双向读+单向写）。代表任务：BERT 做分类、实体识别、句向量检索；GPT 做对话、续写、通用生成；T5 做翻译、摘要这类"明确输入→输出"的任务。出身：BERT（Devlin 等，2018）、GPT 系列（Radford 等，2018 起）、T5（Raffel 等，2019）。'
      },
      {
        heading: '两家训练目标的公式化',
        body: 'MLM 只在被盖住的位置计算损失，每个样本的"有效监督点"约 15%；CLM 对序列每个位置都计算损失，监督密度 100%——同样的数据量下，GPT 式训练把每分钱都花在刀刃上，这也是它数据效率高的重要原因。',
        formula: 'MLM：loss = −Σ(i∈被盖位置) log P(x_i | 前后文)　　CLM：loss = −Σ(t=1..n) log P(x_t | x_&lt;t)',
        formulaNote: '<ul><li><b>log P(x_i | 前后文)</b>：把盖住的词还原出来的对数概率；MLM 只对被盖的约 15% 位置求和</li><li><b>x_t | x_&lt;t</b>：已知前 t−1 个词时第 t 个词的概率——单向，只看过去</li><li><b>求和范围</b>：CLM 对全部 n 个位置求和，每个 token 都是一道接龙题，监督信号密度更高</li><li><b>直觉</b>：MLM 像"一份卷子只改 15 道空"，CLM 像"每个字都要写对"，后者与生成任务形态完全一致</li></ul>'
      },
      {
        heading: '回答模板：为什么 Decoder-only 成为主流',
        body: '面试推荐三段式：先说<b>任务匹配</b>（生成即接龙，训练目标=使用方式）；再说<b>训练效率</b>（每个位置都有监督 + 单栈结构简单，推理配 KV Cache）；最后说 <b>scaling 规律</b>下简单结构可扩展性强、能力涌现（引向 m6-02）。可补一句显厚度：Encoder-only 并未消亡——BERT 系仍是检索与分类的主力（句向量模型多源于它），选型要看任务形态（对比见 m8-05）。'
      }
    ],
    animation: {
      title: '切换 BERT / GPT / T5，看信息流向',
      html: '<div class="anim-m5-06">' +
        '<div class="anim-m5-06-modes">' +
          '<button type="button" class="anim-m5-06-mb" data-m="0">BERT · 完形填空</button>' +
          '<button type="button" class="anim-m5-06-mb" data-m="1">GPT · 文字接龙</button>' +
          '<button type="button" class="anim-m5-06-mb" data-m="2">T5 · 文本到文本</button>' +
        '</div>' +
        '<div class="anim-m5-06-toks">' +
          '<button type="button" class="anim-m5-06-tk" data-i="0">小猫</button>' +
          '<button type="button" class="anim-m5-06-tk" data-i="1">坐</button>' +
          '<button type="button" class="anim-m5-06-tk" data-i="2">在</button>' +
          '<button type="button" class="anim-m5-06-tk" data-i="3">垫子</button>' +
          '<button type="button" class="anim-m5-06-tk" data-i="4">上</button>' +
        '</div>' +
        '<div class="anim-m5-06-vis"></div>' +
        '<div class="anim-m5-06-t5">' +
          '<div class="anim-m5-06-box"><b>输入（Encoder 双向读）</b><span>小猫 坐 在 垫子 上</span></div>' +
          '<div class="anim-m5-06-arrow">→</div>' +
          '<div class="anim-m5-06-box"><b>输出（Decoder 逐词写）</b><span>The cat sits on the mat</span></div>' +
        '</div>' +
        '<div class="anim-m5-06-cap"></div>' +
        '</div>',
      css: '.anim-m5-06 { font-size: 13px; }\n' +
        '.anim-m5-06-modes { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }\n' +
        '.anim-m5-06-mb { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 16px; background: #fff; cursor: pointer; transition: all .3s; }\n' +
        '.anim-m5-06-mb.anim-m5-06-on { background: #f59e0b; border-color: #f59e0b; color: #fff; }\n' +
        '.anim-m5-06-toks { display: flex; flex-wrap: wrap; gap: 6px; }\n' +
        '.anim-m5-06-tk { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; cursor: pointer; transition: all .3s; }\n' +
        '.anim-m5-06-tk.anim-m5-06-on { border-color: #f59e0b; background: #fef3c7; font-weight: 600; }\n' +
        '.anim-m5-06-vis { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; min-height: 30px; }\n' +
        '.anim-m5-06-chip { padding: 3px 10px; border-radius: 14px; font-size: 12px; transition: background .3s, color .3s, opacity .3s; }\n' +
        '.anim-m5-06-chip.anim-m5-06-see { background: #dcfce7; color: #166534; }\n' +
        '.anim-m5-06-chip.anim-m5-06-no { background: #f1f5f9; color: #94a3b8; }\n' +
        '.anim-m5-06-t5 { display: none; align-items: stretch; gap: 10px; flex-wrap: wrap; margin-top: 8px; }\n' +
        '.anim-m5-06-t5.anim-m5-06-show { display: flex; }\n' +
        '.anim-m5-06-box { flex: 1 1 150px; border: 1px solid #f59e0b; border-radius: 8px; padding: 6px 10px; background: #fffbeb; }\n' +
        '.anim-m5-06-box b { display: block; font-size: 11px; color: #b45309; margin-bottom: 2px; }\n' +
        '.anim-m5-06-arrow { align-self: center; color: #b45309; font-weight: 700; }\n' +
        '.anim-m5-06-cap { margin-top: 8px; color: #475569; }',
      js: function (root) {
        var TOK = ['小猫', '坐', '在', '垫子', '上'];
        var mbs = root.querySelectorAll('.anim-m5-06-mb');
        var tks = root.querySelectorAll('.anim-m5-06-tk');
        var vis = root.querySelector('.anim-m5-06-vis');
        var t5 = root.querySelector('.anim-m5-06-t5');
        var cap = root.querySelector('.anim-m5-06-cap');
        var mode = 0, qi = 3, i;
        function render() {
          for (i = 0; i < 3; i++) mbs[i].classList.toggle('anim-m5-06-on', i === mode);
          for (i = 0; i < 5; i++) tks[i].classList.toggle('anim-m5-06-on', i === qi);
          t5.classList.toggle('anim-m5-06-show', mode === 2);
          if (mode === 2) {
            cap.textContent = 'T5 把一切任务统一成"文本进、文本出"：Encoder 双向读懂输入，Decoder 单向逐词写出输出。翻译、摘要等 seq2seq 任务最贴合。';
            return;
          }
          var h = '', j;
          for (j = 0; j < 5; j++) {
            var canSee = (mode === 0) ? true : (j <= qi);
            h += '<span class="anim-m5-06-chip ' + (canSee ? 'anim-m5-06-see' : 'anim-m5-06-no') + '">' + TOK[j] + (canSee ? ' 可见' : ' 未来✕') + '</span>';
          }
          vis.innerHTML = h;
          cap.textContent = mode === 0
            ? '双向注意力：选中的【' + TOK[qi] + '】能同时看到前文与后文——训练时盖住部分词，用全场线索猜答案，所以擅长理解。'
            : '因果掩码：选中的【' + TOK[qi] + '】只能看到自己及之前的词；灰色的"未来"在生成时不可见——与逐词写作完全一致，所以擅长生成。';
        }
        for (i = 0; i < 3; i++) {
          (function (idx) {
            mbs[idx].addEventListener('click', function () { mode = idx; render(); });
          })(i);
        }
        for (i = 0; i < 5; i++) {
          (function (idx) {
            tks[idx].addEventListener('click', function () { qi = idx; render(); });
          })(i);
        }
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'BERT 的预训练目标（完形填空 MLM）决定了它最擅长哪类任务？',
        options: ['理解类任务：分类、实体识别、语义匹配', '无条件长文创作', '实时逐词对话生成', '图像生成'],
        answer: 0,
        explanation: 'BERT 双向编码 + MLM 训练，让每个词的表示深度融合上下文，天然适合"读懂再判断"的任务（接一个轻量输出头即可）。逐词生成是 GPT 因果结构的强项（B、C）；BERT 是纯文本模型，与图像生成无关（D）。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'BERT、GPT、T5 三者的根本区别在于注意力掩码方向不同：BERT 双向可见，GPT 单向只看过去，T5 是"双向读 + 单向写"的组合。',
        answer: true,
        explanation: '掩码方向决定信息流：双向=理解、单向=生成、组合=序列到序列；MLM/CLM/span corruption 等预训练目标都是与掩码配套的练习方式。常见误区：把"参数量不同""词表不同"当根本区别——那些都可以调整，掩码带来的信息流差异才是架构级的分野。'
      },
      {
        type: 'order', difficulty: 3,
        question: 'GPT 逐词生成一段回答的完整循环，正确顺序是（卡片已打乱）：',
        items: ['把新词拼接到输入末尾，作为新的上下文', '输入提示词（prompt）的全部 token', '从概率分布中采样出一个词（如 top-p 采样）', '用因果掩码做一次前向，得到下一个词的概率分布', '重复循环，直到生成结束符或达到长度上限'],
        answer: [1, 3, 2, 0, 4],
        explanation: '接龙循环：先吃下 prompt（第 1 项）→ 前向算出下一词分布（第 3 项）→ 采样出一个词（第 2 项）→ 拼回输入（第 0 项）→ 循环直到终止（第 4 项）。常见误区：把采样放在最后（先有采样才有词可拼）、或漏掉"拼接回输入"（不拼接就无法继续条件生成）。这个循环就是自回归（Autoregressive）生成，也是 KV Cache（m7-01）要优化的对象。'
      }
    ],
    relations: {
      prerequisites: ['m5-05'],
      successors: ['m6-01'],
      confusables: [
        { other: 'm4-03', tip: 'T5 是 seq2seq 思想在 Transformer 上的实现：Encoder-Decoder 都在；GPT 砍掉 Encoder 只留 Decoder，BERT 砍掉 Decoder 只留 Encoder——"谁在场、掩码朝哪"要分清。' },
        { other: 'm6-01', tip: '本课讲"架构与掩码"的差别；m6-01 讲这些架构用什么"训练目标"去学习：MLM/CLM/span corruption 的损失设计与本课掩码一一配套。' },
        { other: 'm8-05', tip: 'Decoder-only 生成强，Encoder-only（BERT 系）理解与检索强：RAG 选型时检索器常用 BERT 系句向量、生成器用 GPT 系——架构特长决定分工。' }
      ]
    },
    memory: {
      mnemonic: 'BERT 盖词双向猜，GPT 接龙只往前，T5 进出皆是文。',
      selfTest: [
        { q: '面试三段式：为什么 LLM 主流选择 Decoder-only 架构？', a: '①任务匹配：对话/写作本质是逐词生成，CLM 目标与使用方式一致；②训练效率：因果掩码下每个位置都产出监督信号（100% 密度），结构单一、易工程化，推理可配 KV Cache；③Scaling 友好：简单结构随参数/数据放大性能稳定增长、能力涌现（m6-02）。可补一句：Encoder-only 并未消亡，检索与分类仍是 BERT 系主场。' },
        { q: 'MLM 与 CLM 的监督信号密度差在哪？对同样的数据意味着什么？', a: 'MLM 只在被盖住的约 15% 位置计算损失；CLM 对全部位置计算损失（每个 token 都要被预测一次）。同样一条数据，CLM 提取的监督信号约为 MLM 的 6~7 倍——这是 GPT 式训练数据效率高的重要原因之一。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：BERT 和 GPT 的差别是什么？',
      reference: 'BERT 像做完形填空的高手，前后文一起看，最擅长理解和判断；GPT 像文字接龙选手，只看已写下的部分、逐字往后编，最擅长对话和写作——读法不同，用途就不同。'
    }
  }
  ]
});
