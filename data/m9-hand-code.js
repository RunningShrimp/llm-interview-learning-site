/* M9 手撕代码 —— 6 个知识点内容数据（契约见 docs/SCHEMA.md v1） */
window.SITE_DATA.registerModule({
  module: 'M9',
  title: '手撕代码',
  icon: '💻',
  color: '#ec4899',
  lessons: [
  {
    id: 'm9-01',
    title: '哈希表与两数之和',
    oneLiner: '用字典把 O(n²) 降到 O(n)',
    estMinutes: 14,
    analogy: {
      title: '带编号的储物柜',
      body: '游乐园的寄存柜有个聪明设计：每件物品贴一个标签（键 key），柜号由标签直接算出来。存、取都只要一步，不用挨个翻柜子。<b>哈希表（Hash Table）</b>——Python 里的字典 <code>dict</code>——就是这套"标签直达物品"的系统，单次存取平均 O(1)。两数之和里，我们把"见过的数"存进柜子；每走到一个新数，先问柜子一句"它的搭档（target 减它）来过吗"，一问即中，不用回头再扫一遍数组。'
    },
    intuition: [
      { heading: '先写暴力：面试的正确开场', body: '最直接的写法是两层循环：枚举每个数 a，再在数组里找有没有 b 使 a + b = target。n 个数约要比较 n²/2 次，数组一长就不可接受。面试时先说出这个基线是加分的，它证明你读懂了题；但必须紧接着主动报出："这是 O(n²)（时间复杂度 Time Complexity），可以用哈希表优化到 O(n)"，然后才动笔。' },
      { heading: '换个问法：找"和"变成找"搭档"', body: 'a + b = target 完全等价于 b = target − a。于是问题变成：对每个走到的数 x，问一句"target − x 这个数之前出现过吗"。"在不在"正是哈希表最擅长的问题——查询平均 O(1)。这不是发明新算法，只是把"查找"这个动作从数组搬家到字典。' },
      { heading: '边查边存：一遍循环搞定', body: '从左到右只走一遍。每到一个数：先查柜子里有没有它的搭档——有，直接返回两个下标收工；没有，就把自己存进柜子继续走。查与存都是 O(1)，总时间 O(n)。代价是要一个 O(n) 的字典来"记账"，这是典型的<b>空间换时间</b>（Space-Time Tradeoff）。' }
    ],
    principle: [
      {
        heading: '标准解法与逐行拆解',
        body: '面试标准答案如下，行行有讲究：\n<pre><code>def two_sum(nums, target):\n    seen = {}                      # 值 → 下标 的"储物柜"\n    for i, x in enumerate(nums):\n        y = target - x             # 我需要的搭档\n        if y in seen:              # 搭档来过吗？O(1) 查询\n            return [seen[y], i]\n        seen[x] = i                # 没找到，把自己入库\n    return []\n</code></pre>\n三处关键：<code>y = target - x</code> 把"找和"翻译成"找搭档"；<code>if y in seen</code> 是哈希表的 O(1) 查询——注意 <code>in</code> 作用在字典上是 O(1)、作用在列表上是 O(n)，容器用错，优化就白做了；<code>seen[x] = i</code> 必须放在查询<b>之后</b>，否则当前数可能和自己配对。'
      },
      {
        heading: '复杂度与"配对套路"',
        body: '时间 O(n)：只遍历一遍，每步 O(1) 查询；空间 O(n)：最坏把所有数都存进字典。这题背后是可复用的模板：<b>看到"找配对、找重复、计数、判断是否出现过"，第一反应就是哈希表</b>。变体顺着同一思路升级：三数之和是"排序 + 固定一个数 + 双指针"；最长无重复子串是"滑动窗口 + 哈希计数"。面试官若追问"数组已排好序呢"，标准答案是双指针夹逼：时间仍 O(n)、空间降到 O(1)，有序性让"排除法"成立，不再需要额外记账。'
      },
      {
        heading: '面试现场的表达顺序',
        body: '手撕题的评分不只看代码。推荐流程：先复述题意并走一遍样例确认理解；再讲思路（"用哈希表把查找降到 O(1)，边遍历边存"）；然后写代码，边写边报复杂度；最后主动给测试用例——正常用例、两个相同数相加（nums=[3,3], target=6）、无解返回空。主动报边界条件，是"工程素养"的直接信号，往往比代码本身更让面试官放心。'
      }
    ],
    animation: {
      title: '两数之和：指针走数组，储物柜逐个入库',
      html: '<div class="anim-m9-01">\n  <div class="anim-m9-01-row">\n    <label>目标 target <input class="anim-m9-01-target" type="number" value="9"></label>\n    <button type="button" class="anim-m9-01-step">下一步</button>\n    <button type="button" class="anim-m9-01-reset">重置</button>\n    <span>试试 target：18（7+11）、26（11+15）、40（无解）</span>\n  </div>\n  <div class="anim-m9-01-nums"></div>\n  <div class="anim-m9-01-cabwrap">已见过的数（储物柜）：<span class="anim-m9-01-seen"></span></div>\n  <div class="anim-m9-01-log"></div>\n</div>',
      css: '.anim-m9-01 { font-size: 13px; }\n.anim-m9-01-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 8px; color: #64748b; }\n.anim-m9-01-nums { display: flex; gap: 8px; margin: 8px 0; }\n.anim-m9-01-cell { width: 68px; padding: 6px 4px; text-align: center; border: 2px solid #cbd5e1; border-radius: 8px; background: #fff; transition: all .3s ease; }\n.anim-m9-01-cell b { display: block; font-size: 16px; }\n.anim-m9-01-cell span { font-size: 11px; color: #94a3b8; }\n.anim-m9-01-cell.is-cur { border-color: #ec4899; background: #fdf2f8; transform: translateY(-3px); }\n.anim-m9-01-cell.is-hit { border-color: #16a34a; background: #f0fdf4; transform: translateY(-3px); }\n.anim-m9-01-seen { display: inline-flex; gap: 6px; flex-wrap: wrap; }\n.anim-m9-01-chip { display: inline-block; padding: 2px 8px; border-radius: 10px; background: #ede9fe; color: #5b21b6; font-family: monospace; }\n.anim-m9-01-log { margin-top: 8px; min-height: 20px; color: #334155; font-family: monospace; }',
      js: function (root) {
        var nums = [2, 7, 11, 15];
        var numsBox = root.querySelector('.anim-m9-01-nums');
        var seenBox = root.querySelector('.anim-m9-01-seen');
        var log = root.querySelector('.anim-m9-01-log');
        var target = root.querySelector('.anim-m9-01-target');
        var cells = null, i = 0, done = false;
        function build() {
          var h = '';
          for (var k = 0; k < nums.length; k++) {
            h += '<div class="anim-m9-01-cell"><b>' + nums[k] + '</b><span>[' + k + ']</span></div>';
          }
          numsBox.innerHTML = h;
          cells = numsBox.querySelectorAll('.anim-m9-01-cell');
        }
        function reset() {
          i = 0; done = false;
          build();
          seenBox.innerHTML = '';
          log.textContent = '点「下一步」：先查柜中有没有搭档，没有就把自己入库。';
        }
        root.querySelector('.anim-m9-01-reset').addEventListener('click', reset);
        root.querySelector('.anim-m9-01-step').addEventListener('click', function () {
          if (done) { log.textContent = '本局已结束，点「重置」换个 target 再来。'; return; }
          if (i >= nums.length) { done = true; log.textContent = '走完没找到搭档 → 返回 []（无解）。'; return; }
          for (var k = 0; k < cells.length; k++) cells[k].classList.remove('is-cur');
          cells[i].classList.add('is-cur');
          var x = nums[i], need = Number(target.value) - x;
          var chip = null;
          if (!isNaN(need)) chip = seenBox.querySelector('[data-v="' + need + '"]');
          if (chip) {
            var j = Number(chip.getAttribute('data-i'));
            cells[i].classList.add('is-hit');
            cells[j].classList.add('is-hit');
            log.textContent = 'nums[' + i + ']=' + x + '，搭档 ' + need + ' 在柜中（下标 ' + j + '）→ 命中！返回 [' + j + ', ' + i + ']';
            done = true;
            return;
          }
          var el = document.createElement('span');
          el.className = 'anim-m9-01-chip';
          el.setAttribute('data-v', String(x));
          el.setAttribute('data-i', String(i));
          el.textContent = x + '→' + i;
          seenBox.appendChild(el);
          log.textContent = 'nums[' + i + ']=' + x + '，搭档 ' + need + ' 不在柜中 → 入库，指针右移';
          i++;
        });
        reset();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'nums = [2, 7, 11, 15]，target = 9，哈希表解法返回什么？',
        options: ['[0, 1]', '[1, 2]', '[0, 3]', '[]'],
        answer: 0,
        explanation: '走到 7 时查 9−7=2，2 已在柜中（下标 0），返回 [0, 1]。[1,2] 对应 7+11=18、[0,3] 对应 2+15=17，都不等于 9；[] 是无解时的返回。考点：哈希解法"先查后存"的顺序，决定了返回结果里更早的下标排在前。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '"先查搭档、再把自己入库"的顺序不能颠倒：若先入库再查，nums = [3, 2, 4]、target = 6 时会在第一步就用 3 匹配到自己，错误地返回 [0, 0]。',
        answer: true,
        explanation: '正确实现先查 y = target − x 是否在 seen 中、再执行 seen[x] = i，保证查询时柜子里只有"当前数之前"的元素；顺序颠倒后，当 target = 2x 时当前数会与自己配对。考点：遍历方向 + 存查顺序，共同实现了"不重复使用同一元素"这条隐含约束，是两数之和最常被追问的细节。'
      },
      {
        type: 'single', difficulty: 2,
        question: '同样是 <code>if y in 容器</code>，为什么容器必须是字典而不能换成列表？',
        options: ['列表的 in 是 O(n) 逐个比对，整体退化回 O(n²)', '列表不能存数字', '字典的 in 需要先排序才能用', '没有区别，只是写法风格不同'],
        answer: 0,
        explanation: '字典底层是哈希表，in 是平均 O(1)；列表的 in 是线性扫描 O(n)，套进两数之和就是 O(n²)，优化等于白做。后两个选项都是误解：in 不需要排序，也不存在"列表不能存数字"。考点：容器选型决定复杂度，面试时"用什么存、用什么查"要一起说清楚。'
      },
      {
        type: 'code', difficulty: 3,
        question: '补全两数之和的哈希表实现：把"找和"翻译成"查搭档"，先查后存，一遍走完。',
        template: 'def two_sum(nums, target):\n    seen = {}                      # 值 → 下标 的"储物柜"\n    for i, x in enumerate(nums):\n        y = target - x             # 我需要的搭档\n        if y in ____:              # O(1) 查询：搭档来过吗\n            return [____, i]\n        seen[____] = i             # 没找到，把自己入库\n    return []\n',
        checks: ['in seen', 'seen[y]', 'seen[x]'],
        solution: 'def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        y = target - x\n        if y in seen:\n            return [seen[y], i]\n        seen[x] = i\n    return []\n',
        explanation: '三个空对应三处命门：查询容器是字典 seen；返回"搭档的下标 seen[y] 与当前下标 i"；入库 seen[x] = i 且必须在查询之后。常见错误：把值 y 当下标返回、先存后查导致自我配对。考点：写完要主动报复杂度——单步查询 O(1)、整体 O(n) 时间 / O(n) 空间，并口述边界用例。'
      }
    ],
    relations: {
      prerequisites: ['m1-04'],
      successors: [],
      confusables: [
        { other: 'm1-04', tip: 'm1-04 讲的是 Python 语法工具（dict 怎么存取、遍历）；本课考的是算法设计——用 dict 的 O(1) 查询把 O(n²) 降到 O(n)。工具与思想分层作答，面试条理更清楚。' },
        { other: 'm9-02', tip: '同为查找：数据无序、要找"配对/重复"时用哈希表，空间换时间；数据有序、只找一个数时用二分 O(log n)，更省内存。先问数据有没有序，再选武器。' }
      ]
    },
    memory: {
      mnemonic: '找搭档，问柜子；边查边存，一遍走完。',
      selfTest: [
        { q: '哈希表解两数之和，为什么必须"先查后存"？', a: '先查 y = target − x 再存自己，保证查询时柜中只有当前数之前的元素；若先存后查，当 target = 2x 时当前数会与自己配对（如 nums=[3,2,4]、target=6 会错误返回 [0,0]）。' },
        { q: '时间与空间复杂度各是多少？代价换来了什么？', a: '时间 O(n)：一遍遍历、每步 O(1) 查询；空间 O(n)：最坏把所有数存入字典。用 O(n) 空间把时间从 O(n²) 压到 O(n)，是"空间换时间"的典型样本。' },
        { q: '面试官追问：数组已排好序时，有没有更省内存的做法？', a: '双指针：left 指头、right 指尾，和太小移 left、太大移 right，O(n) 时间、O(1) 空间；有序性使"排除法"成立，不再需要哈希表记账。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：电脑怎么快速在一堆数字里找到"加起来等于 9"的两个数？',
      reference: '让电脑边走边记小本本：每看到一个数，先翻小本本查"9 减它的差出现过吗"，出现过当场配对成功，没出现过就把它记进本本再走——只过一遍，不用把所有两两组合都傻算一遍。'
    }
  },
  {
    id: 'm9-02',
    title: '二分查找',
    oneLiner: '翻字典找页码的艺术',
    estMinutes: 14,
    analogy: {
      title: '翻字典找页码',
      body: '查一个单词，你不会从第一页开始翻：先翻到字典正中间，看目标在左半还是右半，随手扔掉不要的那一半；再在剩下的一半里翻正中间……每次都把范围砍半。1000 页的字典最多翻 10 次就命中（2¹⁰ = 1024）。这种"每次排除一半"的查找就是<b>二分查找（Binary Search）</b>，它把 n 个候选的查找成本从 O(n) 压到 O(log n)。'
    },
    intuition: [
      { heading: '为什么是 O(log n)', body: 'n 个元素，第一次查完剩 n/2，第二次剩 n/4……k 次后剩 n/2ᵏ。剩 1 个时 n/2ᵏ = 1，解得 k = log₂n。100 万个有序数只要约 20 步，10 亿个约 30 步——对数级增长慢得惊人。这份速度红利不是算法白送的，是"有序"这个前提送的：正因为有序，看一眼中间值就能断定答案在哪半边。' },
      { heading: '两个指针守一条规矩', body: 'left 和 right 圈出"答案只可能在 [left, right] 这段区间"——这叫循环不变式（Loop Invariant）。每轮取中点 mid 试探：命中就返回；nums[mid] 太小说明目标在右半，left = mid + 1 扔掉左半；太大则 right = mid − 1 扔掉右半。区间每轮严格变小，循环必然终止。写二分时心里默念这条不变式，边界就乱不了。' },
      { heading: '三大易错点，面试官全在等', body: '一是循环条件 <code>while left &lt;= right</code> 的等号：少了它，区间缩到只剩一个元素时进不了循环，漏掉边界答案。二是取中点写 <code>left + (right - left) // 2</code>：在 C/Java 里 <code>(left + right)</code> 相加可能超出整数上限溢出成负数；Python 的整数不会溢出，但面试要能写出"防溢出"版本并说出为什么。三是更新必须跨过 mid（+1 / −1）：写成 left = mid，区间可能原地踏步，死循环。' }
    ],
    principle: [
      {
        heading: '标准模板（左闭右闭区间）',
        body: '先声明区间语义（左闭右闭），再按不变式写，是手撕二分的标准姿势：\n<pre><code>def binary_search(nums, target):\n    left, right = 0, len(nums) - 1      # 闭区间 [left, right]\n    while left &lt;= right:                # 等号不能丢\n        mid = left + (right - left) // 2   # 防溢出写法\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] &lt; target:\n            left = mid + 1             # 扔掉左半（含 mid）\n        else:\n            right = mid - 1            # 扔掉右半（含 mid）\n    return -1\n</code></pre>\n逐行对齐不变式：闭区间里 left ≤ right 才可能有候选，所以循环条件带等号；mid 已查过、被排除，更新时必须把它踢出区间；循环正常退出说明区间为空，返回 -1。'
      },
      {
        heading: '前提与复杂度',
        body: '二分的两个前提：<b>有序</b>（或具有单调性——"是否可行"随某个量单调变化）与<b>随机访问</b>（能 O(1) 跳到任意下标，链表不行）。时间 O(log n)，空间 O(1)。',
        formula: '最坏比较次数 = ⌈log₂(n + 1)⌉',
        formulaNote: '<ul><li><b>n</b>：有序数组的元素个数</li><li><b>⌈ ⌉</b>：向上取整，除不尽时多算一次</li><li>直觉：每次比较区间减半，100 个元素最多 7 次、100 万约 20 次、10 亿约 30 次</li><li>考点：报复杂度时顺口换算一次数量级，体现复杂度直觉</li></ul>'
      },
      {
        heading: '变体一句话：找左边界',
        body: '标准模板命中就返回；若要"第一个 ≥ target 的位置"（左边界），改成命中不返回、先记下 mid 为候选答案，再 <code>right = mid - 1</code> 继续向左压，循环结束时的候选即答案；右边界对称。旋转数组、求整数平方根等题都是这套骨架换个条件。动手前先声明"我按左闭右闭写"，能避免大半的边界争论——这也是面试官考察"思路是否清晰"的信号。'
      }
    ],
    animation: {
      title: 'left / mid / right 三指针收缩演示',
      html: '<div class="anim-m9-02">\n  <div class="anim-m9-02-row">\n    <label>要找的数 <input class="anim-m9-02-target" type="number" value="11"></label>\n    <button type="button" class="anim-m9-02-step">走一步</button>\n    <button type="button" class="anim-m9-02-set6">查 6（不存在）</button>\n    <button type="button" class="anim-m9-02-reset">重置</button>\n  </div>\n  <div class="anim-m9-02-nums"></div>\n  <div class="anim-m9-02-legend">粉=mid 试探 · 蓝=left · 绿=right · 灰=已排除</div>\n  <div class="anim-m9-02-log"></div>\n</div>',
      css: '.anim-m9-02 { font-size: 13px; }\n.anim-m9-02-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 10px; }\n.anim-m9-02-nums { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }\n.anim-m9-02-cell { width: 56px; padding: 5px 2px; text-align: center; border: 2px solid #cbd5e1; border-radius: 8px; background: #fff; transition: all .3s ease; }\n.anim-m9-02-cell b { display: block; font-size: 15px; }\n.anim-m9-02-cell span { font-size: 11px; color: #94a3b8; }\n.anim-m9-02-cell.is-out { opacity: .35; }\n.anim-m9-02-cell.is-l { border-color: #3b82f6; }\n.anim-m9-02-cell.is-r { border-color: #16a34a; }\n.anim-m9-02-cell.is-mid { border-color: #ec4899; background: #fdf2f8; transform: translateY(-3px); }\n.anim-m9-02-cell.is-hit { border-color: #16a34a; background: #f0fdf4; transform: translateY(-3px); }\n.anim-m9-02-legend { color: #64748b; margin-bottom: 6px; }\n.anim-m9-02-log { min-height: 36px; color: #334155; font-family: monospace; }',
      js: function (root) {
        var nums = [1, 3, 5, 7, 9, 11, 13, 15];
        var wrap = root.querySelector('.anim-m9-02-nums');
        var log = root.querySelector('.anim-m9-02-log');
        var tIn = root.querySelector('.anim-m9-02-target');
        var left = 0, right = nums.length - 1, done = false;
        function build() {
          var h = '';
          for (var i = 0; i < nums.length; i++) {
            h += '<div class="anim-m9-02-cell"><b>' + nums[i] + '</b><span>[' + i + ']</span></div>';
          }
          wrap.innerHTML = h;
        }
        function paint() {
          var cells = wrap.querySelectorAll('.anim-m9-02-cell');
          var mid = (left <= right) ? left + Math.floor((right - left) / 2) : -1;
          for (var i = 0; i < cells.length; i++) {
            var c = 'anim-m9-02-cell';
            if (i < left || i > right) c += ' is-out';
            if (i === left && left <= right) c += ' is-l';
            if (i === right && left <= right) c += ' is-r';
            if (i === mid) c += ' is-mid';
            cells[i].className = c;
          }
        }
        function reset() {
          left = 0; right = nums.length - 1; done = false;
          build(); paint();
          log.textContent = '点「走一步」：每次看 mid，扔掉一半区间。';
        }
        root.querySelector('.anim-m9-02-reset').addEventListener('click', reset);
        root.querySelector('.anim-m9-02-set6').addEventListener('click', function () { tIn.value = 6; reset(); });
        root.querySelector('.anim-m9-02-step').addEventListener('click', function () {
          if (done) { log.textContent = '本轮结束，点「重置」再来。'; return; }
          if (left > right) { done = true; paint(); log.textContent = 'left 越过 right → 区间为空，target 不在数组中，返回 -1。'; return; }
          var t = Number(tIn.value);
          var mid = left + Math.floor((right - left) / 2);
          paint();
          if (nums[mid] === t) {
            done = true;
            wrap.querySelectorAll('.anim-m9-02-cell')[mid].classList.add('is-hit');
            log.textContent = 'nums[' + mid + '] = ' + t + '，命中！共比较返回下标 ' + mid + '。';
            return;
          }
          if (nums[mid] < t) {
            log.textContent = 'nums[' + mid + ']=' + nums[mid] + ' < ' + t + ' → 目标在右半：left = mid + 1';
            left = mid + 1;
          } else {
            log.textContent = 'nums[' + mid + ']=' + nums[mid] + ' > ' + t + ' → 目标在左半：right = mid - 1';
            right = mid - 1;
          }
          paint();
          if (left > right) { done = true; log.textContent += '；区间已空 → 返回 -1（演示"查 6"这类不存在的情况）。'; }
        });
        reset();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '在 1024 个元素的有序数组里做二分查找，最坏情况要比较几次？',
        options: ['10 次', '100 次', '512 次', '1024 次'],
        answer: 0,
        explanation: '2¹⁰ = 1024，每比较一次区间减半，最多 10 次就剩最后一个元素。512/1024 次是线性扫描的量级，混淆了 O(n) 与 O(log n)。考点：log₂n 要能秒换算——100 万约 20 次、10 亿约 30 次。'
      },
      {
        type: 'fill', difficulty: 2,
        question: '补全标准二分模板的循环条件：<code>while left ____ right:</code>（填比较符号），少了这个符号，区间缩到一个元素时会漏查。',
        accept: ['<=', '=<'],
        explanation: '左闭右闭区间 [left, right] 里，left == right 时区间还剩一个候选，必须允许进入循环去查它，所以是 <=。写成 < 只适合左闭右开区间的模板——两套模板不可混搭，混搭正是二分 bug 的第一大来源。考点：主动声明区间语义再写循环条件。'
      },
      {
        type: 'single', difficulty: 2,
        question: 'C/Java 中取中点常写 <code>mid = left + (right - left) / 2</code> 而不是 <code>(left + right) / 2</code>，原因是？',
        options: ['left + right 相加可能超出整数上限而溢出', '前者计算速度更快', '后者在 Python 里是语法错误', '两者完全等价，只是个人习惯'],
        answer: 0,
        explanation: 'left、right 都接近整数上限时，left + right 会溢出成负数，再除以 2 也救不回来；拆成"先算差、除以 2、再加 left"就不会溢出。Python 整数无上限，两种都安全，但面试写出防溢出版本并说清原因，是工程素养的直接体现。考点：这是手撕二分的"礼仪题"，答不出会被认为没在大厂工程语境下写过代码。'
      },
      {
        type: 'code', difficulty: 3,
        question: '默写二分查找标准模板（左闭右闭区间），注意循环条件等号与跨过 mid 的更新方式。',
        template: 'def binary_search(nums, target):\n    left, right = 0, len(nums) - 1        # 闭区间 [left, right]\n    while left ____ right:                # 等号不能丢\n        mid = left + (right - left) // 2  # 防溢出写法\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = ____ + 1               # 扔掉左半（含 mid）\n        else:\n            right = ____ - 1              # 扔掉右半（含 mid）\n    return -1\n',
        checks: ['left <= right', 'mid + 1', 'mid - 1'],
        solution: 'def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n',
        explanation: '三个空是模板命门：left <= right 保证区间缩到一个元素时还能进循环；更新必须跨过 mid（mid 已被查过、排除），写成 left = mid 在剩余两个元素时会原地踏步、死循环。常见错误：right = mid（左闭右开模板的写法）与 <= 混用导致漏解。考点：写完主动口述"左闭右闭、每轮区间严格缩小"，并跑边界用例——target 在首位、末位、不存在。'
      }
    ],
    relations: {
      prerequisites: ['m1-04'],
      successors: [],
      confusables: [
        { other: 'm9-01', tip: '都是"查找"：无序数据找配对用哈希表（O(n) 时间、O(n) 空间）；有序数据找单个数用二分（O(log n) 时间、O(1) 空间）。先问数据有没有序、要不要随机访问，再选工具。' },
        { other: 'm1-04', tip: 'Python 里 <code>//</code> 是整除（向下取整），<code>/</code> 是真除法返回浮点数——mid 必须用整除，否则列表下标变成小数直接报错。' }
      ]
    },
    memory: {
      mnemonic: '有序才二分；等号别丢，mid 防溢出，更新跨一步。',
      selfTest: [
        { q: '二分查找的两个前提是什么？链表上能二分吗？', a: '有序（或单调性）+ 随机访问。链表取 mid 要 O(n) 遍历，整体退化，所以不能直接二分（工程上用跳表弥补随机访问的缺失）。' },
        { q: '为什么更新是 left = mid + 1 / right = mid - 1，而不是 left = mid？', a: 'mid 已经查过并被排除，闭区间语义下必须把它踢出候选；若写 left = mid，区间只剩两个元素时可能永远停在原地，死循环。' },
        { q: '"找第一个大于等于 target 的位置"与标准模板差在哪？', a: '命中不返回：先把 mid 记为候选答案，再 right = mid - 1 继续向左压，循环结束后候选即左边界；复杂度仍是 O(log n)。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：二分查找为什么快？',
      reference: '像翻字典：每翻一次就扔掉一半不需要的页，十次就能覆盖一千多页——因为"翻十次"对应 2 的十次方个位置，范围指数级缩小，翻的次数只按对数慢慢涨。'
    }
  }
  ,
  {
    id: 'm9-03',
    title: '手撕 Softmax',
    oneLiner: '三行代码与数值稳定的陷阱',
    estMinutes: 14,
    analogy: {
      title: '先压平最高分，再分蛋糕',
      body: '回扣 m1-06 的分蛋糕：softmax 把每个候选的得分按比例切成蛋糕，谁分多少全看相对大小。但称重的秤是"指数"——e¹⁰⁰⁰ 这种读数直接把秤压爆。聪明的做法是：把所有分数统一减去最高分，相当于把最高的那块定为基准 1，<b>相对比例一点没变，秤却永远不会爆</b>。Softmax（柔性最大值）的数值稳定技巧，就是动手前先做这一下"减最高分"。'
    },
    intuition: [
      { heading: 'softmax 在大模型里的位置', body: '大模型每生成一个 token，最后一步都是：词表里每个候选词领到一个打分（logit），softmax 把这些任意实数变成"非负、总和为 1"的概率分布，再按概率抽词。可以说 LLM 每次开口，结尾都是一个 softmax——温度、top-k / top-p 这些旋钮全是围绕它做文章（见 m7-02 与 m9-06）。' },
      { heading: '朴素实现为什么炸', body: '按定义直接写 <code>e = np.exp(x); return e / e.sum()</code>。问题出在 exp 的增长速度：float32 下 exp(89) 左右就超出表示上限变成 inf；大模型的 logits 动辄几十上百，半精度（fp16，上限约 65504）下 exp(12) 附近就爆。一旦分子分母都是 inf，相除得到 NaN——而 NaN 会顺着计算一路污染整个模型输出，训练时直接 loss = NaN，且不报错、静默扩散，比崩溃更危险。' },
      { heading: '减最大值：一行修复', body: '数学上有条免费性质：给每个数同减任意常数 c，softmax 结果完全不变（分子分母同乘 e⁻ᶜ 后约掉）。取 c = max(x)，所有指数都 ≤ 0，最大的那一项恰好是 e⁰ = 1，永不溢出；小项下溢成 0 也无害——它的真实概率本来就趋近 0。成本只是多一次求最大值，属于"免费的保险"，所有主流框架内部都这么做。' }
    ],
    principle: [
      {
        heading: '默认实现：两行',
        body: '面试标准答案就是下面三行有效代码，必须能逐行说清楚：\n<pre><code>import numpy as np\n\ndef softmax(x):\n    e = np.exp(x - np.max(x))   # 先减最大值，防溢出\n    return e / e.sum()\n</code></pre>\n<code>np.max(x)</code> 求基准；<code>x - np.max(x)</code> 整体平移，把最大值压到 0；exp 之后最大项是 1、其余在 (0, 1]；除以总和归一化成概率。若输入是二维批量数据，沿最后一维做：<code>np.exp(x - x.max(axis=-1, keepdims=True))</code>，keepdims 保住形状让减法能广播对齐。'
      },
      {
        heading: '为什么减最大值不改变结果',
        body: '这是本课必考的"为什么"。把推导写成一句话：分子分母同乘 e⁻ᶜ，常数被约掉，分布不变——减法只是换了一把零点不同的尺子。',
        formula: 'softmax(x)ᵢ = eˣⁱ / Σⱼ eˣʲ = e^(xᵢ−c) / Σⱼ e^(xⱼ−c)（对任意常数 c 成立）',
        formulaNote: '<ul><li><b>xᵢ</b>：第 i 个候选的原始打分（logit），可以是任意实数</li><li><b>eˣⁱ</b>：指数化，把打分变成正数，同时放大相互差距</li><li><b>除以 Σⱼ eˣʲ</b>：归一化，让所有候选的概率加起来恰好为 1</li><li><b>减常数 c 不变</b>：分子分母同乘 e⁻ᶜ 后约掉——数学上完全等价，取 c = max(x) 则指数全部 ≤ 0，计算永不溢出</li><li><b>下溢无害</b>：远小于 max 的项 exp 后约等于 0，对应本来就趋近 0 的概率</li></ul>'
      },
      {
        heading: '高频追问清单',
        body: '追问一"为什么减 max 而不是减均值"：减 max 后指数 ≤ 0、分母至少为 1，保证绝对安全；减别的常数只是"碰巧安全"。追问二"和交叉熵什么关系"：交叉熵 = −log(softmax)；PyTorch 的 <code>CrossEntropyLoss</code> 内部融合了 log_softmax + NLL，所以直接喂 logits，不要自己先 softmax 再喂（多一次取指反而损失精度，呼应 m2-03）。追问三"温度是什么"：softmax(x / T)，T 越小分布越尖、越接近贪心（m7-02）。能把这三问答顺，这道手撕题就是送分题。'
      }
    ],
    animation: {
      title: 'softmax 溢出演示台：减不减 max，拉到 200 倍试试',
      html: '<div class="anim-m9-03">\n  <div class="anim-m9-03-row">\n    <span>三个 logits</span>\n    <label>x₁ <input class="anim-m9-03-x1" type="range" min="0" max="10" step="1" value="2"></label>\n    <label>x₂ <input class="anim-m9-03-x2" type="range" min="0" max="10" step="1" value="4"></label>\n    <label>x₃ <input class="anim-m9-03-x3" type="range" min="0" max="10" step="1" value="6"></label>\n    <label>放大倍数 ×<input class="anim-m9-03-scale" type="range" min="1" max="200" step="1" value="1"></label>\n    <label class="anim-m9-03-tgl"><input class="anim-m9-03-stable" type="checkbox" checked> 先减最大值（稳定）</label>\n  </div>\n  <div class="anim-m9-03-table"></div>\n  <div class="anim-m9-03-note"></div>\n</div>',
      css: '.anim-m9-03 { font-size: 13px; }\n.anim-m9-03-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 10px; }\n.anim-m9-03-tab { border-collapse: collapse; font-family: monospace; }\n.anim-m9-03-tab th, .anim-m9-03-tab td { border: 1px solid #e2e8f0; padding: 4px 14px; text-align: right; }\n.anim-m9-03-tab th { background: #fdf2f8; }\n.anim-m9-03-note { margin-top: 8px; color: #334155; }\n.anim-m9-03-note.is-bad { color: #dc2626; font-weight: 600; }',
      js: function (root) {
        var xs = [root.querySelector('.anim-m9-03-x1'), root.querySelector('.anim-m9-03-x2'), root.querySelector('.anim-m9-03-x3')];
        var scale = root.querySelector('.anim-m9-03-scale');
        var stable = root.querySelector('.anim-m9-03-stable');
        var table = root.querySelector('.anim-m9-03-table');
        var note = root.querySelector('.anim-m9-03-note');
        function fmt(v) {
          if (v === Infinity) return '+inf';
          if (isNaN(v)) return 'NaN';
          if (v !== 0 && Math.abs(v) < 0.0001) return v.toExponential(1);
          return String(Math.round(v * 1000) / 1000);
        }
        function update() {
          var s = Number(scale.value);
          var v = xs.map(function (inp) { return Number(inp.value) * s; });
          var use = stable.checked;
          var mx = Math.max.apply(null, v);
          var shifted = use ? v.map(function (x) { return x - mx; }) : v;
          var e = shifted.map(function (x) { return Math.exp(x); });
          var sum = e.reduce(function (a, b) { return a + b; }, 0);
          var p = e.map(function (x) { return x / sum; });
          var h = '<table class="anim-m9-03-tab"><tr><th></th><th>logit</th><th>exp 之后</th><th>概率</th></tr>';
          for (var i = 0; i < 3; i++) {
            h += '<tr><td>x' + (i + 1) + '</td><td>' + fmt(v[i]) + '</td><td>' + fmt(e[i]) + '</td><td>' + fmt(p[i]) + '</td></tr>';
          }
          h += '<tr><td>Σ</td><td>—</td><td>' + fmt(sum) + '</td><td>' + fmt(p.reduce(function (a, b) { return a + b; }, 0)) + '</td></tr></table>';
          table.innerHTML = h;
          var bad = e.some(function (x) { return !isFinite(x); }) || p.some(function (x) { return isNaN(x); });
          note.className = 'anim-m9-03-note' + (bad ? ' is-bad' : '');
          note.textContent = bad
            ? '朴素实现已爆炸：exp 溢出成 inf，inf / inf = NaN，概率列全变 NaN——线上 NaN 事故就是这么来的。勾上「先减最大值」立刻恢复。'
            : (use ? '稳定模式：先减最大值，指数最大是 e⁰ = 1，任何输入都不会溢出，结果与数学定义完全一致。' : '当前数值还算安全。把放大倍数继续调大，看朴素实现什么时候炸。');
        }
        xs.concat([scale]).forEach(function (inp) { inp.addEventListener('input', update); });
        stable.addEventListener('change', update);
        update();
      }
    },
    exercises: [
      {
        type: 'judge', difficulty: 1,
        question: 'softmax 的输出一定非负且总和为 1，因此可以当作概率分布使用。',
        answer: true,
        explanation: 'exp 保证每一项都大于 0，除以总和保证加起来为 1，这就是它能当分布用的两条形状性质。但注意"长得像概率"不等于"校准良好的概率"——模型可能系统性过度自信。考点：softmax 只保证分布的形状，不保证概率的真实性，这是评估环节的常见考点。'
      },
      {
        type: 'fill', difficulty: 2,
        question: '数值稳定的 softmax 在取指数之前，要先给每个 logit 减去 ____，使得最大项的指数恰好是 e⁰ = 1，从根源上避免溢出。',
        accept: ['最大值', 'max', 'max(x)', 'np.max(x)', 'x.max()'],
        explanation: '减去最大值后所有指数 ≤ 0，最大项为 e⁰ = 1，永不溢出；这利用的是 softmax 的平移不变性。考点：追问"为什么偏偏减最大值而不是均值"——它同时保证分母 ≥ 1，是唯一"绝对安全"的选择。'
      },
      {
        type: 'single', difficulty: 2,
        question: 'x = [1000, 1001, 1002]，朴素 softmax（不减 max）在 NumPy 里的输出是什么？',
        options: ['[nan, nan, nan]', '[inf, inf, inf]', '[0.09, 0.24, 0.67]', '直接抛出异常，程序崩溃'],
        answer: 0,
        explanation: 'exp(1000) 等全部溢出为 inf，分子分母都是 inf，inf / inf = NaN。注意它不报错不崩溃——NumPy 只给一条 RuntimeWarning，NaN 静默传播，比异常更危险。稳定版输出正是 [0.09, 0.24, 0.67]。考点：NaN 的传染性，以及"减 max 后结果与数学定义完全一致"。'
      },
      {
        type: 'code', difficulty: 3,
        question: '写出数值稳定的 softmax：先减最大值再取指数，最后归一化成概率分布。',
        template: 'import numpy as np\n\ndef softmax(x):\n    # 第一步：平移防溢出（减去什么？）\n    e = np.exp(x - np.____)\n    # 第二步：归一化成概率分布\n    return ____\n',
        checks: ['max', 'e / e.sum'],
        solution: 'import numpy as np\n\ndef softmax(x):\n    e = np.exp(x - np.max(x))\n    return e / e.sum()\n',
        explanation: '两个空：np.max(x) 求基准做平移；e / e.sum() 归一化。只写 np.exp(x) / np.sum(np.exp(x)) 在大输入上会溢出成 NaN；顺序上必须"先减 max 再 exp"，反了就没意义。考点：LLM 岗的默认送分题，三行内必须出现"减 max"，并准备好回答"为什么等价、为什么不减均值、和 CrossEntropyLoss 什么关系"三个追问。'
      }
    ],
    relations: {
      prerequisites: ['m1-06'],
      successors: [],
      confusables: [
        { other: 'm1-06', tip: 'm1-06 讲 softmax 的"分蛋糕"语义与公式本身；本课回答"代码怎么写才不会 NaN"——同一个公式，多了减最大值这一步纯工程操作，数学结果不变。' },
        { other: 'm7-02', tip: '温度 T 是在 softmax 之前把 logits 除以 T 调节分布"锐度"，softmax 本身不变；m9-06 的 top-k / top-p 则是在 softmax 之后修剪分布——前后三层别混。' }
      ]
    },
    memory: {
      mnemonic: '先减最大再取幂，概率归一不炸机。',
      selfTest: [
        { q: '为什么减 max 在数学上完全等价？', a: '分子分母同乘 e⁻ᶜ 后常数被约掉，softmax(x) = softmax(x − c) 对任意 c 成立；取 c = max(x) 只是把指数全部压到 ≤ 0，让计算安全，结果一个比特都不变。' },
        { q: 'fp16 下为什么更容易出事？', a: 'fp16 最大约 65504，exp(11) 左右就超限；fp32 要到 exp(89)。半精度训练/推理时 logits 稍大，朴素 softmax 就溢出，所以减 max 在混合精度里是必做项而非可选项。' },
        { q: '训练时把 softmax 和交叉熵分开写有什么问题？', a: '先 softmax 得到概率再取 log，小概率会下溢成 0，log(0) = −inf，梯度随之爆炸；应该用 log_softmax 或 CrossEntropyLoss 内部融合（LogSumExp 技巧），让 log 与 exp 在安全域内抵消。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：为什么算概率前要先把最高分减掉？',
      reference: '所有分数一起减去最高分，相对差距原封不动，分蛋糕的比例一点没变；但最大的指数从天文数字变成了 1，电脑秤不爆、算得动——花一次减法买到永不溢出。'
    }
  },
  {
    id: 'm9-04',
    title: '手撕单头自注意力',
    oneLiner: '十行 PyTorch 写出 Q/K/V',
    estMinutes: 18,
    analogy: {
      title: '图书馆查资料',
      body: '你带着一个问题（Query）走进图书馆：架上每本书都有标签（Key）和内容（Value）。你把问题与每本书的标签比对相似度（QKᵀ 打分）；分数先除以 √d_k"降温"，防止某本书一家独大；softmax 把分数变成"每本书该读几成"的注意力配比；最后按配比把书的内容抄写融合（加权求和 V）。<b>自注意力（Self-Attention）</b>就是同一句话里的所有词互相当读者与书：每个词既发查询、也挂标签、也被引用。'
    },
    intuition: [
      { heading: 'LLM 岗手撕第一名', body: '面试官让你写注意力，考的不是背公式，而是三件事：公式每一项对应哪行代码；每个张量的形状怎么流转；√d_k、mask、dim=-1 这些细节能否脱口而出。建议先把形状表背熟再动笔：输入 (B, L, d) → Q/K/V 投影后 (B, L, d_k) → scores (B, L, L) → softmax 不改形状 → 输出 (B, L, d_k)。写一行、报一行形状，是这道题的标准打法。' },
      { heading: '公式到代码的逐项对应', body: '<code>Q @ K.transpose(-2, -1)</code> 就是 QKᵀ——注意只转置最后两维，保留 batch 维（这是 m1-05 张量思维的直接应用）；除以 <code>math.sqrt(d_k)</code> 给打分降温；<code>masked_fill</code> 把不允许看的位置填成 −inf；<code>torch.softmax(scores, dim=-1)</code> 沿最后一维（每个 query 对全部 key 的那一行）归一化；最后 <code>attn @ V</code> 完成加权求和。十行以内，行行有出处。' },
      { heading: '为什么是 √d_k', body: 'Q、K 的分量近似零均值、同方差，点积是 d_k 项乘积求和，方差随 d_k 线性增大：d_k = 64 时分数的标准差约是单维的 8 倍。分数一大，softmax 就进入"一家独大"的饱和区——最大项概率接近 1、其余接近 0，梯度趋近 0。除以 √d_k 恰好把方差拉回 1，让 softmax 保持在梯度健康的工作区。这是"为什么除以 √d_k"的标准答案。' }
    ],
    principle: [
      {
        heading: '公式与十行实现',
        body: '先念公式，再逐项落到代码——每一行都能指回公式的一个部件：\n<pre><code>import torch, math\n\ndef attention(Q, K, V, mask=None):\n    d_k = Q.size(-1)\n    scores = Q @ K.transpose(-2, -1) / math.sqrt(d_k)  # (B, L, L)\n    if mask is not None:\n        scores = scores.masked_fill(mask == 0, float(\'-inf\'))\n    attn = torch.softmax(scores, dim=-1)               # 每行和为 1\n    return attn @ V                                    # (B, L, d_k)\n</code></pre>',
        formula: 'Attention(Q, K, V) = softmax(QKᵀ / √d_k) V',
        formulaNote: '<ul><li><b>Q（Query）</b>：每个位置的"查询"——我在找什么信息</li><li><b>K（Key）</b>：每个位置的"标签"——我能提供什么信息</li><li><b>QKᵀ</b>：L×L 打分矩阵，第 (i, j) 格是位置 i 对位置 j 的关注分</li><li><b>√d_k</b>：除以查询/键维度的平方根，抵消点积方差随 d_k 增大，防 softmax 饱和</li><li><b>softmax(dim=-1)</b>：把每行打分变成和为 1 的注意力权重</li><li><b>乘 V</b>：按权重对内容向量加权求和，输出与输入等长的融合表示</li></ul>'
      },
      {
        heading: '形状追踪表：写一行报一行',
        body: '手撕时嘴里要一直报形状：X (B, L, d) 分别乘 W_q、W_k、W_v 得到 Q/K/V，形状 (B, L, d_k)；<code>Q @ K.transpose(-2, -1)</code> 是 (B, L, d_k) × (B, d_k, L) → (B, L, L)；softmax 不改形状；<code>attn @ V</code> 是 (B, L, L) × (B, L, d_k) → (B, L, d_k)。形状对不上，九成是 transpose 或 @ 的维度搞反了——当场用形状表自查，比盯着公式发呆快得多。'
      },
      {
        heading: 'mask、多头与高频追问',
        body: 'mask 必须在 softmax 之前加：把禁止 attend 的位置写成 −inf，softmax 后权重恰为 0（exp(−inf) = 0）。因果 mask（causal mask）是下三角，"只许看过去"——这正是推理时历史 K/V 能被缓存复用的前提（m7-01）。多头注意力 = h 组不同投影各跑一遍这个函数、拼接后过 W_o（m5-02），会写单头，多头只是再来几份。高频追问：为什么 dim=-1（对每个 query 的打分行归一化）；为什么先 mask 后 softmax（顺序反了 −inf 会被当普通分数参与归一化，掩码失效）；attn @ V 之后通常还有输出投影 W_o。'
      }
    ],
    animation: {
      title: '从公式到矩阵：六步流水线与形状追踪',
      html: '<div class="anim-m9-04">\n  <div class="anim-m9-04-row">\n    <button type="button" class="anim-m9-04-step">下一步</button>\n    <button type="button" class="anim-m9-04-reset">重置</button>\n    <span class="anim-m9-04-hint">示例：句长 L = 4，d_k = 4，因果 mask（只许看自己与过去）</span>\n  </div>\n  <ol class="anim-m9-04-pipe">\n    <li>输入 X (B,L,d)</li>\n    <li>投影 Q,K,V (B,L,d_k)</li>\n    <li>scores = QKᵀ (B,L,L)</li>\n    <li>÷ √d_k</li>\n    <li>mask → −inf</li>\n    <li>softmax(dim=-1)</li>\n    <li>attn @ V → 输出</li>\n  </ol>\n  <div class="anim-m9-04-head"></div>\n  <div class="anim-m9-04-grid"></div>\n</div>',
      css: '.anim-m9-04 { font-size: 13px; }\n.anim-m9-04-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; }\n.anim-m9-04-hint { color: #64748b; }\n.anim-m9-04-pipe { margin: 0 0 10px; padding-left: 18px; }\n.anim-m9-04-pipe li { color: #94a3b8; transition: color .3s ease; }\n.anim-m9-04-pipe li.is-on { color: #be185d; font-weight: 600; }\n.anim-m9-04-head b { color: #be185d; }\n.anim-m9-04-head code { display: inline-block; margin-left: 8px; background: #fdf2f8; padding: 1px 6px; border-radius: 4px; }\n.anim-m9-04-head p { margin: 6px 0 8px; color: #334155; }\n.anim-m9-04-tab { border-collapse: collapse; font-family: monospace; }\n.anim-m9-04-tab td { border: 1px solid #e2e8f0; min-width: 56px; padding: 4px 8px; text-align: center; transition: background .3s ease; }\n.anim-m9-04-tab td.is-mask { background: #1e293b; color: #fca5a5; }',
      js: function (root) {
        var RAW = [
          [2.0, 1.0, 0.0, -1.0],
          [1.0, 3.0, 0.5, 2.0],
          [0.0, 1.0, 2.0, 1.0],
          [1.5, 0.0, 1.0, 3.0]
        ];
        var INFO = [
          { t: '输入 X', s: '(B, L, d)', n: '每个 token 一行 d 维向量。自注意力的任务：让每个位置按需吸收其他位置的信息。', grid: 'none' },
          { t: '线性投影', s: 'Q = XW_q, K = XW_k, V = XW_v，形状 (B, L, d_k)', n: '同一个 X 乘三组权重，得到查询、标签、内容三种角色。手撕时通常由函数入参直接给出 Q/K/V。', grid: 'none' },
          { t: '打分', s: 'scores = Q @ Kᵀ，形状 (B, L, L)', n: '每个 query 与每个 key 做点积：第 i 行第 j 格 = 位置 i 对位置 j 的关注分。', grid: 'raw' },
          { t: '缩放', s: 'scores / √d_k（示例 d_k = 4，即 ÷2）', n: '点积方差随 d_k 线性增大，除以 √d_k 拉回方差 1，softmax 不进饱和区、梯度保持健康。', grid: 'scaled' },
          { t: '掩码', s: 'masked_fill(mask == 0, −inf)，形状不变', n: '因果 mask 是下三角：位置 i 不许看 j > i 的未来。−inf 在 softmax 后权重恰好为 0。', grid: 'masked' },
          { t: '归一化', s: 'attn = softmax(scores, dim=-1)，形状 (B, L, L)', n: '沿最后一维（每行）归一化：每个 query 分配给全部 key 的注意力总和为 1。', grid: 'probs' },
          { t: '加权和', s: 'out = attn @ V，形状 (B, L, d_k)', n: '每行权重对 V 逐列加权求和：每个位置得到一份按注意力配比融合的信息。', grid: 'none' }
        ];
        var lis = root.querySelectorAll('.anim-m9-04-pipe li');
        var head = root.querySelector('.anim-m9-04-head');
        var grid = root.querySelector('.anim-m9-04-grid');
        var step = 0;
        function softmaxRow(row) {
          var m = Math.max.apply(null, row);
          var es = row.map(function (v) { return Math.exp(v - m); });
          var s = 0;
          for (var i = 0; i < es.length; i++) s += es[i];
          return es.map(function (v) { return v / s; });
        }
        function render() {
          for (var i = 0; i < lis.length; i++) lis[i].className = i <= step ? 'is-on' : '';
          var info = INFO[step];
          head.innerHTML = '<b>' + (step + 1) + '. ' + info.t + '</b><code>' + info.s + '</code><p>' + info.n + '</p>';
          if (info.grid === 'none') { grid.innerHTML = ''; return; }
          var probs = null;
          if (info.grid === 'probs') {
            probs = RAW.map(function (row, r) {
              var m = row.map(function (v, c) { return c > r ? -Infinity : v / 2; });
              return softmaxRow(m);
            });
          }
          var h = '<table class="anim-m9-04-tab">';
          for (var r = 0; r < 4; r++) {
            h += '<tr>';
            for (var c = 0; c < 4; c++) {
              var txt, cls = '';
              if (info.grid === 'raw') { txt = RAW[r][c].toFixed(1); }
              else if (info.grid === 'scaled') { txt = (RAW[r][c] / 2).toFixed(1); }
              else if (info.grid === 'masked') {
                if (c > r) { txt = '−inf'; cls = ' is-mask'; } else { txt = (RAW[r][c] / 2).toFixed(1); }
              } else {
                txt = (probs[r][c] * 100).toFixed(0) + '%';
                if (c > r) cls = ' is-mask';
              }
              h += '<td class="' + cls + '">' + txt + '</td>';
            }
            h += '</tr>';
          }
          h += '</table>';
          grid.innerHTML = h;
        }
        root.querySelector('.anim-m9-04-step').addEventListener('click', function () {
          if (step < INFO.length - 1) { step++; render(); }
        });
        root.querySelector('.anim-m9-04-reset').addEventListener('click', function () { step = 0; render(); });
        render();
      }
    },
    exercises: [
      {
        type: 'judge', difficulty: 1,
        question: '除以 √d_k 是为了抵消点积方差随维度增大的问题，防止 softmax 进入梯度极小的饱和区。',
        answer: true,
        explanation: 'QKᵀ 的每一格是 d_k 项乘积的求和，方差正比于 d_k；不缩放时 d_k = 64 分数就很大，softmax 一家独大、梯度趋 0。除以 √d_k 恰好把方差拉回 1。考点：公式人人背得出，答出"为什么"才拿分——这是手撕注意力的必考追问。'
      },
      {
        type: 'order', difficulty: 2,
        question: '把"从公式到可运行代码"的步骤排成正确顺序：',
        items: ['softmax(scores, dim=-1) 沿最后一维归一化', 'Q、K、V 线性投影（或由入参直接给出）', 'attn @ V 加权求和得到输出', 'scores = Q @ Kᵀ / √d_k 计算打分矩阵', '把 mask==0 的位置 masked_fill 成 −inf'],
        answer: [1, 3, 4, 0, 2],
        explanation: '顺序即公式：投影 → 打分缩放 → 掩码 → softmax → 加权和。易错点是把 mask 放到 softmax 之后——那样 −inf 会被当成普通分数参与归一化，掩码失效。考点：order 题考的就是"公式每一项在代码里的执行次序"，与形状追踪表一一对应。'
      },
      {
        type: 'code', difficulty: 3,
        question: '默写单头自注意力核心实现：打分、掩码、归一化、加权求和，四步走完，形状 (B,L,L) 进 (B,L,d_k) 出。',
        template: 'import torch, math\n\ndef attention(Q, K, V, mask=None):\n    d_k = Q.size(-1)\n    # 1) 打分：Q 乘 K 的转置（只转置后两维），并除以 sqrt(d_k)\n    scores = Q @ K.____ / math.sqrt(d_k)\n    if mask is not None:\n        # 2) 屏蔽：mask==0 的位置填成 -inf\n        scores = scores.____(mask == 0, float(\'-inf\'))\n    # 3) 沿最后一维归一化成注意力权重\n    attn = torch.____(scores, dim=-1)\n    # 4) 权重加权 V，输出形状 (B, L, d_k)\n    return attn @ V\n',
        checks: ['transpose', 'masked_fill', 'softmax'],
        solution: 'import torch, math\n\ndef attention(Q, K, V, mask=None):\n    d_k = Q.size(-1)\n    scores = Q @ K.transpose(-2, -1) / math.sqrt(d_k)\n    if mask is not None:\n        scores = scores.masked_fill(mask == 0, float(\'-inf\'))\n    attn = torch.softmax(scores, dim=-1)\n    return attn @ V\n',
        explanation: '三个空是注意力的三块基石：transpose(-2, -1) 实现 Kᵀ 且保留 batch 维；masked_fill 把非法位置打成 −inf（必须在 softmax 之前）；softmax(dim=-1) 逐行归一化。常见错误：用 .T 转置丢失 batch 语义、mask 放在 softmax 之后、忘记除 √d_k。考点：LLM 岗出镜率第一的手撕题，建议练到 3 分钟默写、同步报形状，并备好"√d_k 的来历"的回答。'
      }
    ],
    relations: {
      prerequisites: ['m5-01', 'm1-05'],
      successors: [],
      confusables: [
        { other: 'm5-01', tip: 'm5-01 讲注意力的机制与直觉（Q/K/V 各是什么、为什么有效）；本课把公式逐项落成 PyTorch 代码并盯紧形状。先懂机制再默写，顺序不能反。' },
        { other: 'm5-02', tip: '单头是主干函数；多头 = h 组独立投影各跑一遍这个函数、拼接后过 W_o。会写单头后，多头只是"再来几份 + 拼接"，别把两者当成两套机制。' },
        { other: 'm7-01', tip: '因果 mask（下三角）保证位置 i 只依赖 ≤ i 的历史——正因为这个结构，推理时历史的 K/V 才可以被缓存复用（KV Cache），mask 与 cache 是一体两面。' }
      ]
    },
    memory: {
      mnemonic: '投影打分除根号，掩码 softmax 乘 V。',
      selfTest: [
        { q: 'scores 的形状是什么？softmax 为什么用 dim=-1？', a: '(B, L, L)：每个 query 对每个 key 一个分。dim=-1 表示沿最后一维（每个 query 的打分行）归一化，使每行权重和为 1；dim 用错会沿 batch 或错误维度归一，形状虽不变但语义全错。' },
        { q: 'mask 为什么要在 softmax 之前加？−inf 起什么作用？', a: 'softmax 是指数归一化，−inf 经 exp 后为 0，被禁位置的权重精确归零，且不影响其余位置之间的相对比例；放在 softmax 之后只是事后改数值，破坏"和为 1"的语义，实现也混乱。' },
        { q: '为什么除以 √d_k，而不是 d_k 或干脆不除？', a: '点积是 d_k 个零均值同方差项之和，方差正比于 d_k；除以 √d_k 恰好把方差拉回 1。不除会饱和、梯度消失；除以 d_k 则缩过头，分布过平、注意力失效。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：自注意力让模型在干什么？',
      reference: '读每个词时环顾整句，给相关的词多分一点注意力、不相关的少分一点，再按比例把这些词的信息抄回来融合——像带着问题查图书馆，按匹配度决定每本书读几成。'
    }
  }
  ,
  {
    id: 'm9-05',
    title: '手撕 BPE 分词',
    oneLiner: '像拼乐高一样合并出词表',
    estMinutes: 16,
    analogy: {
      title: '拼乐高：高频组合做成预制件',
      body: '一开始零件库里只有 1×1 的小颗粒（单个字符）。盯着一箱作品（语料）观察：哪些两块颗粒总是肩并肩出现？把它们粘成一个预制件（子词），登记进零件库（词表）；再观察、再粘贴……常用组合（如 est、low）慢慢变成大积木，而没见过的新作品也能用库里现有的颗粒拼出来。<b>BPE（Byte Pair Encoding，字节对编码）</b>就是这套"统计—合并"的循环：不靠词典、不靠语言学规则，纯靠频率把词表"长"出来。'
    },
    intuition: [
      { heading: '为什么需要子词', body: '词级分词的词表会爆炸，而且见到新词就抓瞎（未登录词 OOV）；字符级什么都装得下，但序列太长、单字符几乎没语义。BPE 取中间态：高频词整体成 token，低频词拆成有意义的子块（un + happy），词表可控、永无 OOV——GPT 系列的词表就是 BPE 训出来的（概念动机见 m4-01，本课管"怎么训"）。' },
      { heading: '一轮只有四步', body: '把每个词拆成字符序列 → 统计所有"相邻符号对"的出现次数（按词频加权：low 出现 5 次，它的 (l, o) 就贡献 5）→ 挑出最高频对，在所有词里把这对合并成新符号 → 新符号写入词表。循环 k 次（想要多大词表就循环多少轮），最终得到一张有序的合并规则表。' },
      { heading: '跟着小语料走两轮', body: '语料：low×5、lower×2、newest×6、widest×3。第一轮统计：(e,s) = 6+3 = 9 最高 → 合并出 es，newest 变成 n e w es t、widest 变成 w i d es t。第二轮：(es,t) = 9 最高 → 合并出 est。第三轮 (l,o) = 7 → lo；第四轮 (lo,w) = 7 → low……并列最高时选哪个是实现约定（先出现/字典序均可），不影响机制。面试现场拿笔在词上画圈配对，是最稳的演算方式。' }
    ],
    principle: [
      {
        heading: '30 行模板',
        body: '先讲四步流程再动笔；这题的分数在"流程对"，不在行数少：\n<pre><code>from collections import Counter\n\ndef train_bpe(corpus, k):\n    """corpus 是 词到词频 的字典；k 是合并轮数"""\n    words = {w: list(w) for w in corpus}      # 每个词拆成字符列表\n    merges = []\n    for _ in range(k):\n        pairs = Counter()                     # 1) 统计相邻对（按词频加权）\n        for w, syms in words.items():\n            for a, b in zip(syms, syms[1:]):\n                pairs[a, b] += corpus[w]\n        if not pairs:\n            break\n        best = pairs.most_common(1)[0][0]     # 2) 取最高频对\n        merges.append(best)                   # 3) 登记合并规则\n        for w, syms in words.items():         # 4) 全语料替换合并\n            new, i = [], 0\n            while i &lt; len(syms):\n                if i + 1 &lt; len(syms) and syms[i] == best[0] and syms[i+1] == best[1]:\n                    new.append(best[0] + best[1])\n                    i += 2\n                else:\n                    new.append(syms[i])\n                    i += 1\n            words[w] = new\n    return words, merges\n</code></pre>\n四个模块对上四步：拆字符只做一次；每轮先数对、再挑最高、再全局替换。<code>zip(syms, syms[1:])</code> 是"相邻对"的惯用写法；替换用双指针扫一遍，命中就跳两格，天然避免重叠错位。'
      },
      {
        heading: '复杂度与工程化',
        body: '朴素实现每轮全量重数一遍：O(k·N)，N 是语料的总符号数。工程实现（如 HuggingFace tokenizers）做增量更新——一次合并只影响它发生位置的邻居对计数，配合优先队列选最高频，速度差几个数量级。编码新词时按"学习顺序"重放合并规则：lowest → l o w es t → l o w est → lo w est。追问预备：真实分词器还有词尾标记（区分词中与词尾）、预切分（合并不跨词）、字节级初始化（GPT-2 起先按 256 字节切，任何字符都表示得了）。'
      },
      {
        heading: '面试现场怎么演算',
        body: '考官给小语料让你手推两轮时：先列词频表；逐词写出符号序列；按词频加权数相邻对（别忘了低频词的贡献）；报出最高频对与合并结果。三个常见坑：忘了按词频加权（数成"词的种类数"）；让合并跨词边界（真实实现有预切分挡住）；在并列最高时纠结——说明"实现约定，先出现/字典序均可"即可。演算完成后能主动报一句"朴素复杂度 O(k·N)、工程实现增量更新"，就是完整答案。'
      }
    ],
    animation: {
      title: 'BPE 合并机：在小语料上一轮轮长词表',
      html: '<div class="anim-m9-05">\n  <div class="anim-m9-05-row">\n    <button type="button" class="anim-m9-05-step">合并一轮</button>\n    <button type="button" class="anim-m9-05-reset">重置</button>\n    <span class="anim-m9-05-hint">语料：low×5, lower×2, newest×6, widest×3</span>\n  </div>\n  <div class="anim-m9-05-cards"></div>\n  <div class="anim-m9-05-counts"></div>\n  <div class="anim-m9-05-log"></div>\n</div>',
      css: '.anim-m9-05 { font-size: 13px; }\n.anim-m9-05-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; }\n.anim-m9-05-hint { color: #64748b; font-family: monospace; }\n.anim-m9-05-cards { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }\n.anim-m9-05-card { display: flex; align-items: center; gap: 8px; }\n.anim-m9-05-freq { flex: 0 0 44px; text-align: center; background: #fdf2f8; color: #be185d; border-radius: 10px; font-size: 12px; padding: 1px 0; }\n.anim-m9-05-word { flex: 0 0 58px; font-weight: 600; }\n.anim-m9-05-tok { display: inline-block; border: 1px solid #f9a8d4; background: #fff; border-radius: 6px; padding: 2px 7px; margin-right: 3px; font-family: monospace; transition: background .3s ease; }\n.anim-m9-05-counts { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; min-height: 24px; }\n.anim-m9-05-pair { font-family: monospace; background: #f1f5f9; border-radius: 6px; padding: 2px 6px; }\n.anim-m9-05-pair.is-best { background: #fecdd3; color: #9f1239; font-weight: 600; }\n.anim-m9-05-log { color: #334155; min-height: 20px; }',
      js: function (root) {
        var words = [];
        var round = 0;
        var cards = root.querySelector('.anim-m9-05-cards');
        var countsBox = root.querySelector('.anim-m9-05-counts');
        var log = root.querySelector('.anim-m9-05-log');
        function freshWords() {
          var base = [{ w: 'low', f: 5 }, { w: 'lower', f: 2 }, { w: 'newest', f: 6 }, { w: 'widest', f: 3 }];
          for (var i = 0; i < base.length; i++) base[i].syms = base[i].w.split('');
          return base;
        }
        function render() {
          var h = '';
          for (var i = 0; i < words.length; i++) {
            h += '<div class="anim-m9-05-card"><span class="anim-m9-05-freq">×' + words[i].f + '</span><span class="anim-m9-05-word">' + words[i].w + '</span>';
            for (var j = 0; j < words[i].syms.length; j++) h += '<span class="anim-m9-05-tok">' + words[i].syms[j] + '</span>';
            h += '</div>';
          }
          cards.innerHTML = h;
        }
        function countPairs() {
          var counts = {}, order = [];
          for (var i = 0; i < words.length; i++) {
            var s = words[i].syms;
            for (var j = 0; j + 1 < s.length; j++) {
              var key = s[j] + '·' + s[j + 1];
              if (!(key in counts)) { counts[key] = 0; order.push(key); }
              counts[key] += words[i].f;
            }
          }
          return { counts: counts, order: order };
        }
        function mergePair(list, pair) {
          var parts = pair.split('·'), a = parts[0], b = parts[1];
          var out = [];
          for (var i = 0; i < list.length; i++) {
            var s = list[i].syms, ns = [];
            for (var j = 0; j < s.length; j++) {
              if (j + 1 < s.length && s[j] === a && s[j + 1] === b) { ns.push(a + b); j++; }
              else ns.push(s[j]);
            }
            out.push({ w: list[i].w, f: list[i].f, syms: ns });
          }
          return out;
        }
        function reset() {
          words = freshWords();
          round = 0;
          render();
          countsBox.innerHTML = '';
          log.textContent = '第 0 轮：全部是单字符颗粒。点「合并一轮」开始长词表。';
        }
        root.querySelector('.anim-m9-05-reset').addEventListener('click', reset);
        root.querySelector('.anim-m9-05-step').addEventListener('click', function () {
          if (round >= 8) { log.textContent = '演示跑满 8 轮：真实实现会一直合并到预设词表大小（如 5 万）。点「重置」再看一遍。'; return; }
          var r = countPairs();
          var best = null, bestC = -1;
          for (var k = 0; k < r.order.length; k++) {
            if (r.counts[r.order[k]] > bestC) { bestC = r.counts[r.order[k]]; best = r.order[k]; }
          }
          if (!best) { log.textContent = '没有相邻对了，提前结束。'; return; }
          var h = '';
          for (var t = 0; t < r.order.length && t < 6; t++) {
            h += '<span class="anim-m9-05-pair' + (r.order[t] === best ? ' is-best' : '') + '">(' + r.order[t].split('·').join(',') + ')=' + r.counts[r.order[t]] + '</span>';
          }
          countsBox.innerHTML = h;
          words = mergePair(words, best);
          round++;
          render();
          log.textContent = '第 ' + round + ' 轮：最高频对 (' + best.split('·').join(',') + ') 按词频加权出现 ' + bestC + ' 次 → 合并成新符号「' + best.split('·').join('') + '」写入词表。';
        });
        reset();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'BPE 训练的每一轮做的是什么事？',
        options: ['找出语料中频次最高的相邻符号对，合并成新符号写入词表', '把词频最高的词整个加入词表', '随机挑两个相邻字符合并', '把所有词重新切成单字符'],
        answer: 0,
        explanation: 'BPE 的贪心规则就是"数相邻对、粘最高频"：按词频加权统计所有相邻符号对，把最高频的一对合并成新符号并登记进词表，循环到目标规模。B 是词级分词的思路；C 没有统计依据；D 只是 BPE 的初始化动作。考点：一句话概括 BPE 是高频面试题，答"统计—合并—循环"三词即可。'
      },
      {
        type: 'order', difficulty: 2,
        question: '把 BPE 一轮内部的步骤排成正确顺序：',
        items: ['统计所有相邻符号对的频次（按词频加权）', '把新符号写入词表（合并规则表），进入下一轮', '把每个词拆成字符（符号）序列', '挑出频次最高的符号对，在全部词中替换合并'],
        answer: [2, 0, 3, 1],
        explanation: '先拆字符（只在初始化时做一次），再统计相邻对、合并最高频、登记新符号进入下一轮。易错点：把"合并"放在"统计"之前（还没有频次可依据），或漏掉"写入词表"（合并规则表正是最终词表的来源，编码新词时要按序重放）。考点：order 题考流程颗粒度，四步缺一不可。'
      },
      {
        type: 'code', difficulty: 3,
        question: '补全 BPE 训练主循环：统计相邻对（按词频加权）、取最高频对、全语料替换合并。',
        template: 'from collections import Counter\n\ndef train_bpe(corpus, k):\n    words = {w: list(w) for w in corpus}   # 每个词拆成字符列表\n    for _ in range(k):\n        pairs = Counter()\n        for w, syms in words.items():\n            # 相邻对 = 每个符号和它的右邻居；频次要按词频加权\n            for a, b in zip(syms, syms[____]):\n                pairs[a, b] += corpus[____]\n        best = pairs.____(1)[0]            # 最高频对\n        for w, syms in words.items():      # 全语料替换合并\n            new, i = [], 0\n            while i < len(syms):\n                if i + 1 < len(syms) and syms[i] == best[0] and syms[i+1] == best[1]:\n                    new.append(best[0] + best[1])\n                    i += 2\n                else:\n                    new.append(syms[i])\n                    i += 1\n            words[w] = new\n    return words\n',
        checks: ['syms[1:]', 'corpus[w]', 'most_common'],
        solution: 'from collections import Counter\n\ndef train_bpe(corpus, k):\n    words = {w: list(w) for w in corpus}\n    for _ in range(k):\n        pairs = Counter()\n        for w, syms in words.items():\n            for a, b in zip(syms, syms[1:]):\n                pairs[a, b] += corpus[w]\n        best = pairs.most_common(1)[0][0]\n        for w, syms in words.items():\n            new, i = [], 0\n            while i < len(syms):\n                if i + 1 < len(syms) and syms[i] == best[0] and syms[i+1] == best[1]:\n                    new.append(best[0] + best[1])\n                    i += 2\n                else:\n                    new.append(syms[i])\n                    i += 1\n            words[w] = new\n    return words\n',
        explanation: '三个空是 BPE 的核心三处：syms[1:] 取右邻居构成相邻对；corpus[w] 把词频加权进计数（low×5 的对要加 5 次）；most_common(1) 取最高频对。常见错误：数对时忘乘词频、替换时只换第一处匹配（要用指针扫全词）。考点：口述"拆字—数对—合并—循环"四步，主动报朴素复杂度 O(k·N) 与工程实现的增量优化。'
      }
    ],
    relations: {
      prerequisites: ['m4-01'],
      successors: [],
      confusables: [
        { other: 'm4-01', tip: 'm4-01 讲"token 是什么、为什么要子词"的概念层；本课是 BPE 算法本体——词表怎么被统计出来。先说动机再写循环，两课连着被问时层次才清楚。' },
        { other: 'm6-01', tip: 'BPE 产出的 token 序列，正是预训练"预测下一个 token"的输入与输出单位；分词器的合并质量直接影响序列长度、上下文有效容量与训练成本。' }
      ]
    },
    memory: {
      mnemonic: '拆成字、数邻居、粘高频、循环贴。',
      selfTest: [
        { q: 'BPE 统计相邻对时为什么要按词频加权？', a: '同一对符号在高频词里出现的总次数才是它对压缩的真实贡献：low 出现 5 次，(l,o) 就贡献 5。不加权会把只出现一次的稀有词里的对，高估到与高频对同权。' },
        { q: '训练出的合并规则表怎么用来编码新词？', a: '新词先拆成字符，再按规则的学习顺序逐条重放合并（学习顺序即优先级），直到没有规则可应用。如 lowest → l o w es t → l o w est → lo w est。' },
        { q: '真实分词器实现与课堂版差在哪？', a: '真实实现有预切分（合并不跨词、不跨文档）、词尾标记、字节级初始化（256 字节起步，任何字符可表示）、增量计数加优先队列等工程优化；课堂版只保留"数对—合并—循环"的教学骨架。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：模型的"词表"是怎么造出来的？',
      reference: '从单个字母开始，反复把语料里最常见的相邻字母组合粘成一个新零件存进零件库；粘上几万次后，常用词和常用词根都成了整零件，生僻词也能用小零件拼出来。'
    }
  },
  {
    id: 'm9-06',
    title: '手撕 top-k / top-p 采样',
    oneLiner: '给概率分布"修剪枝"',
    estMinutes: 14,
    analogy: {
      title: '修剪枝的抽奖箱',
      body: '模型心里给词表里每个词都打了分（logits），softmax 之后变成一张完整的彩票表。全表抽奖太随机——AI 会满篇胡话。工程师拿着剪刀修剪枝：<b>top-k 是"只让得分前 k 名进抽奖箱"</b>；<b>top-p 是"按得分从高到低攒票，攒够 p 成就封箱"</b>。箱内仍按概率比例放签，最后抽一张。注意：剪完的箱子必须<b>重新按比例分配签数（重归一化）</b>，否则概率对不上。'
    },
    intuition: [
      { heading: '先复习管线（回扣 m7-02）', body: '每一步文本生成的完整管线：logits →（除以温度 T）→ softmax →（截断：top-k / top-p）→ 重归一化 → 按概率抽样。m7-02 讲三个旋钮的语义，本课把"截断 + 抽样"写成代码。面试里这两问常连着来："top-p 是什么？"——答完定义，下一句就是"写一个"。' },
      { heading: 'top-k：四步十行', body: '排序取前 k 名的下标 → 只对这 k 个候选做 softmax（等价于"其余位置设 −inf"：softmax 后它们恰为 0，候选内自动重归一化）→ 按得到的概率抽一个下标。要点是"截断后必须重归一化"：拿全表概率直接抽，等于没剪。' },
      { heading: 'top-p：攒票到线', body: '先算全量概率，从高到低排序；从第一名开始累积概率，一旦攒够 p 就封箱——得到"累积概率达到 p 的最小候选集"；集合内置零、重归一化、抽样。模型很确定时（分布尖）可能一两个候选就封箱，犹豫时自动多放几个进来——候选个数随分布形状自适应，这正是 top-p 优于固定 k 的地方。' }
    ],
    principle: [
      {
        heading: 'top-k 实现（NumPy）',
        body: '利用"只对候选做 softmax = 其余设 −inf"的等价性，代码可以非常短：\n<pre><code>import numpy as np\n\ndef softmax(x):\n    e = np.exp(x - np.max(x))\n    return e / e.sum()\n\ndef top_k_sample(logits, k):\n    idx = np.argsort(logits)[::-1][:k]     # 前 k 名的下标\n    p = softmax(logits[idx])               # 候选内重归一化\n    return idx[np.random.choice(len(idx), p=p)]\n</code></pre>\n<code>np.argsort(logits)[::-1]</code> 是从大到小排序的下标数组；<code>np.random.choice(n, p=p)</code> 按概率 p 抽一个（p 必须和为 1，所以先 softmax）。想显式走"其余设 −inf"的写法：<code>logits[logits &lt; 阈值] = -np.inf</code> 再全量 softmax——两种写法完全等价，面试任写一种都行，但要能说出等价原因。'
      },
      {
        heading: 'top-p 实现：最小候选集',
        body: '循环版最好写也最好讲，"攒票到线就封箱"：\n<pre><code>def top_p_sample(logits, p):\n    probs = softmax(logits)\n    order = np.argsort(probs)[::-1]            # 概率从高到低\n    keep, total = [], 0.0\n    for i in order:                            # 从高到低攒票\n        keep.append(i)\n        total += probs[i]\n        if total &gt;= p:                         # 攒够 p 就封箱\n            break\n    q = probs[keep] / probs[keep].sum()        # 箱内重归一化\n    return keep[np.random.choice(len(keep), p=q)]\n</code></pre>\n进阶一句话：用 <code>np.cumsum</code> 算累积概率、<code>np.searchsorted</code> 找封箱位置，可免掉 Python 循环；工程实现（HF generate）同样遵守"最小集合"语义。'
      },
      {
        heading: '复杂度与高频追问',
        body: '排序主导复杂度 O(V log V)（V 是词表大小；只需前 k 名或前缀和时可做到约 O(V)）。高频追问：top-k 与 top-p 能同时用吗——能，HF 的 generate 两个参数并存，通常先 top-k 粗剪、再 top-p 细剪，两条件取交集；为什么截断后要重归一化——被剪候选的概率要按比例摊给留下的候选；p 取多少——常用 0.9~0.95；贪心还是采样——确定性任务（代码、事实问答）用低温度/贪心，创意任务放宽截断。回答时始终扣住一句话：<b>剪枝的目的不是少算，是把低质量的概率尾巴切掉</b>。'
      }
    ],
    animation: {
      title: '修剪实验台：top-k 与 top-p 双滑块 + 现场抽签',
      html: '<div class="anim-m9-06">\n  <div class="anim-m9-06-row">\n    <label>top-k <input class="anim-m9-06-k" type="range" min="1" max="8" step="1" value="3"></label>\n    <label>top-p <input class="anim-m9-06-p" type="range" min="10" max="100" step="5" value="90"></label>\n    <button type="button" class="anim-m9-06-sample">抽一次</button>\n    <span class="anim-m9-06-sum"></span>\n  </div>\n  <div class="anim-m9-06-bars"></div>\n  <div class="anim-m9-06-log"></div>\n</div>',
      css: '.anim-m9-06 { font-size: 13px; }\n.anim-m9-06-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 10px; }\n.anim-m9-06-sum { color: #64748b; font-family: monospace; }\n.anim-m9-06-line { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; transition: opacity .3s ease; }\n.anim-m9-06-line.is-cut { opacity: .35; }\n.anim-m9-06-name { flex: 0 0 44px; text-align: right; }\n.anim-m9-06-track { flex: 1 1 auto; height: 14px; background: #fce7f3; border-radius: 7px; overflow: hidden; }\n.anim-m9-06-fill { display: block; height: 100%; background: #ec4899; border-radius: 7px; transition: width .35s ease, background .35s ease; }\n.anim-m9-06-pv { flex: 0 0 52px; font-family: monospace; }\n.anim-m9-06-tag { flex: 0 0 36px; font-size: 12px; color: #64748b; }\n.anim-m9-06-line.is-win .anim-m9-06-name { color: #be185d; font-weight: 700; }\n.anim-m9-06-line.is-win .anim-m9-06-fill { background: #16a34a; }\n.anim-m9-06-log { margin-top: 8px; min-height: 20px; color: #334155; }',
      js: function (root) {
        var names = ['樱花', '咖啡', '代码', '月亮', '雨伞', '背包', '键盘', '贝壳'];
        var logits = [5.2, 4.1, 3.6, 3.0, 2.2, 1.6, 0.9, 0.2];
        var bars = root.querySelector('.anim-m9-06-bars');
        var kIn = root.querySelector('.anim-m9-06-k');
        var pIn = root.querySelector('.anim-m9-06-p');
        var log = root.querySelector('.anim-m9-06-log');
        var sumEl = root.querySelector('.anim-m9-06-sum');
        var probs = softmax(logits);
        function softmax(a) {
          var m = Math.max.apply(null, a);
          var es = a.map(function (v) { return Math.exp(v - m); });
          var s = es.reduce(function (x, y) { return x + y; }, 0);
          return es.map(function (v) { return v / s; });
        }
        function keptFlags() {
          var k = Number(kIn.value), p = Number(pIn.value) / 100;
          var order = logits.map(function (v, i) { return i; }).sort(function (a, b) { return logits[b] - logits[a]; });
          var byK = {}, byP = {}, total = 0;
          for (var i = 0; i < k; i++) byK[order[i]] = true;
          for (var j = 0; j < order.length; j++) {
            byP[order[j]] = true;
            total += probs[order[j]];
            if (total >= p) break;
          }
          var keep = {}, mass = 0;
          for (var t = 0; t < logits.length; t++) {
            if (byK[t] && byP[t]) { keep[t] = true; mass += probs[t]; }
          }
          return { keep: keep, mass: mass };
        }
        function render(kept) {
          var h = '';
          var maxP = Math.max.apply(null, probs);
          for (var i = 0; i < probs.length; i++) {
            var on = !!kept.keep[i];
            h += '<div class="anim-m9-06-line' + (on ? ' is-keep' : ' is-cut') + '">'
              + '<span class="anim-m9-06-name">' + names[i] + '</span>'
              + '<span class="anim-m9-06-track"><span class="anim-m9-06-fill" style="width:' + (probs[i] / maxP * 100).toFixed(1) + '%"></span></span>'
              + '<span class="anim-m9-06-pv">' + (probs[i] * 100).toFixed(1) + '%</span>'
              + '<span class="anim-m9-06-tag">' + (on ? '入箱' : '剪掉') + '</span></div>';
          }
          bars.innerHTML = h;
          var n = 0;
          for (var key in kept.keep) n++;
          sumEl.textContent = '候选 ' + n + ' 个 / 保留概率质量 ' + (kept.mass * 100).toFixed(1) + '%';
        }
        function update() { probs = softmax(logits); render(keptFlags()); log.textContent = '拖动滑块看候选箱怎么变；top-k 管个数，top-p 管票数。'; }
        kIn.addEventListener('input', update);
        pIn.addEventListener('input', update);
        root.querySelector('.anim-m9-06-sample').addEventListener('click', function () {
          var kept = keptFlags();
          render(kept);
          var ids = [];
          for (var t = 0; t < logits.length; t++) if (kept.keep[t]) ids.push(t);
          var r = Math.random() * kept.mass, win = ids[ids.length - 1];
          for (var i = 0; i < ids.length; i++) {
            r -= probs[ids[i]];
            if (r <= 0) { win = ids[i]; break; }
          }
          var lines = bars.querySelectorAll('.anim-m9-06-line');
          lines[win].classList.add('is-win');
          log.textContent = '抽中「' + names[win] + '」——箱内重归一化后的中签率约 ' + (probs[win] / kept.mass * 100).toFixed(1) + '%（原始概率 ' + (probs[win] * 100).toFixed(1) + '%）。';
        });
        update();
      }
    },
    exercises: [
      {
        type: 'judge', difficulty: 1,
        question: 'top-p 保留的是"按概率从高到低累积、首次达到 p 的最小候选集合"，因此候选个数随分布形状自适应。',
        answer: true,
        explanation: '尖分布可能一两个候选就凑够 p，平分布则放入更多候选；固定个数的 top-k 做不到这种自适应。考点：一句话说清 top-k 与 top-p 的本质差异——固定候选个数 vs 固定概率质量，这是 m7-02 概念题与本课代码题之间的桥梁。'
      },
      {
        type: 'code', difficulty: 2,
        question: '补全 top-k 采样：降序取前 k 名下标，候选内重归一化后按概率抽样。',
        template: 'import numpy as np\n\ndef softmax(x):\n    e = np.exp(x - np.max(x))\n    return e / e.sum()\n\ndef top_k_sample(logits, k):\n    # 第一步：按 logits 从大到小排序，取前 k 名的下标\n    idx = np.argsort(logits)[____][:k]\n    # 第二步：只对这 k 个候选做 softmax（=候选内重归一化）\n    p = softmax(logits[____])\n    # 第三步：按概率 p 随机抽一个下标并返回\n    return idx[np.random.choice(len(idx), p=p)]\n',
        checks: ['::-1', 'logits[idx]', 'np.random.choice'],
        solution: 'import numpy as np\n\ndef softmax(x):\n    e = np.exp(x - np.max(x))\n    return e / e.sum()\n\ndef top_k_sample(logits, k):\n    idx = np.argsort(logits)[::-1][:k]\n    p = softmax(logits[idx])\n    return idx[np.random.choice(len(idx), p=p)]\n',
        explanation: '两个空是 top-k 的骨架：[::-1] 把升序反转成降序再截前 k；logits[idx] 只取前 k 名的 logits 进 softmax——候选外自动为 0，等价于"其余设 −inf"。常见错误：不截断直接对全表抽样（等于没剪），或忘了候选内重归一化。考点：口述"排序—截断—重归一化—抽样"四步，报复杂度 O(V log V)。'
      },
      {
        type: 'code', difficulty: 3,
        question: '补全 top-p 采样：从高到低攒票到 p 就封箱，箱内重归一化后抽样。',
        template: 'def top_p_sample(logits, p):\n    probs = softmax(logits)\n    order = np.argsort(probs)[::-1]     # 概率从高到低的下标\n    keep, total = [], 0.0\n    for i in order:\n        keep.____(i)                    # 收进候选集\n        total += probs[i]\n        if total >= p:                  # 攒够 p 就封箱\n            break\n    q = probs[keep] / probs[keep].____  # 箱内重归一化\n    return keep[np.random.choice(len(keep), p=q)]\n',
        checks: ['append', 'probs[keep].sum'],
        solution: 'def top_p_sample(logits, p):\n    probs = softmax(logits)\n    order = np.argsort(probs)[::-1]\n    keep, total = [], 0.0\n    for i in order:\n        keep.append(i)\n        total += probs[i]\n        if total >= p:\n            break\n    q = probs[keep] / probs[keep].sum()\n    return keep[np.random.choice(len(keep), p=q)]\n',
        explanation: '两个空：append 按概率从高到低把候选收进箱子；probs[keep].sum() 求箱内概率质量以便重归一化——剪枝后留下的概率不再和为 1，必须除回去才能喂给 np.random.choice 的 p 参数。常见错误：从低概率往高攒（顺序错）、漏掉重归一化。考点：top-p 的"最小集合"定义与"封箱即停"的循环写法，能配套说出先 top-k 后 top-p 的叠加用法更佳。'
      }
    ],
    relations: {
      prerequisites: ['m7-02', 'm1-05'],
      successors: [],
      confusables: [
        { other: 'm7-02', tip: 'm7-02 讲三个旋钮的语义与直觉（温度、top-k、top-p 各管什么）；本课把它们落成代码。两课常被连着问：先说清"截断谁、怎么重归一化"，再动笔写实现。' },
        { other: 'm1-06', tip: 'softmax 是采样管线的公共工序：温度作用在 softmax 之前（logits 层面），top-k / top-p 截断作用在 softmax 之后（概率层面），m9-03 的减 max 是 softmax 内部的数值技巧——三层职责别混。' }
      ]
    },
    memory: {
      mnemonic: 'top-k 数人头，top-p 攒票到线，剪完重归一再抽签。',
      selfTest: [
        { q: '为什么截断之后必须重归一化？', a: '剪掉候选后剩下的概率和小于 1；抽样函数要求概率和为 1，且语义上要让留下的候选按原相对比例分享被剪掉的概率质量，否则抽样结果系统性偏小。' },
        { q: 'top-k 和 top-p 能同时用吗？顺序怎么定？', a: '能。常见做法是先 top-k 粗剪（保证候选不超上限、控制最坏情况），再 top-p 自适应细剪；两个条件取交集，交集内重归一化后抽样。HF generate 里 top_k 与 top_p 参数即并存。' },
        { q: '分布很尖时 top-p 的行为是什么？', a: '第一、二名可能就攒够 p，候选自动收敛到一两个，行为接近贪心解码——体现"自适应"：确定性场景自动变稳，不需要人工去调 k。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：top-k / top-p 采样在干什么？',
      reference: 'AI 下笔前把候选词按得分排队，只让前几名（top-k）或攒够九成票的头部（top-p）进抽奖箱，箱内概率重新摊匀后抽签——既保留随机灵感，又把胡言乱语的尾巴剪掉。'
    }
  }
  ]
});

