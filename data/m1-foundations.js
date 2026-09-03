// knowledge_source: "internal"
/* M1 数学与编程地基 —— 6 个知识点内容数据（契约见 docs/SCHEMA.md v1；决策见 DECISIONS.md D4/D6/D12） */
window.SITE_DATA.registerModule({
  module: 'M1',
  title: '数学与编程地基',
  icon: '🧮',
  color: '#6366f1',
  lessons: [
  {
    id: 'm1-01',
    title: '向量与矩阵',
    oneLiner: '用"表格与变换"理解 AI 的基本材料',
    estMinutes: 10,
    analogy: {
      title: '外卖推荐官的打分表',
      body: '你想找一家奶茶店，推荐系统要算"你与这家店的匹配度"。它把匹配拆成几项打分：甜度契合 8 分、距离近 3 分、价格合适 9 分——把分数按固定顺序排成一排 <code>[8, 3, 9]</code>，就是一个<b>向量（Vector）</b>。两串分数对应位置相乘再相加，得到一个"匹配总分"，这就是<b>点积（Dot Product）</b>。把 1000 家店每家的分数表叠成一摞，就是<b>矩阵（Matrix）</b>：AI 的全部原材料，几乎都是这种"数字表格"。'
    },
    intuition: [
      { heading: '向量：一排有顺序的数字', body: '把"甜度 8、距离 3、价格 9"排成 <code>[8, 3, 9]</code>，顺序不能乱，这就是向量（Vector）。AI 里一切输入——一句话、一张图、一个用户——最终都被编码成这样的数字串，术语叫向量表示或嵌入（Embedding）。几何上，二维向量 <code>[3, 2]</code> 是从原点出发的一支箭：横着走 3 步、竖着走 2 步。箭有方向，所以向量能表达"倾向"。' },
      { heading: '点积：衡量两支箭有多"合拍"', body: '两个向量对应位置相乘再求和，得到一个数。两支箭方向越接近，点积越大；互相垂直（毫无关系）点积为 0；方向相反点积为负。所以"搜索"的本质常常是：把问题和所有候选都变成向量，逐个算点积，挑总分最高的几个。大模型注意力机制（Attention）里的 Q·K 打分，就是一次批量点积。' },
      { heading: '矩阵：向量的批量加工厂', body: '把许多向量一行一行堆起来就是矩阵。矩阵乘向量 = 同时给一批对象打分；矩阵乘矩阵 = 两套打分标准交叉出一张总表。深度学习里成千上万的参数（权重 Weight）就是以矩阵形式存的——模型每次推理，本质上是数据在一系列矩阵之间接力变换。' }
    ],
    principle: [
      {
        heading: '点积：AI 世界最常用的乘法',
        body: '两个等长向量，对应位置相乘再全部加起来，得到一个数。它计算便宜、含义清晰（方向合拍程度），是检索、推荐、注意力机制的基石。面试时能徒手算点积、说出"方向一致点积最大"，是第一道基本功。',
        formula: 'a·b = a₁b₁ + a₂b₂ + … + aₙbₙ',
        formulaNote: '<ul><li><b>a, b</b>：两个长度相同的向量，第 1 个位置配第 1 个位置，一一对应</li><li><b>aᵢbᵢ</b>：第 i 个位置两数相乘，是"这一个维度的匹配贡献"</li><li><b>Σ（求和）</b>：把所有维度的贡献加总成一个总分</li><li>直觉：同号相乘为正（加分），异号为负（减分），总分高 = 各维度合拍</li></ul>'
      },
      {
        heading: '模长与余弦相似度：只看方向',
        body: '点积受向量长度影响：分量普遍偏大（"话多"）的向量天然占便宜。把点积除以两个向量的模长（长度），得到余弦相似度（Cosine Similarity），只剩方向信息，取值 [−1, 1]。向量数据库检索（RAG 场景，见 m8-02）默认用它。',
        formula: 'cos θ = (a·b) / (‖a‖ × ‖b‖)',
        formulaNote: '<ul><li><b>a·b</b>：上面刚学的点积，衡量合拍程度</li><li><b>‖a‖、‖b‖</b>：向量的模长（长度），各分量平方和再开根号</li><li><b>除以模长</b>：把长度拉回同一标准，只比较方向</li><li><b>cos θ</b>：1 = 同方向最相似，0 = 垂直无关，−1 = 方向相反</li></ul>'
      },
      {
        heading: '矩阵乘法：批量点积',
        body: '矩阵乘向量 = 对一批对象同时打分；矩阵乘矩阵 = 打分标准互相交叉。神经网络的一层就是一次"矩阵乘法 + 激活函数"，看懂行乘列，就看懂了数据在模型里的形状流转。',
        formula: 'C[i][j] = Σₖ A[i][k] · B[k][j]',
        formulaNote: '<ul><li><b>C[i][j]</b>：结果矩阵第 i 行第 j 列的那个数</li><li><b>A 的第 i 行 与 B 的第 j 列</b>：做一次点积，填进这个格子</li><li><b>内维匹配</b>：A 的列数必须等于 B 的行数，否则乘法无定义（编程里直接报错）</li><li><b>结果形状</b> = (A 的行数, B 的列数)，例如 (2×3)·(3×4) → (2×4)</li></ul>'
      }
    ],
    animation: {
      title: '点积相似度打分器：推荐系统怎么挑店',
      html: '<div class="anim-m1-01"><div class="anim-m1-01-row"><span class="anim-m1-01-lab">你的口味向量固定为 q = [2, 1]</span><span>候选店向量 b：</span><span>甜度 b₁ <input class="anim-m1-01-b1" type="range" min="-4" max="4" step="1" value="3"></span><span>距离 b₂ <input class="anim-m1-01-b2" type="range" min="-4" max="4" step="1" value="3"></span><button class="anim-m1-01-btn" type="button">与 q 完全对齐（设为 [4, 2]）</button></div><div class="anim-m1-01-calc"></div><div class="anim-m1-01-track"><div class="anim-m1-01-fill"></div></div><div class="anim-m1-01-tag"></div></div>',
      css: '.anim-m1-01 { font-size: 13px; padding: 4px 2px; }\n.anim-m1-01-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 8px; }\n.anim-m1-01-lab { font-weight: 600; color: #4338ca; }\n.anim-m1-01-calc { font-family: monospace; margin: 6px 0; color: #334155; }\n.anim-m1-01-track { height: 14px; background: #e2e8f0; border-radius: 7px; overflow: hidden; }\n.anim-m1-01-fill { height: 100%; width: 0; background: #22c55e; border-radius: 7px; transition: width .45s ease, background .45s ease; }\n.anim-m1-01-tag { margin-top: 6px; font-weight: 600; color: #475569; }',
      js: function (root) {
        var q = [2, 1];
        var b1 = root.querySelector('.anim-m1-01-b1');
        var b2 = root.querySelector('.anim-m1-01-b2');
        var calc = root.querySelector('.anim-m1-01-calc');
        var fill = root.querySelector('.anim-m1-01-fill');
        var tag = root.querySelector('.anim-m1-01-tag');
        function update() {
          var b = [Number(b1.value), Number(b2.value)];
          var dot = q[0] * b[0] + q[1] * b[1];
          var cos = dot / (Math.sqrt(5) * Math.sqrt(b[0] * b[0] + b[1] * b[1]));
          calc.textContent = '点积 = 2×' + b[0] + ' + 1×' + b[1] + ' = ' + dot + '，余弦相似度 ≈ ' + cos.toFixed(2);
          var pct = Math.max(2, (cos + 1) / 2 * 100);
          fill.style.width = pct + '%';
          fill.style.background = cos > 0.3 ? '#22c55e' : (cos > -0.3 ? '#f59e0b' : '#ef4444');
          tag.textContent = cos > 0.85 ? '非常相似，优先推荐！' : (cos > 0.3 ? '有点相关，可以看看' : (cos > -0.3 ? '不太相关' : '方向相反，最不推荐'));
        }
        b1.addEventListener('input', update);
        b2.addEventListener('input', update);
        root.querySelector('.anim-m1-01-btn').addEventListener('click', function () {
          b1.value = 4; b2.value = 2; update();
        });
        update();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '向量 a = [1, 2]，b = [3, 4]，点积 a·b = ？',
        options: ['11', '10', '7', '21'],
        answer: 0,
        explanation: '点积 = 1×3 + 2×4 = 3 + 8 = 11。常见误区：把两串数字直接全部相加（1+2+3+4=10），或对应位置相加（1+3、2+4）——点积是"对应位置相乘再求和"，乘法和求和两步都不能换成别的。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '两个<b>非零</b>向量点积为 0，说明它们方向互相垂直，在相似度语义里表示"毫无关系"。',
        answer: true,
        explanation: '点积 = |a|·|b|·cos θ，夹角 90° 时 cos θ = 0，所以垂直向量点积必为 0。在嵌入检索里这代表两个对象正交、不相关。常见误区：以为点积为 0 说明其中一个是零向量（题干已排除），或误以为 0 表示"相似度中等"。'
      },
      {
        type: 'fill', difficulty: 3,
        question: '矩阵 A 形状为 (2, 3)，矩阵 B 形状为 (3, 4)，则 A·B 的形状是 ____（用类似 <code>2x4</code> 的形式回答，乘号用小写字母 x）',
        accept: ['2x4', '2 x 4', '(2,4)', '(2, 4)', '2×4'],
        explanation: '矩阵乘法要求内维匹配（A 的列数 3 = B 的行数 3），结果形状取两端：(A 的行数 2, B 的列数 4)，即 2x4。常见误区：以为结果形状是两个形状的某种"相加"，或忽略内维匹配规则导致 (3,4)·(2,3) 这类非法乘法也敢写。'
      }
    ],
    relations: {
      prerequisites: [],
      successors: ['m1-03', 'm1-05'],
      confusables: [
        { other: 'm1-05', tip: '向量/矩阵是数学对象，张量（Tensor）是它们在 NumPy/PyTorch 里的编程载体：1 维张量≈向量，2 维张量≈矩阵，3 维以上是矩阵的自然推广。数学课说"矩阵乘法"，代码里写的就是张量的 @ 运算。' }
      ]
    },
    memory: {
      mnemonic: '点积逐乘再相加，方向合拍分才高；矩阵行乘列，内维不对齐就报错。',
      selfTest: [
        { q: '为什么搜索/推荐系统常用"点积"衡量相似度？', a: '点积逐项相乘再求和：两个向量在各维度越同向合拍，正贡献越多，方向一致且长度大时点积最大；归一化后就是余弦相似度，只看方向、不受长度影响，且计算极快（可批量、可硬件加速）。' },
        { q: '(2×3) 乘 (3×4) 结果形状是什么？反过来 (3×4) 乘 (2×3) 行不行？', a: '前者结果是 (2×4)；反着乘内维是 4 与 2，不相等，不满足内维匹配，乘法无定义（NumPy/PyTorch 中直接报错）。' },
        { q: '余弦相似度和点积的区别是什么？', a: '余弦相似度 = 点积除以两个模长，消除了向量长度的影响，只比较方向，取值 [−1, 1]；点积则同时受方向和长度影响。向量检索通常先归一化再用点积，等价于余弦。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：向量是什么？为什么 AI 这么喜欢它？',
      reference: '向量是一串有顺序的数字，像一张"多维度打分表"；AI 把文字、图片、用户都翻译成这样的打分表之后，就能用点积这种简单的乘加运算比较任意两个东西有多相似——所有智能行为都建立在这串数字上。'
    }
  },
  {
    id: 'm1-02',
    title: '概率与分布',
    oneLiner: '用"天气预报"的语言描述不确定性',
    estMinutes: 10,
    analogy: {
      title: '天气预报在说什么',
      body: '预报说"降水概率 80%"，不是说 100 天里必定下 80 天雨，而是说：在类似的大气条件下，历史上大约八成会下雨。机器学习模型说"这是猫的概率 0.92"，用的是同一套语言——把不确定性变成 0 到 1 之间的数。而大模型每写一个字之前，词表里每个候选字都领到一个概率：<b>概率分布（Probability Distribution）</b>就是模型"心里的那张表"。'
    },
    intuition: [
      { heading: '概率是 0 到 1 之间的"把握刻度"', body: '0 表示不可能，1 表示必然，0.5 表示五五开。概率回答的不是"会不会"，而是"有多大把握"。它不是玄学：可以拿数据反复检验，是可统计、可计算的数字。模型输出 0.92，意思是按模型的判断，九成把握是猫。' },
      { heading: '分布 = 把所有可能性排成一排', body: '只谈单个概率容易漏事，把所有可能结果的概率一起列全，就是概率分布。天气预报其实是给"晴 / 多云 / 小雨 / 大雨"各配一个概率；大模型每生成一个字之前，几万个候选字各有一个概率——这张巨大的表就是模型此刻的分布，生成就是从表里挑一个。' },
      { heading: '频率会向概率靠拢', body: '抛硬币 10 次可能 7 次正面，但抛一万次，正面比例会稳稳靠近 0.5，这叫大数定律（Law of Large Numbers）。这也是机器学习需要大数据的原因：样本够多，"经验频率"才足以估计"真实概率"。' }
    ],
    principle: [
      {
        heading: '概率分布：把所有可能摆上桌',
        body: '分布有两条铁律：每个概率都在 0 到 1 之间；全部加起来恰好等于 1（归一化 Normalization）。语言模型的训练目标，说白了就是：让真实出现的下一个字，在模型给出的分布里概率尽量大。',
        formula: 'P(x₁) + P(x₂) + … + P(xₙ) = 1，其中 0 ≤ P(xᵢ) ≤ 1',
        formulaNote: '<ul><li><b>P(xᵢ)</b>：第 i 种结果发生的概率，是一个 0~1 的数</li><li><b>非负</b>：概率不能是负数，"负把握"没有意义</li><li><b>总和为 1</b>：结果必然是清单中的某一个，把握合计必须正好用完 100%</li><li>直觉：少给或多给任何一项，这张"世界可能性清单"就自相矛盾</li></ul>'
      },
      {
        heading: '条件概率：拿到新证据后重新判断',
        body: '世界一旦有了新信息，判断就该更新。条件概率（Conditional Probability）就是在"已知 B 发生"的前提下评估 A 的把握。朴素贝叶斯分类器、以及大模型本身 P(下一个字 | 前文)，都是条件概率。',
        formula: 'P(A|B) = P(A ∩ B) / P(B)',
        formulaNote: '<ul><li><b>P(A|B)</b>：读作"已知 B 发生时，A 的概率"，竖线后面是手里已有的信息</li><li><b>P(A ∩ B)</b>：A 和 B 同时发生的概率</li><li><b>P(B)</b>：B 自己发生的概率，用来把"世界"缩小到 B 成立的那部分</li><li>直觉：知道 B 后，可能世界缩小了一圈，再看 A 在剩余世界中占多大比例</li></ul>'
      },
      {
        heading: '期望：加权平均的"长远平均值"',
        body: '期望（Expected Value / Expectation）是按概率加权的平均值，表示长期重复后的平均结果。强化学习里"最大化期望回报"、评估里"期望误差"，用的都是它。',
        formula: 'E[X] = Σ xᵢ · P(xᵢ)',
        formulaNote: '<ul><li><b>xᵢ</b>：第 i 种结果的取值（比如抽奖能拿到的钱数）</li><li><b>P(xᵢ)</b>：该结果发生的概率，作为"权重"</li><li><b>乘积求和</b>：每种结果按出现可能性大小分摊，合成一个平均数</li><li>直觉：一次结果随机，重复无数次后的平均值会稳定在期望附近</li></ul>'
      }
    ],
    animation: {
      title: '摸球实验：频率如何逼近概率',
      html: '<div class="anim-m1-02"><p class="anim-m1-02-desc">袋中 70% 红球、30% 蓝球，每次摸出后放回。随着次数增多，频率会越来越贴近真实概率——这正是"用数据估计概率"的直觉来源（大数定律）。</p><div class="anim-m1-02-btns"><button class="anim-m1-02-draw" type="button">摸 1 次</button><button class="anim-m1-02-draw100" type="button">连摸 100 次</button><button class="anim-m1-02-reset" type="button">清零重来</button></div><div class="anim-m1-02-row"><span class="anim-m1-02-lab">红球</span><div class="anim-m1-02-bar"><div class="anim-m1-02-red"></div></div></div><div class="anim-m1-02-row"><span class="anim-m1-02-lab">蓝球</span><div class="anim-m1-02-bar"><div class="anim-m1-02-blue"></div></div></div><div class="anim-m1-02-info"></div></div>',
      css: '.anim-m1-02-desc { font-size: 13px; margin: 0 0 8px; }\n.anim-m1-02-btns { display: flex; gap: 8px; margin-bottom: 10px; }\n.anim-m1-02-btns button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m1-02-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }\n.anim-m1-02-lab { width: 34px; font-size: 12px; }\n.anim-m1-02-bar { flex: 1; height: 20px; background: #f1f5f9; border-radius: 6px; overflow: hidden; }\n.anim-m1-02-red { height: 100%; width: 0; background: #ef4444; transition: width .5s ease; }\n.anim-m1-02-blue { height: 100%; width: 0; background: #3b82f6; transition: width .5s ease; }\n.anim-m1-02-info { font-family: monospace; font-size: 12px; color: #334155; }',
      js: function (root) {
        var red = 0, blue = 0;
        var redBar = root.querySelector('.anim-m1-02-red');
        var blueBar = root.querySelector('.anim-m1-02-blue');
        var info = root.querySelector('.anim-m1-02-info');
        function render() {
          var total = red + blue;
          var rp = total ? Math.round(red / total * 100) : 0;
          redBar.style.width = rp + '%';
          blueBar.style.width = (100 - rp) + '%';
          info.textContent = '已摸 ' + total + ' 次：红 ' + red + '（' + rp + '%）/ 蓝 ' + blue +
            '（' + (100 - rp) + '%）｜真实分布：红 70% / 蓝 30%';
        }
        function draw(n) {
          for (var i = 0; i < n; i++) {
            if (Math.random() < 0.7) { red++; } else { blue++; }
          }
          render();
        }
        root.querySelector('.anim-m1-02-draw').addEventListener('click', function () { draw(1); });
        root.querySelector('.anim-m1-02-draw100').addEventListener('click', function () { draw(100); });
        root.querySelector('.anim-m1-02-reset').addEventListener('click', function () { red = 0; blue = 0; render(); });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '掷一枚均匀骰子，"点数是偶数"的概率是多少？',
        options: ['1/2', '1/3', '1/6', '2/3'],
        answer: 0,
        explanation: '偶数点有 2、4、6 共 3 种结果，3/6 = 1/2。常见误区：把"偶数"当成一种结果算成 1/6，或把 2+4+6=12 当分子——分子数的是"结果个数"，不是点数之和。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '抛两枚公平硬币，"至少出现一个正面"的概率是 1/2。',
        answer: false,
        explanation: '列出全部 4 种等可能结果：正正、正反、反正、反反，"至少一正"占 3 种，概率是 3/4。常见误区："两个 1/2 直接相加"或"出现一次就够所以是一半"——多事件"至少一个"应当用对立事件 1 − P(全是反面) = 1 − 1/4 来算。'
      },
      {
        type: 'single', difficulty: 3,
        question: '某疾病患病率为 1%。检测仪对病人 90% 呈阳性，对健康人 90% 呈阴性。某人检测结果呈阳性，他真正患病的概率约为多少？',
        options: ['90%', '50%', '8.3%', '1%'],
        answer: 2,
        explanation: '按 1 万人算：约 100 人患病 → 90 人真阳性；9900 人健康 → 990 人假阳性。阳性共 1080 人，其中真患病 90/1080 ≈ 8.3%。常见误区是"基础率忽视（base rate fallacy）"：只看检测准确率 90% 就答 90%，忽略了患病基础率极低、健康人基数大产生大量假阳性。这也是面试常考的贝叶斯思维题。'
      }
    ],
    relations: {
      prerequisites: [],
      successors: ['m1-06', 'm7-02'],
      confusables: [
        { other: 'm1-06', tip: 'softmax 的输出"长得像"概率分布（非负、总和为 1），但它是把一组分数做归一化的产物，并不保证刻画真实世界的不确定性——温度调高会人为压平分布。真正的概率来自数据生成过程，两者不能混为一谈。' }
      ]
    },
    memory: {
      mnemonic: '单个叫概率，全家福叫分布；加起来必须等于一，拿到证据看条件。',
      selfTest: [
        { q: '概率分布必须满足哪两条数学性质？', a: '① 每个取值的概率非负且不超过 1；② 所有可能取值的概率之和恰好等于 1（归一化）。违反任何一条都不构成合法分布。' },
        { q: 'P(阳性|患病) 和 P(患病|阳性) 是一回事吗？', a: '不是。前者是检测灵敏度（病人中呈阳性的比例），后者要结合患病基础率用贝叶斯方法换算；基础率很低时两者可以相差巨大（见基础率忽视）。' },
        { q: '为什么抽样次数越多，用频率估计概率越可信？', a: '大数定律：独立重复试验中，频率会依概率收敛到真实概率；次数越多，随机波动被平均掉，估计越稳定。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：什么是"概率分布"？为什么它加起来必须是 1？',
      reference: '概率分布就是把一件事所有可能的结果各配一个"把握百分比"的完整清单；因为最终发生的一定是清单里的某一个，所有把握加起来理应刚好用完 100%，也就是 1。'
    }
  },
  {
    id: 'm1-03',
    title: '导数与梯度',
    oneLiner: '下山时每一步该往哪走',
    estMinutes: 12,
    analogy: {
      title: '蒙眼下山',
      body: '你蒙着眼站在山坡上，想走到谷底。看不见路，但脚能感觉到坡度：哪边更陡地往下斜，就朝哪边迈一小步；落地后再感觉一次，再迈一步……反复多次，你终会站在一块"怎么踩都不斜"的平地——谷底。<b>梯度下降（Gradient Descent）</b>训练模型用的就是这套笨办法：山是"损失函数"，你的位置是"模型参数"，脚感是"梯度"。'
    },
    intuition: [
      { heading: '导数：脚下的坡度', body: '导数（Derivative）回答："此刻把 x 挪一丁点，y 跟着变多少？"这个比值就是斜率。斜率为正 = 上坡（x 增大 y 也增大），为负 = 下坡，为 0 = 平地（可能是谷底或山顶）。它把"变化快慢"变成了一个能计算的数字。' },
      { heading: '梯度：最陡的上坡方向', body: '当参数不止一个（模型动辄上亿个），每个参数各有一个"坡度"，把它们打包成向量，就是<b>梯度（Gradient）</b>。数学可以证明：梯度指向"上升最快"的方向。所以下山要走它的<b>反方向</b>——这是面试必背结论（原理区给可背诵表述）。' },
      { heading: '学习率：步子迈多大', body: '每步走多远由学习率（Learning Rate）控制。步子太大：一步跨过谷底，在两侧来回弹甚至越弹越高；步子太小：磨磨蹭蹭半天走不到。要下降的那个"山"，术语叫损失函数（Loss）——衡量模型当前有多差。' }
    ],
    principle: [
      {
        heading: '导数：变化率的精确刻画',
        body: '导数把"x 动一点点，y 动多少"写成极限：挪动量越小，平均变化率越接近瞬时变化率。先记两条常用求导：常数的导数是 0；(x²) 的导数是 2x。后面 m1-06 会用到 sigmoid 的导数 σ(1−σ)。',
        formula: "f'(x) = lim(Δx→0) [ f(x+Δx) − f(x) ] / Δx",
        formulaNote: '<ul><li><b>Δx</b>：给 x 的一个微小挪动量</li><li><b>f(x+Δx) − f(x)</b>：x 挪动后 y 的相应变化量</li><li><b>比值</b>：这段小区间上的平均变化率（平均坡度）</li><li><b>lim(Δx→0)</b>：让挪动无限小，平均坡度就无限接近瞬时坡度 f&#39;(x)</li><li>符号直觉：f&#39;(x) &gt; 0 上坡，&lt; 0 下坡，= 0 平地</li></ul>'
      },
      {
        heading: '梯度与更新公式：面试背诵版',
        body: '把每个参数各自的偏导数（Partial Derivative）按顺序排成向量，就是梯度。<b>面试可背</b>："梯度指向函数值上升最快的方向；因为任一方向上的变化率等于梯度在该方向的投影，投影在梯度自身方向最大，所以其负方向就是下降最快的方向，参数沿负梯度更新。"',
        formula: 'θ ← θ − η · ∇L(θ)',
        formulaNote: '<ul><li><b>θ</b>：待优化的参数（模型的权重，可能有几十亿个）</li><li><b>∇L(θ)</b>：损失对参数的梯度向量，指向上山最快方向</li><li><b>η</b>：学习率（Learning Rate），每步走的长度</li><li><b>负号</b>：反方向即下山最快方向——梯度下降的"下"字来源</li><li><b>←</b>：更新赋值；反复迭代，直到损失基本不再下降（收敛）</li></ul>'
      },
      {
        heading: '从导数到训练：损失函数这张地图',
        body: '把"模型当前有多差"写成一个可导的数 L（损失函数 Loss），训练就是机械循环：前向算 L → 求梯度 → 沿负梯度更新。上亿参数的梯度由反向传播（Backpropagation，见 m3-02）用链式法则一次算出；学习率怎么自动调大调小，则是优化器（见 m3-03）的活。',
        formula: '∇L = ( ∂L/∂θ₁, ∂L/∂θ₂, …, ∂L/∂θₙ )',
        formulaNote: '<ul><li><b>∂L/∂θᵢ</b>：只把第 i 个参数挪动一丁点（其余全冻结）时，损失变化多少</li><li><b>直觉</b>：每个参数对"弄差损失"的责任份额</li><li><b>梯度向量</b>：把所有参数的责任份额按顺序装进一个向量</li><li>参数有几十亿个，梯度就有几十维——所以需要反向传播高效计算</li></ul>'
      }
    ],
    animation: {
      title: '梯度下山小球：看学习率怎么主宰命运',
      html: '<div class="anim-m1-03"><div class="anim-m1-03-box"><div class="anim-m1-03-ball"></div></div><div class="anim-m1-03-ctrl"><button class="anim-m1-03-step" type="button">沿负梯度走一步</button><button class="anim-m1-03-reset" type="button">回到山上</button><label>学习率 η <input class="anim-m1-03-lr" type="range" min="0.05" max="1.05" step="0.05" value="0.2"> <span class="anim-m1-03-etaval">0.20</span></label></div><div class="anim-m1-03-info"></div></div>',
      css: '.anim-m1-03 { font-size: 13px; }\n.anim-m1-03-box { position: relative; width: 320px; max-width: 100%; height: 160px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px; overflow: hidden; }\n.anim-m1-03-pt { position: absolute; width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%; background: #94a3b8; }\n.anim-m1-03-ball { position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%; background: #6366f1; box-shadow: 0 1px 4px rgba(0,0,0,.35); transition: left .45s ease, top .45s ease; }\n.anim-m1-03-ctrl { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 6px; }\n.anim-m1-03-ctrl button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m1-03-info { font-family: monospace; font-size: 12px; color: #334155; }',
      js: function (root) {
        var W = 320, H = 160, box = root.querySelector('.anim-m1-03-box');
        var ball = root.querySelector('.anim-m1-03-ball');
        var lr = root.querySelector('.anim-m1-03-lr');
        var etaVal = root.querySelector('.anim-m1-03-etaval');
        var info = root.querySelector('.anim-m1-03-info');
        var x = 4.5, steps = 0;
        function toPix(xv) {
          var px = (xv + 5) / 10 * W;
          var py = H - 12 - (xv * xv / 25) * (H - 24);
          return [px, py];
        }
        for (var i = 0; i <= 40; i++) {
          var xv = -5 + i * 0.25;
          var p = toPix(xv);
          var d = document.createElement('div');
          d.className = 'anim-m1-03-pt';
          d.style.left = p[0] + 'px';
          d.style.top = p[1] + 'px';
          box.appendChild(d);
        }
        function render() {
          var p = toPix(x);
          ball.style.left = p[0] + 'px';
          ball.style.top = p[1] + 'px';
          var g = 2 * x;
          info.innerHTML = '位置 x=' + x.toFixed(2) + '｜海拔 f(x)=x²=' + (x * x).toFixed(1) +
            '｜梯度 2x=<b>' + g.toFixed(2) + '</b>｜已走 ' + steps + ' 步' +
            (Math.abs(x) < 0.15 ? '｜斜率≈0，到达谷底附近' : '');
        }
        root.querySelector('.anim-m1-03-step').addEventListener('click', function () {
          var eta = Number(lr.value);
          x = x - eta * 2 * x;
          steps++;
          render();
        });
        root.querySelector('.anim-m1-03-reset').addEventListener('click', function () { x = 4.5; steps = 0; render(); });
        lr.addEventListener('input', function () { etaVal.textContent = Number(lr.value).toFixed(2); });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '函数 f(x) = x²，在 x = 3 处的导数 f&#39;(3) 等于多少？',
        options: ['6', '9', '3', '2'],
        answer: 0,
        explanation: '幂函数求导 (x²)&#39; = 2x，代入 x=3 得 6。常见误区：把导数当成函数值 f(3)=9（那是"高度"，不是"坡度"），或套错公式算成 2×3²。导数描述的是斜率，不是位置。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '梯度下降中，参数应沿<b>正</b>梯度方向更新，因为梯度指向函数值上升最快的方向。',
        answer: false,
        explanation: '前半句科学、结论错：正因为梯度指向上山最快方向，下山才必须沿"负"梯度，即 θ ← θ − η∇L(θ)。若沿正梯度更新，损失会越走越大。常见误区：背了"沿梯度方向更新"却漏掉负号，这是面试中最经典的口误。'
      },
      {
        type: 'order', difficulty: 3,
        question: '把梯度下降一次迭代的四个步骤按正确顺序排列：',
        items: ['按 θ ← θ − η·∇L(θ) 更新参数', '用当前参数做前向计算，得到损失 L(θ)', '用更新后的参数回到第一步，重复直到收敛', '反向求出损失对参数的梯度 ∇L(θ)'],
        answer: [1, 3, 0, 2],
        explanation: '正确顺序：先算损失（1）→ 再求梯度（3）→ 沿负梯度更新（0）→ 循环（2）。常见误区：先更新再求梯度（没有梯度就不知道往哪更新），或先求梯度再算损失（梯度必须基于当前损失才能求出）。这个循环就是所有深度学习训练的主循环。'
      }
    ],
    relations: {
      prerequisites: ['m1-01'],
      successors: ['m1-06', 'm2-02'],
      confusables: [
        { other: 'm3-02', tip: '梯度是"往哪走、走多急"的答案；反向传播是"高效算出这个答案"的算法（链式法则逐层回传）。面试常混：问"反向传播是什么"答成"沿梯度更新参数"就错了——更新是梯度下降的事，反向传播只负责算梯度。' }
      ]
    },
    memory: {
      mnemonic: '导数看坡度，梯度指上坡；要下山，反着走，步子别太大。',
      selfTest: [
        { q: '面试背诵：梯度下降为什么沿"负梯度"方向更新？', a: '梯度 ∇L 是各偏导数组成的向量，指向损失上升最快的方向（任一方向的变化率 = 梯度在该方向的投影，投影在梯度自身方向最大）；因此其反方向是下降最快的方向，取 θ ← θ − η∇L(θ)，负号即"下山"。' },
        { q: '学习率太大、太小分别会发生什么？', a: '太大：一步跨过谷底，损失来回震荡甚至发散（NaN）；太小：每步位移极小，收敛极慢，还容易困在平坦区或鞍点附近。' },
        { q: '偏导数 ∂L/∂θᵢ 的直觉含义是什么？', a: '只把第 i 个参数挪动一丁点、其余参数全部冻结时，损失变化多少——即"这个参数对损失的责任份额"；所有参数的责任份额按顺序排成梯度向量。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：梯度下降到底在干什么？',
      reference: '蒙着眼下山：每一步用脚感受哪边最陡，朝最陡的下坡方向挪一小步，反复直到站在平地——训练模型就是把"损失"这座山，一步步走到最低谷。'
    }
  },
  {
    id: 'm1-04',
    title: 'Python 最小必备',
    oneLiner: '变量、列表、字典、循环与函数五件事',
    estMinutes: 15,
    analogy: {
      title: '一个厨房的五件套',
      body: 'Python 厨房里只有五件核心厨具：<b>变量</b>是贴了标签的保鲜盒（装东西）；<b>列表</b>是一排编号的调料格（按 0、1、2 取）；<b>字典</b>是"菜名 → 格子号"的检索卡（按名字取）；<b>循环</b>是"对每一格重复同一个动作"；<b>函数</b>是食谱机——丢进食材（参数），按步骤加工，端出成品（返回值）。学会这五件，就能读懂绝大多数 AI 示例代码。'
    },
    intuition: [
      { heading: '变量：给值贴标签', body: '<code>x = 5</code> 的意思是"把 5 放进盒子，盒子上贴着 x 这张标签"。Python 不用提前声明类型，常用类型有：整数（int）、小数（float）、字符串（str）、真伪（bool）。注意 <code>=</code> 是"赋值"不是数学相等，所以 <code>x = x + 1</code> 完全合法：取出 x、加 1、放回去。' },
      { heading: '列表与字典：两种收纳术', body: '列表（list）像一排编了号的抽屉：<code>scores = [90, 85, 77]</code>，用 <code>scores[0]</code> 取第一个——注意下标从 0 数起。字典（dict）像查电话本：<code>user = {"name": "小明"}</code>，用 <code>user["name"]</code> 按名字取值。常用操作：<code>len()</code> 数个数、<code>append()</code> 往列表末尾追加、<code>in</code> 判断存在。' },
      { heading: '循环与函数：偷懒的艺术', body: '循环（for）让机器替你重复："对列表里每个元素做同一件事"；函数（def）把一段操作打包成可反复调用的机器。Python 用"冒号 + 缩进"表示"哪些行属于这个块"——缩进不是美观问题，是语法本身，错一格程序就不是你想要的意思。' }
    ],
    principle: [
      {
        heading: '变量与类型：程序的名词',
        body: '四大常用类型各司其职：int 整数、float 小数、str 字符串、bool 真伪。字符串相加是拼接：<code>"a" + "b"</code> 得 <code>"ab"</code>；字符串和数字不能直接相加，<code>"3" + 3</code> 会报错，要用 <code>int("3")</code> 先转换——新手最常撞的第一堵墙。',
        formula: "x = 5            # int 整数\npi = 3.14        # float 小数\nname = 'XiaoMing'  # str 字符串\nok = True        # bool 真伪",
        formulaNote: '<ul><li><b>x / pi / name / ok</b>：变量名，指向值的标签</li><li><b>=</b>：赋值号，把右边的值装进左边的名字</li><li><b>#</b>：注释，写给人看的说明，程序不执行</li><li><b>type(x)</b>：查询 x 当前装的是什么类型</li></ul>'
      },
      {
        heading: '容器：列表与字典',
        body: '列表有序、按下标取（从 0 起），适合"一串同类东西"；字典按键取，适合"按名字找东西"。两者可以互相嵌套——深度学习的数据集，本质就是一串"字典套列表"的样本。',
        formula: "scores = [90, 85, 77]\nuser = {'name': 'XiaoMing', 'vip': True}",
        formulaNote: '<ul><li><b>[ ]</b>：列表 list，scores[0] 取第一个值 90，scores.append(60) 末尾追加</li><li><b>{ }</b>：字典 dict，user[&#39;name&#39;] 得 &#39;XiaoMing&#39;，键（key）唯一</li><li><b>len(scores)</b>：元素个数，得 3</li><li><b>85 in scores</b>：判断存在，得 True</li></ul>'
      },
      {
        heading: '流程：循环、分支与函数',
        body: 'for…in 逐个访问元素；if / else 分支选择路线；def 定义函数封装复用。冒号后的缩进块决定"谁属于谁"：函数体、循环体、分支体都靠缩进划界。',
        formula: 'def total(xs):\n    s = 0\n    for x in xs:\n        if x > 0:\n            s += x\n    return s',
        formulaNote: '<ul><li><b>def total(xs)</b>：定义函数 total，参数是 xs</li><li><b>for x in xs</b>：逐个取出 xs 的元素，赋给 x</li><li><b>if x &gt; 0</b>：分支，只累加正数</li><li><b>s += x</b>：累加，等价于 s = s + x</li><li><b>return s</b>：把结果交还调用者，并结束函数</li></ul>'
      }
    ],
    animation: {
      title: 'for 循环单步执行器：看着机器替你累加',
      html: '<div class="anim-m1-04"><p class="anim-m1-04-desc">scores = [90, 85, 77, 92]，逐轮执行 <code>total += scores[i]</code>：</p><div class="anim-m1-04-trace"></div><div class="anim-m1-04-btns"><button class="anim-m1-04-next" type="button">下一步</button><button class="anim-m1-04-reset" type="button">重置</button></div><div class="anim-m1-04-out"></div></div>',
      css: '.anim-m1-04-desc { font-size: 13px; margin: 0 0 8px; }\n.anim-m1-04-trace { display: flex; gap: 8px; margin: 8px 0; flex-wrap: wrap; }\n.anim-m1-04-cell { padding: 6px 12px; border-radius: 6px; background: #e2e8f0; font-family: monospace; transition: background .3s ease, transform .3s ease; }\n.anim-m1-04-cur { background: #6366f1; color: #fff; transform: translateY(-4px); }\n.anim-m1-04-btns { display: flex; gap: 8px; margin-bottom: 8px; }\n.anim-m1-04-btns button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m1-04-out { font-family: monospace; font-size: 12px; color: #334155; min-height: 18px; }',
      js: function (root) {
        var scores = [90, 85, 77, 92];
        var trace = root.querySelector('.anim-m1-04-trace');
        var out = root.querySelector('.anim-m1-04-out');
        var i = 0, total = 0;
        function cells(cur) {
          trace.innerHTML = scores.map(function (s, k) {
            return '<span class="anim-m1-04-cell' + (k === cur ? ' anim-m1-04-cur' : '') + '">' + s + '</span>';
          }).join('');
        }
        function resetView() {
          i = 0; total = 0;
          cells(-1);
          out.textContent = '点击「下一步」，逐轮执行 total += scores[i]';
        }
        root.querySelector('.anim-m1-04-next').addEventListener('click', function () {
          if (i >= scores.length) {
            out.textContent = '循环结束：total = ' + total + '，平均分 = ' + (total / scores.length) + '。再点可继续看结束状态';
            return;
          }
          total += scores[i];
          cells(i);
          out.textContent = '第 ' + (i + 1) + ' 轮：total += scores[' + i + ']（即 +' + scores[i] + '）→ total = ' + total;
          i++;
        });
        root.querySelector('.anim-m1-04-reset').addEventListener('click', resetView);
        resetView();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '<code>nums = [3, 1, 2]</code>，执行 <code>nums.append(7)</code> 之后，<code>len(nums)</code> 和 <code>nums[0]</code> 分别是多少？',
        options: ['4 和 3', '4 和 7', '3 和 3', '4 和 1'],
        answer: 0,
        explanation: 'append 把 7 追加到<b>末尾</b>，列表变 [3, 1, 2, 7]，长度为 4；下标从 0 数起，nums[0] 仍是 3。常见误区：以为 append 会插到开头或自动排序，或把下标当序号从 1 数起而误选 nums[1]=1。'
      },
      {
        type: 'fill', difficulty: 2,
        question: '要把元素 x 追加到列表 L 的末尾，应调用 L.____(x)（填方法名）',
        accept: ['append'],
        explanation: 'list 的 append 方法把新元素加到末尾（原地修改列表）。常见误区：以为有 push（那是其他语言的叫法）或 add（那是 set 的方法）；Python 列表尾部追加就叫 append。'
      },
      {
        type: 'code', difficulty: 3,
        question: '补全词频统计函数：统计列表中每个单词出现的次数，返回字典。',
        template: 'def word_count(words):\n    counts = {}\n    for w in words:\n        if w ____ counts:        # 判断 w 是否已经统计过\n            counts[w] += ____    # 见过：计数加一\n        else:\n            counts[w] = 1        # 第一次见：从 1 开始\n    ____ counts\n\nprint(word_count([\'ai\', \'go\', \'ai\']))',
        checks: ['in', '1', 'return'],
        solution: "def word_count(words):\n    counts = {}\n    for w in words:\n        if w in counts:\n            counts[w] += 1\n        else:\n            counts[w] = 1\n    return counts\n\nprint(word_count(['ai', 'go', 'ai']))  # {'ai': 2, 'go': 1}",
        explanation: '三个考点：用 in 判断字典里是否已有该键；已有则计数 +1，没有则初始化为 1；最后 return 把结果交出去。常见误区：漏掉初始化分支导致 KeyError，或忘记 return 导致函数返回 None——这是新手最高频的 bug 之一。'
      }
    ],
    relations: {
      prerequisites: [],
      successors: ['m1-05', 'm9-01'],
      confusables: [
        { other: 'm1-05', tip: 'Python 原生 list 不做"整批数学运算"：[1, 2] * 2 得 [1, 2, 1, 2]（重复两遍）；而 NumPy 数组 np.array([1, 2]) * 2 得 [2, 4]（逐元素翻倍）。做数值计算要用后者，这是两类对象的本质区别。' }
      ]
    },
    memory: {
      mnemonic: '盒子贴标签，列表按下标，字典按名字，循环管重复，函数管打包。',
      selfTest: [
        { q: 'list 和 dict 各适合什么场景？', a: 'list 适合"有序的一串东西"，按下标 0,1,2… 取，可 append 追加；dict 适合"按名字找东西"的键值映射，按 key 取值，键唯一且查找快（哈希表）。' },
        { q: 'Python 的函数体为什么必须缩进？', a: 'Python 用缩进表示代码块层级（代替其他语言的大括号）：冒号后缩进的行才属于该函数/循环/分支。缩进错误会直接语法报错，或悄悄改变逻辑归属。' },
        { q: '"3" + 3 会发生什么？怎么改？', a: '报 TypeError：字符串和数字不能相加。应显式转换：int("3") + 3 得 6，或 "3" + str(3) 得 "33"。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：函数（function）是什么？',
      reference: '函数是一台"食谱机"：从入口丢进原料（参数），它按写好的步骤加工，再从出口端出成品（返回值）；写一次，之后随时重复使用，不用每次重新教。'
    }
  },
  {
    id: 'm1-05',
    title: 'NumPy 与 PyTorch 张量',
    oneLiner: '批量计算的乐高积木',
    estMinutes: 15,
    analogy: {
      title: '个体搬运工 vs 整板流水线',
      body: '给 1000 个零件都刷一遍漆：笨办法是雇 1000 个工人一个个刷（Python 的 for 循环）；聪明办法是把整板零件送进流水线，一次全刷完。<b>NumPy 数组 / PyTorch 张量（Tensor）</b>就是那条流水线：把成千上万个数字打包成一个对象，一条指令整批加工，底层由 C/CUDA 并行完成——这叫向量化（Vectorization），是深度学习代码快几个数量级的秘密。'
    },
    intuition: [
      { heading: '张量：统一规格的数字容器', body: '一个数是 0 维标量，一排数是 1 维向量，一张表是 2 维矩阵，再往上统称张量（Tensor）。PyTorch 的 <code>torch.tensor(...)</code> 和 NumPy 的 <code>np.array(...)</code> 用法高度相似；深度学习偏爱 PyTorch，是因为它额外记录"计算图"，能自动求梯度（Autograd），正好接住 m1-03 的下山需求。' },
      { heading: '拿到张量先问三件事', body: '形状（shape）、数值类型（dtype）、放在 CPU 还是 GPU（device）——调试深度学习代码九成的报错是 shape 对不上。比如 (3, 4) 的矩阵只能乘 (4, 2) 的矩阵；改形状用 <code>view / reshape</code>（元素总数不变），行列互换用 <code>.T</code>。' },
      { heading: '广播：形状不同也能算', body: '<code>(3, 4) - (4,)</code> 能直接算：把长度 4 的向量"虚拟复制" 3 份，去减每一行。最常见用途：给每一行减去均值做标准化、给每层输出加偏置（bias）。规则一句话：<b>从最后一维向前对齐，每一维相等或其中一个为 1 即可</b>——面试常考，下面原理区给可背诵版。' }
    ],
    principle: [
      {
        heading: '创建与三件套：shape / dtype / device',
        body: '建一个张量，先看 shape。dtype 决定精度（默认 float32，混合精度训练会换 float16/bfloat16），device 决定它在哪块芯片上——CPU 上的张量和 GPU 上的张量不能直接运算，要先 .to() 搬到同一边。',
        formula: 't = torch.tensor([[1., 2.], [3., 4.]])\nt.shape    # torch.Size([2, 2])\nt.dtype    # torch.float32',
        formulaNote: '<ul><li><b>t</b>：一个 2 行 2 列的张量（矩阵）</li><li><b>shape</b>：每一维的长度，调试的第一入口</li><li><b>dtype</b>：元素数值类型；数字带小数点（1.）即按 float 存</li><li><b>device</b>：数据在 CPU 还是 GPU（如 cuda:0），运算双方必须在同一设备</li></ul>'
      },
      {
        heading: '形状变换与两种乘法',
        body: '<code>reshape / view</code> 只改"形状标签"，元素顺序不变（总数恒为 6）；<code>.T</code> 真正交换行列位置。星号 <code>*</code> 是逐元素相乘，<code>@</code> 才是矩阵乘法——深度学习里 <code>W @ x</code> 是"加权混合"，<code>*</code> 常用于门控（如 GRU/LSTM），两者混用是新手高频 bug。',
        formula: 'A.reshape(3, 2)   # (2,3) → (3,2)，共 6 个元素不变\nC = A @ B         # 矩阵乘: (m,k) @ (k,n) → (m,n)\nD = A * B         # 逐元素乘: 形状需可广播',
        formulaNote: '<ul><li><b>reshape / view</b>：改形状不改元素顺序；view 要求内存连续，reshape 更宽容</li><li><b>.T</b>：转置，第 i 行变第 i 列，元素位置真的互换</li><li><b>@</b>：矩阵乘法，内维必须相等（m1-01 的行乘列）</li><li><b>*</b>：对应位置各自相乘，形状相同或可广播才行</li></ul>'
      },
      {
        heading: '广播机制：面试背诵版',
        body: '<b>可背表述</b>："广播从最后一维向前逐维对齐，每一维相等、或其中一个为 1（或缺维视作 1）即兼容；为 1 的维度被虚拟复制到匹配大小再运算，不真实占用内存；任何一维不满足则报错。"典型用途：形状 (3,4) 的矩阵减去形状 (4,) 的列均值向量，每一行都减。',
        formula: '(2, 3, 4) 与 (4,)   → (2, 3, 4)  ✔\n(2, 3, 4) 与 (3, 4) → (2, 3, 4)  ✔\n(2, 3, 4) 与 (2, 4) → 报错       ✘',
        formulaNote: '<ul><li><b>对齐方式</b>：两个形状右侧对齐（末维对末维），从后往前逐维比较</li><li><b>兼容条件</b>：每一维相等，或其中一个为 1；缺失的维当作 1</li><li><b>结果形状</b>：逐维取较大值</li><li><b>第三行为何报错</b>：末维 4=4 通过，但倒数第二维 3 与 2 既不相等也无 1</li><li><b>用途</b>：减均值、加偏置 bias，无需手动复制数据</li></ul>'
      }
    ],
    animation: {
      title: '张量形状变换器：6 个元素的三副面孔',
      html: '<div class="anim-m1-05"><p class="anim-m1-05-desc">同一串 6 个元素 <code>[1..6]</code>，reshape 只改"怎么看它"，.T 转置才会真正搬动元素位置：</p><div class="anim-m1-05-shape"></div><div class="anim-m1-05-grid"><div class="anim-m1-05-cell">1</div><div class="anim-m1-05-cell">2</div><div class="anim-m1-05-cell">3</div><div class="anim-m1-05-cell">4</div><div class="anim-m1-05-cell">5</div><div class="anim-m1-05-cell">6</div></div><div class="anim-m1-05-btns"><button class="anim-m1-05-btn" type="button" data-shape="2,3|1,2,3,4,5,6">reshape(2, 3)</button><button class="anim-m1-05-btn" type="button" data-shape="3,2|1,2,3,4,5,6">reshape(3, 2)</button><button class="anim-m1-05-btn" type="button" data-shape="3,2|1,4,2,5,3,6">.T 转置</button><button class="anim-m1-05-btn" type="button" data-shape="6,1|1,2,3,4,5,6">view(6, 1)</button></div></div>',
      css: '.anim-m1-05-desc { font-size: 13px; margin: 0 0 8px; }\n.anim-m1-05-shape { font-family: monospace; font-size: 12px; color: #334155; margin-bottom: 8px; }\n.anim-m1-05-grid { display: grid; gap: 6px; margin-bottom: 10px; width: max-content; }\n.anim-m1-05-cell { width: 44px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: #eef2ff; color: #4338ca; font-family: monospace; font-weight: 600; }\n.anim-m1-05-flash { animation: anim-m1-05-pop .45s ease; }\n@keyframes anim-m1-05-pop { 0% { transform: scale(.82); background: #c7d2fe; } 100% { transform: scale(1); background: #eef2ff; } }\n.anim-m1-05-btns { display: flex; gap: 8px; flex-wrap: wrap; }\n.anim-m1-05-btns button { padding: 4px 10px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; font-family: monospace; }',
      js: function (root) {
        var grid = root.querySelector('.anim-m1-05-grid');
        var label = root.querySelector('.anim-m1-05-shape');
        function render(shape, order) {
          grid.style.gridTemplateColumns = 'repeat(' + shape[1] + ', 44px)';
          grid.querySelectorAll('.anim-m1-05-cell').forEach(function (c, k) {
            c.textContent = order[k];
            c.classList.remove('anim-m1-05-flash');
            void c.offsetWidth;
            c.classList.add('anim-m1-05-flash');
          });
          label.textContent = 'shape = (' + shape.join(', ') + ')　元素总数 6 不变' +
            (order.join('') === '123456' ? '　（元素顺序未变）' : '　（转置：元素真的搬了家）');
        }
        root.querySelectorAll('.anim-m1-05-btn').forEach(function (b) {
          b.addEventListener('click', function () {
            var p = b.getAttribute('data-shape').split('|');
            render(p[0].split(',').map(Number), p[1].split(',').map(Number));
          });
        });
        render([2, 3], [1, 2, 3, 4, 5, 6]);
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '<code>np.array([1, 2, 3]) * 2</code> 的结果是？',
        options: ['array([2, 4, 6])', 'array([1, 2, 3, 1, 2, 3])', 'array([1, 4, 9])', '直接报错'],
        answer: 0,
        explanation: 'NumPy 数组的 * 是<b>逐元素</b>运算，每个元素各自翻倍得 [2, 4, 6]。常见误区：把 Python 原生 list 的语义搬过来（list * 2 才是"重复两遍"，对应选项 B）；选项 C 是逐元素平方 a**2 的结果。两种"*"含义不同是 m1-04 与本课的核心分界。'
      },
      {
        type: 'code', difficulty: 2,
        question: '补全代码：对 A、B 做矩阵乘法，并生成一个 (2, 4) 的全 1 张量。',
        template: 'import torch\n\nA = torch.randn(2, 3)\nB = torch.randn(3, 4)\nC = ____ @ ____            # 矩阵乘法（内维 3 匹配），结果形状 (2, 4)\nones = torch.____(2, 4)    # 生成形状 (2, 4) 的全 1 张量\nprint(C.shape, ones.shape)',
        checks: ['@', 'torch.ones'],
        solution: 'import torch\n\nA = torch.randn(2, 3)\nB = torch.randn(3, 4)\nC = A @ B\nones = torch.ones(2, 4)\nprint(C.shape, ones.shape)  # torch.Size([2, 4]) torch.Size([2, 4])',
        explanation: '矩阵乘法用 @（内维相等：3=3，结果 (2, 4)）；全 1 张量用 torch.ones(2, 4)，全 0 用 torch.zeros。常见误区：把 @ 写成 *（那是逐元素乘，且 (2,3)*(3,4) 形状对不上会报错）；或忘记张量创建函数在 torch 命名空间下，写成裸的 ones(2,4)。'
      },
      {
        type: 'judge', difficulty: 3,
        question: '形状为 (2, 3) 和 (3, 1) 的两个张量可以直接广播相加，结果形状是 (2, 3)。',
        answer: false,
        explanation: '广播从最后一维向前逐维检查：末维 3 与 1 兼容（1 可扩展），但倒数第二维是 2 与 3——既不相等也没有一个为 1，规则不满足，直接报错。常见误区：以为"有一维相同/为 1 就能算"，正确表述是<b>每一维</b>都必须从末维起逐一对齐通过。'
      }
    ],
    relations: {
      prerequisites: ['m1-01', 'm1-04'],
      successors: ['m9-04', 'm9-06'],
      confusables: [
        { other: 'm1-01', tip: '向量/矩阵是数学概念，张量（Tensor）是它们在 NumPy/PyTorch 中的编程载体：1 维张量≈向量、2 维张量≈矩阵、3 维以上是推广；数学书上的"矩阵乘法"在代码里就是张量的 @ 运算。' },
        { other: 'm1-04', tip: 'Python list 与 NumPy/PyTorch 张量的关键差异：list 的 * 是重复、+ 是拼接，没有整批算术；张量的 * 和 + 都是逐元素批量运算，并支持广播。数值计算必须换成张量，否则性能差几个数量级。' }
      ]
    },
    memory: {
      mnemonic: '张量三问 shape/dtype/device；逐元素星号、矩阵乘 @；广播末维对齐，相等或有 1 才扩。',
      selfTest: [
        { q: '面试背诵：NumPy/PyTorch 的广播（broadcasting）规则是什么？', a: '两形状右侧对齐，从最后一维向前逐维比较：每一维相等、或其中一个为 1（缺维视作 1）即兼容；为 1 的维度被虚拟复制到匹配大小再运算、不占额外内存；任一维不满足则报错。NumPy 与 PyTorch 规则一致。' },
        { q: 'view/reshape 和转置 .T 的本质区别？', a: 'view/reshape 只改"形状标签"，元素顺序完全不变（view 要求内存连续）；.T 是真转置，元素行列位置互换。无论怎么改，元素总数必须不变。' },
        { q: '为什么深度学习代码强调向量化、少写 for 循环？', a: 'NumPy/PyTorch 的批量运算由底层 C/CUDA 并行实现，一条指令处理整个张量；Python 层 for 循环逐元素执行，解释器开销大、无法并行，慢几个数量级。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：张量（Tensor）是什么？',
      reference: '张量就是"任意维度的数字表格"：一个数、一排数、一张表、一摞表都算；深度学习把所有数据和参数都装进这种统一规格的容器里，机器就能整批、高速地加工它们。'
    }
  },
  {
    id: 'm1-06',
    title: 'Sigmoid 与 Softmax',
    oneLiner: '把分数变成概率的两兄弟',
    estMinutes: 12,
    analogy: {
      title: '一人上场 vs 多人分蛋糕',
      body: '评委给选手打分，但分数五花八门，怎么变成"胜率"？两个办法：<b>Sigmoid</b> 是"一人上场"——把一个任意分数单独压进 0 到 1，当"把握"用；<b>Softmax</b> 是"多人分蛋糕"——把一组分数放在一起，按比例把 100% 的把握切给每个人：分高的拿得多，但人人有份、总和恒为 1。二分类用 sigmoid，多分类（以及大模型挑下一个字）用 softmax。'
    },
    intuition: [
      { heading: 'Sigmoid：一条 S 形曲线', body: '<code>σ(x) = 1/(1+e^(−x))</code>：x 越大越接近 1，越小越接近 0，x=0 时恰好 0.5，曲线呈 S 形。它把"任意打分"变成"0~1 的把握"，逻辑回归（m2-03）和各种门控单元都用它。注意两端很"平"（饱和）：x 很大很小时，输出几乎不动——导数趋近 0，这会给深层网络埋下"梯度消失"的伏笔（m3-02）。' },
      { heading: 'Softmax：指数化后切蛋糕', body: '先对每个分数取 e 的指数（把分数拉开差距且全变正数），再除以总和归一化：分高者占比大，总和严格等于 1。它是多分类输出层的标配——大模型每生成一个字，就是对全词表做一次 softmax，再按概率挑字。' },
      { heading: '数值稳定与温度：两个必考点', body: '分数很大时 e^1000 会"溢出"成无穷大，程序得到 NaN。解法是<b>先给每个分数减去最大值再取指数</b>——数学结果完全不变，数值却安全（原理区给可背版）。另外 softmax 里除以温度 T：T 大分布变平（更随机），T 小分布变尖（更确定），这是采样策略（m7-02）的开关。' }
    ],
    principle: [
      {
        heading: 'Sigmoid：单个分数 → 把握',
        body: '输入任意实数，输出恒在 (0, 1) 区间，且单调：分数越高把握越大。二分类里输出可直接当"P(属于正类)"。它还有一个漂亮性质：导数是 σ(x)(1−σ(x))，用输出就能算出导数——但两端趋近 0，正是深层网络梯度消失的经典根源。',
        formula: 'σ(x) = 1 / (1 + e^(−x))',
        formulaNote: '<ul><li><b>e</b> ≈ 2.718：自然常数；e^(−x) 保证输入越大、分母越小、输出越接近 1</li><li><b>x = 0</b>：σ(0) = 1/2，S 曲线的对称中心</li><li><b>输出范围</b>：(0, 1)，可解释为"把握/概率"，但只是模型打分的单调压缩</li><li><b>导数 σ(1−σ)</b>：x=0 时最大 0.25；两端趋近 0 → 饱和 → 梯度消失</li></ul>'
      },
      {
        heading: 'Softmax：一组分数 → 概率分布',
        body: 'Softmax 做两步：先用指数放大差距（并保证全为正），再除以总和归一化。它保持单调——分数越高概率越高——同时强制总和为 1，输出即是一个合法的概率分布。若某个分数远大于其余，softmax 会输出"几乎全押它"的分布（趋近 one-hot）。',
        formula: 'softmax(zᵢ) = e^(zᵢ) / Σⱼ e^(zⱼ)',
        formulaNote: '<ul><li><b>zᵢ</b>：第 i 个候选的原始分数，术语叫 logits，可正可负</li><li><b>e^(zᵢ)</b>：指数化——全变正数，且放大分数间的差距</li><li><b>Σⱼ e^(zⱼ)</b>：所有候选的指数加总，作分母用来归一化</li><li><b>结果</b>：每个候选一个 (0,1) 的概率，总和恰好为 1</li></ul>'
      },
      {
        heading: '数值稳定版：先减最大值（面试必背）',
        body: '<b>可背表述</b>："z 很大时 e^z 溢出为 inf，inf/inf 得 NaN；给每个 z 减去 max(z) 后，指数最大只到 e^0=1，而分子分母同时除以 e^max 在数学上相互抵消，结果不变——纯数值技巧，不改语义。"工程中直接用 <code>torch.softmax(x, dim=-1)</code>：dim 指定沿哪个维度归一化（该维上和为 1），对 (batch, vocab) 的 logits 通常取最后一维 -1，PyTorch 内部已做稳定处理。',
        formula: 'softmax(z)ᵢ = e^(zᵢ − max(z)) / Σⱼ e^(zⱼ − max(z))',
        formulaNote: '<ul><li><b>max(z)</b>：这组分数里的最大值；每个 zᵢ 先减去它</li><li><b>为何安全</b>：最大的指数变为 e^0 = 1，不会再溢出成 inf</li><li><b>为何结果不变</b>：分子分母同乘 e^(−max)，约分后与原式完全等价</li><li><b>dim=-1</b>：PyTorch 里指沿最后一维（词表维）归一化，每个样本各自和为 1</li><li><b>手撕 softmax</b>（m9-03）必考：写不写这行减 max，是面试官判断工程素养的探针</li></ul>'
      }
    ],
    animation: {
      title: 'Sigmoid 滑块 + Softmax 温度旋钮',
      html: '<div class="anim-m1-06"><div class="anim-m1-06-sec"><b>① Sigmoid：一个分数压进 (0, 1)</b><div class="anim-m1-06-curve"><div class="anim-m1-06-sdot"></div></div><div class="anim-m1-06-srow"><input class="anim-m1-06-sx" type="range" min="-6" max="6" step="0.1" value="0"><span class="anim-m1-06-sval"></span></div><p class="anim-m1-06-note">拖动 x，红点沿 S 曲线滑动：x=0 时 σ=0.5；两端越来越"笃定"，但也越来越"迟钝"（饱和）。</p></div><div class="anim-m1-06-sec"><b>② Softmax 温度：一组分数分蛋糕</b><p class="anim-m1-06-note">三个候选词的 logits = [2.0, 1.0, 0.5]，拖动温度 T：</p><div class="anim-m1-06-srow"><input class="anim-m1-06-t" type="range" min="0.1" max="3" step="0.1" value="1"><span class="anim-m1-06-tval"></span></div><div class="anim-m1-06-row"><span class="anim-m1-06-lab">词 A</span><div class="anim-m1-06-track"><div class="anim-m1-06-bar"></div></div></div><div class="anim-m1-06-row"><span class="anim-m1-06-lab">词 B</span><div class="anim-m1-06-track"><div class="anim-m1-06-bar"></div></div></div><div class="anim-m1-06-row"><span class="anim-m1-06-lab">词 C</span><div class="anim-m1-06-track"><div class="anim-m1-06-bar"></div></div></div></div></div>',
      css: '.anim-m1-06 { font-size: 13px; }\n.anim-m1-06-sec { margin-bottom: 14px; }\n.anim-m1-06-curve { position: relative; width: 260px; max-width: 100%; height: 90px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; }\n.anim-m1-06-pt { position: absolute; width: 3px; height: 3px; margin: -1.5px 0 0 -1.5px; border-radius: 50%; background: #94a3b8; }\n.anim-m1-06-sdot { position: absolute; width: 12px; height: 12px; margin: -6px 0 0 -6px; border-radius: 50%; background: #ef4444; transition: left .25s ease, top .25s ease; }\n.anim-m1-06-srow { display: flex; gap: 10px; align-items: center; margin-top: 6px; }\n.anim-m1-06-note { font-size: 12px; color: #64748b; margin: 6px 0; }\n.anim-m1-06-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }\n.anim-m1-06-lab { width: 34px; font-size: 12px; }\n.anim-m1-06-track { flex: 1; height: 18px; background: #f1f5f9; border-radius: 9px; overflow: hidden; }\n.anim-m1-06-bar { height: 100%; width: 0; background: #f59e0b; color: #fff; font-size: 11px; display: flex; align-items: center; justify-content: center; transition: width .4s ease; }',
      js: function (root) {
        var W = 260, H = 90;
        var curve = root.querySelector('.anim-m1-06-curve');
        var dot = root.querySelector('.anim-m1-06-sdot');
        var sx = root.querySelector('.anim-m1-06-sx');
        var sval = root.querySelector('.anim-m1-06-sval');
        function sig(x) { return 1 / (1 + Math.exp(-x)); }
        for (var i = 0; i <= 60; i++) {
          var xv = -6 + i * 0.2;
          var pt = document.createElement('div');
          pt.className = 'anim-m1-06-pt';
          pt.style.left = ((xv + 6) / 12 * W) + 'px';
          pt.style.top = (H - 8 - sig(xv) * (H - 16)) + 'px';
          curve.appendChild(pt);
        }
        curve.appendChild(dot);
        function updS() {
          var x = Number(sx.value);
          var y = sig(x);
          dot.style.left = ((x + 6) / 12 * W) + 'px';
          dot.style.top = (H - 8 - y * (H - 16)) + 'px';
          sval.textContent = 'x=' + x.toFixed(1) + ' → σ=' + y.toFixed(3);
        }
        sx.addEventListener('input', updS);
        updS();
        var st = root.querySelector('.anim-m1-06-t');
        var tval = root.querySelector('.anim-m1-06-tval');
        var bars = root.querySelectorAll('.anim-m1-06-bar');
        var z = [2, 1, 0.5];
        function updT() {
          var T = Number(st.value);
          var es = z.map(function (v) { return Math.exp(v / T); });
          var s = es[0] + es[1] + es[2];
          bars.forEach(function (b, k) {
            var p = es[k] / s;
            b.style.width = (p * 100).toFixed(1) + '%';
            b.textContent = p.toFixed(2);
          });
          tval.textContent = 'T=' + T.toFixed(1) + (T < 0.8 ? '：尖，更确定' : (T > 1.5 ? '：平，更多样' : '：适中'));
        }
        st.addEventListener('input', updT);
        updT();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'sigmoid 函数在 x = 0 处的输出 σ(0) 等于多少？',
        options: ['0.5', '0', '1', '约 0.368'],
        answer: 0,
        explanation: 'σ(0) = 1/(1+e⁰) = 1/2 = 0.5，这是 S 曲线的对称中心。常见误区：以为没有输入时输出 0，或把 e⁰ 算成 e；约 0.368 是 1/e，是给混淆者的干扰项。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'softmax 的输出每个分量都在 (0, 1) 区间内（不含端点），且所有分量之和严格等于 1。',
        answer: true,
        explanation: '指数函数恒为正数，除以正的总和后每个分量必在 (0, 1) 内，且按构造总和为 1——所以 softmax 输出是合法的概率分布。常见误区：以为可能出现 0 或负数（只有在数值下溢时才会近似为 0）；另一个误区是把"和为 1"误记成 sigmoid 的性质——sigmoid 只处理单个分数，没有"总和"概念。'
      },
      {
        type: 'code', difficulty: 3,
        question: '手写数值稳定的 softmax：先减最大值防溢出，再指数化、归一化。',
        template: 'import torch\n\ndef stable_softmax(x):\n    z = x - x.____()      # 先减最大值, 防止 e^z 溢出为 inf\n    e = torch.____(z)     # 逐元素取指数\n    return e / e.____(dim=-1, keepdim=True)  # 沿最后一维求和归一化',
        checks: ['max', 'exp', 'sum'],
        solution: 'import torch\n\ndef stable_softmax(x):\n    z = x - x.max(dim=-1, keepdim=True).values\n    e = torch.exp(z)\n    return e / e.sum(dim=-1, keepdim=True)\n\n# 一维输入也可简写为:\n# z = x - x.max(); e = torch.exp(z); return e / e.sum()\n# 工程中直接用 torch.softmax(x, dim=-1)',
        explanation: '三步口诀：减 max、取 exp、除以 sum。减最大值后指数最大为 e^0=1，不会溢出，而分子分母同除 e^max 结果不变——这是纯数值技巧。常见误区：直接 torch.exp(x) 后溢出得 NaN；或忘记沿 dim=-1 求和导致形状对不上；工程实践推荐 torch.softmax(x, dim=-1)，其中 dim 指定归一化的维度。'
      }
    ],
    relations: {
      prerequisites: ['m1-02', 'm1-03'],
      successors: ['m2-03', 'm9-03'],
      confusables: [
        { other: 'm1-02', tip: 'softmax 的输出形似概率分布（非负、和为 1），但它是"分数归一化"的产物，不保证反映真实不确定性：温度调高会人为压平分布。真正的概率来自数据生成过程，描述不确定性的学科语言在 m1-02。' },
        { other: 'm3-05', tip: 'softmax 是"按比例分配 100% 把握"的归一化（切蛋糕），LayerNorm 是"减均值、除标准差"的标准化（把数值摆匀到均值 0 方差 1）。都带"归一"字样，但目的、公式、位置完全不同：前者在输出层/注意力里，后者在层与层之间。' }
      ]
    },
    memory: {
      mnemonic: 'sigmoid 管一个，压进 0 到 1；softmax 管一群，指数化后分蛋糕；先减最大值，溢出不来找。',
      selfTest: [
        { q: '面试背诵：手写 softmax 为什么先减去最大值？', a: 'z 很大时 e^z 溢出为 inf，inf/inf 得 NaN；减去 max(z) 后指数最大为 e^0=1，不再溢出；而分子分母同除 e^max 数学上相互抵消，结果不变——纯数值稳定技巧，不改语义。' },
        { q: 'torch.softmax(logits, dim=-1) 的 dim 是什么意思？', a: '指定沿哪个维度做归一化（该维上各分量和为 1）。对形状 (batch, vocab) 的 logits 取 -1（最后一维/词表维），即每个样本各自在候选词上归一化出一个分布。' },
        { q: '温度 T 如何影响 softmax 分布？', a: 'logits 先除以 T 再 softmax：T>1 分布被压平、更随机多样；T<1 分布更尖锐、更确定；T→0 退化为贪心（永远选最大分）。这是大模型采样（m7-02）的核心旋钮。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：softmax 是干什么的？',
      reference: 'softmax 是"分蛋糕算法"：把一组打分先指数放大拉开差距，再按比例切成总和为 1 的概率——分高的拿得多，但人人有份；大模型挑下一个字，就是先给全词表打分、再让 softmax 切蛋糕。'
    }
  }
  ]
});
