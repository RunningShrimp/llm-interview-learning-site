/* M2 传统机器学习 —— 7 个知识点内容数据（契约见 docs/SCHEMA.md v1） */
window.SITE_DATA.registerModule({
  module: 'M2',
  title: '传统机器学习',
  icon: '🌲',
  color: '#0ea5e9',
  lessons: [
  {
    id: 'm2-01',
    title: '机器学习全景',
    oneLiner: '数据驱动的三种学习范式与数据三分法',
    estMinutes: 10,
    analogy: {
      title: '学做菜的三条路',
      body: '学做菜有三条路。<b>监督学习</b>像报班上课：老师给你看"这盘是鱼香肉丝、那盘是麻婆豆腐"（带标签的例子），你照着练，老师批改作业指出对错；<b>无监督学习</b>像独自逛菜市场：没人告诉你菜名，你却能把一百种菜按"叶菜 / 根茎 / 菌菇"自动归堆；<b>强化学习</b>像闭眼做实验：自己下厨，好吃下次多做（奖励），难吃就换做法（惩罚），慢慢摸出独家配方。机器学习（Machine Learning）的各种算法，几乎都能在这三条路里找到位置。'
    },
    intuition: [
      { heading: '从"人写规则"到"数据里学规则"', body: '传统编程是人把规则一条条写死：遇到"中奖""点击领奖"就标记为垃圾邮件——规则永远写不完，骗子换个词就失效。机器学习把方向反过来：喂给机器上万封"邮件 + 是否垃圾"的例子，让它<b>自己从数据里总结规则</b>，总结出的规则就叫模型（Model）。数据越多、越干净，规则通常越准。' },
      { heading: '三种学习范式：有没有老师、有没有答案', body: '<b>监督学习（Supervised Learning）</b>：每个样本都带标准答案（标签），学的是"输入 → 输出"的映射。答案连续（房价、气温）叫回归，答案是类别（是不是垃圾邮件）叫分类。<b>无监督学习（Unsupervised Learning）</b>：没有标签，目标是发现数据自身的结构，典型任务是聚类（把相似的用户自动分群）。<b>强化学习（Reinforcement Learning）</b>：没有逐条答案，智能体在环境里试错，靠奖励信号学出长期得分最高的策略，AlphaGo 自我对弈就是典型。' },
      { heading: '数据三分：训练 / 验证 / 测试', body: '做机器学习前先切数据：<b>训练集</b>是上课例题，用来拟合模型参数；<b>验证集</b>是模拟考，用来调超参数、比较不同模型；<b>测试集</b>是高考——考前绝不能看，只在一切定稿后考一次，代表上线后的真实水平。拿测试集反复调参，等于偷看考题：成绩虚高，上线就翻车。这个坑叫信息泄漏（Data Leakage），是面试必考的工程素养题。' }
    ],
    principle: [
      {
        heading: '监督学习：从带答案的样本中学映射',
        body: '监督学习的一切算法——决策树、逻辑回归、神经网络——共享同一个数学骨架：找一个带参数的函数 f，让它在所有样本上的预测都尽量贴近标签。不同算法的区别，只是 f 的形状（一条直线？一棵树？一个百层的网络）和衡量"差距"的方式不同。',
        formula: 'ŷ = f(x; θ)，训练目标：min L(θ) = (1/n) · Σ ℓ( yᵢ , f(xᵢ; θ) )',
        formulaNote: '<ul><li><b>xᵢ, yᵢ</b>：第 i 个样本的输入和标准答案（标签）</li><li><b>f(x; θ)</b>：模型，θ 是它内部的参数（要学的那堆数字）</li><li><b>ŷ</b>：模型的预测值，与真实 y 做对照</li><li><b>ℓ</b>：单条预测与答案的差距（分类常用交叉熵，回归常用平方误差）</li><li><b>(1/n)·Σ</b>：对全部 n 个样本取平均——训练就是把平均差距压到最小</li></ul>'
      },
      {
        heading: '数据怎么切：比例与铁律',
        body: '常见切法是 8 : 1 : 1 或 6 : 2 : 2。训练集拟合参数 θ（模型自己学的那部分）；验证集拟合的是超参数（树多深、学习率多大这类人设定的旋钮）；测试集只做最终汇报。三份数据必须来自同一分布，且彼此不重叠——一旦测试集信息渗进训练过程，评估就失效。',
        formula: '训练集 : 验证集 : 测试集 ≈ 8 : 1 : 1（数据少时用交叉验证补足，见 m2-07）',
        formulaNote: '<ul><li><b>训练集</b>：模型反复看、反复学的材料，占比最大</li><li><b>验证集</b>：调超参数、选模型用，会被使用多次</li><li><b>测试集</b>：全程隔离，最后只用一次，成绩才无偏</li><li><b>铁律</b>：任何来自测试集的信息进入训练/调参，都叫信息泄漏，评估结果不可信</li></ul>'
      },
      {
        heading: '面试视角：范式识别是第一道送分题',
        body: '面试官常给场景让你归类：预测房价（监督-回归）、判断是否欺诈（监督-分类）、用户自动分群（无监督-聚类）、游戏 AI 自己练级（强化）。更深一层的追问是"你的标签哪来的、标注成本多少"——监督学习的成本大头在标注，这也是大模型时代预训练（无标注）+ 微调（少量标注）路线的由来（见 m6-01、m6-03）。能顺着范式讲到这条线，就是加分段。'
      }
    ],
    animation: {
      title: '三种范式体验台：同一批水果，三种学法',
      html: '<div class="anim-m2-01"><div class="anim-m2-01-tabs"><button class="anim-m2-01-btn anim-m2-01-on" data-mode="sup" type="button">① 监督学习</button><button class="anim-m2-01-btn" data-mode="unsup" type="button">② 无监督学习</button><button class="anim-m2-01-btn" data-mode="rl" type="button">③ 强化学习</button></div><div class="anim-m2-01-chips"></div><div class="anim-m2-01-note"></div><div class="anim-m2-01-flow"><span class="anim-m2-01-step anim-m2-01-s1">输入数据</span><span class="anim-m2-01-arrow">→</span><span class="anim-m2-01-step anim-m2-01-s2">学习信号</span><span class="anim-m2-01-arrow">→</span><span class="anim-m2-01-step anim-m2-01-s3">学到什么</span></div></div>',
      css: '.anim-m2-01 { font-size: 13px; }\n.anim-m2-01-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }\n.anim-m2-01-btn { padding: 5px 14px; border: 1px solid #cbd5e1; border-radius: 999px; background: #fff; cursor: pointer; transition: background .25s ease, color .25s ease, border-color .25s ease; }\n.anim-m2-01-btn.anim-m2-01-on { background: #0ea5e9; border-color: #0ea5e9; color: #fff; }\n.anim-m2-01-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; min-height: 34px; }\n.anim-m2-01-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 8px; background: #f1f5f9; transition: background .3s ease, transform .3s ease; }\n.anim-m2-01-chip em { font-style: normal; font-size: 12px; padding: 1px 8px; border-radius: 999px; background: #e2e8f0; color: #334155; transition: background .3s ease; }\n.anim-m2-01-good { background: #dcfce7 !important; color: #166534; }\n.anim-m2-01-bad { background: #fee2e2 !important; color: #991b1b; }\n.anim-m2-01-unsup { opacity: .92; }\n.anim-m2-01-note { color: #475569; line-height: 1.6; min-height: 40px; margin-bottom: 8px; }\n.anim-m2-01-flow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }\n.anim-m2-01-step { padding: 4px 10px; border-radius: 6px; background: #e0f2fe; color: #0369a1; font-size: 12px; transition: background .3s ease; }\n.anim-m2-01-arrow { color: #94a3b8; }',
      js: function (root) {
        var chips = root.querySelector('.anim-m2-01-chips');
        var note = root.querySelector('.anim-m2-01-note');
        var s1 = root.querySelector('.anim-m2-01-s1');
        var s2 = root.querySelector('.anim-m2-01-s2');
        var s3 = root.querySelector('.anim-m2-01-s3');
        if (!chips || !note || !s1 || !s2 || !s3) return;
        var MODES = {
          sup: {
            chips: [['苹果', '甜', 'good'], ['柠檬', '酸', 'bad'], ['西瓜', '甜', 'good'], ['山楂', '酸', 'bad'], ['荔枝', '甜', 'good'], ['青梅', '酸', 'bad']],
            html: function (d) { return '<span class="anim-m2-01-chip"><b>' + d[0] + '</b><em class="anim-m2-01-' + d[2] + '">' + d[1] + '</em></span>'; },
            note: '监督学习：每个样本自带标准答案（绿色/红色标签）。模型盯着"外观 → 甜 / 酸"的配对学映射，就像照着老师批改过的作业练习。',
            s: ['带标签数据', '标准答案（标签）', '映射 f：外观 → 甜 / 酸']
          },
          unsup: {
            chips: [['苹果', '?'], ['柠檬', '?'], ['西瓜', '?'], ['山楂', '?'], ['荔枝', '?'], ['青梅', '?']],
            html: function (d) { return '<span class="anim-m2-01-chip anim-m2-01-unsup"><b>' + d[0] + '</b><em>' + d[1] + '</em></span>'; },
            note: '无监督学习：标签被遮住。模型按相似度自动归堆——甜系水果聚成一簇、酸系聚成另一簇，从头到尾没人告诉它"正确答案"。',
            s: ['无标签数据', '无标准答案（自找结构）', '簇：甜组 / 酸组']
          },
          rl: {
            chips: [['试吃 1', '少糖 −1', 'bad'], ['试吃 2', '少糖 −1', 'bad'], ['试吃 3', '加糖 +1', 'good'], ['试吃 4', '加糖 +1', 'good'], ['试吃 5', '多放糖 +2', 'good'], ['试吃 6', '多放糖 +2', 'good']],
            html: function (d) { return '<span class="anim-m2-01-chip anim-m2-01-rl"><b>' + d[0] + '</b><em class="anim-m2-01-' + d[2] + '">' + d[1] + '</em></span>'; },
            note: '强化学习：没有标准答案，只有环境反馈的奖励。得高分的做法被强化、低分的被回避——策略在试错记录中一步步进化。',
            s: ['试错动作', '奖励 / 惩罚信号', '策略：下一道怎么调']
          }
        };
        function render(mode) {
          var m = MODES[mode];
          if (!m) return;
          chips.innerHTML = m.chips.map(m.html).join('');
          note.textContent = m.note;
          s1.textContent = m.s[0];
          s2.textContent = m.s[1];
          s3.textContent = m.s[2];
        }
        var btns = root.querySelectorAll('.anim-m2-01-btn');
        for (var i = 0; i < btns.length; i++) {
          (function (btn) {
            btn.addEventListener('click', function () {
              for (var j = 0; j < btns.length; j++) btns[j].classList.remove('anim-m2-01-on');
              btn.classList.add('anim-m2-01-on');
              render(btn.getAttribute('data-mode'));
            });
          })(btns[i]);
        }
        render('sup');
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '预测明天的最高气温（一个具体数值），属于哪种任务？',
        options: ['回归（监督学习）', '分类（监督学习）', '聚类（无监督学习）', '强化学习'],
        answer: 0,
        explanation: '预测连续数值是回归，且训练时有历史"日期特征 → 实际气温"的标签配对，属于监督学习。分类预测的是离散类别；聚类是无标签自动分群；强化学习靠奖励试错。常见误区：看到"预测"两个字就选强化学习——预测数值（气温、房价）是最典型的回归任务。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '只要在测试集上反复调参，最终测试集准确率就能真实反映模型的上线水平。',
        answer: false,
        explanation: '测试集的定位是"只考一次"的最终评价；反复用它调参，等于把考题答案泄漏进模型选择过程（信息泄漏），测试成绩虚高，上线遇到新数据就会回落。正确做法：用验证集反复调参选型，测试集留到一切定稿后评估一次。'
      },
      {
        type: 'single', difficulty: 3,
        question: '以下四个任务中，属于<b>无监督学习</b>的是：',
        options: ['根据历史成交记录预测二手房价格', '把百万用户按消费行为自动分成 8 个群体，群体事先没有名字', '判断一封邮件是否为垃圾邮件（有历史人工标注）', '训练 AI 下围棋，只靠胜负反馈提升棋力'],
        answer: 1,
        explanation: '无监督学习的标志是没有标签、从数据自身找结构：用户分群（聚类）没有"标准分组答案"可对。房价预测与垃圾邮件识别都有标签（监督学习）；围棋 AI 只靠胜负奖励试错（强化学习）。面试高频追问"聚类与分类的区别"：分类有标签、聚类没有；聚类结果还需要人来解读命名。'
      }
    ],
    relations: {
      prerequisites: ['m1-03'],
      successors: ['m2-04', 'm2-07'],
      confusables: [
        { other: 'm2-07', tip: '本课的"训练/验证/测试"是一次性三分；m2-07 的 K 折交叉验证是在"训练+验证"这部分上轮流换着当验证集、取平均以获得更稳的估计——测试集在两种方案里都始终隔离不动。' },
        { other: 'm6-03', tip: 'SFT 指令微调本质上就是监督学习：输入是指令，标签是示范回答，仍是"预测答案、算损失、调参数"这套范式，只是模型从决策树换成了大语言模型。' }
      ]
    },
    memory: {
      mnemonic: '监督有答案，无监督找同类，强化靠奖惩；训练上课、验证模考、测试高考。',
      selfTest: [
        { q: '验证集和测试集有什么区别？为什么不能合并？', a: '验证集用于调超参数、选模型，会被反复使用；测试集模拟真实上线，只在一切定稿后评估一次。合并后模型选择过程会"偷看"考题（信息泄漏），评估不再无偏，上线表现往往明显低于离线成绩。' },
        { q: '垃圾分类（判断垃圾邮件）为什么是监督学习？它的无监督版本会是什么样？', a: '因为有历史标注（人工标过"是/不是垃圾"），模型从带答案的样本中学映射。无监督版本：不做"是不是垃圾"的判断，而是把所有邮件按内容相似度自动聚成若干主题簇。' },
        { q: '强化学习与监督学习最本质的区别是什么？', a: '监督学习每条样本都有标准答案可逐条对照；强化学习没有答案，只有环境反馈的奖励信号，智能体要靠试错最大化长期累积奖励，还要自己权衡探索与利用。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：机器学习和普通编程有什么不一样？',
      reference: '普通编程是人把规则一条条写死让机器照办；机器学习是把大量带答案的例子喂给机器，让它自己总结规则——例子越多越干净，总结出的规则就越好用。'
    },
  },
  {
    id: 'm2-02',
    title: '线性回归与损失函数',
    oneLiner: '画一条最贴近数据的直线，并用梯度下降一步步找到它',
    estMinutes: 12,
    analogy: {
      title: '中介估房价',
      body: '老中介不看复杂公式，凭一张"面积—成交价"散点图徒手画一条直线：以后来了新房子，量出面积、横轴一查、顺着直线读出估价。画线的手艺全在"贴得近"——直线要离每个成交点都尽量近。<b>线性回归（Linear Regression）</b>就是把这套手艺交给机器：直线方程 ŷ = w·x + b 是模型，"贴得近的程度"用损失函数打分，调 w 和 b 的过程就是训练。'
    },
    intuition: [
      { heading: '直线由两个旋钮决定', body: 'ŷ = w·x + b 里只有两个未知数：<b>w</b> 是斜率，对应"每平米单价"——面积每多 1 平米，估价涨多少；<b>b</b> 是截距，对应"起步价"。训练前直线乱画一通，训练就是拧这两个旋钮，让直线稳稳穿过散点云的中间。真实房价还受地段、房龄影响，那就把 x 换成多个特征（w 也变多个），思路完全不变。' },
      { heading: '什么叫"贴近"：逐点量误差再算总账', body: '对每个历史成交点，误差 = 真实价 − 预测价。把每条误差<b>平方</b>后加起来再取平均，就是均方误差（MSE, Mean Squared Error）。为什么用平方而不是直接加？① 正负误差直接加会互相抵消——预测偏高和偏低一抵消，错得离谱也显示"零误差"；② 平方把大错误放大重罚，模型优先消灭离谱预测；③ 平方函数处处可导，方便用梯度（见 m1-03）找最优。' },
      { heading: '梯度下降拧旋钮', body: '把 MSE 想成一座以 w、b 为坐标的山：海拔是损失，谷底是最佳直线。训练就是 m1-03 的蒙眼下山：脚感（梯度）告诉我们哪个方向上坡，就朝反方向迈一小步，步长是学习率 η。步子太大：一步跨过谷底，来回震荡甚至越弹越高（发散）；步子太小：磨磨蹭蹭半天走不到底。大部分"模型训不动"的问题，出在这两个旋钮上。' }
    ],
    principle: [
      {
        heading: '模型与均方误差（MSE）',
        body: '线性回归的模型与损失是所有机器学习的"第一对公式"：模型负责从特征算出预测，损失负责给"贴得多近"打分。记住流程"预测 → 求差 → 平方 → 平均"，面试手算 MSE 就是这四步。',
        formula: 'ŷᵢ = w·xᵢ + b，L(w, b) = (1/n) · Σ (yᵢ − ŷᵢ)²',
        formulaNote: '<ul><li><b>xᵢ</b>：第 i 套房的特征（如面积），yᵢ 是真实成交价</li><li><b>ŷᵢ</b>：模型按当前 w、b 给出的预测价</li><li><b>yᵢ − ŷᵢ</b>：单点误差，正=预测偏低，负=预测偏高</li><li><b>平方</b>：正负误差不再抵消，且大误差被放大重罚</li><li><b>(1/n)·Σ</b>：全部样本取平均，损失不随样本量膨胀；L 越小直线越贴数据，训练目标就是 min L</li></ul>'
      },
      {
        heading: '梯度下降更新式',
        body: '对 MSE 求偏导可得干净的梯度公式，代入 m1-03 的更新式 θ ← θ − η·∂L/∂θ 就能迭代。核心记忆点：误差为正（预测偏低）时，梯度会把 w 往大调——方向全自动正确，不需要人工干预。',
        formula: 'w ← w − η · ∂L/∂w，b ← b − η · ∂L/∂b，其中 ∂L/∂w = (2/n) · Σ (ŷᵢ − yᵢ)·xᵢ',
        formulaNote: '<ul><li><b>∂L/∂w</b>：w 拧大一丁点时损失变化多少（对 MSE 展开求导的结果）</li><li><b>(ŷᵢ − yᵢ)·xᵢ</b>：单样本误差 × 该样本特征值——误差越大、x 越大的点，对梯度贡献越大</li><li><b>负号</b>：沿下降最快方向更新（下山）</li><li><b>η 学习率</b>：过大 → 震荡发散、损失变 NaN；过小 → 收敛极慢</li><li><b>∂L/∂b</b> 同理：= (2/n)·Σ(ŷᵢ − yᵢ)，只是不乘 xᵢ</li></ul>'
      },
      {
        heading: '面试考点：为什么是平方损失',
        body: '深挖一层：最小化平方误差等价于"假设噪声服从高斯分布时的最大似然"——点到为止，能说出这句就是加分。面试更常问对比题：MSE 与 MAE（绝对误差均值）怎么选？MSE 处处可导、大误差罚得重，但对离群点敏感（一套天价豪宅能带偏整条线）；MAE 对离群点稳健，但在 0 处不可导。折中方案是 Huber 损失，或先清洗离群点再训练。'
      }
    ],
    animation: {
      title: '拧旋钮拟合房价：看 MSE 与梯度下降联动手',
      html: '<div class="anim-m2-02"><svg class="anim-m2-02-svg" viewBox="0 0 320 180" width="100%" height="180" preserveAspectRatio="xMidYMid meet"><rect x="0" y="0" width="320" height="180" fill="#f8fafc"></rect><g class="anim-m2-02-gpts"><circle cx="45.7" cy="148.5" r="4" fill="#64748b"></circle><circle cx="91.4" cy="121.5" r="4" fill="#64748b"></circle><circle cx="137.1" cy="105" r="4" fill="#64748b"></circle><circle cx="182.9" cy="81" r="4" fill="#64748b"></circle><circle cx="228.6" cy="57" r="4" fill="#64748b"></circle><circle cx="274.3" cy="36" r="4" fill="#64748b"></circle></g><line class="anim-m2-02-line" x1="0" y1="0" x2="0" y2="0" stroke="#0ea5e9" stroke-width="2.5"></line><text x="6" y="14" font-size="10" fill="#94a3b8">价格</text><text x="288" y="174" font-size="10" fill="#94a3b8">面积</text></svg><div class="anim-m2-02-ctrl"><label>w 单价 <input class="anim-m2-02-w" type="range" min="0" max="2.2" step="0.05" value="0.2"> <span class="anim-m2-02-wv">0.20</span></label><label>b 起步价 <input class="anim-m2-02-b" type="range" min="0" max="4" step="0.1" value="2.5"> <span class="anim-m2-02-bv">2.5</span></label><label>η 学习率 <input class="anim-m2-02-lr" type="range" min="0.005" max="0.3" step="0.005" value="0.02"> <span class="anim-m2-02-lrv">0.020</span></label></div><div class="anim-m2-02-btns"><button class="anim-m2-02-step" type="button">沿梯度拧一步</button><button class="anim-m2-02-auto" type="button">跳到谷底附近</button><button class="anim-m2-02-reset" type="button">重置</button></div><div class="anim-m2-02-info"></div></div>',
      css: '.anim-m2-02 { font-size: 13px; }\n.anim-m2-02-svg { border: 1px solid #e2e8f0; border-radius: 8px; display: block; margin-bottom: 8px; }\n.anim-m2-02-line { transition: x1 .2s ease, x2 .2s ease; }\n.anim-m2-02-ctrl { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px; }\n.anim-m2-02-ctrl label { display: inline-flex; align-items: center; gap: 6px; }\n.anim-m2-02-btns { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }\n.anim-m2-02-btns button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m2-02-info { font-family: monospace; font-size: 12px; color: #334155; line-height: 1.6; min-height: 34px; }',
      js: function (root) {
        var pts = [[1, 2.1], [2, 3.9], [3, 5.0], [4, 6.6], [5, 8.2], [6, 9.6]];
        var W = 320, H = 180, XMAX = 7, YMAX = 12;
        var line = root.querySelector('.anim-m2-02-line');
        var wIn = root.querySelector('.anim-m2-02-w');
        var bIn = root.querySelector('.anim-m2-02-b');
        var lrIn = root.querySelector('.anim-m2-02-lr');
        var wv = root.querySelector('.anim-m2-02-wv');
        var bv = root.querySelector('.anim-m2-02-bv');
        var lrv = root.querySelector('.anim-m2-02-lrv');
        var info = root.querySelector('.anim-m2-02-info');
        if (!line || !wIn || !bIn || !lrIn || !info) return;
        function toPix(x, y) { return [x / XMAX * W, H - y / YMAX * H]; }
        function stats() {
          var w = Number(wIn.value), b = Number(bIn.value);
          var mse = 0, gw = 0, gb = 0;
          for (var i = 0; i < pts.length; i++) {
            var e = (w * pts[i][0] + b) - pts[i][1];
            mse += e * e; gw += e * pts[i][0]; gb += e;
          }
          var n = pts.length;
          return { w: w, b: b, mse: mse / n, gw: 2 * gw / n, gb: 2 * gb / n };
        }
        function render() {
          var s = stats();
          var p0 = toPix(0, s.b), p1 = toPix(XMAX, s.w * XMAX + s.b);
          line.setAttribute('x1', p0[0]); line.setAttribute('y1', p0[1]);
          line.setAttribute('x2', p1[0]); line.setAttribute('y2', p1[1]);
          wv.textContent = s.w.toFixed(2);
          bv.textContent = s.b.toFixed(1);
          lrv.textContent = Number(lrIn.value).toFixed(3);
          var hint = s.gw > 0 ? 'w 应调大' : 'w 应调小';
          var warn = (!isFinite(s.mse) || s.mse > 200) ? ' ｜⚠ 损失爆炸：学习率太大，越走越高了！' : '';
          info.innerHTML = 'MSE = <b>' + s.mse.toFixed(2) + '</b> ｜ ∂L/∂w = ' + s.gw.toFixed(2) +
            '（' + hint + '）｜ ∂L/∂b = ' + s.gb.toFixed(2) + warn;
        }
        function step() {
          var s = stats(), lr = Number(lrIn.value);
          wIn.value = Math.max(-2, Math.min(4.4, s.w - lr * s.gw));
          bIn.value = Math.max(-4, Math.min(8, s.b - lr * s.gb));
          render();
        }
        wIn.addEventListener('input', render);
        bIn.addEventListener('input', render);
        lrIn.addEventListener('input', render);
        root.querySelector('.anim-m2-02-step').addEventListener('click', step);
        root.querySelector('.anim-m2-02-auto').addEventListener('click', function () {
          wIn.value = 1.5; bIn.value = 0.55; render();
        });
        root.querySelector('.anim-m2-02-reset').addEventListener('click', function () {
          wIn.value = 0.2; bIn.value = 2.5; render();
        });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '线性回归模型 ŷ = w·x + b 中，b（截距）的含义是：',
        options: ['当特征 x = 0 时模型的预测值', '直线的倾斜程度', '预测值与真实值的平均误差', '学习率'],
        answer: 0,
        explanation: 'b 是 x=0 时的预测值，对应房价类比的"起步价"；描述倾斜程度的是斜率 w（x 每增加 1，预测增加 w）；预测与真实的差距是误差 y−ŷ，不是参数；学习率 η 是训练步长，不属于模型本身。分清 w 与 b 是读懂一切线性模型的第一步。'
      },
      {
        type: 'fill', difficulty: 2,
        question: '把"预测值与真实值之差的平方"对全部样本取平均，得到的损失叫 ____（中文名或英文缩写均可）。',
        accept: ['均方误差', '均方损失', '均方差', 'mse', 'mean squared error'],
        explanation: 'MSE = Mean Squared Error，四步口诀"预测→求差→平方→平均"。平方让正负误差不抵消、大错重罚、处处可导。注意区分：MAE 是取绝对值后平均（对离群点更稳但 0 处不可导）；分类任务用的是交叉熵而不是 MSE。'
      },
      {
        type: 'code', difficulty: 3,
        question: '补全 NumPy 版 MSE 与一步梯度更新（沿负梯度方向）：',
        template: 'import numpy as np\n\ndef mse(y, y_hat):\n    # ① 差的平方, 再对全部样本取平均\n    return np.____((y - y_hat) ** 2)\n\ndef train_step(x, y, w, b, lr):\n    y_hat = w * x + b\n    gw = 2 / len(y) * np.____((y_hat - y) * x)   # ② dL/dw\n    gb = 2 / len(y) * np.____(y_hat - y)         # ③ dL/db\n    w = w - ____ * gw                            # ④ 沿负梯度更新\n    b = b - lr * gb\n    return w, b',
        checks: ['mean', 'lr * gw'],
        solution: 'import numpy as np\n\ndef mse(y, y_hat):\n    return np.mean((y - y_hat) ** 2)\n\ndef train_step(x, y, w, b, lr):\n    y_hat = w * x + b\n    gw = 2 / len(y) * np.mean((y_hat - y) * x)\n    gb = 2 / len(y) * np.mean(y_hat - y)\n    w = w - lr * gw\n    b = b - lr * gb\n    return w, b\n\n# 自检: 跑 100 步后 mse 应持续下降并趋于稳定',
        explanation: '四个空分别是：np.mean（平方误差取平均，MSE 与两个梯度公式里都要对样本平均）；lr * gw（更新式 w ← w − η·∂L/∂w）。常见误区：忘了平方或忘了取平均（损失随样本数膨胀）；更新方向写成 + lr * gw——沿正梯度是上山，损失越训越大。判据：每步之后 MSE 应下降。'
      }
    ],
    relations: {
      prerequisites: ['m1-03', 'm1-04'],
      successors: ['m2-03'],
      confusables: [
        { other: 'm2-03', tip: '线性回归直接输出数值（房价），配平方误差，属回归；逻辑回归输出的是压到 0~1 的概率，配交叉熵，属分类。"逻辑回归"名字里带"回归"是历史误会——它做的是分类。' },
        { other: 'm3-01', tip: '一个神经元 = 一次线性变换 w·x + b 再套激活函数：把激活去掉就是本课的线性回归，换成 sigmoid 就是下一课的逻辑回归。神经网络可看作大量这种单元的组合。' }
      ]
    },
    memory: {
      mnemonic: '预测求差再平方，平均就是 MSE；负梯度小步拧，学习率大要爆炸。',
      selfTest: [
        { q: 'MSE 为什么对误差"平方"而不是直接相加？', a: '三点：正负误差直接相加会抵消（错得离谱也可能显示零误差）；平方放大并重罚大误差；平方函数处处可导、梯度连续，方便梯度下降。代价是对离群点敏感——MAE 更稳健但 0 处不可导，折中是 Huber。' },
        { q: '学习率 0.3 时损失越训越大，最可能的原因和急救措施？', a: '步子太大，每步跨过谷底、在对侧弹得更高（震荡发散）。急救：学习率调小一到两个数量级再训；工程上可用学习率衰减或自适应优化器（见 m3-03）。判据：正常训练 MSE 应单调下降并趋于稳定。' },
        { q: '写出线性回归的更新式，并说明每个符号。', a: 'w ← w − η·∂L/∂w，b ← b − η·∂L/∂b：w、b 是直线参数（单价与起步价），∂L/∂w = (2/n)·Σ(ŷᵢ−yᵢ)·xᵢ 是损失对 w 的梯度（上坡方向），η 是学习率（步长），负号表示下山。误差为正时自动把 w 调大。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：训练线性回归时机器到底在干什么？',
      reference: '机器在"面积—房价"图上反复调整一条直线的斜率和起点，让直线到每个真实成交点的距离平方加起来最小——每一步都朝误差下降最陡的方向拧一点点旋钮。'
    },
  },
  {
    id: 'm2-03',
    title: '逻辑回归',
    oneLiner: '把线性打分压成概率，做"是 / 否"判断',
    estMinutes: 12,
    analogy: {
      title: '信贷审批员的两步决策',
      body: '银行审批贷款分两步。第一步<b>打分</b>：把收入、负债、历史逾期按各自权重加权求和，得出一个风险分——这一步就是一条线性回归式的打分公式。第二步<b>查表</b>：分数太抽象，审批员要向客户报"违约概率"，于是查一张 S 形换算表：分数越高概率越接近 100%，越低越接近 0，中间 0 分恰好对应 50%。<b>逻辑回归（Logistic Regression）</b>= 线性打分 + S 形换算（Sigmoid）+ 按概率做"批 / 拒"决定。'
    },
    intuition: [
      { heading: '线性分数不能直接当概率', body: '打分 z = w·x + b 可以是从负无穷到正无穷的任何数，而概率必须待在 0 到 1 之间。Sigmoid（回看 m1-06 的 S 曲线）负责压数轴：正分压成大于 0.5 的概率，负分压成小于 0.5，0 分恰好 0.5。所以逻辑回归 = 线性回归的打分 + 一道"概率化"工序，输出永远是一个理直气壮的概率。' },
      { heading: '决策边界是一条直线', body: '判决规则通常是"概率超过 0.5 判正类"。而概率恰好 0.5 的位置 ⟺ 打分 z = 0 ⟺ w·x + b = 0——在二维特征图上就是一条<b>直线</b>：线的一侧全判"批"，另一侧全判"拒"。w 决定直线朝向，b 决定直线平移。正因如此，逻辑回归被称为线性分类器；想要弯曲的边界，得手工造特征（如 x₁·x₂）或换其他模型。' },
      { heading: '损失换成交叉熵（面试高频）', body: '分类能不能也用 MSE？能跑，但有两个毛病：① MSE 套上 sigmoid 后损失面坑坑洼洼（非凸），梯度下降容易卡在半山腰；② 更致命的是 sigmoid 两端饱和，MSE 的梯度里带着一个趋于 0 的因子——<b>预测错得越离谱，反而越学不动</b>。交叉熵恰好消掉这个因子：错得越狠、梯度越大、学得越快。这一问是面试的经典"为什么"，原理区给出背诵版。' }
    ],
    principle: [
      {
        heading: '模型：一步打分，一步压概率',
        body: '逻辑回归的两步结构与信贷类比一一对应：先线性加权打分，再用 Sigmoid 换算成概率。看懂这两步，就同时看懂了神经网络的"一个神经元"（见 m3-01）——区别只是网络把很多这样的单元叠在一起。',
        formula: 'z = w·x + b，p = σ(z) = 1 / (1 + e^(−z))',
        formulaNote: '<ul><li><b>x</b>：特征向量（收入、负债、逾期次数…）</li><li><b>w</b>：每个特征的权重，正=推高违约概率，负=降低</li><li><b>b</b>：偏置，整体基线倾向</li><li><b>z</b>：线性打分，范围 (−∞, +∞)，本身不是概率</li><li><b>σ(z)</b>：Sigmoid，把 z 压进 (0, 1)；z=0 → p=0.5，z 越大 p 越接近 1；输出 p 即"是正类（如违约）的概率"</li></ul>'
      },
      {
        heading: '交叉熵损失（二元）',
        body: '交叉熵的直觉是"惩罚说谎"：真实是正类（y=1）而模型只给 p=0.1，罚 −ln(0.1)≈2.3，很疼；给 p=0.9，罚 −ln(0.9)≈0.1，几乎不疼。对它求导会得到一个极简梯度 p − y——预测概率与真实标签的差，错得越大梯度越大，学得越快；预测对了梯度趋于 0，自然停手。',
        formula: 'L = −[ y·ln(p) + (1−y)·ln(1−p) ]，梯度：∂L/∂z = p − y',
        formulaNote: '<ul><li><b>y</b>：真实标签，1=正类、0=负类</li><li><b>y=1 时</b>：只剩 −ln(p)——预测概率 p 越小罚越重</li><li><b>y=0 时</b>：只剩 −ln(1−p)——模型越倾向正类罚越重</li><li><b>p − y</b>：梯度恰好等于"预测概率 − 真实标签"，形式极简、错得越大步子越大</li><li><b>Σ 再 /n</b>：多样本时对每条损失取平均，得到总损失</li></ul>'
      },
      {
        heading: '面试背诵：为什么不用 MSE',
        body: '把两个损失对 sigmoid 求导对比：MSE 的梯度里含 sigmoid 的导数因子 σ′(z)=σ(z)(1−σ(z))，它在 z 很大或很小时趋近 0（饱和区）。预测完全错误（y=1 而 p≈0）恰恰发生在饱和区——于是错得最狠时梯度反而≈0，训练极慢。交叉熵求导时该因子恰好被消掉，梯度干净等于 p−y。背诵版一句话：<b>"MSE 配 sigmoid：非凸且错得越狠梯度越小；交叉熵：凸且梯度恰为 p−y。"</b>',
        formula: 'MSE 梯度 ∝ (p − y)·σ′(z)，其中 σ′(z) = σ(z)·(1 − σ(z)) → 饱和区趋近 0',
        formulaNote: '<ul><li><b>σ′(z)</b>：sigmoid 的导数，两端（z 很大/很小）都趋近 0，只在 z=0 附近最大（0.25）</li><li><b>(p − y)·σ′(z)</b>：MSE 的梯度被 σ′ 缩水——错得越离谱（越饱和）梯度越小，学不动</li><li><b>非凸</b>：MSE 套 sigmoid 后损失面有多个坑，梯度下降可能卡在坏解；交叉熵对线性模型是凸函数，只有一个谷底</li><li><b>结论</b>：分类用交叉熵 = 凸 + 梯度不消失，两大理由缺一不可</li></ul>'
      }
    ],
    animation: {
      title: 'S 弯换算台：分数 → 概率 → 判决',
      html: '<div class="anim-m2-03"><svg class="anim-m2-03-svg" viewBox="0 0 320 170" width="100%" height="170" preserveAspectRatio="xMidYMid meet"><rect x="0" y="0" width="320" height="170" fill="#f8fafc"></rect><line x1="10" y1="15" x2="10" y2="155" stroke="#cbd5e1"></line><line x1="10" y1="155" x2="310" y2="155" stroke="#cbd5e1"></line><text x="14" y="26" font-size="10" fill="#94a3b8">p=1</text><text x="14" y="152" font-size="10" fill="#94a3b8">p=0</text><polyline class="anim-m2-03-curve" points="" fill="none" stroke="#0ea5e9" stroke-width="2.5"></polyline><g class="anim-m2-03-tl"><line x1="10" y1="85" x2="310" y2="85" stroke="#f59e0b" stroke-dasharray="5 4"></line><text x="284" y="81" font-size="10" fill="#d97706">阈值线</text></g><g class="anim-m2-03-dot"><circle cx="0" cy="0" r="6" fill="#0ea5e9" stroke="#fff" stroke-width="2"></circle></g><text x="150" y="167" font-size="10" fill="#94a3b8">线性打分 z（左负右正）</text></svg><div class="anim-m2-03-ctrl"><label>打分 z <input class="anim-m2-03-z" type="range" min="-6" max="6" step="0.1" value="1.5"> <span class="anim-m2-03-zv">1.5</span></label><label>审批阈值 <input class="anim-m2-03-t" type="range" min="0.05" max="0.95" step="0.05" value="0.5"> <span class="anim-m2-03-tv">0.50</span></label></div><div class="anim-m2-03-info"></div><div class="anim-m2-03-verdict"></div></div>',
      css: '.anim-m2-03 { font-size: 13px; }\n.anim-m2-03-svg { border: 1px solid #e2e8f0; border-radius: 8px; display: block; margin-bottom: 8px; }\n.anim-m2-03-dot { transition: transform .25s ease; }\n.anim-m2-03-tl { transition: transform .25s ease; }\n.anim-m2-03-ctrl { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px; }\n.anim-m2-03-ctrl label { display: inline-flex; align-items: center; gap: 6px; }\n.anim-m2-03-info { font-family: monospace; font-size: 12px; color: #334155; margin-bottom: 6px; }\n.anim-m2-03-verdict { font-weight: 600; padding: 6px 10px; border-radius: 6px; background: #f1f5f9; transition: background .3s ease, color .3s ease; }',
      js: function (root) {
        var svg = root.querySelector('.anim-m2-03-svg');
        var curve = root.querySelector('.anim-m2-03-curve');
        var dot = root.querySelector('.anim-m2-03-dot');
        var tl = root.querySelector('.anim-m2-03-tl');
        var zIn = root.querySelector('.anim-m2-03-z');
        var tIn = root.querySelector('.anim-m2-03-t');
        var zv = root.querySelector('.anim-m2-03-zv');
        var tv = root.querySelector('.anim-m2-03-tv');
        var info = root.querySelector('.anim-m2-03-info');
        var verdict = root.querySelector('.anim-m2-03-verdict');
        if (!curve || !dot || !tl || !zIn || !tIn || !info || !verdict) return;
        function sig(z) { return 1 / (1 + Math.exp(-z)); }
        function zx(z) { return 10 + (z + 6) / 12 * 300; }
        function py(p) { return 155 - p * 140; }
        (function buildCurve() {
          var pts = [];
          for (var z = -6; z <= 6.001; z += 0.25) pts.push(zx(z).toFixed(1) + ',' + py(sig(z)).toFixed(1));
          curve.setAttribute('points', pts.join(' '));
        })();
        function render() {
          var z = Number(zIn.value), t = Number(tIn.value), p = sig(z);
          dot.style.transform = 'translate(' + zx(z).toFixed(1) + 'px,' + py(p).toFixed(1) + 'px)';
          tl.style.transform = 'translateY(' + (py(t) - 85).toFixed(1) + 'px)';
          zv.textContent = z.toFixed(1);
          tv.textContent = t.toFixed(2);
          info.textContent = 'p = σ(' + z.toFixed(1) + ') = 1/(1+e^−' + z.toFixed(1) + ') = ' + p.toFixed(2);
          if (p >= t) {
            verdict.textContent = 'p ' + p.toFixed(2) + ' ≥ 阈值 ' + t.toFixed(2) + ' → 批准（判为正类）';
            verdict.style.background = '#dcfce7'; verdict.style.color = '#166534';
          } else {
            verdict.textContent = 'p ' + p.toFixed(2) + ' < 阈值 ' + t.toFixed(2) + ' → 拒绝（判为负类）';
            verdict.style.background = '#fee2e2'; verdict.style.color = '#991b1b';
          }
        }
        zIn.addEventListener('input', render);
        tIn.addEventListener('input', render);
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '逻辑回归对某样本输出 0.87，这个数的含义是：',
        options: ['样本属于正类的概率约为 87%', '模型在测试集上的准确率是 87%', '样本到决策边界的距离是 0.87', '损失函数的当前值是 0.87'],
        answer: 0,
        explanation: 'sigmoid 输出就是概率：0.87 表示"87% 把握是正类"，通常再与阈值（默认 0.5）比较下判决。准确率要在整个测试集上统计对错才能算；到边界的距离是 SVM 的语言（间隔）；损失值是针对"一条样本的标签"算的惩罚，不是模型输出。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '逻辑回归虽然名字带"回归"，但它解决的是分类问题；在二维特征平面上，它的决策边界是一条直线。',
        answer: true,
        explanation: '名字源于历史上"对线性回归的结果套 sigmoid"的称谓，实际用于分类（输出概率 + 阈值判决）。p=0.5 ⟺ z=0 ⟺ w·x+b=0，是线性方程，几何上确为直线/超平面，所以它是线性分类器——要弯曲边界需手工造交叉特征或换树/核方法。"名字带回归却是分类器"是面试第一坑。'
      },
      {
        type: 'fill', difficulty: 3,
        question: '分类任务中，逻辑回归配套的损失函数是 ____ 损失（填中文名），而线性回归配套的是均方误差。',
        accept: ['交叉熵', '交叉熵损失', '对数损失', 'log loss', '二元交叉熵'],
        explanation: '交叉熵在错得越狠时惩罚越大、梯度恰为 p−y，且损失面是凸的；MSE 配 sigmoid 会非凸且饱和区梯度消失（错得越狠越学不动）。"分类配交叉熵、回归配平方误差"这组搭配是面试高频题，答反很伤。'
      }
    ],
    relations: {
      prerequisites: ['m2-02', 'm1-06'],
      successors: ['m2-05', 'm2-06', 'm3-01'],
      confusables: [
        { other: 'm2-02', tip: '线性回归输出连续数值（配 MSE，做回归）；逻辑回归 = 线性打分套 sigmoid 输出概率（配交叉熵，做分类）。别被"回归"字面骗了——这是面试第一坑。' },
        { other: 'm2-06', tip: '逻辑回归默认按 0.5 阈值下判决，但阈值是可调的业务旋钮：调低 → 报得多、精确率降召回升；调高 → 反之。判决之后怎么算账，正是 m2-06 评估指标的内容。' }
      ]
    },
    memory: {
      mnemonic: '先打分，再压弯，概率过线就判决；分类交叉熵，MSE 错狠了学不动。',
      selfTest: [
        { q: '为什么逻辑回归的决策边界是直线（超平面）？', a: '判决只看 σ(w·x+b) 是否超过 0.5，而 σ(z)=0.5 ⟺ z=0 ⟺ w·x+b=0。w·x+b=0 是线性方程，几何上就是直线/平面；改 w 只转动边界、改 b 只平移边界，形状永远是直的。' },
        { q: '面试背诵：分类为什么用交叉熵而不用 MSE？', a: '两点：① MSE 套 sigmoid 后损失面非凸，易陷坏解；交叉熵对线性模型是凸的。② MSE 梯度含 σ′(z)=σ(1−σ) 因子，sigmoid 饱和区（错得最狠时）梯度趋 0、学不动；交叉熵梯度恰为 p−y，误差越大梯度越大。一句话：凸 + 梯度不消失。' },
        { q: '把审批阈值从 0.5 调到 0.3，精确率和召回率怎么变？', a: '阈值降低 → 更多样本被判为正类 → 召回率上升（漏掉的更少）、精确率下降（误报混入更多）。这是业务旋钮：宁可错抓调低、宁可漏抓调高，具体账怎么算见 m2-06。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：逻辑回归是怎么做"是 / 否"判断的？',
      reference: '先把各种因素加权打一个总分，再用一条 S 形曲线把总分换算成 0 到 100% 的把握，超过五成判"是"、不到五成判"否"——像审批员打分后查换算表再决定批不批贷款。'
    },
  },
  {
    id: 'm2-04',
    title: '决策树与集成学习',
    oneLiner: '一棵树像玩二十个问题不断提问切分，一片森林靠群体投票更可靠',
    estMinutes: 14,
    analogy: {
      title: '二十个问题猜动物',
      body: '你心里想一个动物，我来猜。聪明的问法不是上来就喊"是猎豹吗"，而是问"它比狗大吗？""它生活在水里吗？"——每个问题都把剩余可能一刀切成两半，几问之内锁定答案，这就是著名的二十个问题游戏。<b>决策树（Decision Tree）</b>就是这样一棵"问题树"：每个节点挑一个最划算的问题，顺着回答往下走，走到叶子给出结论。<b>集成学习（Ensemble Learning）</b>则是多请几位猜题高手：要么各自独立猜完投票（随机森林），要么后一位专补前一位猜错的漏洞（Boosting）。'
    },
    intuition: [
      { heading: '什么叫"最划算的问题"', body: '好问题的标准只有一个：问完之后，剩下的人群更"纯"。候选动物里猫狗对半开时，问"是猫吗"等于白问；问"有没有胡须"可能一下把两类分开。训练决策树时，每个特征都被变成候选问题（"年龄大于 30 吗？""收入大于 1 万吗？"），逐个试切一遍，谁切完两边最纯就选谁当节点——就像游戏里专挑"最能排除一半可能"的问题问。' },
      { heading: '树不能问到底：过拟合与剪枝', body: '若一直问下去，每个叶子只剩一个训练样本——训练集 100% 正确，但这等于把每个老顾客的答案背了下来，来个新人就不会举一反三，这就是过拟合（Overfitting，详见 m3-04）。对策是剪枝（Pruning）：预剪枝 = 提前刹车，限制树深、规定叶子最少样本数；后剪枝 = 先长满再回头砍掉"增益小到没意义"的分支，好比文章写完再删废话。' },
      { heading: '一棵树不稳，一群树来凑', body: '单棵决策树很"敏感"：数据稍微一变，长出的树形状就大变。随机森林（Random Forest）用 Bagging 思路：对训练集做有放回抽样造出多份略有差异的数据，每棵树还被限制只能随机看一部分特征，最后所有树投票——个体犯的傻在群体投票里被抵消。Boosting（XGBoost、LightGBM 的思想源头）则是串联补弱：先训一棵弱树，看它错在哪些样本上，下一棵专攻这些错题，一棵接一棵把短板补齐。' }
    ],
    principle: [
      {
        heading: '信息熵：给"乱度"定一个数',
        body: '决策树把"纯不纯"量化成信息熵（Entropy）：类别越均匀熵越大，全部同类熵为 0。经典例题：14 个水果里 9 甜 5 酸，熵约 0.94，接近对半开的上限 1——够乱，值得一问。挑问题就是在挑"切完熵最小"的那个。',
        formula: 'H(X) = −Σ pᵢ·log₂pᵢ',
        formulaNote: '<ul><li><b>pᵢ</b>：第 i 个类别占的比例（如 9/14、5/14）</li><li><b>log₂</b>：以 2 为底，熵的单位是比特</li><li><b>−Σ</b>：对各类别的 p·log₂p 求和再取负（p·log₂p 本身是负数，结果才是正的）</li><li><b>两个极端</b>：对半开 0.5/0.5 时 H=1（最乱）；全部同类 H=0（最纯）</li><li><b>用途</b>：熵就是"还剩多少不确定性"，树想用最少的问题把它降到 0</li></ul>'
      },
      {
        heading: '信息增益：哪个问题最值',
        body: '一个问题值不值，看它能让熵掉多少：增益 = 父集熵 − 切分后的加权平均熵。增益最大的问题当选节点——"越问越接近答案"这句话，在数学上就是"每步挑增益最大的问题"。注意增益要看"当前还剩谁"：在根节点没用的特征，切过几刀后可能变成关键一问。',
        formula: '增益 = H(父) − (n左/n)·H(左) − (n右/n)·H(右)',
        formulaNote: '<ul><li><b>H(父)</b>：问之前当前数据的熵</li><li><b>n左 / n右</b>：答"是 / 否"分别落进左右两边的样本数，n 为总数</li><li><b>(n左/n)·H(左)</b>：左边按占比加权——人多的一边话语权大</li><li><b>增益</b>：这一问平均消灭多少不确定性；为 0 说明问了白问</li><li><b>递归</b>：每个子节点重复"算增益 → 选最大 → 切分"，直到切纯或触发停止条件</li></ul>'
      },
      {
        heading: '面试考点：Bagging vs Boosting',
        body: '两者对比是集成学习的必考题，背这句：<b>Bagging 并行训练多棵独立的树、投票表决，降方差；Boosting 串行训练、每棵专修上一棵的错题、加权求和，降偏差。</b>另两个常见追问：① 工程上常用基尼系数（Gini）替代熵，趋势一致、少算一次对数；② 决策树对特征量纲不敏感——只比较大小、不做加减，一般不用归一化（展开见 m2-07）。'
      }
    ],
    animation: {
      title: '选问句切水果：看熵与增益怎么挑问题',
      html: '<div class="anim-m2-04"><div class="anim-m2-04-top">当前组熵 H = <b class="anim-m2-04-hval">1.00</b><span class="anim-m2-04-hint">熵：0 = 全纯，1 = 对半开；决策树专挑"切完熵最小"的问题</span></div><div class="anim-m2-04-cur"><div class="anim-m2-04-curhead">当前组：<span class="anim-m2-04-path">全部 8 个水果</span></div><div class="anim-m2-04-chips"></div></div><div class="anim-m2-04-qs"><button class="anim-m2-04-q" type="button" data-f="0">颜色 = 红？</button><button class="anim-m2-04-q" type="button" data-f="1">形状 = 圆？</button><button class="anim-m2-04-q" type="button" data-f="2">大小 = 大？</button><span class="anim-m2-04-qn"></span></div><div class="anim-m2-04-split"></div><ul class="anim-m2-04-log"></ul><div class="anim-m2-04-btns"><button class="anim-m2-04-reset" type="button">重新开始</button></div></div>',
      css: '.anim-m2-04 { font-size: 13px; }\n.anim-m2-04-top { margin-bottom: 6px; color: #334155; }\n.anim-m2-04-hint { color: #94a3b8; font-size: 12px; margin-left: 6px; }\n.anim-m2-04-cur { border: 1px dashed #cbd5e1; border-radius: 8px; padding: 8px; margin-bottom: 8px; }\n.anim-m2-04-curhead { color: #475569; margin-bottom: 6px; }\n.anim-m2-04-chips { display: flex; flex-wrap: wrap; gap: 6px; }\n.anim-m2-04-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-size: 12px; animation: anim-m2-04-in .35s ease; }\n.anim-m2-04-red { background: #fee2e2; color: #7f1d1d; }\n.anim-m2-04-yel { background: #fef3c7; color: #78350f; }\n.anim-m2-04-tg { background: #dcfce7; color: #166534; border-radius: 4px; padding: 0 4px; font-style: normal; }\n.anim-m2-04-ta { background: #fecaca; color: #991b1b; border-radius: 4px; padding: 0 4px; font-style: normal; }\n@keyframes anim-m2-04-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n.anim-m2-04-qs { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 8px; }\n.anim-m2-04-q { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 999px; background: #fff; cursor: pointer; transition: border-color .25s ease, background .25s ease; }\n.anim-m2-04-q:hover { border-color: #0ea5e9; }\n.anim-m2-04-qn { color: #475569; width: 100%; font-size: 12px; }\n.anim-m2-04-split { display: flex; gap: 8px; margin-bottom: 8px; }\n.anim-m2-04-box { flex: 1; border-radius: 8px; padding: 6px 8px; min-height: 40px; animation: anim-m2-04-in .4s ease; }\n.anim-m2-04-bl { background: #eff6ff; }\n.anim-m2-04-br { background: #f8fafc; border: 1px solid #e2e8f0; }\n.anim-m2-04-box em { font-style: normal; font-size: 12px; color: #475569; display: block; margin-bottom: 4px; }\n.anim-m2-04-box div { display: flex; flex-wrap: wrap; gap: 4px; }\n.anim-m2-04-log { list-style: none; padding: 0; margin: 0 0 8px; color: #334155; font-size: 12px; line-height: 1.7; }\n.anim-m2-04-btns button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }',
      js: function (root) {
        var DATA = [
          { c: '红', s: '圆', z: '大', t: '甜' },
          { c: '红', s: '圆', z: '小', t: '甜' },
          { c: '红', s: '长', z: '大', t: '甜' },
          { c: '红', s: '长', z: '小', t: '酸' },
          { c: '黄', s: '圆', z: '大', t: '酸' },
          { c: '黄', s: '圆', z: '小', t: '酸' },
          { c: '黄', s: '长', z: '小', t: '酸' },
          { c: '黄', s: '长', z: '大', t: '甜' }
        ];
        var QS = [
          { q: '颜色 = 红？', key: 'c', yes: '红' },
          { q: '形状 = 圆？', key: 's', yes: '圆' },
          { q: '大小 = 大？', key: 'z', yes: '大' }
        ];
        var hval = root.querySelector('.anim-m2-04-hval');
        var pathEl = root.querySelector('.anim-m2-04-path');
        var chipsEl = root.querySelector('.anim-m2-04-chips');
        var qnEl = root.querySelector('.anim-m2-04-qn');
        var splitEl = root.querySelector('.anim-m2-04-split');
        var logEl = root.querySelector('.anim-m2-04-log');
        var qBtns = root.querySelectorAll('.anim-m2-04-q');
        if (!hval || !chipsEl || !splitEl || !logEl || !qnEl) return;
        var queue, cur, logs;
        function ent(idxs) {
          var n = idxs.length, p = 0;
          if (!n) return 0;
          for (var i = 0; i < n; i++) if (DATA[idxs[i]].t === '甜') p++;
          p /= n;
          if (p <= 0 || p >= 1) return 0;
          return -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
        }
        function splitBy(idxs, f) {
          var L = [], R = [];
          for (var i = 0; i < idxs.length; i++) {
            if (DATA[idxs[i]][QS[f].key] === QS[f].yes) L.push(idxs[i]); else R.push(idxs[i]);
          }
          return [L, R];
        }
        function gain(idxs, f) {
          var s = splitBy(idxs, f), n = idxs.length;
          return ent(idxs) - (s[0].length / n) * ent(s[0]) - (s[1].length / n) * ent(s[1]);
        }
        function chipHtml(i) {
          var d = DATA[i];
          return '<span class="anim-m2-04-chip ' + (d.c === '红' ? 'anim-m2-04-red' : 'anim-m2-04-yel') + '">' + d.c + d.s + d.z + '<i class="' + (d.t === '甜' ? 'anim-m2-04-tg' : 'anim-m2-04-ta') + '">' + d.t + '</i></span>';
        }
        function render() {
          if (cur) {
            chipsEl.innerHTML = cur.idxs.map(chipHtml).join('');
            hval.textContent = ent(cur.idxs).toFixed(2);
            pathEl.textContent = cur.desc;
            var parts = [];
            for (var f = 0; f < 3; f++) parts.push(QS[f].q + ' 增益 ' + gain(cur.idxs, f).toFixed(2));
            qnEl.textContent = '各问句增益 → ' + parts.join(' ｜ ') + '（挑最大的问）';
          } else {
            chipsEl.innerHTML = '';
            hval.textContent = '0.00（全部切纯）';
            pathEl.textContent = '没有混杂的组了';
            qnEl.textContent = '完成！回看日志：越问越接近答案；但问到底就是背答案（过拟合），工程上要剪枝。';
          }
        }
        function ask(f) {
          if (!cur) return;
          var s = splitBy(cur.idxs, f), g = gain(cur.idxs, f);
          logs.push('<li>在「' + cur.desc + '」上问 <b>' + QS[f].q + '</b>：增益 ' + g.toFixed(2) +
            (g < 0.005 ? '（增益为 0，白问——问题的价值要看"当前还剩谁"）' : '') +
            ' → 左 ' + s[0].length + ' 个（H=' + ent(s[0]).toFixed(2) + '），右 ' + s[1].length + ' 个（H=' + ent(s[1]).toFixed(2) + '）</li>');
          logEl.innerHTML = logs.join('');
          splitEl.innerHTML =
            '<div class="anim-m2-04-box anim-m2-04-bl"><em>答"是"（' + s[0].length + ' 个，H=' + ent(s[0]).toFixed(2) + '）</em><div>' + s[0].map(chipHtml).join('') + '</div></div>' +
            '<div class="anim-m2-04-box anim-m2-04-br"><em>答"否"（' + s[1].length + ' 个，H=' + ent(s[1]).toFixed(2) + '）</em><div>' + s[1].map(chipHtml).join('') + '</div></div>';
          var mixed = [];
          for (var k = 0; k < 2; k++) {
            if (ent(s[k]) > 0.001) mixed.push({ idxs: s[k], desc: cur.desc + ' → ' + QS[f].q.replace('？', '') + (k === 0 ? '：是' : '：否') });
          }
          queue = mixed.concat(queue);
          cur = queue.length ? queue.shift() : null;
          render();
        }
        function reset() {
          queue = []; logs = [];
          logEl.innerHTML = ''; splitEl.innerHTML = '';
          cur = { idxs: [0, 1, 2, 3, 4, 5, 6, 7], desc: '全部 8 个水果' };
          render();
        }
        for (var i = 0; i < qBtns.length; i++) {
          (function (b) {
            b.addEventListener('click', function () { ask(Number(b.getAttribute('data-f'))); });
          })(qBtns[i]);
        }
        root.querySelector('.anim-m2-04-reset').addEventListener('click', reset);
        reset();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '二分类训练集处于下面哪种状态时，信息熵最大？',
        options: ['正类与负类各占一半', '全部样本都是同一类', '正类占 90%，负类占 10%', '正类占 70%，负类占 30%'],
        answer: 0,
        explanation: '熵衡量"乱度"，对半开时最无法预测，二元情形取最大值 1 比特；全部同类 H=0；9:1 时 H≈0.47、7:3 时 H≈0.88，都比对半开"纯"。面试要点：熵越大越乱，决策树挑问题就是挑"切完加权熵最小、增益最大"的那个，这是节点生长的唯一准则。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '随机森林里的每棵树都使用完全相同的训练集和全部特征独立训练，因此树与树互不相同、投票才能降低方差。',
        answer: false,
        explanation: '前半句正是错误所在：Bagging 的灵魂是"不同"——对训练集做有放回抽样（Bootstrap），且每个节点只在随机抽取的部分特征里挑最优；若每棵树看的数据和特征完全一样，长出的树几乎相同，投票等于一人多票，方差一点不降。面试必考句："随机森林的随机 = 数据随机 + 特征随机，两样缺一不可。"'
      },
      {
        type: 'order', difficulty: 3,
        question: '把决策树（信息增益版）生长一个节点的步骤排成正确顺序：',
        items: ['按该问题把数据切到左右两个子节点', '计算当前数据集的信息熵', '子节点若仍混杂就回到第一步递归生长', '对每种候选切分，算切分后的加权平均熵', '选信息增益（父熵 − 加权子熵）最大的问题当节点'],
        answer: [1, 3, 4, 0, 2],
        explanation: '正确次序：先算当前熵（下标 1）→ 给每种候选切分算加权熵（下标 3）→ 挑增益最大者当节点（下标 4）→ 执行切分（下标 0）→ 子节点仍混杂则递归（下标 2）。常见错序是先切分再算熵——不先算增益就无法挑问题；面试考点是"增益 = 父熵 − 加权子熵"这一步比较发生在切分之前。'
      }
    ],
    relations: {
      prerequisites: ['m2-01'],
      successors: [],
      confusables: [
        { other: 'm2-05', tip: '决策树的边界是横平竖直的"矩形切分"（每次只问一个特征），SVM 找的是一条整体的线性边界；前者像逐层问问题逐步逼近，后者像一步画一条最宽的分界马路。' },
        { other: 'm3-04', tip: '剪枝就是决策树自己的正则化：限制深度、叶子最少样本数（预剪枝）或长满再砍（后剪枝），目的与 L2、Dropout 一样，都是压制过拟合。' }
      ]
    },
    memory: {
      mnemonic: '越问越纯才增益，问到底会背答案；森林投票降方差，串串补错降偏差。',
      selfTest: [
        { q: '随机森林的"两个随机"是什么？各起什么作用？', a: '数据随机（Bootstrap 有放回抽样）+ 特征随机（每个节点只在随机子集里挑最优）。两者让树与树之间差异大、相关性低，投票/平均才能有效抵消个体波动、降低方差；若树都长一样，集成就退化为复制粘贴，毫无收益。' },
        { q: 'Bagging 和 Boosting 的区别一句话背诵版？', a: 'Bagging 并行训练多棵独立的树、投票表决，降方差（随机森林）；Boosting 串行训练、每棵专修上一棵的错题、加权求和，降偏差（AdaBoost/XGBoost/LightGBM）。前者治"不稳定"，后者治"学不动"。' },
        { q: '增益为 0 的问题还值得当节点吗？为什么同一个问题在不同深度价值不同？', a: '增益为 0 说明切完两边熵没降（如对半开的两类按无关特征切），白问，不该选。信息增益取决于"当前组还剩谁"：在根节点无用的特征，切几刀后可能完美分开剩余样本——所以决策树是逐层贪心，每个节点都在当前处境下重新挑最值的问题。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：随机森林为什么比单棵决策树更靠谱？',
      reference: '一棵树容易因为数据里的小波动就长歪，随机森林请来几百棵"各自只看过一部分数据、只被允许用一部分特征"的树，最后大家投票——单个人的偏见在群体投票里被抵消掉了。'
    }
  },
  {
    id: 'm2-05',
    title: '支持向量机 SVM',
    oneLiner: '在两堆点之间修最宽的马路：最大间隔、支持向量与核技巧',
    estMinutes: 12,
    analogy: {
      title: '两村之间修马路',
      body: '红村和蓝村的地界犬牙交错，要修一条笔直的马路把两村彻底隔开。方案有无数种：路可以紧贴红村，也可以紧贴蓝村——但贴着哪村，哪村多盖一间房就被压到路对面去了。<b>支持向量机（Support Vector Machine, SVM）</b>的答案：把路修在正中间，让两侧路肩到最近房子的距离（间隔 Margin）最大。而真正决定马路位置的，只有贴着路肩的那几栋房子——它们叫<b>支持向量（Support Vectors）</b>，其余房子就算全部拆掉，马路也纹丝不动。'
    },
    intuition: [
      { heading: '为什么要"最宽"：宽马路抗扰动', body: '逻辑回归只求分对，边界可以贴着某一类；SVM 额外要求边界离最近的正、负样本都尽量远。离得远，意味着新样本（两村新盖的房）即使位置有点抖动也不容易被划错村——间隔就是缓冲带，缓冲带越宽泛化通常越好。这和 m2-03 的直线边界不冲突：两者都是线性分类器，差别在"目标"——一个最大化概率似然，一个最大化几何间隔。' },
      { heading: '支持向量：少数点说了算', body: '训练完成后你会发现：决定 w 和 b 的只是贴着路肩的两三个点。把远处的样本全删掉重新训练，得到的马路一模一样——这就是"SVM 的解只由支持向量决定"，面试最爱问的冷知识。几何工具是 m1-01 的向量与内积：点到直线 w·x + b = 0 的距离等于 |w·x + b| / ||w||，间隔就是从两侧最近点各量一次。' },
      { heading: '核技巧：揉面团升维后一刀切', body: '若两堆点一个圈套一个圈、一条直线永远切不开怎么办？像揉面团一样把整张平面按某个规则抬起来（比如按"到中心的距离"抬高），低维缠在一起的点在高维可能一下分层，再切一刀即可。妙处在于：核函数（Kernel）不用真的计算高维坐标，直接在低维算出"高维内积"，计算量几乎不涨。此外还有软间隔（Soft Margin）：允许极少数噪声点越界，用超参数 C 控制分对与路宽的权衡。' }
    ],
    principle: [
      {
        heading: '最大间隔：写成优化问题',
        body: '把"修最宽的路"翻译成数学：找法向量 w 和偏置 b，让所有样本不仅分对，而且离边界至少留出一个"路肩"宽度；最大化间隔等价于最小化 ||w||。这是一个凸优化问题——损失面只有一个谷底，求到的必是全局最优，这与神经网络的多坑损失面形成鲜明对比（见 m3-02、m3-03）。',
        formula: '间隔 γ = 2 / ||w||，目标：min (1/2)·||w||²，约束：yᵢ·(w·xᵢ + b) ≥ 1',
        formulaNote: '<ul><li><b>w</b>：分界超平面的法向量，决定马路朝向；b 决定平移位置</li><li><b>||w||</b>：向量 w 的长度（模长），m1-01 的内容</li><li><b>yᵢ</b>：标签，正类记 +1、负类记 −1（不是 0/1，方便乘进不等式）</li><li><b>yᵢ·(w·xᵢ + b) ≥ 1</b>：每个样本不仅要分对，还得离边界至少一个路肩宽</li><li><b>为什么 min ||w||²</b>：两条路肩 w·x+b=±1 之间的距离恰为 2/||w||，间隔最大 ⟺ ||w|| 最小；平方更好求导</li></ul>'
      },
      {
        heading: '支持向量与软间隔 C',
        body: '上述约束对大多数样本是"松弛"的（离路肩远），只在支持向量处取等号——求解后只有它们对应的系数非零，删掉其他样本解不变。现实数据总有噪声，硬要全部分对会让间隔被离群点挤得极窄，于是允许少数点违约（越过路肩甚至跨过马路），违约程度 ξᵢ 记入总账、按 C 加权惩罚：C 大几乎不容错、容易过拟合；C 小宽容错、边界更平滑但可能欠拟合。',
        formula: 'min (1/2)·||w||² + C·Σξᵢ，约束：yᵢ·(w·xᵢ + b) ≥ 1 − ξᵢ，ξᵢ ≥ 0',
        formulaNote: '<ul><li><b>ξᵢ</b>：第 i 个样本的"违约量"，0 = 守规矩，越大错得越离谱</li><li><b>C</b>：给违约定的价——面试金句"C 大易过拟合，C 小易欠拟合"</li><li><b>Σξᵢ</b>：把所有违约加总，乘 C 后并入目标一起最小化</li><li><b>取舍</b>：数据噪声大、离群点多时把 C 调小，宁可边界粗一点也要宽马路</li></ul>'
      },
      {
        heading: '核技巧与常用核',
        body: '推导会发现 w 只以"样本两两内积"的形式出现，于是可以把内积整体替换成核函数 K(x, z)——它等于把 x、z 各自映射到高维后的内积，却完全不需要去高维算坐标。选型经验：特征多、样本不大时线性核就够（等价于不升维）；数据没有明显线性关系时，径向基核（RBF）是默认首选。这些"怎么选"的问题，面试常作为开放追问。',
        formula: 'K(x, z) = φ(x)·φ(z)，常用 RBF 核：K(x, z) = e^(−γ·||x−z||²)',
        formulaNote: '<ul><li><b>φ</b>：升维映射（如把 x 变成 x, x², x·y…），直觉就是"揉面团抬高"</li><li><b>K(x,z)</b>：直接在低维算出的"高维内积"，免去显式 φ 的计算与存储——核技巧省算力的关键</li><li><b>RBF 核</b>：样本越近 K 越大，相当于映射到无穷维空间，应用最广</li><li><b>γ</b>：控制"多近才算近"，γ 太大只盯着个别点、容易过拟合</li></ul>'
      }
    ],
    animation: {
      title: '修马路与揉面团：最大间隔 + 核技巧升维',
      html: '<div class="anim-m2-05"><div class="anim-m2-05-tabs"><button class="anim-m2-05-tab anim-m2-05-on" data-view="line" type="button">① 最大间隔：修马路</button><button class="anim-m2-05-tab" data-view="kernel" type="button">② 核技巧：揉面团升维</button></div><svg class="anim-m2-05-svg" viewBox="0 0 320 180" width="100%" height="180" preserveAspectRatio="xMidYMid meet"><g class="anim-m2-05-lineview"><line class="anim-m2-05-m1" stroke="#cbd5e1" stroke-dasharray="5 4"></line><line class="anim-m2-05-m2" stroke="#cbd5e1" stroke-dasharray="5 4"></line><line class="anim-m2-05-main" stroke="#0ea5e9" stroke-width="2.5"></line><g class="anim-m2-05-pts"><circle class="anim-m2-05-p" cx="215" cy="50" r="5" fill="#dc2626"></circle><circle class="anim-m2-05-p" cx="245" cy="40" r="5" fill="#dc2626"></circle><circle class="anim-m2-05-p" cx="260" cy="70" r="5" fill="#dc2626"></circle><circle class="anim-m2-05-p" cx="235" cy="85" r="5" fill="#dc2626"></circle><circle class="anim-m2-05-p" cx="275" cy="55" r="5" fill="#dc2626"></circle><circle class="anim-m2-05-p" cx="190" cy="78" r="5" fill="#dc2626"></circle><circle class="anim-m2-05-p" cx="60" cy="120" r="5" fill="#2563eb"></circle><circle class="anim-m2-05-p" cx="85" cy="135" r="5" fill="#2563eb"></circle><circle class="anim-m2-05-p" cx="105" cy="115" r="5" fill="#2563eb"></circle><circle class="anim-m2-05-p" cx="70" cy="95" r="5" fill="#2563eb"></circle><circle class="anim-m2-05-p" cx="50" cy="140" r="5" fill="#2563eb"></circle><circle class="anim-m2-05-p" cx="120" cy="112" r="5" fill="#2563eb"></circle></g><text x="252" y="26" font-size="11" fill="#dc2626">红村</text><text x="42" y="166" font-size="11" fill="#1d4ed8">蓝村</text></g><g class="anim-m2-05-kview" style="display:none"><line class="anim-m2-05-cut" x1="10" y1="110" x2="310" y2="110" stroke="#f59e0b" stroke-dasharray="6 4" opacity="0"></line><text class="anim-m2-05-cutlabel" x="228" y="104" font-size="10" fill="#d97706" opacity="0">一刀切开</text><g class="anim-m2-05-kpts"><circle class="anim-m2-05-k" cx="28" cy="150" r="5" fill="#dc2626"></circle><circle class="anim-m2-05-k" cx="61" cy="150" r="5" fill="#dc2626"></circle><circle class="anim-m2-05-k" cx="259" cy="150" r="5" fill="#dc2626"></circle><circle class="anim-m2-05-k" cx="292" cy="150" r="5" fill="#dc2626"></circle><circle class="anim-m2-05-k" cx="105" cy="150" r="5" fill="#2563eb"></circle><circle class="anim-m2-05-k" cx="138" cy="150" r="5" fill="#2563eb"></circle><circle class="anim-m2-05-k" cx="182" cy="150" r="5" fill="#2563eb"></circle><circle class="anim-m2-05-k" cx="215" cy="150" r="5" fill="#2563eb"></circle></g><text class="anim-m2-05-kaxis" x="46" y="172" font-size="10" fill="#94a3b8">一维数轴：找一个切点分不开红蓝</text></g></svg><div class="anim-m2-05-linectrl"><label>马路角度 <input class="anim-m2-05-th" type="range" min="15" max="75" step="1" value="45"> <span class="anim-m2-05-thv">45°</span></label><label>马路位置 <input class="anim-m2-05-d" type="range" min="120" max="240" step="1" value="176"> <span class="anim-m2-05-dv">176</span></label><button class="anim-m2-05-best" type="button">自动修到最宽</button></div><div class="anim-m2-05-kwrap" style="display:none"><button class="anim-m2-05-kbtn" type="button">揉面团：升维 y = x²</button></div><div class="anim-m2-05-info"></div></div>',
      css: '.anim-m2-05 { font-size: 13px; }\n.anim-m2-05-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }\n.anim-m2-05-tab { padding: 5px 14px; border: 1px solid #cbd5e1; border-radius: 999px; background: #fff; cursor: pointer; transition: background .25s ease, border-color .25s ease, color .25s ease; }\n.anim-m2-05-tab.anim-m2-05-on { background: #0ea5e9; border-color: #0ea5e9; color: #fff; }\n.anim-m2-05-svg { border: 1px solid #e2e8f0; border-radius: 8px; display: block; margin-bottom: 8px; }\n.anim-m2-05-linectrl, .anim-m2-05-kwrap { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 8px; }\n.anim-m2-05-linectrl label { display: inline-flex; align-items: center; gap: 6px; }\n.anim-m2-05-linectrl button, .anim-m2-05-kwrap button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m2-05-p { transition: stroke .25s ease, stroke-width .25s ease; }\n.anim-m2-05-p.anim-m2-05-sv { stroke: #f59e0b; stroke-width: 3; }\n.anim-m2-05-k { transition: transform .6s ease; }\n.anim-m2-05-main { transition: all .2s ease; }\n.anim-m2-05-info { font-family: monospace; font-size: 12px; color: #334155; line-height: 1.6; min-height: 36px; }',
      js: function (root) {
        var P = [
          { x: 215, y: 50, c: 1 }, { x: 245, y: 40, c: 1 }, { x: 260, y: 70, c: 1 },
          { x: 235, y: 85, c: 1 }, { x: 275, y: 55, c: 1 }, { x: 190, y: 78, c: 1 },
          { x: 60, y: 120, c: -1 }, { x: 85, y: 135, c: -1 }, { x: 105, y: 115, c: -1 },
          { x: 70, y: 95, c: -1 }, { x: 50, y: 140, c: -1 }, { x: 120, y: 112, c: -1 }
        ];
        var KV = [-6, -4.5, 4.5, 6, -2.5, -1, 1, 2.5];
        var info = root.querySelector('.anim-m2-05-info');
        var lineview = root.querySelector('.anim-m2-05-lineview');
        var kview = root.querySelector('.anim-m2-05-kview');
        var linectrl = root.querySelector('.anim-m2-05-linectrl');
        var kwrap = root.querySelector('.anim-m2-05-kwrap');
        var main = root.querySelector('.anim-m2-05-main');
        var m1 = root.querySelector('.anim-m2-05-m1');
        var m2 = root.querySelector('.anim-m2-05-m2');
        var pts = root.querySelectorAll('.anim-m2-05-p');
        var thIn = root.querySelector('.anim-m2-05-th');
        var dIn = root.querySelector('.anim-m2-05-d');
        var thv = root.querySelector('.anim-m2-05-thv');
        var dv = root.querySelector('.anim-m2-05-dv');
        if (!info || !lineview || !kview || !main || !m1 || !m2 || !pts.length || !thIn || !dIn) return;
        var tabs = root.querySelectorAll('.anim-m2-05-tab');
        for (var t = 0; t < tabs.length; t++) {
          (function (btn) {
            btn.addEventListener('click', function () {
              for (var j = 0; j < tabs.length; j++) tabs[j].classList.remove('anim-m2-05-on');
              btn.classList.add('anim-m2-05-on');
              var isLine = btn.getAttribute('data-view') === 'line';
              lineview.style.display = isLine ? '' : 'none';
              kview.style.display = isLine ? 'none' : '';
              linectrl.style.display = isLine ? '' : 'none';
              kwrap.style.display = isLine ? 'none' : '';
              info.textContent = isLine ? '拖动角度与位置把马路修宽；贴着路肩的黄圈房子就是支持向量。' : '在一维数轴上，红点分居两端、蓝点夹在中间：无论把切点放哪，总有一侧混色。';
            });
          })(tabs[t]);
        }
        function renderLine() {
          var th = Number(thIn.value) * Math.PI / 180;
          var d = Number(dIn.value);
          var nx = Math.cos(th), ny = Math.sin(th);
          thv.textContent = thIn.value + '°';
          dv.textContent = dIn.value;
          var vals = [], bad = false, i, v;
          for (i = 0; i < P.length; i++) {
            v = P[i].x * nx + P[i].y * ny;
            vals.push(Math.abs(v - d));
            if ((P[i].c === 1 && v <= d) || (P[i].c === -1 && v >= d)) bad = true;
          }
          var ex = -ny * 200, ey = nx * 200;
          var cx = nx * d, cy = ny * d;
          main.setAttribute('x1', cx - ex); main.setAttribute('y1', cy - ey);
          main.setAttribute('x2', cx + ex); main.setAttribute('y2', cy + ey);
          for (i = 0; i < pts.length; i++) pts[i].classList.remove('anim-m2-05-sv');
          if (bad) {
            m1.setAttribute('opacity', '0'); m2.setAttribute('opacity', '0');
            info.textContent = '⚠ 有房子被压到马路对面的村子——这条"路"不合法，挪一挪角度或位置。';
            return;
          }
          var m = Math.min.apply(null, vals);
          var o1x = nx * (d - m), o1y = ny * (d - m);
          var o2x = nx * (d + m), o2y = ny * (d + m);
          m1.setAttribute('opacity', '1'); m2.setAttribute('opacity', '1');
          m1.setAttribute('x1', o1x - ex); m1.setAttribute('y1', o1y - ey);
          m1.setAttribute('x2', o1x + ex); m1.setAttribute('y2', o1y + ey);
          m2.setAttribute('x1', o2x - ex); m2.setAttribute('y1', o2y - ey);
          m2.setAttribute('x2', o2x + ex); m2.setAttribute('y2', o2y + ey);
          for (i = 0; i < pts.length; i++) {
            if (vals[i] < m + 0.6) pts[i].classList.add('anim-m2-05-sv');
          }
          info.innerHTML = '间隔宽度 ≈ ' + (2 * m).toFixed(1) + ' 米 ｜ 黄圈 = 支持向量（删掉远处的房子，马路纹丝不动）。点「自动修到最宽」看最大间隔解。';
        }
        thIn.addEventListener('input', renderLine);
        dIn.addEventListener('input', renderLine);
        root.querySelector('.anim-m2-05-best').addEventListener('click', function () {
          thIn.value = 45; dIn.value = 176; renderLine();
        });
        var kbtn = root.querySelector('.anim-m2-05-kbtn');
        var kpts = root.querySelectorAll('.anim-m2-05-k');
        var cut = root.querySelector('.anim-m2-05-cut');
        var cutlabel = root.querySelector('.anim-m2-05-cutlabel');
        var kaxis = root.querySelector('.anim-m2-05-kaxis');
        var lifted = false;
        kbtn.addEventListener('click', function () {
          lifted = !lifted;
          for (var i = 0; i < kpts.length; i++) {
            var dy = lifted ? -KV[i] * KV[i] * 3.2 : 0;
            kpts[i].style.transform = 'translateY(' + dy.toFixed(1) + 'px)';
          }
          cut.setAttribute('opacity', lifted ? '1' : '0');
          cutlabel.setAttribute('opacity', lifted ? '1' : '0');
          kbtn.textContent = lifted ? '揉回平面' : '揉面团：升维 y = x²';
          kaxis.textContent = lifted ? '升维后（纵轴 = 数值的平方）：一条水平线轻松切开' : '一维数轴：找一个切点分不开红蓝';
          info.textContent = lifted ? '低维缠在一起的点，按 y = x² 抬起后红蓝分层——核技巧就是在高维继续找最宽马路，却不必真的计算高维坐标。' : '一维数轴上红点分居两端、蓝点夹在中间：无论把切点放哪，总有一侧混色。';
        });
        renderLine();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'SVM 中"支持向量"指的是：',
        options: ['离分界超平面最近、决定边界位置的少数样本', '所有参与训练的样本', '被分错、需要重点惩罚的样本', '预测时置信度最高的样本'],
        answer: 0,
        explanation: '支持向量是落在间隔边界（路肩）上的少数样本，w 和 b 完全由它们决定，删掉其他样本重新训练，边界不变——这正是"修马路"类比里贴着路肩的那几栋房子。选项 3 描述的是软间隔里可能违约的点，违约点不一定成为支持向量；选项 4 与模型参数无关。这是 SVM 的名字由来，也是面试第一问。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '使用核技巧时，SVM 必须先把样本显式映射到高维空间再训练，因此计算量一定随维度暴增。',
        answer: false,
        explanation: '恰恰相反：核函数（如 RBF 核）直接在原始空间计算"高维内积"K(x,z)=φ(x)·φ(z)，绕开了显式映射 φ，训练只依赖样本间的核值——这正是核技巧省算力的魔法，显式升维反而是它要避免的事。面试常追问"核技巧为什么快"，标准答案："只算内积、不造高维特征。"'
      },
      {
        type: 'single', difficulty: 3,
        question: '数据噪声大、离群点多，训练软间隔 SVM 时更合理的做法是：',
        options: ['把 C 调小，容忍少数点越界，换来更宽的间隔', '把 C 调大，逼模型把每个点都分对', '换成线性核并保持 C 不变', '删掉所有被分错的样本再训练'],
        answer: 0,
        explanation: 'C 是"分对 vs 宽马路"的权衡旋钮：C 大 → 违约惩罚重 → 间隔被离群点挤窄、易过拟合；C 小 → 容忍少数噪声点越界，间隔宽、更抗噪。核函数解决的是"能不能分开"，与容错无关；删错分样本会把最有信息量的边界样本一起删掉。面试一句话："C 大易过拟合，C 小易欠拟合。"'
      }
    ],
    relations: {
      prerequisites: ['m1-01', 'm2-03'],
      successors: [],
      confusables: [
        { other: 'm2-03', tip: '逻辑回归与线性 SVM 都是线性边界，但目标不同：逻辑回归最大化全体样本的对数似然（所有点都出力），SVM 只最大化边界附近的间隔（少数支持向量说了算）；且逻辑回归输出概率，SVM 只给类别与到边界的距离。' },
        { other: 'm1-01', tip: '点到直线的距离、样本间的相似度都靠向量内积：SVM 的间隔公式与核函数 K(x,z)=φ(x)·φ(z) 本质都是在算内积——m1-01 的内积是本课的几何工具。' }
      ]
    },
    memory: {
      mnemonic: '两村中间修宽路，路肩贴着支持向量；直线切不开就揉面升维，软间隔 C 管宽容。',
      selfTest: [
        { q: '为什么删掉非支持向量的样本，SVM 的解完全不变？', a: '优化问题的约束只在支持向量处取等号（yᵢ(w·xᵢ+b)=1），其余样本的约束松弛、对应系数为 0——它们对 w、b 没有任何贡献。所以决定边界的只是贴着路肩的少数点，删掉远处的点再训练，得到的超平面一模一样。' },
        { q: '核技巧解决了什么问题？为什么不需要真的升维？', a: '解决"低维线性不可分"：升维后可能线性可分。训练公式里 w 只以样本两两内积的形式出现，于是整体替换成核函数 K(x,z)=φ(x)·φ(z)——直接在低维算出高维内积，不必显式计算高维坐标，计算量几乎不涨。RBF 核是最常用的默认选择。' },
        { q: 'C 调大、调小分别会发生什么？', a: 'C 大：违约惩罚重，模型尽力把每个点分对，间隔被噪声挤窄、易过拟合；C 小：宽容少数点越界，间隔宽、边界平滑但可能欠拟合。选择依据是数据噪声水平——噪声大、离群点多时调小 C。一句话：C 大易过拟合，C 小易欠拟合。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：SVM 在做什么？',
      reference: '在两堆点中间修一条最宽的马路，离马路最近的几栋房子（支持向量）说了算，谁贴得近马路就听谁的——直线切不开的地方，就把整张平面像面团一样揉起来升个维，再切一刀。'
    }
  },
  {
    id: 'm2-06',
    title: '评估指标',
    oneLiner: '用混淆矩阵四格账本看清：精确率、召回率、F1 与 AUC 各管什么',
    estMinutes: 14,
    analogy: {
      title: '缉私犬的功过簿',
      body: '海关的缉私犬对每个包裹做两件事：吠或不吠。吠了且真是违禁品 = 抓对（TP）；没吠但里面真有违禁品 = 漏放（FN，最危险）；吠了但里面只是主人的老干妈 = 冤枉（FP）；没吠也确实没事 = 正常放行（TN）。这四个格子就是<b>混淆矩阵（Confusion Matrix）</b>。把狗调得敏感些，违禁品几乎跑不掉（召回率高），但冤枉的包裹变多（精确率下降）；调得迟钝些则相反。指标怎么选、账怎么算，就是本课的全部内容。'
    },
    intuition: [
      { heading: '四格账本先摆对', body: '记法只花十秒：第一个字母 T/F 表示"猜对了没"，第二个字母 P/N 表示"模型猜的是哪类"。TP = 报病且真病，FP = 报病其实健康，FN = 没报其实有病，TN = 没报也没病。所有指标都是这四个格子的比例组合——先把四格数对，再谈公式，这是面试手算题不出错的关键。' },
      { heading: '精确率 vs 召回率：枪口与渔网', body: '精确率（Precision）= TP/(TP+FP)，问"报出来的里面有多少真坏人"，管的是枪口准不准；召回率（Recall）= TP/(TP+FN)，问"所有坏人里抓到了多少"，管的是网眼密不密。两者通常一升一降，由判决阈值控制（回扣 m2-03 的 0.5 阈值旋钮）：阈值调低，报得多、召回升、精确降。取舍看业务代价：癌症筛查宁可错查不可漏诊，重召回；垃圾邮件拦截宁可漏掉几封也别把正常邮件扔进垃圾箱，重精确。' },
      { heading: '类别不平衡时，准确率会骗人', body: '若数据 99% 是负类，一个把所有样本都猜成负类的"废物模型"准确率高达 99%，但一个正类都没抓到（召回率 0）。所以不平衡场景要看精确率/召回率、F1 或 AUC。F1 是精确率与召回率的调和平均：只要一边趋近 0，F1 就被拖向 0——它惩罚"偏科"；而算术平均会把 100% 配 0% 平白平均成 50%，明显虚高。' }
    ],
    principle: [
      {
        heading: '从四格到三大指标',
        body: '设 10000 人体检，其中 100 人真实患病；模型报警 200 人，其中 80 人真患病。则 TP=80、FP=120、FN=20、TN=9780：精确率 40%（报警里四成真病）、召回率 80%（病人抓到八成）、准确率 98.6%。注意准确率高达 98.6% 主要靠"健康人太多"撑起来——单看它会漏掉"漏诊 20 人"这个要命的信息。',
        formula: '精确率 P = TP/(TP+FP)，召回率 R = TP/(TP+FN)，准确率 = (TP+TN)/总数',
        formulaNote: '<ul><li><b>TP / FP / FN / TN</b>：抓对 / 冤枉 / 漏放 / 放行四个格子的人数</li><li><b>P 的分母是"报出来的"</b>：衡量报警可信度，低 = 误报多</li><li><b>R 的分母是"全部真阳性"</b>：衡量漏网程度，低 = 漏诊多</li><li><b>准确率</b>：全部猜对的比例，类别平衡时才直观可靠</li><li><b>本例</b>：P=80/200=40%，R=80/100=80%——两者经常差距很大，必须分开汇报</li></ul>'
      },
      {
        heading: 'F1：为什么用调和平均',
        body: 'F1 用调和平均把 P 和 R 绑在一起：调和平均的结果永远被较小值拖住，P=100%、R=0% 时 F1=0，而算术平均会给出虚高的 50%。直觉像两人接力：总成绩由慢的那个人决定，而不是两人速度的平均。若业务更在乎召回，可用加权版 Fβ（β 大于 1 时召回权重更高），面试知道这个名字即可。',
        formula: 'F1 = 2·P·R / (P + R)',
        formulaNote: '<ul><li><b>P、R</b>：精确率与召回率</li><li><b>调和平均</b>：两数都大结果才大，一方趋近 0 整体就趋近 0——不许偏科</li><li><b>对比算术平均</b>：(P+R)/2 在 100% 与 0% 时仍有 50%，掩盖短板</li><li><b>Fβ</b>：召回权重更高的变体，β 越大越偏心召回（F1 即 β=1）</li></ul>'
      },
      {
        heading: 'ROC 与 AUC：与阈值无关的排队能力',
        body: '模型其实给每条样本输出分数，阈值只决定"分数过线算阳性"。把阈值从 1 扫到 0，每个阈值算一对 (FPR, TPR) 画出 ROC 曲线；曲线下面积就是 AUC。它的直觉非常好记：AUC = 随机抽一个正样本和一个负样本，正样本分数排在负样本前面的概率——0.5 等于瞎猜排序，1.0 是完美排序。类别极不平衡时，PR 曲线（精确率-召回率曲线）往往比 ROC 更敏感，这是面试加分点。',
        formula: 'AUC = P( 正样本得分 > 负样本得分 )，TPR = TP/(TP+FN)，FPR = FP/(FP+TN)',
        formulaNote: '<ul><li><b>TPR</b>：真阳性率，就是召回率——病人里抓到多少</li><li><b>FPR</b>：假阳性率——健康人里被误报的比例</li><li><b>扫描阈值</b>：每个阈值给 ROC 一个点，连成曲线，AUC 是曲线下面积</li><li><b>概率解释</b>：AUC 衡量"正负样本的排队能力"，与选哪个阈值无关</li><li><b>参照线</b>：AUC=0.5 是随机瞎猜的对角线，越大越贴近左上角（完美）</li></ul>'
      }
    ],
    animation: {
      title: '拖动阈值：看混淆矩阵与精确率/召回率联动',
      html: '<div class="anim-m2-06"><div class="anim-m2-06-ctrl"><label>判决阈值 <input class="anim-m2-06-t" type="range" min="0.05" max="0.95" step="0.05" value="0.5"> <span class="anim-m2-06-tv">0.50</span></label><button class="anim-m2-06-b1" type="button">筛查模式 0.30</button><button class="anim-m2-06-b2" type="button">默认 0.50</button><button class="anim-m2-06-b3" type="button">严格模式 0.70</button></div><div class="anim-m2-06-row"></div><div class="anim-m2-06-grid"><div class="anim-m2-06-cell anim-m2-06-tp"><i>TP 抓对（病·报病）</i><b class="anim-m2-06-tpv">0</b></div><div class="anim-m2-06-cell anim-m2-06-fn"><i>FN 漏放（病·没报）</i><b class="anim-m2-06-fnv">0</b></div><div class="anim-m2-06-cell anim-m2-06-fp"><i>FP 冤枉（健·报病）</i><b class="anim-m2-06-fpv">0</b></div><div class="anim-m2-06-cell anim-m2-06-tn"><i>TN 放行（健·没报）</i><b class="anim-m2-06-tnv">0</b></div></div><div class="anim-m2-06-metrics"></div><div class="anim-m2-06-note">绿 = 抓对、深红 = 漏放（最危险）、橙 = 冤枉、灰 = 放行。拖动阈值，看精确率与召回率一升一降。</div></div>',
      css: '.anim-m2-06 { font-size: 13px; }\n.anim-m2-06-ctrl { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 8px; }\n.anim-m2-06-ctrl label { display: inline-flex; align-items: center; gap: 6px; }\n.anim-m2-06-ctrl button { padding: 4px 10px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m2-06-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }\n.anim-m2-06-chip { display: inline-flex; flex-direction: column; align-items: center; gap: 1px; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-family: monospace; transition: background .3s ease, color .3s ease; }\n.anim-m2-06-chip b { font-size: 11px; }\n.anim-m2-06-tp { background: #dcfce7; color: #166534; }\n.anim-m2-06-fp { background: #ffedd5; color: #9a3412; }\n.anim-m2-06-fn { background: #fecaca; color: #991b1b; }\n.anim-m2-06-tn { background: #f1f5f9; color: #475569; }\n.anim-m2-06-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; max-width: 360px; margin-bottom: 8px; }\n.anim-m2-06-cell { border-radius: 8px; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; }\n.anim-m2-06-cell i { font-style: normal; font-size: 12px; }\n.anim-m2-06-cell b { font-size: 16px; }\n.anim-m2-06-metrics { font-family: monospace; font-size: 12px; color: #334155; line-height: 1.7; }\n.anim-m2-06-note { color: #64748b; font-size: 12px; margin-top: 4px; }',
      js: function (root) {
        var D = [
          [0.92, 0], [0.86, 1], [0.74, 1], [0.61, 0], [0.55, 1],
          [0.43, 1], [0.35, 0], [0.28, 1], [0.15, 0], [0.07, 0]
        ];
        var row = root.querySelector('.anim-m2-06-row');
        var tIn = root.querySelector('.anim-m2-06-t');
        var tv = root.querySelector('.anim-m2-06-tv');
        var tp = root.querySelector('.anim-m2-06-tpv');
        var fp = root.querySelector('.anim-m2-06-fpv');
        var fn = root.querySelector('.anim-m2-06-fnv');
        var tn = root.querySelector('.anim-m2-06-tnv');
        var met = root.querySelector('.anim-m2-06-metrics');
        if (!row || !tIn || !met || !tp) return;
        function render() {
          var t = Number(tIn.value);
          tv.textContent = t.toFixed(2);
          var n = { tp: 0, fp: 0, fn: 0, tn: 0 }, html = '';
          for (var i = 0; i < D.length; i++) {
            var pos = D[i][0] >= t, sick = D[i][1] === 1;
            var k = pos ? (sick ? 'tp' : 'fp') : (sick ? 'fn' : 'tn');
            n[k]++;
            html += '<span class="anim-m2-06-chip anim-m2-06-' + k + '"><b>' + (sick ? '病' : '健') + '</b>' + D[i][0].toFixed(2) + '</span>';
          }
          row.innerHTML = html;
          tp.textContent = n.tp; fp.textContent = n.fp; fn.textContent = n.fn; tn.textContent = n.tn;
          var p = (n.tp + n.fp) ? n.tp / (n.tp + n.fp) : NaN;
          var r = (n.tp + n.fn) ? n.tp / (n.tp + n.fn) : NaN;
          var acc = (n.tp + n.tn) / D.length;
          var f1 = (p + r) ? 2 * p * r / (p + r) : NaN;
          function f(x) { return isNaN(x) ? '—' : (x * 100).toFixed(0) + '%'; }
          met.innerHTML = '精确率 = ' + f(p) + '（报出来的里真有病）｜ 召回率 = ' + f(r) + '（病人里抓到多少）<br>准确率 = ' + f(acc) + ' ｜ F1 = ' + f(f1);
        }
        tIn.addEventListener('input', render);
        root.querySelector('.anim-m2-06-b1').addEventListener('click', function () { tIn.value = 0.3; render(); });
        root.querySelector('.anim-m2-06-b2').addEventListener('click', function () { tIn.value = 0.5; render(); });
        root.querySelector('.anim-m2-06-b3').addEventListener('click', function () { tIn.value = 0.7; render(); });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '召回率（Recall）的计算公式是：',
        options: ['TP / (TP + FN)', 'TP / (TP + FP)', '(TP + TN) / (TP + TN + FP + FN)', 'TN / (TN + FP)'],
        answer: 0,
        explanation: '召回率 = 所有真实正类中被抓到的比例，分母是"全部真坏人"（TP+FN）。选项 2 是精确率（分母是"报出来的"）；选项 3 是准确率；选项 4 是特异度。区分口诀看分母：分母是"全部坏人"是召回，分母是"全部报警"是精确——这是面试手算题的第一步，四格摆错全盘皆错。'
      },
      {
        type: 'fill', difficulty: 2,
        question: '数据中 99% 是负类，模型把所有样本都猜成负类：准确率高达 99%，但召回率只有 ____（填一个数字）。',
        accept: ['0', '0.0', '0%', '0.00', '零'],
        explanation: '一个正类都没抓到：TP=0、FN=全部正类，召回率 0/1=0。这就是类别不平衡下准确率的骗术——多数类占比本身就是基线，"全猜多数类"的废物模型也能刷出高准确率。面试标准应对：不平衡场景改看精确率/召回率、F1、PR 曲线或 AUC，训练侧可用类别加权、过采样/欠采样。'
      },
      {
        type: 'order', difficulty: 3,
        question: '评估一个输出打分的二分类模型，把下列步骤排成正确顺序：',
        items: ['统计 TP、FP、FN、TN，填出混淆矩阵', '把样本按模型打分从高到低排队', '换多个阈值重画，得到 ROC 曲线并计算 AUC', '选定一个阈值，打分在阈值之上的判为正类', '由混淆矩阵算出精确率、召回率与 F1'],
        answer: [1, 3, 0, 4, 2],
        explanation: '正确次序：先有打分（下标 1）→ 选阈值产生判决（下标 3）→ 判决之后才填四格账本（下标 0）→ 由四格算指标（下标 4）→ 扫描多个阈值画 ROC、算 AUC（下标 2）。面试考点藏在最后一步：AUC 与单一阈值无关——它把阈值扫了个遍，衡量的是整体排序能力，所以总是放在单一阈值评估之后作为全景补充。'
      }
    ],
    relations: {
      prerequisites: ['m2-03'],
      successors: [],
      confusables: [
        { other: 'm2-03', tip: '精确率/召回率是"判决之后"的账本，而判决靠阈值——m2-03 的 sigmoid 概率过线（默认 0.5）才产生 TP/FP。调阈值就是在精确率和召回率之间拧旋钮，模型本身没变。' },
        { other: 'm4-05', tip: '分类用混淆矩阵族（P/R/F1/AUC）看"判对没有"；语言模型评估用的是困惑度、BLEU/ROUGE 这类"生成得好不好"的指标——两套指标体系解决不同问题，别混用。' }
      ]
    },
    memory: {
      mnemonic: 'T 猜对 F 猜错，P 报阳 N 报阴；精确看枪口、召回看网眼，F1 罚偏科，AUC 比排队。',
      selfTest: [
        { q: '癌症筛查和垃圾邮件拦截各应重哪个指标？为什么？', a: '癌症筛查重召回率：漏诊（FN）代价是生命，误报只是多做一次检查；垃圾邮件拦截重精确率：把客户的重要邮件误扔垃圾箱（FP）代价高，漏掉几封垃圾邮件无伤大雅。通用句式："看 FP 与 FN 哪个业务代价更高"，再倒推该重哪个指标。' },
        { q: 'AUC = 0.5 和 AUC = 0.95 分别说明什么？', a: '0.5：随机抽一正一负，正样本排在前的概率只有一半——排序能力与瞎猜无异；0.95：95% 的正负样本对里正样本分数更高——排队能力优秀。但 AUC 与阈值无关，AUC 高不代表默认 0.5 阈值下的精确率/召回率就好，业务指标仍需按选定阈值另算。' },
        { q: '99% 负类的数据上，模型全猜负类：准确率、召回率各是多少？怎么破？', a: '准确率 99%（负类全对），召回率 0%（一个正类没抓到）。破法：评估改看精确率/召回率/F1、PR 曲线或 AUC；训练侧用类别加权损失、过采样/欠采样。面试要点：多数类占比就是准确率的"作弊基线"，越不平衡越不能只报准确率。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：精确率和召回率的区别？',
      reference: '精确率管"报出来的可疑包裹里有多少真有问题"——别冤枉人；召回率管"所有真有问题里抓到了多少"——别漏掉人。两者通常一升一降，按业务代价取舍，F1 则是要求两头都不许太差的综合分。'
    }
  },
  {
    id: 'm2-07',
    title: '特征工程与交叉验证',
    oneLiner: '把原始数据备成模型好下锅的形状，并用 K 折交叉验证考出稳定成绩',
    estMinutes: 12,
    analogy: {
      title: '下锅前先把菜切好',
      body: '大厨开火前先把菜洗好、切好、按盘码放，真正下锅只花几分钟——这一步叫备菜。<b>特征工程（Feature Engineering）</b>就是给模型备菜：原始数据（日期、城市名、收入）不能直接下锅，要切成模型认识的形状：把量纲差万倍的特征拉到同一尺度（特征缩放），把"北京/上海/广州"变成一排 0/1 开关（独热编码），把"单价 × 数量"合成新列"总价"（交叉特征）。<b>交叉验证（Cross Validation）</b>则是"多考几次试再下结论"：把练习卷均匀切成 K 份，轮流拿一份当模拟考，K 次成绩取平均——一次考试的运气就被抹平了。'
    },
    intuition: [
      { heading: '备菜三件套：缩放、独热、交叉', body: '特征缩放解决"收入几万"与"年龄几十"量纲悬殊的问题：归一化（Min-Max）把数值压进 0~1，标准化（Standardization）减均值再除标准差。独热编码（One-Hot）解决"城市"这类无序类别：直接编号 1/2/3 会暗示假的大小关系，变成三列开关才不失真。交叉特征（Feature Crossing）负责人工喂组合信号，如"周末 × 促销"——线性模型不会自己发现组合，得切好喂进去；树模型则能自动找组合。' },
      { heading: 'K 折交叉验证：一次考试有运气', body: '验证集只有一份时，成绩受"这份数据恰好偏简单/偏难"的运气影响。K 折交叉验证的完整流程：① 把训练数据均匀切 K 份；② 轮流拿其中 1 份当验证集、其余 K−1 份当训练集；③ 共训练 K 次，得到 K 个成绩；④ 取平均（顺便看波动）。测试集从头到尾隔离不动（回扣 m2-01 铁律）。K 常取 5 或 10；类别不平衡时用分层抽样，让每折的正负比例一致。' },
      { heading: '欠拟合 vs 过拟合：背题与理解', body: '模型太简单、连训练集都学不好，是欠拟合（Underfitting）——像没消化知识硬背了几句，换题就懵；药方是加特征、加模型复杂度。训练集接近满分、验证集却拉胯，是过拟合（Overfitting）——把练习题连同答案里的噪声一起背了下来；药方是更多数据、正则化、简化模型（详见 m3-04）。诊断靠一张对照表：训练与验证成绩"双双低 = 欠拟合，一高一低 = 过拟合"。' }
    ],
    principle: [
      {
        heading: '特征缩放：两个公式与适用对象',
        body: '两个公式都只做线性变换，不改变数据分布形状，只改"刻度"。需要缩放的是靠距离或梯度吃饭的模型：KNN 按距离找邻居，收入一列的数值差会淹没年龄一列；逻辑回归、神经网络配梯度下降，量纲悬殊会让损失面变成细长山谷、只能走之字（回扣 m2-02 的学习率之痛）。不需要的是树模型——见下一节。',
        formula: 'Min-Max：x′ = (x − min) / (max − min)；标准化：x′ = (x − μ) / σ',
        formulaNote: '<ul><li><b>min / max</b>：该列特征的最小 / 最大值，Min-Max 把整列压进 0~1</li><li><b>μ、σ</b>：该列的均值与标准差，标准化后均值为 0、方差为 1</li><li><b>注意</b>：min/max/μ/σ 只能用训练集统计，再套到验证 / 测试集——否则又是信息泄漏</li><li><b>选谁</b>：有明显离群点时标准化更稳（Min-Max 会被极值拉偏）</li></ul>'
      },
      {
        heading: '树模型为什么不太需要归一化',
        body: '决策树及其集成（随机森林、XGBoost）的每个节点只问"某特征大于阈值吗"——只比较大小，不做加减乘除。你把收入从元换成万元，树无非把阈值从 30000 改成 3，长出的树完全等价，所以缩放对树基本是白做的功。这是面试常问的"哪些模型怕量纲"对照题：怕的是 KNN、SVM（尤其 RBF 核）、配梯度下降的逻辑回归与神经网络；不怕的是树模型。独热编码对树也不是必须——树可以直接在类别值上切分。'
      },
      {
        heading: 'K 折交叉验证：流程与得分',
        body: '把交叉验证写成一行公式就是 K 个成绩的平均。它替代的是"单独划一份验证集"——数据少时尤其划算：每条样本都轮流当过验证数据，估计更稳；代价是训练 K 次、算力乘 K。记住两个不变量：① 测试集始终隔离，只在最终评估用一次；② 超参数是在交叉验证里选的，选好后通常用全部训练数据重训再交付。',
        formula: 'CV 得分 = (1/K)·Σ scoreₖ，k = 1…K',
        formulaNote: '<ul><li><b>K</b>：份数，常用 5 或 10；K 越大估计越稳、算力越贵</li><li><b>scoreₖ</b>：第 k 折当验证集时的成绩（如准确率或 F1）</li><li><b>Σ 取平均</b>：抹平单次切分的运气；同时报最大最小值看波动</li><li><b>分层 K 折</b>：每折保持正负类比例一致，不平衡数据必用</li><li><b>边界</b>：交叉验证在"训练 + 验证"数据内进行，测试集始终隔离</li></ul>'
      }
    ],
    animation: {
      title: 'K 折流水线：轮流当验证集',
      html: '<div class="anim-m2-07"><div class="anim-m2-07-ctrl"><span>折数 K：</span><button class="anim-m2-07-k anim-m2-07-on" data-k="3" type="button">K=3</button><button class="anim-m2-07-k" data-k="5" type="button">K=5</button><button class="anim-m2-07-k" data-k="10" type="button">K=10</button><span class="anim-m2-07-tip">（测试集已提前隔离，不在场）</span></div><div class="anim-m2-07-pool"></div><div class="anim-m2-07-btns"><button class="anim-m2-07-go" type="button">跑下一折</button><button class="anim-m2-07-reset" type="button">重置</button></div><div class="anim-m2-07-round"></div><div class="anim-m2-07-scores"></div><div class="anim-m2-07-final"></div></div>',
      css: '.anim-m2-07 { font-size: 13px; }\n.anim-m2-07-ctrl { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 8px; color: #334155; }\n.anim-m2-07-tip { color: #94a3b8; font-size: 12px; }\n.anim-m2-07-k { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 999px; background: #fff; cursor: pointer; transition: background .25s ease, border-color .25s ease, color .25s ease; }\n.anim-m2-07-k.anim-m2-07-on { background: #0ea5e9; border-color: #0ea5e9; color: #fff; }\n.anim-m2-07-pool { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }\n.anim-m2-07-chip { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 30px; border-radius: 6px; font-size: 12px; background: #f1f5f9; color: #475569; transition: background .35s ease, color .35s ease, transform .35s ease; }\n.anim-m2-07-val { background: #ffedd5; color: #9a3412; transform: translateY(-3px); font-weight: 600; }\n.anim-m2-07-trn { background: #dbeafe; color: #1e40af; }\n.anim-m2-07-btns button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; margin-right: 8px; }\n.anim-m2-07-round { color: #334155; margin-bottom: 6px; min-height: 20px; }\n.anim-m2-07-scores { font-family: monospace; font-size: 12px; color: #334155; line-height: 1.7; margin-bottom: 4px; }\n.anim-m2-07-final { font-weight: 600; color: #0369a1; line-height: 1.6; }',
      js: function (root) {
        var SC = {
          3: [80, 76, 84],
          5: [82, 85, 79, 88, 81],
          10: [83, 80, 86, 81, 79, 87, 82, 84, 78, 85]
        };
        var pool = root.querySelector('.anim-m2-07-pool');
        var goBtn = root.querySelector('.anim-m2-07-go');
        var roundEl = root.querySelector('.anim-m2-07-round');
        var scoresEl = root.querySelector('.anim-m2-07-scores');
        var finalEl = root.querySelector('.anim-m2-07-final');
        var kBtns = root.querySelectorAll('.anim-m2-07-k');
        if (!pool || !goBtn || !scoresEl || !finalEl) return;
        var K = 3, f = 0, got = [], msg = '';
        function foldOf(i) { return i % K; }
        function avg(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s / a.length; }
        function render() {
          var chips = pool.querySelectorAll('.anim-m2-07-chip');
          for (var i = 0; i < chips.length; i++) {
            var cls = 'anim-m2-07-chip';
            if (foldOf(i) < f) cls += ' anim-m2-07-val';
            else if (f > 0) cls += ' anim-m2-07-trn';
            chips[i].className = cls;
          }
          roundEl.textContent = msg;
          scoresEl.textContent = got.length ? '各折成绩（%）：' + got.join(' ｜ ') : '';
          if (f >= K) {
            var a = avg(got), lo = Math.min.apply(null, got), hi = Math.max.apply(null, got);
            finalEl.textContent = 'K 折平均 = ' + a.toFixed(1) + '%（最高 ' + hi + '%、最低 ' + lo + '%）。定稿：用全部训练数据按选定配置重训，最后在隔离的测试集上考一次。';
            goBtn.textContent = '已完成全部 K 折';
          } else {
            finalEl.textContent = '';
            goBtn.textContent = '跑下一折';
          }
        }
        goBtn.addEventListener('click', function () {
          if (f >= K) return;
          var valIdx = [];
          for (var i = 0; i < 10; i++) if (foldOf(i) === f) valIdx.push(i + 1);
          got.push(SC[K][f]);
          msg = '第 ' + (f + 1) + ' 折完成：验证集 = 样本 ' + valIdx.join('、') + '，其余 ' + (10 - valIdx.length) + ' 个当训练集 → 本次成绩 ' + SC[K][f] + '%。';
          f++;
          render();
        });
        function reset() {
          var h = '';
          for (var i = 0; i < 10; i++) h += '<span class="anim-m2-07-chip">样本' + (i + 1) + '</span>';
          pool.innerHTML = h;
          f = 0; got = [];
          msg = '点「跑下一折」开始：每一折轮流拿 1 份当验证集，其余当训练集。';
          render();
        }
        root.querySelector('.anim-m2-07-reset').addEventListener('click', reset);
        for (var i = 0; i < kBtns.length; i++) {
          (function (btn) {
            btn.addEventListener('click', function () {
              for (var j = 0; j < kBtns.length; j++) kBtns[j].classList.remove('anim-m2-07-on');
              btn.classList.add('anim-m2-07-on');
              K = Number(btn.getAttribute('data-k'));
              reset();
            });
          })(kBtns[i]);
        }
        reset();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '特征"城市"取值为 {北京, 上海, 广州}，喂给线性模型前最合适的处理是：',
        options: ['独热编码成 3 列 0/1 开关', '直接编号 北京=1、上海=2、广州=3', '全部除以城市数量的最大值', '保留字符串原样参与加权求和'],
        answer: 0,
        explanation: '编号 1/2/3 会引入假的大小与距离关系（模型会误学出"广州 3 > 上海 2"的数值含义），线性模型会把编号当真实数值加权。独热编码让每个城市独立一列开关，无序类别信息不失真。面试延伸：高基数类别（上万个取值）独热会爆列数，工程上改用目标编码或嵌入（Embedding，思想源头见 m4-02 词向量）。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '对随机森林、XGBoost 这类树模型做 min-max 归一化，长出的树与不归一化时等价，因此树模型通常可以不做特征缩放。',
        answer: true,
        explanation: '树的每个节点只做"某特征 > 阈值？"的大小比较，min-max 是单调线性变换，只把阈值等比挪了挪，切分结构完全不变——所以缩放对树基本白做。必须缩放的是依赖距离或梯度的模型：KNN、SVM（尤其 RBF 核）、配梯度下降的逻辑回归 / 神经网络。面试常问"哪些模型怕量纲"，答这组对照即可。'
      },
      {
        type: 'order', difficulty: 3,
        question: '把"用 5 折交叉验证评估并交付模型"的流程排成正确顺序：',
        items: ['取 5 次成绩的平均值与波动范围，作为模型的稳定估计', '把训练数据均匀切成 5 份', '在全程隔离、只考一次的测试集上做最终评估', '轮流拿其中 1 份当验证集、其余 4 份当训练集，共训练 5 次', '用全部训练数据按选定配置重新训练最终模型'],
        answer: [1, 3, 0, 4, 2],
        explanation: '正确次序：切 5 份（下标 1）→ 轮流训练 5 次（下标 3）→ 平均得到稳定估计、据此选超参（下标 0）→ 用全量训练数据重训不浪费数据（下标 4）→ 测试集只考一次（下标 2）。面试考点：交叉验证代替的是"单次验证集"而不是测试集——测试集在两种方案里都全程隔离，提前动它就是信息泄漏（回扣 m2-01）。'
      }
    ],
    relations: {
      prerequisites: ['m2-01'],
      successors: [],
      confusables: [
        { other: 'm2-01', tip: 'm2-01 的"训练/验证/测试"是一次性按比例切分；K 折交叉验证是把"训练+验证"部分均匀切 K 份、轮流当验证集再取平均，更稳但更费算力——测试集在两种方案里都全程隔离。' },
        { other: 'm3-04', tip: '欠拟合 / 过拟合的"背题 vs 理解"在 m3-04 会升级成可操作的药方：L2 正则、Dropout、早停等——特征工程管"喂什么"，正则化管"学多狠"。' },
        { other: 'm3-05', tip: '本课的特征缩放是"训练前把每列输入拉平"（Min-Max / 标准化）；m3-05 的 BatchNorm / LayerNorm 是"网络内部逐层归一化激活值"——一个在门口备菜，一个在锅里调味，别混为一谈。' }
      ]
    },
    memory: {
      mnemonic: '缩放独热交叉备好菜，K 折轮流考、平均才可信；训练好验证差是过拟合。',
      selfTest: [
        { q: '哪些模型需要特征缩放，哪些不需要？为什么？', a: '需要：KNN（按距离找邻居）、SVM（核值依赖距离，RBF 尤甚）、配梯度下降的逻辑回归与神经网络（量纲悬殊让损失面细长、收敛慢）。不需要：树模型——节点只做"特征 > 阈值"的大小比较，线性缩放只平移阈值，树结构不变。' },
        { q: '口述 5 折交叉验证的完整流程。', a: '把训练数据均匀切 5 份；轮流拿 1 份当验证集、其余 4 份训练，共 5 次；5 个成绩取平均并看波动，作为模型的稳定估计（超参数据此选择）；定稿后用全部训练数据重训，最后在全程隔离的测试集上评估一次。数据不平衡时改用分层 K 折，保持每折类别比例一致。' },
        { q: '训练集准确率 99%、验证集 70%：什么病？开什么药？反过来双双 60% 呢？', a: '一高一低是过拟合（背题）：加数据、加正则化（L2/Dropout/早停，见 m3-04）、简化模型。双双偏低是欠拟合（没学会）：加特征、加模型复杂度、训久一点。先看"训练 vs 验证差距"诊断，再开药——这是面试场景题的答题框架。' }
      ]
    },
    feynman: {
      prompt: '用一句话向完全外行解释：K 折交叉验证为什么比"只考一次"更可信？',
      reference: '把练习题分成 5 份，轮流拿其中 1 份当考卷、考满 5 次再算平均——单次考试"题目恰好偏易或偏难"的运气被平均掉了，估出来的水平更接近真实能力。'
    }
  }
  ]
});
