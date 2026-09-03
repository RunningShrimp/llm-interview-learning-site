/* M3 深度学习基础 —— 7 个知识点内容数据（契约见 docs/SCHEMA.md v1） */
window.SITE_DATA.registerModule({
  module: 'M3',
  title: '深度学习基础',
  icon: '🧠',
  color: '#8b5cf6',
  lessons: [
  {
    id: 'm3-01',
    title: '神经元与 MLP',
    oneLiner: '从一个"加权投票的委员"长成层层加工的多层网络',
    estMinutes: 12,
    analogy: {
      title: '委员会投票',
      body: '公司招人，评审委员会集体打分。每位"委员"（神经元）性格不同：有的看重笔试、有的看重面试，各自按重视程度给意见加权（加权求和），再加一点个人偏好（偏置），最后过一个"表态门槛"——分数不够就沉默，够了才发言（激活）。一位委员只能做粗浅判断，但把几百位委员按层分组、层层传递：第一层听原始材料，第二层听第一层的发言……最高层拍板结论。这张层层投票网，就是多层感知机（MLP）。'
    },
    intuition: [
      { heading: '神经元：加权求和 + 激活，两步走', body: '一个神经元（Neuron）只干两件事：先把各路输入乘上自己的权重再加总——z = w·x + b，这是"听取意见、按重视程度打分"；再把总分送进激活函数（Activation Function）做非线性变换——a = f(z)，这是"过门槛决定怎么表态"。最常用的门槛是 ReLU：正数原样通过，负数归零（"这事我不表态"）。' },
      { heading: '为什么必须有非线性', body: '如果去掉激活函数，堆 100 层也没用：两层线性叠加 W₂(W₁x+b₁)+b₂ 整理后仍是 (W₂W₁)x + (W₂b₁+b₂)——还是一个线性函数。也就是说，没有激活函数的多层网络会"塌缩"成一层，再深也只能画直线边界。激活函数提供的弯曲（非线性），是神经网络拟合复杂规律的命根子——面试必考结论。' },
      { heading: 'MLP：层层加工的流水线', body: '多层感知机（MLP，Multi-Layer Perceptron）= 输入层 → 若干隐藏层 → 输出层：层内神经元互不相连，相邻层之间两两全连接。数据像流水线：每层做一次"加权求和 + 激活"，把原始特征逐步提炼成更抽象的表示。理论上足够宽的 MLP 能逼近任意连续函数（万能近似定理）——但"能表达"不等于"训得动"，怎么训就是下一课反向传播的事。' }
    ],
    principle: [
      {
        heading: '单个神经元的数学',
        body: '前半是线性部分（加权求和 + 偏置），后半是非线性部分（激活）。顺带打通一条线：逻辑回归（m2-03）其实就是"单个神经元 + sigmoid 激活"的特例——面试官爱用这题检验你有没有把传统机器学习和深度学习连起来。',
        formula: 'z = w₁x₁ + w₂x₂ + … + wₙxₙ + b，a = f(z)',
        formulaNote: '<ul><li><b>xᵢ</b>：第 i 路输入（原始特征或上一层的输出）</li><li><b>wᵢ</b>：第 i 路权重，"这个意见我听几分"——训练就是在调它</li><li><b>b</b>：偏置（bias），"个人偏好"，把表态门槛左右平移</li><li><b>f</b>：激活函数（ReLU / sigmoid / tanh…），提供非线性</li><li><b>a</b>：神经元的输出，作为下一层的输入继续传递</li></ul>'
      },
      {
        heading: '没有激活函数 = 多层塌缩成一层',
        body: '线性套线性仍是线性。设 W&#39; = W₂W₁、b&#39; = W₂b₁ + b₂，两层线性网络与一层没有表达力差别。加入非线性 f 后塌缩失效，网络才能拟合弯曲的决策边界——这是"深度"二字有意义的前提。',
        formula: 'W₂(W₁x + b₁) + b₂ = (W₂W₁)x + (W₂b₁ + b₂)',
        formulaNote: '<ul><li><b>W₁, b₁</b>：第一层的权重与偏置；<b>W₂, b₂</b>：第二层的权重与偏置</li><li><b>左式</b>：两层线性层的复合计算</li><li><b>右式</b>：合并后仍是"一个矩阵乘法 + 一个向量加法"，即一层线性层</li><li>直觉：线性变换连乘只是换了一副线性变换的面具，加深没有换来新能力</li></ul>'
      },
      {
        heading: 'MLP 前向传播：矩阵接力',
        body: '每一层都是一次"矩阵乘法 + 加偏置 + 激活"，输出作为下一层输入。这个"从输入算到输出"的过程叫前向传播（Forward Propagation）。层越深、每层越宽，参数越多、表达力越强，但训练也越难——深度学习后续所有技巧（初始化、归一化、残差）都在为"深而可训"服务。',
        formula: 'h(l) = f( W(l)·h(l−1) + b(l) )，最后一层输出 ŷ',
        formulaNote: '<ul><li><b>h(l−1)</b>：第 l−1 层的输出向量，也是第 l 层的输入</li><li><b>W(l)</b>：第 l 层的权重矩阵，形状为 (本层神经元数 × 上层输出数)</li><li><b>b(l)</b>：第 l 层的偏置向量，每个神经元一个</li><li><b>f</b>：逐元素作用的激活函数</li><li><b>ŷ</b>：输出层结果；分类问题常再接 softmax（m1-06）变成概率</li></ul>'
      }
    ],
    animation: {
      title: '神经元表态机：调权重、换激活，看委员怎么表态',
      html: '<div class="anim-m3-01"><p class="anim-m3-01-desc">一位评审委员（神经元）：给两路意见 x₁、x₂ 分配权重 w₁、w₂，加偏好 b，总分 z = w₁x₁ + w₂x₂ + b，再过激活门槛决定表态值 a：</p><div class="anim-m3-01-row"><label>x₁ <input class="anim-m3-01-x1" type="range" min="-3" max="3" step="0.5" value="2"></label><label>x₂ <input class="anim-m3-01-x2" type="range" min="-3" max="3" step="0.5" value="1"></label><label>w₁ <input class="anim-m3-01-w1" type="range" min="-3" max="3" step="0.5" value="1.5"></label><label>w₂ <input class="anim-m3-01-w2" type="range" min="-3" max="3" step="0.5" value="-1"></label><label>b <input class="anim-m3-01-b" type="range" min="-3" max="3" step="0.5" value="0.5"></label><label>激活 <select class="anim-m3-01-act"><option value="relu">ReLU</option><option value="sigmoid">Sigmoid</option><option value="none">无（纯线性）</option></select></label></div><div class="anim-m3-01-calc"></div><div class="anim-m3-01-track"><div class="anim-m3-01-fill"></div></div><div class="anim-m3-01-tag"></div></div>',
      css: '.anim-m3-01 { font-size: 13px; }\n.anim-m3-01-desc { margin: 0 0 8px; }\n.anim-m3-01-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 8px; }\n.anim-m3-01-row label { display: flex; align-items: center; gap: 4px; }\n.anim-m3-01-calc { font-family: monospace; margin: 6px 0; color: #334155; }\n.anim-m3-01-track { height: 16px; background: #e2e8f0; border-radius: 8px; overflow: hidden; }\n.anim-m3-01-fill { height: 100%; width: 0; border-radius: 8px; transition: width .35s ease, background .35s ease; }\n.anim-m3-01-tag { margin-top: 6px; color: #475569; }',
      js: function (root) {
        var x1 = root.querySelector('.anim-m3-01-x1');
        var x2 = root.querySelector('.anim-m3-01-x2');
        var w1 = root.querySelector('.anim-m3-01-w1');
        var w2 = root.querySelector('.anim-m3-01-w2');
        var bEl = root.querySelector('.anim-m3-01-b');
        var act = root.querySelector('.anim-m3-01-act');
        var calc = root.querySelector('.anim-m3-01-calc');
        var fill = root.querySelector('.anim-m3-01-fill');
        var tag = root.querySelector('.anim-m3-01-tag');
        if (!calc || !fill || !tag) return;
        function update() {
          var a1 = Number(x1.value), a2 = Number(x2.value);
          var m1 = Number(w1.value), m2 = Number(w2.value), bb = Number(bEl.value);
          var z = m1 * a1 + m2 * a2 + bb;
          var mode = act ? act.value : 'relu';
          var y;
          if (mode === 'sigmoid') { y = 1 / (1 + Math.exp(-z)); }
          else if (mode === 'none') { y = z; }
          else { y = Math.max(0, z); }
          calc.textContent = 'z = ' + m1 + '×' + a1 + ' + (' + m2 + ')×' + a2 + ' + ' + bb + ' = ' + z.toFixed(2) + '　→　a = f(z) = ' + y.toFixed(3);
          var pct;
          if (mode === 'sigmoid') { pct = y * 100; }
          else if (mode === 'none') { pct = Math.abs(y) / 10 * 100; }
          else { pct = y / 10 * 100; }
          fill.style.width = Math.max(2, Math.min(100, pct)) + '%';
          fill.style.background = y > 0 ? '#22c55e' : '#ef4444';
          if (mode === 'none') {
            tag.textContent = '纯线性：输出只是输入的线性组合——叠再多层也塌缩成一层，画不出曲线边界';
          } else if (mode === 'relu') {
            tag.textContent = y > 0 ? 'ReLU：总分 > 0，委员表态（原样通过）' : 'ReLU：总分 ≤ 0，委员沉默（归零）——正因有这道门槛，多层才有意义';
          } else {
            tag.textContent = 'Sigmoid：把总分压成 0~1 的"表态强度"，z = 0 时恰好 0.5';
          }
        }
        [x1, x2, w1, w2, bEl].forEach(function (el) { if (el) el.addEventListener('input', update); });
        if (act) act.addEventListener('change', update);
        update();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '某神经元输入 x = [2, 1]，权重 w = [3, −1]，偏置 b = 1，激活函数为 ReLU。它的输出 a 是多少？',
        options: ['6', '5', '0', '−6'],
        answer: 0,
        explanation: '先线性加权求和：z = 3×2 + (−1)×1 + 1 = 6；再过激活：ReLU(6) = 6。常见误区：漏加偏置得 5；把顺序反成"先激活再加偏置"得 0；权重符号看错得 −6。固定顺序：先 z = w·x + b，再 a = f(z)。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '如果把一个多层网络的激活函数全部去掉，那么无论堆多少层，它都等价于一个单层线性模型。',
        answer: true,
        explanation: '线性变换的复合仍是线性变换：W₂(W₁x+b₁)+b₂ = (W₂W₁)x + (W₂b₁+b₂)，一层就能表达同样的函数族。激活函数提供的非线性是"深度"有价值的前提，去掉它多层就塌缩成一层——这是面试必考结论，答不出会直接暴露基础不牢。'
      },
      {
        type: 'fill', difficulty: 3,
        question: '要在多层网络的每层输出后加入非线性、避免多层塌缩成一层，必须使用____函数（填中文或英文术语均可）。',
        accept: ['激活', '激活函数', 'activation', 'activation function'],
        explanation: '激活函数（如 ReLU、sigmoid、tanh）对加权求和的结果做非线性变换，是多层网络能拟合弯曲边界的关键。ReLU 因计算便宜、正区间梯度恒为 1 不易饱和，成为现代网络的默认选择；sigmoid/tanh 两端饱和则与梯度消失相关（m3-02）。'
      }
    ],
    relations: {
      prerequisites: ['m1-03', 'm2-03'],
      successors: ['m3-02', 'm3-04', 'm3-06', 'm3-07', 'm4-02', 'm7-04'],
      confusables: [
        { other: 'm2-03', tip: '逻辑回归 = 单个神经元 + sigmoid 激活的特例；MLP 的区别是隐藏层叠加后能学非线性边界，而逻辑回归的决策边界永远是线性的超平面。' },
        { other: 'm3-06', tip: 'MLP 全连接：每个输入连每个神经元，参数随输入维度暴涨；CNN 卷积用小窗口 + 参数共享，参数量与输入大小无关，适合利用空间局部性。' }
      ]
    },
    memory: {
      mnemonic: '加权求和加偏置，激活门槛建弯曲；没有激活塌一层。',
      selfTest: [
        { q: '面试背诵：为什么神经网络必须用非线性激活函数？', a: '没有激活函数时，多层线性变换的复合仍是线性变换（W₂(W₁x+b₁)+b₂ = (W₂W₁)x+(W₂b₁+b₂)），再深的网络也等价于一层，只能拟合线性关系；激活函数提供非线性，网络才能逼近任意复杂函数，"深度"才有意义。' },
        { q: '一个神经元内部的两步计算分别是什么？', a: '① 线性部分：z = w·x + b（加权求和加偏置）；② 非线性部分：a = f(z)，f 是激活函数（如 ReLU：负数归零、正数通过）。输出 a 再传给下一层神经元。' },
        { q: '逻辑回归和"一个神经元"是什么关系？', a: '逻辑回归就是单个神经元 + sigmoid 激活：先线性打分 z = w·x + b，再经 σ(z) 压成 0~1 的概率。MLP 相当于把许多这样的单元分多层连起来，靠隐藏层自动学到非线性特征。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：神经网络里的一个"神经元"在干什么？',
      reference: '它像一位评审委员：把各方意见按自己的重视程度加权打总分，再过一道"表态门槛"——分数不够就沉默（输出 0），够了才发言；成百上千位委员分层接力，就能从原始材料里层层提炼出复杂判断。'
    }
  },
  {
    id: 'm3-02',
    title: '反向传播',
    oneLiner: '责任沿计算图逐层回传，让深层网络的训练在计算上成为可能',
    estMinutes: 15,
    analogy: {
      title: '年终追责链',
      body: '公司年业绩不达标，老板要追责。他不会挨个审每个员工，而是先问直接负责的部门："你们的影响有多大？"部门再往下问小组，小组再问个人——每一级只回答自己这一环节的"影响系数"，层层相乘，最终每个人的责任份额都算得清清楚楚。<b>反向传播（Backpropagation）</b>就是神经网络版的追责链：损失是"业绩缺口"，参数是"员工"，链式法则把责任从输出层一路乘回每个参数。'
    },
    intuition: [
      { heading: '计算图：把计算画成流水线', body: '任何模型的计算都能拆成一串节点：输入 → 乘法 → 加法 → 激活 → … → 损失。这张有向图叫计算图（Computational Graph）。前向传播沿箭头从左到右"记账"，每步存下结果；反向传播沿箭头反着走"追责"，用每步的局部影响系数算出全局责任。PyTorch 的自动求导（Autograd）本质就是替你维护这张图。' },
      { heading: '局部梯度：每个节点只管自己', body: '计算图上每个节点只需要知道两件事：自己的输出怎么随输入变（局部导数），以及"最终损失对我的输出有多不满意"（上游传来的梯度）。两者一乘，就是损失对它输入的责任——上游的数怎么来的、下游怎么用，都不用管。正是这种"只看局部"，让几十层的网络也能高效算梯度。' },
      { heading: '为什么深层训练因此成为可能', body: '一个模型有上亿个参数，如果每个参数都靠"扰动一下、看损失变多少"来测梯度，前向计算就要重跑上亿次。反向传播用链式法则一次反向扫过全图，就把所有参数的梯度一并算出——代价只相当于一两次前向。没有它，深层网络的训练在计算上根本不可行。' }
    ],
    principle: [
      {
        heading: '链式法则：责任相乘',
        body: '若 x 先变成 y、y 再影响 L，那么 x 的责任 = 上游对 y 的不满意程度 × y 随 x 变化的速率。多级串联就连乘。再记两条节点规则：加法节点把上游梯度原样发给每路输入；乘法节点把上游梯度乘以"另一路输入的值"。这三句口诀能覆盖绝大多数手推题。',
        formula: '∂L/∂x = ∂L/∂y × ∂y/∂x',
        formulaNote: '<ul><li><b>∂L/∂y</b>：上游传来的梯度——"最终损失对 y 有多不满意"</li><li><b>∂y/∂x</b>：本节点的局部导数——"y 随 x 变化的速率"</li><li><b>相乘</b>：影响沿链条逐级换算，乘法即"责任换算汇率"</li><li><b>多级</b>：x→z→y→L 就连乘三项，这就是链式法则（Chain Rule）</li></ul>'
      },
      {
        heading: '前向记账 → 反向追责：完整顺序',
        body: '完整训练一步的顺序永远是：① 前向传播算出损失 L；② 反向传播从 L 出发、沿计算图逆序用链式法则求出每个参数的梯度；③ 用梯度更新参数；④ 换一批数据重复。顺序不能颠倒：没有前向缓存的中间结果，反向无从算起。这也是 order 题的经典素材，对应 PyTorch 训练代码里 forward / backward / step 三段。',
        formula: '前向：x → u → y → L（缓存中间量）；反向：∂L/∂y → ∂L/∂u → ∂L/∂x（逆序相乘）',
        formulaNote: '<ul><li><b>① 前向</b>：沿图正向计算并缓存每个中间量（记账）</li><li><b>② 反向</b>：从 L 逆序回扫，逐节点乘局部导数（追责）</li><li><b>③ 更新</b>：θ ← θ − η·∇L，优化器登场（m3-03）</li><li><b>④ 循环</b>：换下一批数据重复，直到损失不再下降（收敛）</li></ul>'
      },
      {
        heading: '一个能徒手算完的例子',
        body: '面试手推梯度的标准动作：先列前向数值，再逆序乘局部导数，一步不漏。下例从 x 到 L 共三级：前向 u=4、y=12、L=9；反向依次得 −6、−18、−72。多做几遍这种"计算图接力"，自动求导在你眼里就不再是黑盒。',
        formula: 'x=2 → u=x²（∂u/∂x=2x）→ y=3u（∂y/∂u=3）→ L=(y−15)²（∂L/∂y=2(y−15)）',
        formulaNote: '<ul><li><b>前向</b>：u = 2² = 4；y = 3×4 = 12；L = (12−15)² = 9</li><li><b>∂L/∂y = 2(y−15) = −6</b>：损失节点自己求导</li><li><b>∂L/∂u = −6 × 3 = −18</b>：乘上乘法节点的局部导数 3</li><li><b>∂L/∂x = −18 × 2x = −18 × 4 = −72</b>：再乘平方节点的局部导数 2x</li></ul>'
      }
    ],
    animation: {
      title: '计算图推演器：先前向记账，再反向追责',
      html: '<div class="anim-m3-02"><p class="anim-m3-02-desc">计算图：x →（平方）u →（×3）y →（与 15 之差的平方）L。点「走一步」逐节点前向记账，再逆序反向追责，当前步骤高亮：</p><div class="anim-m3-02-graph"></div><div class="anim-m3-02-btns"><button class="anim-m3-02-step" type="button">走一步</button><button class="anim-m3-02-reset" type="button">重置</button></div><div class="anim-m3-02-info"></div></div>',
      css: '.anim-m3-02 { font-size: 13px; }\n.anim-m3-02-desc { margin: 0 0 8px; }\n.anim-m3-02-graph { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }\n.anim-m3-02-node { flex: 1; min-width: 76px; padding: 8px 6px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; text-align: center; transition: border-color .3s ease, box-shadow .3s ease, transform .3s ease; }\n.anim-m3-02-nm { font-family: monospace; font-weight: 700; color: #334155; }\n.anim-m3-02-val { font-family: monospace; color: #8b5cf6; min-height: 16px; }\n.anim-m3-02-grad { font-family: monospace; font-size: 11px; color: #dc2626; min-height: 15px; }\n.anim-m3-02-cur { border-color: #8b5cf6; box-shadow: 0 0 0 2px rgba(139,92,246,.25); transform: translateY(-3px); background: #f5f3ff; }\n.anim-m3-02-btns { display: flex; gap: 8px; margin-bottom: 6px; }\n.anim-m3-02-btns button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m3-02-info { font-family: monospace; font-size: 12px; color: #334155; min-height: 18px; }',
      js: function (root) {
        var wrap = root.querySelector('.anim-m3-02-graph');
        var info = root.querySelector('.anim-m3-02-info');
        var stepBtn = root.querySelector('.anim-m3-02-step');
        var resetBtn = root.querySelector('.anim-m3-02-reset');
        if (!wrap || !info || !stepBtn) return;
        var names = ['x（输入）', 'u = x²', 'y = 3u', 'L = (y−15)²'];
        var vals = ['2', '4', '12', '9'];
        var gradText = ['∂L/∂x = −72', '', '∂L/∂u = −18', '∂L/∂y = −6'];
        var stages = [
          { n: 0, f: true, g: -1, txt: '前向记账①：输入 x = 2' },
          { n: 1, f: true, g: -1, txt: '前向记账②：u = x² = 4，记下局部导数 ∂u/∂x = 2x = 4' },
          { n: 2, f: true, g: -1, txt: '前向记账③：y = 3u = 12，记下局部导数 ∂y/∂u = 3' },
          { n: 3, f: true, g: -1, txt: '前向记账④：L = (12−15)² = 9，记下局部导数 ∂L/∂y = 2(y−15) = −6' },
          { n: 3, f: false, g: 3, txt: '反向追责①：损失节点自己求导，得 ∂L/∂y = −6' },
          { n: 2, f: false, g: 2, txt: '反向追责②：∂L/∂u = ∂L/∂y × ∂y/∂u = −6 × 3 = −18' },
          { n: 1, f: false, g: 0, txt: '反向追责③：∂L/∂x = ∂L/∂u × ∂u/∂x = −18 × 4 = −72，梯度流回输入' },
          { n: 0, f: false, g: -1, txt: '追责完毕：x 的责任份额（梯度）为 −72，可以交给优化器去更新了' }
        ];
        var boxes = [], valEls = [], gradEls = [];
        names.forEach(function (nm) {
          var d = document.createElement('div');
          d.className = 'anim-m3-02-node';
          d.innerHTML = '<div class="anim-m3-02-nm">' + nm + '</div><div class="anim-m3-02-val"></div><div class="anim-m3-02-grad"></div>';
          wrap.appendChild(d);
          boxes.push(d);
          valEls.push(d.querySelector('.anim-m3-02-val'));
          gradEls.push(d.querySelector('.anim-m3-02-grad'));
        });
        var si = -1;
        function render() {
          boxes.forEach(function (d) { d.classList.remove('anim-m3-02-cur'); });
          gradEls.forEach(function (g) { g.textContent = ''; });
          var k, st;
          for (k = 0; k <= si && k < stages.length; k++) {
            st = stages[k];
            if (st.f) { valEls[st.n].textContent = vals[st.n]; }
            else if (st.g >= 0) { gradEls[st.g].textContent = gradText[st.g]; }
          }
          if (si >= 0 && si < stages.length) {
            boxes[stages[si].n].classList.add('anim-m3-02-cur');
            info.textContent = stages[si].txt;
          } else {
            info.textContent = '点「走一步」，先逐节点前向记账，再逆序反向追责';
          }
          if (si >= stages.length - 1) { info.textContent += '　✔ 全链完成'; }
        }
        stepBtn.addEventListener('click', function () {
          if (si < stages.length - 1) { si++; render(); }
        });
        if (resetBtn) resetBtn.addEventListener('click', function () { si = -1; render(); });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '计算图上已知 ∂L/∂y = 2，∂y/∂x = 3，由链式法则 ∂L/∂x 等于多少？',
        options: ['6', '5', '1.5', '2/3'],
        answer: 0,
        explanation: '链式法则是相乘：∂L/∂x = ∂L/∂y × ∂y/∂x = 2×3 = 6。常见误区：相加得 5、相除得 1.5 或 2/3——梯度沿链条传递是"影响系数逐级换算"，换算方式是乘法，不是加法或除法。'
      },
      {
        type: 'order', difficulty: 2,
        question: '把训练一步的四个环节按正确顺序排列：',
        items: ['反向传播求出各参数的梯度 ∇L', '前向传播算出损失 L', '按 θ ← θ − η·∇L 更新参数', '换下一批数据重复以上步骤，直到收敛'],
        answer: [1, 0, 2, 3],
        explanation: '正确顺序：前向算损失（下标 1）→ 反向求梯度（0）→ 更新参数（2）→ 循环（3）。常见误区：先更新再求梯度（没有梯度就不知道往哪更新），或先反向再前向（没有前向缓存的中间量，链式法则无从乘起）。这个顺序就是 PyTorch 训练循环 forward / backward / step 的来源。'
      },
      {
        type: 'fill', difficulty: 3,
        question: '计算图：x →(×2)→ u →(平方)→ L。当 x = 3 时 u = 6，已知 ∂L/∂u = 2u = 12，则 ∂L/∂x = ____（填数字）',
        accept: ['24'],
        explanation: '链式法则：∂L/∂x = ∂L/∂u × ∂u/∂x = 12 × 2 = 24（乘法节点的局部导数 ∂u/∂x = 2 是常数）。常见误区：把两级导数相加（12+2=14）或只算一级（12）——沿链传递必须逐级相乘，这正是反向传播"追责相乘"的核心动作。'
      }
    ],
    relations: {
      prerequisites: ['m3-01'],
      successors: ['m3-03', 'm3-05', 'm6-04'],
      confusables: [
        { other: 'm1-03', tip: '梯度下降是"用梯度更新参数"的策略，反向传播是"高效算出梯度"的算法；面试答"反向传播就是沿梯度更新参数"是经典口误——更新那一步属于梯度下降/优化器。' },
        { other: 'm3-03', tip: '分工记忆：反向传播负责"算"（求出 ∇L），优化器负责"用"（拿 ∇L 和学习率更新 θ）。Adam 里的一阶动量是对反向传播算出的 g 做平均，不是重新求导。' }
      ]
    },
    memory: {
      mnemonic: '前向记账存结果，反向追责乘梯度；链式相乘逐层传。',
      selfTest: [
        { q: '面试背诵：反向传播是什么？', a: '基于链式法则在计算图上高效求梯度的算法：先前向传播算出损失并缓存中间量，再从损失出发逆序逐节点相乘局部导数，一次回扫就把所有参数的梯度同时算出，计算代价约为一两次前向传播。它只负责"算梯度"，更新参数是优化器（梯度下降/Adam）的事。' },
        { q: '加法节点和乘法节点分别怎么传梯度？', a: '加法节点把上游梯度原样分发给每一路输入（∂(a+b)/∂a = ∂(a+b)/∂b = 1，"人人有责"）；乘法节点把上游梯度乘以"另一路输入的值"再往下传（∂(ab)/∂a = b）。' },
        { q: '为什么说反向传播让"深层"训练成为可能？', a: '上亿参数若逐个用"扰动看损失变化"测梯度，每个参数都要重跑一次前向；反向传播利用链式法则一次逆向扫描同时得到全部梯度，计算量与前向同阶——没有它，深层网络的训练成本根本不可接受。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：反向传播在干什么？',
      reference: '像公司年终追责：业绩差了，老板先问部门、部门再问小组、小组再问个人，每一级只报自己的"影响系数"，层层相乘——最后每个参数该背多大责任（梯度）就都算清楚了，各自朝改进方向调整。'
    }
  },
  {
    id: 'm3-03',
    title: '优化器',
    oneLiner: '从蒙眼下坡到 Adam：参数更新的进化史，面试最爱问 Adam 的两个动量',
    estMinutes: 14,
    analogy: {
      title: '下山四式',
      body: '同一个人下山，走法可以越来越聪明：① <b>SGD</b> 是蒙眼下坡——只靠脚底当前坡度迈步，简单但容易走歪、步子难拿捏；② <b>Momentum</b> 是有惯性的小球——把历次坡度攒成冲量，冲过小坑小坎；③ <b>AdaGrad / RMSProp</b> 是会看路况的老司机——哪边一直很陡就把那边的步子放小，平缓处放大步子；④ <b>Adam</b> 把"惯性"和"看路况"合体：既记方向，又按地形调步长，成为默认首选。'
    },
    intuition: [
      { heading: 'SGD 与学习率', body: '随机梯度下降（SGD, Stochastic Gradient Descent）每次只拿一小批数据（mini-batch）估梯度就更新。学习率（Learning Rate）η 是唯一的步长旋钮：太大来回震荡甚至发散，太小磨蹭不到底。批量小带来的噪声反而有正则化效果，但同一个 η 对所有参数一视同仁，遇上"有的方向陡、有的方向平"就难办——这正是后续改进的动机。' },
      { heading: 'Momentum：攒一把冲劲', body: '动量法维护一个速度 v：v ← β·v + g（g 是当前梯度），再按 v 更新参数。历史梯度方向一致时越滚越快，方向来回打架时互相抵消——所以能冲过小坑（噪声）和小坡（浅局部极小）。β 常取 0.9，直觉上相当于"最近约 10 步梯度的加权平均"。' },
      { heading: '自适应步长与 Adam', body: 'AdaGrad 给每个参数累计"历史梯度平方和"，平方和大的参数步长自动调小——但只减不增，后期步长趋于 0 学不动；RMSProp 改成指数移动平均，忘掉久远的、盯住近期。Adam（Adaptive Moment Estimation）= Momentum（一阶动量 m，记方向）+ RMSProp（二阶动量 v，记幅度），再做偏差修正。面试高频：说出"一阶动量≈梯度均值、二阶动量≈梯度平方均值、β₁=0.9、β₂=0.999、ε=10⁻⁸"。' }
    ],
    principle: [
      {
        heading: 'SGD 与动量',
        body: 'SGD 是一切的基线；Momentum 只是把"更新方向"从当前梯度换成历史梯度的加权平均。别以为 Adam 全面取代了它：SGD+Momentum 在许多视觉任务上泛化依然很强，"选哪个优化器"本身就是面试常问的权衡题。',
        formula: 'SGD：θ ← θ − η·g；　Momentum：v ← β·v + g，θ ← θ − η·v',
        formulaNote: '<ul><li><b>θ</b>：参数；<b>g = ∇L(θ)</b>：这一步用小批数据算出的梯度（来自 m3-02）</li><li><b>η</b>：学习率，全局步长旋钮</li><li><b>v</b>：速度（动量），历史梯度的指数加权平均</li><li><b>β</b>：动量系数，常用 0.9——"保留九成旧速度，添一成新梯度"</li></ul>'
      },
      {
        heading: '自适应学习率：RMSProp',
        body: 's 是梯度平方的指数移动平均，近似"这个参数的梯度经常有多大"。除以 √s 之后：经常大幅震荡的参数步长被压小，梯度稀疏平缓的参数步长被放大——不同参数各走各的合适步幅，这正是"自适应"的含义。AdaGrad 是它的"不遗忘版本"（s 只累加），后期容易学不动。',
        formula: 's ← ρ·s + (1−ρ)·g²，　θ ← θ − η·g / (√s + ε)',
        formulaNote: '<ul><li><b>s</b>：该参数历史梯度平方的指数移动平均（二阶动量的前身）</li><li><b>ρ</b>：衰减率，决定"记多近的历史"</li><li><b>√s</b>：近似梯度幅度的均方根（RMS），充当"分母步长调节器"</li><li><b>ε</b>：极小常数，防止除零</li><li>效果：梯度常年大的参数 → √s 大 → 步长小；梯度小的参数 → 步长相对大</li></ul>'
      },
      {
        heading: 'Adam：一阶 + 二阶动量（面试必背）',
        body: 'm 是梯度的指数移动平均（方向记忆，继承 Momentum）；v 是梯度平方的指数移动平均（幅度感知，继承 RMSProp）；训练初期 m、v 偏向 0，除以 (1−βᵗ) 做<b>偏差修正</b>拉回真实水平——这是 Adam 论文（Kingma &amp; Ba, ICLR 2015）的关键一步，也常被追问。默认超参：η=0.001，β₁=0.9，β₂=0.999，ε=10⁻⁸。',
        formula: 'm ← β₁m + (1−β₁)g；v ← β₂v + (1−β₂)g²；m̂ = m/(1−β₁ᵗ)；v̂ = v/(1−β₂ᵗ)；θ ← θ − η·m̂/(√v̂ + ε)',
        formulaNote: '<ul><li><b>m（一阶动量）</b>：梯度的指数移动平均，近似均值——"平均往哪走"，替代裸梯度</li><li><b>v（二阶动量）</b>：梯度平方的指数移动平均，近似未中心化方差——"平均走多猛"，自适应分母</li><li><b>m̂、v̂</b>：偏差修正后的版本；不修正的话第一步 m≈0.1g、v≈0.001g²，严重低估</li><li><b>β₁=0.9、β₂=0.999</b>：两个动量各自的记忆长度（短记忆管方向、长记忆管幅度）</li><li><b>ε</b>：数值稳定小量；<b>η</b> 默认 0.001，仍需按任务调整</li></ul>'
      }
    ],
    animation: {
      title: '优化器下山对比器：同一个坡，三种走法',
      html: '<div class="anim-m3-03"><p class="anim-m3-03-desc">损失地形 f(x) = x²/8，小球从 x = 8 出发。选一个优化器、调学习率，看它怎么下山：</p><div class="anim-m3-03-box"><div class="anim-m3-03-ball"></div></div><div class="anim-m3-03-ctrl"><label>优化器 <select class="anim-m3-03-sel"><option value="sgd">SGD</option><option value="mom">Momentum</option><option value="adam">Adam</option></select></label><label>学习率 η <input class="anim-m3-03-lr" type="range" min="0.2" max="8" step="0.2" value="1"> <span class="anim-m3-03-lrv">1.0</span></label><button class="anim-m3-03-step" type="button">走一步</button><button class="anim-m3-03-run" type="button">快进 30 步</button><button class="anim-m3-03-reset" type="button">重置</button></div><div class="anim-m3-03-info"></div></div>',
      css: '.anim-m3-03 { font-size: 13px; }\n.anim-m3-03-desc { margin: 0 0 8px; }\n.anim-m3-03-box { position: relative; width: 320px; max-width: 100%; height: 150px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px; overflow: hidden; }\n.anim-m3-03-pt { position: absolute; width: 3px; height: 3px; margin: -1.5px 0 0 -1.5px; border-radius: 50%; background: #cbd5e1; }\n.anim-m3-03-trail { position: absolute; width: 5px; height: 5px; margin: -2.5px 0 0 -2.5px; border-radius: 50%; background: #f59e0b; opacity: .6; }\n.anim-m3-03-ball { position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%; background: #8b5cf6; box-shadow: 0 1px 4px rgba(0,0,0,.35); transition: left .4s ease, top .4s ease; }\n.anim-m3-03-ctrl { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 6px; }\n.anim-m3-03-ctrl button, .anim-m3-03-ctrl select { padding: 4px 10px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m3-03-info { font-family: monospace; font-size: 12px; color: #334155; min-height: 30px; }',
      js: function (root) {
        var W = 320, H = 150;
        var box = root.querySelector('.anim-m3-03-box');
        var sel = root.querySelector('.anim-m3-03-sel');
        var lr = root.querySelector('.anim-m3-03-lr');
        var lrv = root.querySelector('.anim-m3-03-lrv');
        var info = root.querySelector('.anim-m3-03-info');
        var ball = root.querySelector('.anim-m3-03-ball');
        var stepBtn = root.querySelector('.anim-m3-03-step');
        var runBtn = root.querySelector('.anim-m3-03-run');
        var resetBtn = root.querySelector('.anim-m3-03-reset');
        if (!box || !info || !ball || !stepBtn) return;
        var XMIN = -10, XMAX = 10;
        function fx(x) { return x * x / 8; }
        function toPix(x) {
          var px = (x - XMIN) / (XMAX - XMIN) * W;
          var py = H - 10 - fx(x) / fx(XMAX) * (H - 20);
          return [px, py];
        }
        var i, p, d;
        for (i = 0; i <= 80; i++) {
          p = toPix(XMIN + i * (XMAX - XMIN) / 80);
          d = document.createElement('div');
          d.className = 'anim-m3-03-pt';
          d.style.left = p[0] + 'px';
          d.style.top = p[1] + 'px';
          box.appendChild(d);
        }
        var st;
        function reset() {
          st = { x: 8, v: 0, m: 0, s: 0, t: 0, n: 0 };
          box.querySelectorAll('.anim-m3-03-trail').forEach(function (e) { e.remove(); });
          render();
        }
        function stepOnce() {
          var eta = lr ? Number(lr.value) : 1;
          var g = st.x / 4;
          var opt = sel ? sel.value : 'sgd';
          if (opt === 'sgd') { st.x -= eta * g; }
          else if (opt === 'mom') { st.v = 0.9 * st.v + g; st.x -= eta * st.v; }
          else {
            st.t++;
            st.m = 0.9 * st.m + 0.1 * g;
            st.s = 0.999 * st.s + 0.001 * g * g;
            var mh = st.m / (1 - Math.pow(0.9, st.t));
            var vh = st.s / (1 - Math.pow(0.999, st.t));
            st.x -= eta * mh / (Math.sqrt(vh) + 1e-8);
          }
          st.n++;
          var tr = document.createElement('div');
          tr.className = 'anim-m3-03-trail';
          p = toPix(st.x);
          tr.style.left = p[0] + 'px';
          tr.style.top = p[1] + 'px';
          box.appendChild(tr);
          if (box.querySelectorAll('.anim-m3-03-trail').length > 300) { box.querySelector('.anim-m3-03-trail').remove(); }
          render();
        }
        function render() {
          p = toPix(st.x);
          ball.style.left = p[0] + 'px';
          ball.style.top = p[1] + 'px';
          var opt = sel ? sel.value : 'sgd';
          var note = opt === 'sgd' ? 'SGD：只看当前梯度，步长 = η×g'
            : (opt === 'mom' ? 'Momentum：v 累积历史梯度，方向一致会越走越快'
              : 'Adam：步长 ≈ η×符号(g)，谷底附近小幅摆动属正常，实战配合学习率衰减');
          var off = Math.abs(st.x) > XMAX ? '｜⚠ 步子太大，飞出画面了（学习率过大 → 发散）' : '';
          info.textContent = '第 ' + st.n + ' 步｜x = ' + st.x.toFixed(3) + '｜损失 f(x) = ' + fx(st.x).toFixed(3) + off + '｜' + note;
          if (lrv && lr) lrv.textContent = Number(lr.value).toFixed(1);
        }
        stepBtn.addEventListener('click', stepOnce);
        if (runBtn) runBtn.addEventListener('click', function () { for (var k = 0; k < 30; k++) stepOnce(); });
        if (resetBtn) resetBtn.addEventListener('click', reset);
        if (lr) lr.addEventListener('input', function () { lrv.textContent = Number(lr.value).toFixed(1); });
        if (sel) sel.addEventListener('change', reset);
        reset();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'Adam 优化器结合了哪两种机制？',
        options: ['动量（一阶动量）+ 自适应学习率（二阶动量）', '动量 + Dropout', '数据增强 + 早停', 'L2 正则 + 梯度裁剪'],
        answer: 0,
        explanation: 'Adam = Momentum 的动量（一阶动量 m，梯度均值，记方向）+ RMSProp 的自适应学习率（二阶动量 v，梯度平方均值，记幅度），再加偏差修正。选项 B/C/D 混入的是正则化与防过拟合手段（m3-04），与优化器的更新规则无关——面试最爱用"Adam 由什么组成"开场。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'RMSProp 用梯度平方的指数移动平均做分母：梯度长期很大的参数步长会被自动调小，长期平缓的参数步长相对放大。',
        answer: true,
        explanation: 's 是梯度平方的指数移动平均，√s 近似该参数梯度的典型幅度；更新量 η·g/(√s+ε) 中，梯度常年大的参数分母大、步子被压小，梯度稀疏的参数步子相对放大——这就是"自适应"的含义。常见误区：以为自适应学习率是全局一个数在变（那是学习率调度），RMSProp/Adam 的缩放是逐参数独立的。'
      },
      {
        type: 'code', difficulty: 3,
        question: '补全 PyTorch 训练循环：用 Adam 优化器（学习率 0.001），并完成反向传播一步。',
        template: 'import torch\n\nmodel = MyModel()\noptim = torch.optim.____(model.parameters(), ____=0.001)  # Adam 优化器\nfor x, y in loader:\n    pred = model(x)\n    loss = loss_fn(pred, y)\n    loss.____()          # 反向传播：算出所有参数的梯度\n    optim.step()         # 优化器：按梯度更新参数\n    optim.zero_grad()    # 清空梯度，准备下一轮',
        checks: ['Adam', 'lr', 'backward'],
        solution: 'import torch\n\nmodel = MyModel()\noptim = torch.optim.Adam(model.parameters(), lr=0.001)\nfor x, y in loader:\n    pred = model(x)\n    loss = loss_fn(pred, y)\n    loss.backward()      # 反向传播算梯度\n    optim.step()         # Adam 更新参数\n    optim.zero_grad()    # 清空梯度',
        explanation: '三个考点：优化器选 torch.optim.Adam（默认 β₁=0.9、β₂=0.999、ε=1e-8）；学习率用 lr= 关键字传入；反向传播调 loss.backward()，对应 m3-02。常见误区：忘写 backward 导致梯度全为 None、step 不动；或漏掉 zero_grad 导致梯度跨 batch 累加——这是新手训练代码的头号 bug。'
      }
    ],
    relations: {
      prerequisites: ['m3-02'],
      successors: [],
      confusables: [
        { other: 'm1-03', tip: 'm1-03 讲"梯度下降"这个总策略（沿负梯度走），本课讲策略的具体实现谱系：SGD/Momentum/RMSProp/Adam 都是"这一步怎么走"的不同方案，核心差异在步长与方向怎么定。' },
        { other: 'm3-02', tip: '分工：反向传播"算梯度"，优化器"用梯度"。训练循环里 backward() 对应 m3-02，optim.step() 对应本课；两者的先后顺序不能颠倒。' }
      ]
    },
    memory: {
      mnemonic: 'SGD 蒙眼，动量攒劲，自适应看路；Adam 一阶记方向、二阶定步长。',
      selfTest: [
        { q: '面试背诵：Adam 的两个动量分别是什么？', a: '一阶动量 m：梯度的指数移动平均（近似均值），保留历史方向、平滑震荡，继承自 Momentum，β₁=0.9；二阶动量 v：梯度平方的指数移动平均（近似未中心化方差），逐参数自适应缩放步长，继承自 RMSProp，β₂=0.999。更新量 η·m̂/(√v̂+ε)，m̂、v̂ 是除以 (1−βᵗ) 的偏差修正，ε=10⁻⁸ 防除零。' },
        { q: 'Momentum 为什么能"冲过小坑"？', a: '它把历史梯度攒成速度 v：方向一致时逐步加速、来回相反时相互抵消。小坑产生的反向梯度不足以抵消已有动量，小球带着惯性冲过去——本质是"平均掉震荡、加速一致方向"。' },
        { q: '学习率 η 和二阶动量 √v 同时控制步长，分工有何不同？', a: 'η 是全局步长基准，对所有参数一致；√v 是逐参数的相对缩放（梯度长期大的参数被压小、长期小的被放大）。最终步长 = η × m̂/√v̂：η 管"整体快慢"，v 管"个体配速"。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：Adam 优化器聪明在哪？',
      reference: '下坡时它既记得最近几步一直往哪走（动量，不被单次噪声带偏），又会看每个参数所在的路况自动调步幅（陡处小步、缓处大步），把"惯性"和"看路"合在一起，所以默认就好用、不用精调。'
    }
  },
  {
    id: 'm3-04',
    title: '过拟合与正则化',
    oneLiner: '背题型学霸 vs 理解型学霸：如何防止模型死记硬背',
    estMinutes: 12,
    analogy: {
      title: '背题的同学 vs 理解的同学',
      body: '两个同学备考：甲把 500 道模拟题答案背得滚瓜烂熟，模拟卷次次满分（训练损失极低），高考换了新题就懵（验证损失飙升）；乙把题型背后的道理吃透，模拟卷 90 分，高考照样 90 分。机器学习里，模型"死记训练数据、新数据就翻车"的病叫<b>过拟合（Overfitting）</b>；正则化（Regularization）就是给模型立规矩的一整套纪律：不许只背、要学规律。'
    },
    intuition: [
      { heading: '怎么判断：看两条损失曲线', body: '把数据分成训练集和验证集，边训练边画两条损失曲线。健康状态：两条一起下降、挨得很近。过拟合警报：训练损失继续降、验证损失却掉头回升——模型开始背题了。反过来两条都降不下去、都偏高，是欠拟合（Underfitting）——学得还不够。面试画图题常考这个"剪刀差"分叉。' },
      { heading: 'Dropout：随机点名', body: '训练时每轮随机让一部分神经元"下课"（输出置零，比例常取 0.1~0.5），推理时全员上岗。效果：网络不敢把宝押在任何单个神经元身上，被迫学出冗余、分散的特征——就像小组作业随机点名，谁也别想躺赢。工程细节：PyTorch 训练时对保留值除以 (1−p) 补偿期望，推理时直接关闭，无需再缩放。' },
      { heading: 'L2 罚款 + 早停 + 数据增强', body: 'L2 正则在损失里加 λΣw²——权重越大罚款越重，逼着模型"用最简单的方式解释数据"。早停（Early Stopping）：盯住验证损失，一回升就停手，别把题背完。数据增强（Data Augmentation）：把训练数据翻倍变花样（图片翻转裁剪、文本回译），见多识广自然背不了题。' }
    ],
    principle: [
      {
        heading: '过拟合的数学画像',
        body: '训练误差低只说明"记住能力强"，泛化差距大说明"背得多懂太少"。模型容量（参数量）越大、训练数据越少、训练越久，越容易过拟合——对策也正好从这三头下手：加约束（正则化）、加数据（增强）、控时长（早停）。',
        formula: '泛化误差 = 训练误差 + 泛化差距；目标：两者同小',
        formulaNote: '<ul><li><b>训练误差</b>：模型在见过的数据上的错误率（模拟考成绩）</li><li><b>泛化误差</b>：在没见过的新数据上的错误率（高考成绩）</li><li><b>泛化差距</b>：两者之差，衡量"背题程度"</li><li><b>欠拟合</b> = 两者都高；<b>健康</b> = 两者同低且差距小</li></ul>'
      },
      {
        heading: 'L2 正则与权重衰减',
        body: '罚项把"权重整体偏大"也计入损失。每步更新相当于先把权重乘一个略小于 1 的系数（收缩 shrink），再按原梯度走——所以 L2 又叫权重衰减（Weight Decay）。λ 是罚款力度：太大权重全被压扁 → 欠拟合，太小形同虚设。大模型训练标配的 AdamW，就是把权重衰减从 Adam 的自适应步长里剥离出来单独执行。',
        formula: "L' = L + λ·Σwᵢ²；梯度 ∂L'/∂w = ∂L/∂w + 2λw；更新近似 w ← (1−2λη)·w − η·∂L/∂w",
        formulaNote: '<ul><li><b>Σwᵢ²</b>：所有权重平方和，衡量"权重整体肥瘦"</li><li><b>λ</b>：正则强度（罚款单价），需调的超参数</li><li><b>+2λw</b>：罚项带来的额外梯度，方向永远把 w 往 0 拉</li><li><b>(1−2λη)</b>：小于 1 的衰减因子——每步先"瘦身"再走梯度，故名权重衰减</li></ul>'
      },
      {
        heading: 'Dropout 的训练/推理差异（易错点）',
        body: '丢弃会让输出期望变小，所以训练时对保留值除以 (1−p)（inverted dropout），保证输出期望与不丢弃时一致；推理时不需要任何随机、也不再缩放。面试易错："推理时也要随机丢弃"是错的——推理必须确定、用全部神经元，PyTorch 里 model.eval() 自动切换。',
        formula: '训练：ã = a ⊙ mask/(1−p)，mask 各元素以概率 p 为 0；推理：直接用全部神经元',
        formulaNote: '<ul><li><b>mask</b>：与激活同形状的 0/1 掩码，随机生成，每个训练步重抽</li><li><b>p</b>：丢弃概率，隐藏层常用 0.1~0.5</li><li><b>除以 (1−p)</b>：让保留值的期望与不丢弃时一致，推理无需补偿</li><li><b>推理</b>：关闭随机、全神经元前向，行为完全确定</li></ul>'
      }
    ],
    animation: {
      title: '训练/验证损失分叉观察台：亲眼看一次过拟合',
      html: '<div class="anim-m3-04"><p class="anim-m3-04-leg">紫线 = 训练损失，橙线 = 验证损失。拖动"训练轮数"观察分叉，或开启正则化对比：</p><svg class="anim-m3-04-svg" viewBox="0 0 320 150" role="img" aria-label="训练与验证损失曲线"></svg><div class="anim-m3-04-ctrl"><label>训练轮数 <input class="anim-m3-04-ep" type="range" min="1" max="30" step="1" value="1"> <span class="anim-m3-04-epv">1</span></label><button class="anim-m3-04-tog" type="button">开启正则化（L2 + Dropout）重训</button></div><div class="anim-m3-04-info"></div></div>',
      css: '.anim-m3-04 { font-size: 13px; }\n.anim-m3-04-leg { font-size: 12px; color: #64748b; margin: 0 0 6px; }\n.anim-m3-04-svg { width: 320px; max-width: 100%; height: 150px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; display: block; margin-bottom: 8px; }\n.anim-m3-04-ctrl { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 6px; }\n.anim-m3-04-ctrl button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m3-04-info { font-family: monospace; font-size: 12px; color: #334155; min-height: 30px; }',
      js: function (root) {
        var svg = root.querySelector('.anim-m3-04-svg');
        var ep = root.querySelector('.anim-m3-04-ep');
        var epv = root.querySelector('.anim-m3-04-epv');
        var info = root.querySelector('.anim-m3-04-info');
        var btn = root.querySelector('.anim-m3-04-tog');
        if (!svg || !ep || !info) return;
        var reg = false;
        var W = 320, H = 150;
        function trainL(e) { return 2.1 * Math.exp(-0.22 * e) + 0.08; }
        function valL(e) {
          if (reg) { return 1.95 * Math.exp(-0.15 * e) + 0.34; }
          return 1.9 * Math.exp(-0.2 * e) + 0.28 + (e > 9 ? 0.016 * Math.pow(e - 9, 1.7) : 0);
        }
        function px(e) { return 12 + (e - 1) / 29 * (W - 24); }
        function py(v) { return H - 12 - v / 3.3 * (H - 26); }
        function draw() {
          var s1 = '', s2 = '', e;
          for (e = 1; e <= 30; e++) {
            s1 += px(e).toFixed(1) + ',' + py(trainL(e)).toFixed(1) + ' ';
            s2 += px(e).toFixed(1) + ',' + py(valL(e)).toFixed(1) + ' ';
          }
          var ce = Number(ep.value);
          var marker = '<line x1="' + px(ce) + '" y1="6" x2="' + px(ce) + '" y2="' + (H - 12) + '" stroke="#94a3b8" stroke-dasharray="4 3" />' +
            '<circle cx="' + px(ce) + '" cy="' + py(trainL(ce)).toFixed(1) + '" r="4" fill="#8b5cf6" />' +
            '<circle cx="' + px(ce) + '" cy="' + py(valL(ce)).toFixed(1) + '" r="4" fill="#f59e0b" />';
          svg.innerHTML = '<polyline points="' + s1 + '" fill="none" stroke="#8b5cf6" stroke-width="2" />' +
            '<polyline points="' + s2 + '" fill="none" stroke="#f59e0b" stroke-width="2" />' + marker;
          var msg;
          if (ce <= 6) { msg = '前几轮：两条曲线一起降，模型还在学（偏欠拟合期）'; }
          else if (reg) { msg = '开启正则化后：训练略慢，但验证损失不再回升——泛化稳住了'; }
          else if (ce <= 10) { msg = '训练与验证同步下降、差距小：健康'; }
          else { msg = '警报：训练损失还在降、验证损失掉头回升 → 过拟合！该上正则化 / 早停了'; }
          info.textContent = '第 ' + ce + ' 轮｜训练损失 ' + trainL(ce).toFixed(3) + '｜验证损失 ' + valL(ce).toFixed(3) + '　→　' + msg;
          if (epv) epv.textContent = ce;
          if (btn) btn.textContent = reg ? '关闭正则化（还原过拟合）' : '开启正则化（L2 + Dropout）重训';
        }
        ep.addEventListener('input', draw);
        if (btn) btn.addEventListener('click', function () { reg = !reg; draw(); });
        draw();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '训练几个 epoch 后，训练损失降到很低，验证损失却持续上升。这说明模型怎么了？',
        options: ['过拟合，开始死记训练数据', '欠拟合，学得还不够', '训练很成功，可以部署了', '数据太多了，需要减数据'],
        answer: 0,
        explanation: '训练损失低 + 验证损失回升 = 教科书式过拟合：模型在背训练集而不是学规律。选项 B 欠拟合是两条损失都高且降不动；选项 C 恰恰最危险——只看训练损失就宣布成功是新手最大陷阱；选项 D 方向反了，数据更多反而缓解过拟合。面试画图题就考这组分叉曲线。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'Dropout 在训练时随机把一部分神经元输出置零；推理（评估）时则关闭 Dropout、使用全部神经元，不做任何随机丢弃。',
        answer: true,
        explanation: 'Dropout 只在训练时"随机点名"以逼出冗余特征；推理要求输出确定、可复现，必须用全部神经元。训练时保留值除以 (1−p) 已补偿期望，推理无需再缩放。常见误区：以为推理时也要随机丢弃（会导致预测抖动不可复现）；PyTorch 中 model.eval() 一键切换到推理模式。'
      },
      {
        type: 'fill', difficulty: 3,
        question: 'L2 正则化在损失中加入 λ·Σw²：λ 越大，对大权重的"罚款"越重，训练出的权重整体就越____（填：大 或 小）。',
        accept: ['小'],
        explanation: 'λ 越大罚项越狠，权重被持续往 0 拉（权重衰减），整体变小、模型更平滑简单——但 λ 过大会把权重压得太扁导致欠拟合。常见误区：以为正则化让权重变大或认为 λ 无所谓；λ 是需要用验证集调的超参数。大模型训练中 AdamW 把这步单独执行，正是工程上对这一点的重视。'
      }
    ],
    relations: {
      prerequisites: ['m3-01'],
      successors: [],
      confusables: [
        { other: 'm2-07', tip: '交叉验证是"怎么可靠地估计泛化误差"的评估手段，正则化是"降低泛化误差"的训练手段——一个负责体检，一个负责治病，实践中配合使用：用交叉验证选 λ 等超参数。' },
        { other: 'm2-04', tip: '决策树的剪枝、限制树深，与 L2/Dropout 是同一种思想（约束模型复杂度防止背题）在不同模型家族的落地方式；面试可以说"正则化是跨模型通用的防过拟合思想"。' }
      ]
    },
    memory: {
      mnemonic: '训练降、验证升，背题了；Dropout 点名，L2 罚款，早停收手，增强加餐。',
      selfTest: [
        { q: '面试画图题：训练/验证损失曲线怎么判断过拟合？', a: '训练损失持续下降、验证损失先降后回升，两线呈"剪刀差"分叉即过拟合；两线都高且降不动是欠拟合；健康状态是两线同步下降、收敛后差距小。对策按过拟合程度选：Dropout/L2/早停/数据增强。' },
        { q: 'Dropout 在训练和推理时的行为有何不同？', a: '训练时以概率 p 随机把神经元输出置零，并对保留值除以 (1−p) 保持期望（inverted dropout）；推理时关闭随机、使用全部神经元，不做任何缩放（PyTorch 用 model.eval() 切换）。推理随机丢弃是典型错误答案。' },
        { q: '为什么 L2 正则又叫"权重衰减"？', a: '罚项 λΣw² 的梯度是 2λw，加进更新式后每步相当于先把 w 乘以 (1−2λη)（小于 1，向 0 收缩），再走原梯度步——权重被逐步"衰减"，模型被迫用更平滑、更简单的权重组合解释数据。AdamW 就是把它从 Adam 的自适应更新里剥离出来单独执行。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：什么是过拟合，怎么防？',
      reference: '模型把训练题背下来了、一遇新题就翻车，这叫过拟合；防法是给它立规矩——随机点名（Dropout）、给大权重罚款（L2）、见好就收（早停）、多喂新题（数据增强），逼它学规律而不是背答案。'
    }
  },
  {
    id: 'm3-05',
    title: '初始化与归一化',
    oneLiner: '起跑站位（初始化）与节拍器（归一化）如何决定训练成败',
    estMinutes: 12,
    analogy: {
      title: '起跑线与节拍器',
      body: '一场合唱排练：开嗓前先站好位（<b>初始化</b>）——如果全班都站同一个位置、发同一个音（全 0 初始化），声部之间永远分不出层次，只能唱出"一个声部"；站位太挤或太散（权重太小或太大），声音要么细不可闻、要么刺耳爆麦。排练中还需要节拍器不断把音量拉回标准线（<b>归一化</b>），否则一层层传下去，不是越唱越炸就是越唱越轻。深度网络同理：初始化决定起点，归一化稳住每一层的数据节奏。'
    },
    intuition: [
      { heading: '全 0 初始化为什么学不动', body: '若同一层所有权重都是 0（或同一常数），每个神经元的输入相同、输出相同、梯度也相同——更新之后仍然一模一样。这叫对称性（Symmetry）破不掉：一层上万个神经元实际只相当于一个神经元，网络没有分工。所以必须随机初始化，先让各神经元"各有立场"，梯度才能把它们往不同方向带。' },
      { heading: '随机也要有分寸：Xavier 与 He', body: '随机得太小，信号一层层缩水，深层网络前半段就"哑"了（梯度消失）；太大则层层放大直至溢出（梯度爆炸）。合适的尺度与每层输入个数 fan_in 有关：tanh/sigmoid 用 Xavier 初始化，ReLU 用 He（Kaiming）初始化——面试能说出"标准差 = √(2/fan_in)（He）、√(2/(fan_in+fan_out))（Xavier）"即可。' },
      { heading: '归一化：给每层上节拍器', body: '即使起跑合格，训练中参数一动，各层输出的均值方差还是会漂移。归一化层在层与层之间做"减均值、除标准差，再缩放平移"的校准：<b>BatchNorm（BN）沿 batch 方向</b>统计——把同一特征在不同样本间摆匀；<b>LayerNorm（LN）沿特征方向</b>统计——把同一个样本自己的各维特征摆匀。面试爱问：LLM 里为什么用 LN 不用 BN？——序列变长、batch 小或样本间差异大时 BN 的统计量不稳，LN 完全不受影响（m5-04 展开）。' }
    ],
    principle: [
      {
        heading: '初始化的尺度公式',
        body: '以 He 为例：n 个输入的加权和，若每个输入方差 σ²、权重方差 σw²，则输出方差是 n·σw²·σ²；ReLU 把负半边砍掉，方差再减半——要维持方差不缩水，需 σw² = 2/n。这就是"标准差 √(2/fan_in)"的来历：数字不大，含义是"每过一层，信号的能量刚好不增不减"。',
        formula: 'Xavier：Var(w) = 2/(fan_in + fan_out)；　He：Var(w) = 2/fan_in，即 std = √(2/fan_in)',
        formulaNote: '<ul><li><b>fan_in</b>：该层每个神经元收到的输入个数；fan_out 是输出个数</li><li><b>n·σw²·σ²</b>：n 个独立乘积的方差相加（方差可加性，m1-02）</li><li><b>÷2（ReLU）</b>：负值被置零，近似损失一半方差，所以 He 是 Xavier 的两倍</li><li><b>例</b>：fan_in = 512 时 He 的 std = √(2/512) ≈ 0.063</li><li><b>Xavier</b>：为 tanh/sigmoid 兼顾前向与反向传播的折中</li></ul>'
      },
      {
        heading: 'BatchNorm：沿 batch 方向',
        body: '对每一个特征通道，把"整个 batch 在这个特征上的取值"拉到均值 0、方差 1，再用可学习的 γ、β 还原表达力（万一"不归一化"更好呢，留给网络自己选）。训练时用当前 batch 的统计量并维护滑动平均供推理使用。batch 越小、样本间差异越大，统计量噪声越大，BN 越不稳——这是它的死穴。',
        formula: 'μ_B = (1/m)·Σᵢxᵢ，σ_B² = (1/m)·Σᵢ(xᵢ−μ_B)²；x̂ = (x−μ_B)/√(σ_B²+ε)，y = γ·x̂ + β',
        formulaNote: '<ul><li><b>μ_B、σ_B²</b>：当前 batch 在该特征上的均值与方差（跨样本统计）</li><li><b>ε</b>：防除零小量</li><li><b>x̂</b>：标准化后的值，该特征在 batch 内均值为 0、方差为 1</li><li><b>γ、β</b>：可学习的缩放与平移，把"要不要归一化"的选择权交给网络</li><li><b>m</b>：batch 内样本数——m 越小统计量越抖</li></ul>'
      },
      {
        heading: 'LayerNorm：沿特征方向（LLM 的选择）',
        body: '对每个样本自己，把"它的所有特征维"拉到均值 0、方差 1。统计只依赖样本自身：batch 大小无关、序列长短无关、训练推理行为一致，天然适配变长文本。Transformer/LLM 全线采用 LN（m5-04 结合残差细讲）。一句话对比：<b>BN 管列（跨样本看同一特征），LN 管行（同一样本看所有特征）</b>。',
        formula: 'μ = (1/d)·Σⱼxⱼ，σ² = (1/d)·Σⱼ(xⱼ−μ)²；x̂ = (x−μ)/√(σ²+ε)，y = γ·x̂ + β',
        formulaNote: '<ul><li><b>d</b>：特征维度数（如隐藏维 768），对它求均值方差</li><li><b>对每个样本独立</b>：不借用同 batch 其他样本的信息</li><li><b>变长序列</b>：每个位置各自归一化，与序列长度无关</li><li><b>对比 BN</b>：BN 跨样本统计同一特征，LN 跨特征统计同一样本——方向恰好垂直</li></ul>'
      }
    ],
    animation: {
      title: '信号逐层传递观测台：σ 的生死 8 层',
      html: '<div class="anim-m3-05"><p class="anim-m3-05-desc">k = 权重标准差相对理论最优（ReLU→He、tanh→Xavier）的倍率：k = 1.0 时信号能量层层保持。点「过一层」，看初始 σ=1 的信号穿过 8 层后的命运：</p><div class="anim-m3-05-ctrl"><label>k 倍率 <input class="anim-m3-05-k" type="range" min="0.4" max="2.2" step="0.1" value="1"> <span class="anim-m3-05-kv">1.0</span></label><label>激活 <select class="anim-m3-05-act"><option value="relu">ReLU</option><option value="tanh">tanh</option></select></label><button class="anim-m3-05-next" type="button">过一层</button><button class="anim-m3-05-reset" type="button">重置</button></div><div class="anim-m3-05-bars"></div><div class="anim-m3-05-info"></div></div>',
      css: '.anim-m3-05 { font-size: 13px; }\n.anim-m3-05-desc { margin: 0 0 8px; }\n.anim-m3-05-ctrl { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 8px; }\n.anim-m3-05-ctrl button, .anim-m3-05-ctrl select { padding: 4px 10px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m3-05-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }\n.anim-m3-05-lab { width: 44px; font-size: 11px; color: #475569; text-align: right; }\n.anim-m3-05-track { flex: 1; height: 12px; background: #f1f5f9; border-radius: 6px; overflow: hidden; }\n.anim-m3-05-fill { height: 100%; border-radius: 6px; transition: width .4s ease, background .4s ease; }\n.anim-m3-05-ok { background: #22c55e; }\n.anim-m3-05-warn { background: #f59e0b; }\n.anim-m3-05-bad { background: #ef4444; }\n.anim-m3-05-dim { background: #cbd5e1; }\n.anim-m3-05-num { font-family: monospace; font-size: 11px; color: #475569; width: 140px; }\n.anim-m3-05-info { font-family: monospace; font-size: 12px; color: #334155; margin-top: 6px; min-height: 30px; }',
      js: function (root) {
        var kEl = root.querySelector('.anim-m3-05-k');
        var kv = root.querySelector('.anim-m3-05-kv');
        var actSel = root.querySelector('.anim-m3-05-act');
        var bars = root.querySelector('.anim-m3-05-bars');
        var btn = root.querySelector('.anim-m3-05-next');
        var resetBtn = root.querySelector('.anim-m3-05-reset');
        var info = root.querySelector('.anim-m3-05-info');
        if (!bars || !info || !btn) return;
        var LAYERS = 8;
        var stds = [1];
        function classify(s) {
          if (s >= 8) { return { cls: 'anim-m3-05-bad', tag: '爆炸' }; }
          if (s <= 0.02) { return { cls: 'anim-m3-05-dim', tag: '消失' }; }
          if (s >= 0.3 && s <= 3) { return { cls: 'anim-m3-05-ok', tag: '健康' }; }
          return { cls: 'anim-m3-05-warn', tag: '偏移' };
        }
        function render() {
          var act = actSel ? actSel.value : 'relu';
          var html = '', i, s, c, w;
          for (i = 0; i < stds.length; i++) {
            s = stds[i];
            c = classify(s);
            w = Math.min(100, Math.max(1.5, Math.log10(Math.max(s, 0.0001)) * 25 + 50));
            html += '<div class="anim-m3-05-row"><span class="anim-m3-05-lab">' + (i === 0 ? '输入' : '第' + i + '层') + '</span>' +
              '<div class="anim-m3-05-track"><div class="anim-m3-05-fill ' + c.cls + '" style="width:' + w.toFixed(1) + '%"></div></div>' +
              '<span class="anim-m3-05-num">σ=' + (s >= 100 ? s.toExponential(1) : s.toFixed(3)) + (i === 0 ? '' : ' ' + c.tag) + '</span></div>';
          }
          bars.innerHTML = html;
          var kx = kEl ? Number(kEl.value) : 1;
          var cur = stds[stds.length - 1];
          var msg = 'k = ' + kx.toFixed(1) + '（1.0 = 理论最优）｜' + (act === 'relu' ? 'ReLU 对应 He 初始化 √(2/fan_in)' : 'tanh 对应 Xavier 初始化');
          if (cur >= 8) { msg += '｜信号已爆炸：数值溢出、梯度 NaN'; }
          else if (cur <= 0.02) { msg += '｜信号已消失：后面的层基本学不到东西'; }
          else {
            msg += '｜已传到第 ' + (stds.length - 1) + ' 层';
            if (act === 'tanh' && cur > 1.5) { msg += '，tanh 已进入饱和区（梯度趋 0）'; }
            msg += '，点「过一层」继续';
          }
          info.textContent = msg;
          if (kv && kEl) kv.textContent = kx.toFixed(1);
        }
        btn.addEventListener('click', function () {
          if (stds.length > LAYERS) { return; }
          var kx = kEl ? Number(kEl.value) : 1;
          stds.push(stds[stds.length - 1] * kx);
          render();
        });
        function reset() { stds = [1]; render(); }
        if (resetBtn) resetBtn.addEventListener('click', reset);
        if (kEl) kEl.addEventListener('input', function () { stds = [1]; render(); });
        if (actSel) actSel.addEventListener('change', function () { stds = [1]; render(); });
        reset();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '把神经网络的权重全部初始化为 0，会发生什么？',
        options: ['同一层所有神经元输出与梯度相同，对称性破不掉，学不出分工', '损失直接为 0，训练完成', '模型收敛得更快', '只是显存占用变少，没有其他影响'],
        answer: 0,
        explanation: '全 0（或同常数）时同层各神经元的输出、梯度完全一致，每次更新后仍保持一致——对称性永远破不了，一层等效于一个神经元。选项 B 混淆了"权重为 0"与"损失为 0"；选项 C 恰恰相反，网络学不动；注意偏置 b 可以初始化为 0，出问题的是权重。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'BatchNorm 沿 batch 方向做统计，LayerNorm 沿特征方向；在 batch 较小、样本间差异大或序列长度可变的场景，LayerNorm 通常更稳定。',
        answer: true,
        explanation: 'BN 对同一特征跨样本求均值方差，batch 小或样本异质时统计量噪声大，且变长序列难以组 batch；LN 只对样本自身的特征维统计，与 batch 大小、序列长度无关，训练推理行为一致——所以 Transformer/LLM 全用 LN。这是"NLP 为什么不用 BN"的面试标准答案。'
      },
      {
        type: 'single', difficulty: 3,
        question: '某层有 512 个输入（fan_in = 512），采用 He 初始化，权重的标准差约为多少？',
        options: ['约 0.06', '约 0.63', '约 1.4', '与输入个数无关，取任意值'],
        answer: 0,
        explanation: 'He 初始化 std = √(2/fan_in) = √(2/512) = √0.0039 ≈ 0.063。选项 B 是把公式记成 2/fan_in = 0.0039 后小数点错位；选项 C 混淆了"保持方差不变的倍率"与标准差本身；权重尺度必须随 fan_in 变化（输入越多，单个权重越要小），所以 D 错。'
      }
    ],
    relations: {
      prerequisites: ['m3-02'],
      successors: ['m5-04'],
      confusables: [
        { other: 'm1-06', tip: 'softmax 的"归一化"是把一组分数变成总和为 1 的概率分布（切蛋糕）；LayerNorm 的"归一化"是减均值除标准差的数据校准（摆匀节奏）。中文名字像，数学、目的、位置全不同。' },
        { other: 'm5-04', tip: '本课只讲 LN 的统计方向与动机（为何替代 BN）；m5-04 讲 LN 在 Transformer 里与残差连接的配合（Pre-LN / Post-LN）如何让超深网络稳定训练。' }
      ]
    },
    memory: {
      mnemonic: '全零学不动，对称破不掉；ReLU 配 He，tanh 配 Xavier；BN 沿批，LN 沿特征。',
      selfTest: [
        { q: '面试背诵：为什么不能把权重全初始化为 0？', a: '全 0 时同层所有神经元的输出、梯度完全相同，每次更新后仍保持相同——对称性永远破不了，一层等效于一个神经元，网络学不出分工。必须随机初始化拉开差异，再用 Xavier/He 控制方差尺度。（偏置 b 初始化为 0 没问题，出问题的是权重。）' },
        { q: 'BatchNorm 和 LayerNorm 的统计方向分别是什么？', a: 'BN 沿 batch 方向：对同一特征通道，跨样本求均值方差；LN 沿特征方向：对同一样本，跨所有特征维求均值方差。batch 小、样本异质或序列变长时 BN 统计量不稳，LN 完全不受影响——LLM/Transformer 因此全用 LN。' },
        { q: 'He 初始化的标准差公式是什么？针对什么激活函数？', a: 'std = √(2/fan_in)，针对 ReLU：ReLU 砍掉负半轴使方差减半，权重方差须为 Xavier（2/(fan_in+fan_out)）的两倍来补偿。例如 fan_in = 512 时 std ≈ 0.063。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：为什么模型训练前要"初始化"、训练中要"归一化"？',
      reference: '初始化是把几百位"委员"随机拉开立场（不能全一样，否则永远意见雷同），且音量适中（太大太小信号都传不动）；归一化是训练中不断把每层数据的"音量"拉回标准线，防止一层层放大成噪声、或缩小成无声。'
    }
  },
  {
    id: 'm3-06',
    title: '卷积神经网络 CNN',
    oneLiner: '用滑动的小放大镜看图：参数共享与局部感受野如何省掉天文数字的参数',
    estMinutes: 13,
    analogy: {
      title: '滑动的小放大镜',
      body: '在一幅大图里找"竖直边缘"，不必每次看全图：拿一个 3×3 的小放大镜（<b>卷积核</b>），从左上角开始一格一格滑过整张图，每个位置只看 3×3 的小块并打一个分，把分数按位置铺开就是一张"边缘热度图"。妙处有二：<b>同一个放大镜</b>扫遍全图——不管猫耳朵出现在哪个角落，用的都是同一套判据（参数共享）；放大镜每次只看局部——不必一上来就把百万像素搅在一起（局部感受野）。卷积神经网络（CNN，Convolutional Neural Network）就是层层叠叠的放大镜流水线。'
    },
    intuition: [
      { heading: '局部感受野 + 参数共享：省参数的两大法宝', body: '全连接层（m3-01）看 1000×1000 的图，第一层就要 10⁶×10⁶ 个权重——天文数字。卷积核只有 3×3 = 9 个权重，滑动扫全图：参数量与图像大小无关。代价是"每个位置用同一套判据"，收益是图像规律本来就平移不变（边缘在哪里都是边缘）。面试要点：CNN 的高效来自"结构先验"，不是魔法。' },
      { heading: '池化：做缩略图', body: '卷积输出的特征图（Feature Map）很大，池化（Pooling）把它缩小：2×2 最大池化是每个 2×2 小块只保留最大值——"这块区域有没有目标"比"目标具体在哪一格"更重要，还顺带带来小幅平移容忍。池化没有可学习参数，纯规则操作。' },
      { heading: 'CNN 适合图像，不适合文本', body: '图像的强信息在局部像素组合（边缘 → 纹理 → 部件 → 物体），且空间平移不变——正中卷积下怀。文本不同：词没有"上下左右"的网格位置，关键信息往往相距很远（主语和谓语隔 20 个词），变长且语序敏感——小放大镜看不到长距离依赖。这个问题后来由注意力机制（m5-01）优雅解决，CNN 的局限正是 Transformer 崛起的伏笔。' }
    ],
    principle: [
      {
        heading: '卷积在算什么：尺寸公式是计算题常客',
        body: '每个输出位置 = 放大镜盖住的那一小块与核逐元素相乘再求和。尺寸公式是面试计算题常客：W 图宽、K 核宽、P 零填充（Padding）、S 步幅（Stride）。多层卷积 + 激活堆叠，浅层学边缘纹理、深层学部件语义——特征逐层抽象。',
        formula: '输出尺寸 = (W − K + 2P)/S + 1；　特征图元素 = Σ(核 × 感受野) + b',
        formulaNote: '<ul><li><b>W</b>：输入边长；<b>K</b>：核边长；<b>P</b>：单侧补零圈数；<b>S</b>：每次滑动几格</li><li><b>例</b>：28×28 输入、3×3 核、P=0、S=1 → (28−3)/1+1 = 26 → 输出 26×26</li><li><b>P 取 (K−1)/2（3×3 核配 P=1）</b>可保持尺寸不变，俗称 same padding</li><li><b>逐元素乘加</b>：9 个乘法再加一个和——卷积本质是"模板匹配打分"</li></ul>'
      },
      {
        heading: '特征图与多通道',
        body: '一个核只擅长一种图案，所以要并排放多个核：彩色图输入 3 通道，第一层用 16 个核就输出 16 张特征图（每个核其实横跨所有输入通道，参数为 3×3×3 个权重 + 1 个偏置）。通道数 = 该层学到的图案种类数，越深通道越多、图越小——信息从"空间大、图案少"走向"空间小、图案多"。',
        formula: '输出通道数 = 卷积核个数；每个核输出一张特征图',
        formulaNote: '<ul><li><b>卷积核个数</b>：超参数，决定输出通道数（16、32、64…逐层翻倍是常见配置）</li><li><b>多通道输入</b>：每个核是三维小块（K×K×输入通道数），跨通道加权求和</li><li><b>偏置 b</b>：每个核配一个，同 m3-01 的神经元</li><li><b>趋势</b>：空间尺寸逐层缩小（池化/步幅），通道数逐层增多</li></ul>'
      },
      {
        heading: 'CNN 完整流水线（order 素材）',
        body: '经典流程：卷积提取局部特征 → ReLU 引入非线性 → 池化缩小尺寸；这套"卷-激-池"重复若干轮后，把最后的特征图<b>展平（Flatten）</b>成一维向量，交给全连接层汇总分类。展平是把"空间地图"翻译成"特征清单"的接口——全连接层从此不再关心位置。',
        formula: '卷积 → 激活 →（池化）× N → 展平 → 全连接 → softmax',
        formulaNote: '<ul><li><b>卷积</b>：滑动打分，产出特征图</li><li><b>激活（ReLU）</b>：去负留正，提供非线性（m3-01）</li><li><b>池化</b>：缩略图，缩小空间尺寸</li><li><b>展平</b>：三维特征图拉直成一维向量</li><li><b>全连接 + softmax</b>：汇总特征，输出类别概率（m1-06）</li></ul>'
      }
    ],
    animation: {
      title: '卷积滑动窗口扫描器：亲手扫出一张特征图',
      html: '<div class="anim-m3-06"><p class="anim-m3-06-desc">6×6 输入（中间两列是"白条"）× 3×3 竖直边缘核。同一套 9 个权重扫遍 16 个位置，逐格打分：</p><div class="anim-m3-06-row"><div><div class="anim-m3-06-cap">输入 6×6</div><div class="anim-m3-06-grid anim-m3-06-in"></div></div><div><div class="anim-m3-06-cap">核 3×3</div><div class="anim-m3-06-grid anim-m3-06-k"></div></div><div><div class="anim-m3-06-cap">输出特征图 4×4</div><div class="anim-m3-06-grid anim-m3-06-out"></div></div><div><div class="anim-m3-06-cap">2×2 最大池化</div><div class="anim-m3-06-grid anim-m3-06-pg"></div></div></div><div class="anim-m3-06-btns"><button class="anim-m3-06-step" type="button">滑动一步</button><button class="anim-m3-06-scanall" type="button">扫完全图</button><button class="anim-m3-06-pool" type="button">2×2 最大池化</button><button class="anim-m3-06-reset" type="button">重置</button></div><div class="anim-m3-06-calc"></div></div>',
      css: '.anim-m3-06 { font-size: 13px; }\n.anim-m3-06-desc { margin: 0 0 8px; }\n.anim-m3-06-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }\n.anim-m3-06-cap { font-size: 11px; color: #64748b; margin-bottom: 4px; }\n.anim-m3-06-grid { display: grid; gap: 3px; width: max-content; }\n.anim-m3-06-cell { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 4px; background: #f1f5f9; font-family: monospace; font-size: 12px; color: #334155; transition: background .3s ease; }\n.anim-m3-06-cur { outline: 2px solid #8b5cf6; outline-offset: -2px; background: #ede9fe; }\n.anim-m3-06-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 6px; }\n.anim-m3-06-btns button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m3-06-calc { font-family: monospace; font-size: 12px; color: #334155; min-height: 30px; }',
      js: function (root) {
        var gin = root.querySelector('.anim-m3-06-in');
        var gk = root.querySelector('.anim-m3-06-k');
        var gout = root.querySelector('.anim-m3-06-out');
        var pg = root.querySelector('.anim-m3-06-pg');
        var calc = root.querySelector('.anim-m3-06-calc');
        var stepBtn = root.querySelector('.anim-m3-06-step');
        var scanAllBtn = root.querySelector('.anim-m3-06-scanall');
        var poolBtn = root.querySelector('.anim-m3-06-pool');
        var resetBtn = root.querySelector('.anim-m3-06-reset');
        if (!gin || !gk || !gout || !calc || !stepBtn) return;
        var IN = [
          [0, 0, 1, 1, 0, 0],
          [0, 0, 1, 1, 0, 0],
          [0, 0, 1, 1, 0, 0],
          [0, 0, 1, 1, 0, 0],
          [0, 0, 1, 1, 0, 0],
          [0, 0, 1, 1, 0, 0]
        ];
        var K = [[1, 0, -1], [1, 0, -1], [1, 0, -1]];
        var out = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
        var pos = -1;
        var N = 6, ON = 4, STEPS = 16;
        function mkGrid(el, rows, cols) {
          if (!el) return;
          el.innerHTML = '';
          el.style.gridTemplateColumns = 'repeat(' + cols + ', 26px)';
          for (var i = 0; i < rows * cols; i++) {
            var d = document.createElement('div');
            d.className = 'anim-m3-06-cell';
            el.appendChild(d);
          }
        }
        function cell(el, r, c, cols) { return el ? el.children[r * cols + c] : null; }
        function shade(v) {
          if (v === null) { return '#f1f5f9'; }
          if (v > 0) { return 'rgba(34,197,94,' + Math.min(0.9, v / 3).toFixed(2) + ')'; }
          if (v < 0) { return 'rgba(239,68,68,' + Math.min(0.9, -v / 3).toFixed(2) + ')'; }
          return '#e2e8f0';
        }
        function render() {
          var wr = Math.floor(Math.max(0, pos) / ON), wc = Math.max(0, pos) % ON;
          var r, c, d, inWin;
          for (r = 0; r < N; r++) {
            for (c = 0; c < N; c++) {
              d = cell(gin, r, c, N);
              if (!d) continue;
              d.textContent = IN[r][c];
              inWin = pos >= 0 && r >= wr && r < wr + 3 && c >= wc && c < wc + 3;
              d.classList.toggle('anim-m3-06-cur', inWin);
            }
          }
          for (r = 0; r < 3; r++) {
            for (c = 0; c < 3; c++) {
              d = cell(gk, r, c, 3);
              if (!d) continue;
              d.textContent = K[r][c];
              d.classList.toggle('anim-m3-06-cur', pos >= 0 && K[r][c] !== 0);
            }
          }
          for (r = 0; r < ON; r++) {
            for (c = 0; c < ON; c++) {
              d = cell(gout, r, c, ON);
              if (!d) continue;
              d.textContent = out[r][c] === null ? '' : out[r][c];
              d.style.background = shade(out[r][c]);
            }
          }
          if (pos >= 0) {
            calc.textContent = '放大镜在 (行' + wr + ', 列' + wc + ')：Σ 核×感受野 = ' + out[wr][wc] +
              '　（负 = 黑边：左暗右亮；正 = 白边：左亮右暗；0 = 无边缘）';
          } else {
            calc.textContent = '点「滑动一步」，放大镜从左上角开始逐格扫描（同一套 9 个权重用遍全图）';
          }
          if (pos >= STEPS - 1) { calc.textContent += '　✔ 扫描完成，特征图已生成'; }
        }
        mkGrid(gin, N, N);
        mkGrid(gk, 3, 3);
        mkGrid(gout, ON, ON);
        if (pg) mkGrid(pg, 2, 2);
        function stepOnce() {
          if (pos >= STEPS - 1) { calc.textContent = '已扫完全图：点「2×2 最大池化」看缩略图，或「重置」再来'; return; }
          pos++;
          var wr = Math.floor(pos / ON), wc = pos % ON, s = 0;
          for (var kr = 0; kr < 3; kr++) {
            for (var kc = 0; kc < 3; kc++) { s += K[kr][kc] * IN[wr + kr][wc + kc]; }
          }
          out[wr][wc] = s;
          render();
        }
        stepBtn.addEventListener('click', stepOnce);
        if (scanAllBtn) scanAllBtn.addEventListener('click', function () {
          while (pos < STEPS - 1) { stepOnce(); }
        });
        if (poolBtn) poolBtn.addEventListener('click', function () {
          if (pos < STEPS - 1) { calc.textContent = '先扫完 16 个位置，再做池化（缩略图要基于完整特征图）'; return; }
          if (!pg) return;
          var vals = [[0, 0], [0, 0]], pr, pc, r, c, m;
          for (pr = 0; pr < 2; pr++) {
            for (pc = 0; pc < 2; pc++) {
              m = -Infinity;
              for (r = pr * 2; r < pr * 2 + 2; r++) {
                for (c = pc * 2; c < pc * 2 + 2; c++) { m = Math.max(m, out[r][c]); }
              }
              vals[pr][pc] = m;
            }
          }
          mkGrid(pg, 2, 2);
          for (r = 0; r < 2; r++) {
            for (c = 0; c < 2; c++) {
              var d = cell(pg, r, c, 2);
              if (!d) continue;
              d.textContent = vals[r][c];
              d.style.background = shade(vals[r][c]);
            }
          }
          calc.textContent = '2×2 最大池化：每块只留最大值 → 4×4 特征图缩成 2×2 缩略图（无参数、纯规则）。正值保留 = "这里有白边"的信息还在';
        });
        if (resetBtn) resetBtn.addEventListener('click', function () {
          pos = -1;
          out = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
          if (pg) pg.innerHTML = '';
          render();
        });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '一个 3×3 卷积核在 100×100 的图像上滑动扫描，这个卷积层（单核、不含偏置）的可学习权重有多少个？',
        options: ['9 个（权重共享，与图像大小无关）', '10000 个', '90000 个', '随滑动位置数变化，约 8 万个'],
        answer: 0,
        explanation: '卷积核在空间上滑动时复用同一套权重，参数就是核自身的 3×3 = 9 个，与图像大小和滑动次数无关——这正是"参数共享"省参数的核心。选项 C 是每个位置配独立权重的全连接思路（10⁴ 位置 × 9 权重 ≈ 9 万），恰恰是 CNN 要避免的天文数字。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '池化层没有可学习参数，只按固定规则（如取窗口最大值）缩小特征图，并顺带带来小幅平移容忍。',
        answer: true,
        explanation: '最大池化/平均池化都是纯规则操作，没有权重和偏置，训练时不更新任何参数。它缩小空间尺寸、减少计算量，并让特征对几像素的平移不敏感。常见误区：以为池化也参与"学习"——真正可学习的是前面的卷积核；面试追问"池化为什么无参数"就答"它是固定规则的下采样"。'
      },
      {
        type: 'order', difficulty: 2,
        question: '把经典 CNN 的处理流程按正确顺序排列：',
        items: ['全连接层汇总特征，输出类别分数', '卷积层用小窗口提取局部特征', '池化层把特征图缩小成缩略图', '展平成一维向量', 'ReLU 激活函数去负留正'],
        answer: [1, 4, 2, 3, 0],
        explanation: '正确顺序：卷积（1）→ 激活（4）→ 池化（2）→ 展平（3）→ 全连接（0）。常见误区：把激活放到池化之后（先激活再池化更常见，顺序反了会先丢掉负值信息再匹配）、忘记展平（卷积输出是三维特征图，全连接只吃一维向量）。"卷-激-池"重复 N 轮再展平接全连接，是 CNN 的标准骨架。'
      },
      {
        type: 'single', difficulty: 3,
        question: '输入特征图为 28×28，用 3×3 卷积核、padding = 0、stride = 1 卷积后，输出特征图的尺寸是？',
        options: ['26×26', '28×28', '25×25', '13×13'],
        answer: 0,
        explanation: '套尺寸公式 (W−K+2P)/S+1 = (28−3+0)/1+1 = 26，输出 26×26。选项 B 是 P=1（same padding）的结果 (28−3+2)/1+1=28；选项 C 忘了"+1"；选项 D 是 stride=2 的量级。这个公式是面试卷积计算题的第一公式，务必默写无误。'
      }
    ],
    relations: {
      prerequisites: ['m3-01'],
      successors: [],
      confusables: [
        { other: 'm3-01', tip: '全连接每对"输入-神经元"都有独立权重，参数随输入维度平方级爆炸；卷积核在空间上滑动复用同一套权重，参数量与输入大小无关——参数共享是 CNN 的立身之本。' },
        { other: 'm5-01', tip: '卷积是"固定权重的小窗口"扫局部，长距离关系要叠很多层才能传到；自注意力是"每个位置直接对全局打分"，任意两词一步直达——这也是文本建模从 CNN/RNN 转向 Transformer 的原因。' }
      ]
    },
    memory: {
      mnemonic: '小窗共享扫全图，卷积激活再池化，展平交给全连接。',
      selfTest: [
        { q: 'CNN 省参数的两大法宝是什么？各解决什么问题？', a: '① 局部感受野：每个输出只看 K×K 小块，不必连接全部像素，避免连接数爆炸；② 参数共享：同一卷积核滑遍全图，参数量与图像大小无关（3×3 核只有 9 个权重），还匹配图像"平移不变"的规律。' },
        { q: '28×28 输入经 3×3 卷积（P=0, S=1）后尺寸是多少？若 P=1 呢？', a: '(28−3+0)/1+1 = 26，输出 26×26；P=1 时 (28−3+2)/1+1 = 28，尺寸不变（same padding）。公式：(W−K+2P)/S+1。' },
        { q: '为什么 CNN 不适合建模文本？', a: '文本没有网格式的空间局部性，词序敏感且关键依赖常相距很远；卷积小窗口一次只看局部，要叠很多层才能传播长距离信息，对变长序列也不友好。这类"全局依赖"需求由注意力机制（m5-01）更直接地满足。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：CNN 是怎么看图的？',
      reference: '拿一个小放大镜（卷积核）从图的一角滑到另一角，每个位置给"这里有没有我要找的图案"打个分；同一个放大镜用遍全图（省参数），一层层放大镜从找线条到找零件再到找整体，最后展平交给全连接拍板。'
    }
  },
  {
    id: 'm3-07',
    title: 'RNN 与 LSTM',
    oneLiner: '逐词阅读的记忆机器：为什么健忘，LSTM 的三个闸门怎么补救',
    estMinutes: 13,
    analogy: {
      title: '边读边记的笔记本',
      body: '读一本长篇小说：每读完一章，大脑里留着一份"到目前为止的剧情摘要"——这就是<b>隐状态（Hidden State）</b>，RNN 的记忆。普通 RNN 的笔记本太小：每读一个新词都要重写整份摘要，越写越潦草，读到最后连主角名字都忘了（长距离依赖丢失、梯度消失）。<b>LSTM（长短期记忆网络，Long Short-Term Memory）</b>给笔记本装了三个闸门：遗忘门决定旧内容删多少，输入门决定新内容记多少，输出门决定这次从笔记里翻出多少来用——记忆从此有了"删、存、取"的精细管理。'
    },
    intuition: [
      { heading: 'RNN：同一套权重逐词复用', body: '循环神经网络（RNN，Recurrent Neural Network）每步做同一件事：读进当前词 x_t，结合上一步的记忆 h_{t−1}，算出新记忆 h_t = tanh(W·x_t + U·h_{t−1})。注意 W、U 每一步都相同——"权重共享"沿时间维度发生（呼应 m3-06 的空间共享）。h_t 压缩了"从头到当前词"的信息，理论上能处理任意长度。' },
      { heading: '健忘的根源：梯度沿时间连乘', body: '训练时梯度要沿时间一步步往回传（展开后像一条很深的链），每过一步就乘一次系数（普遍 < 1 时衰减、> 1 时放大）：传 50 步，0.8 的系数只剩 0.8⁵⁰ ≈ 0.00001——最早的词几乎收不到任何"责任信号"（梯度消失），这就是 RNN 健忘的数学根源。它与 m3-02 的层间梯度同源，只是发生在"时间方向"。' },
      { heading: 'LSTM 的三个闸门', body: 'LSTM 给记忆加了主干道——细胞状态（Cell State）c_t，像传送带一路直通，三门控制读写：遗忘门 f 决定旧记忆保留比例，输入门 i 决定新信息写入比例，输出门 o 决定把记忆翻出多少给外界。细胞状态的更新以加法为主，梯度能沿传送带畅通远行。但再精细的门也只是缓解：超长文本仍力不从心——为注意力机制埋下伏笔（m4-03 / m5-01）。' }
    ],
    principle: [
      {
        heading: 'RNN 的一步',
        body: '每个时间步：当前输入与旧记忆线性混合后过 tanh，得到新记忆。tanh 把数值压在 (−1, 1)——既是稳定器也是隐患：它每步自带 ≤ 1 的压缩，长链上就是指数遗忘。',
        formula: 'h_t = tanh(W·x_t + U·h_{t−1} + b)；　y_t = f(h_t)',
        formulaNote: '<ul><li><b>x_t</b>：第 t 个词的向量（如词向量，m4-02）</li><li><b>h_{t−1}</b>：上一步的记忆，"到目前为止读到了什么"</li><li><b>W、U</b>：所有时间步共用同一套权重（时间维度的参数共享）</li><li><b>tanh</b>：把新记忆压回 (−1, 1)，防数值发散</li><li><b>y_t</b>：按任务从 h_t 读出（如预测下一个词）</li></ul>'
      },
      {
        heading: '梯度沿时间连乘（面试推导点）',
        body: '展开整条链后，早期记忆的梯度是 T 个系数的连乘：系数普遍小于 1 就指数级趋零（梯度消失），大于 1 则爆炸。实用对策：梯度裁剪（Gradient Clipping）治爆炸——超过阈值就按比例缩小；治消失则要改结构——LSTM 的门控 + 加法细胞状态登场。',
        formula: '∂L/∂h₀ = ∂L/∂h_T × Π(t=1..T) ∂h_t/∂h_{t−1}',
        formulaNote: '<ul><li><b>Π（连乘）</b>：T 步系数相乘——指数级放大或衰减的来源</li><li><b>tanh′ ≤ 1</b>：每步自带 ≤ 1 的压缩，链一长必然衰减</li><li><b>梯度裁剪</b>：梯度范数超阈值就等比缩小，防爆炸的暴力手段</li><li><b>治本</b>：让记忆主干走"加法"而非反复乘权重——见 LSTM</li></ul>'
      },
      {
        heading: 'LSTM 门控公式组（面试常问"三门各管什么"）',
        body: '三门都是 sigmoid（输出 0~1，天然当"阀门开度"）：遗忘门管删、输入门管存、输出门管取。细胞状态 c 的更新以<b>加法</b>为主——旧记忆乘保留比例、新内容乘写入比例再相加，没有反复矩阵连乘，梯度可沿 c 传很远。面试按"删、存、取"三字诀答。',
        formula: 'f_t = σ(W_f·[h_{t−1}, x_t])；i_t = σ(W_i·[h_{t−1}, x_t])；c̃_t = tanh(W_c·[h_{t−1}, x_t])；c_t = f_t⊙c_{t−1} + i_t⊙c̃_t；o_t = σ(W_o·[h_{t−1}, x_t])；h_t = o_t⊙tanh(c_t)',
        formulaNote: '<ul><li><b>σ（sigmoid）</b>：输出 (0,1)，当阀门开度——0 全关、1 全开</li><li><b>f_t 遗忘门</b>：旧记忆 c_{t−1} 每一维保留的比例（删多少）</li><li><b>i_t 输入门 + c̃_t 候选</b>：新信息写入的比例与内容（存什么、存多少）</li><li><b>c_t = f⊙c_{t−1} + i⊙c̃_t</b>：加法更新——梯度高速公路</li><li><b>o_t 输出门 + h_t</b>：从记忆翻出多少给外界（取多少）；⊙ 为逐元素乘</li></ul>'
      }
    ],
    animation: {
      title: '记忆传递链：普通 RNN 为什么读到后面忘了开头',
      html: '<div class="anim-m3-07"><p class="anim-m3-07-desc">逐词阅读 5 个词，观察"第 1 个词的信息"在记忆里的残留：普通 RNN 每步重写记忆、信息按保留率 r 衰减；LSTM 的细胞状态走加法主干道、残留率接近 1：</p><div class="anim-m3-07-row"><label>模式 <select class="anim-m3-07-mode"><option value="rnn">普通 RNN</option><option value="lstm">LSTM（门控保留 ≈ 0.95）</option></select></label><label>普通 RNN 保留率 r <input class="anim-m3-07-r" type="range" min="0.3" max="0.95" step="0.05" value="0.55"> <span class="anim-m3-07-rv">0.55</span></label></div><div class="anim-m3-07-track"><div class="anim-m3-07-fill"></div></div><div class="anim-m3-07-steps"></div><div class="anim-m3-07-btns"><button class="anim-m3-07-next" type="button">读下一个词</button><button class="anim-m3-07-reset" type="button">重读</button></div><div class="anim-m3-07-info"></div></div>',
      css: '.anim-m3-07 { font-size: 13px; }\n.anim-m3-07-desc { margin: 0 0 8px; }\n.anim-m3-07-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 8px; }\n.anim-m3-07-row select { padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; }\n.anim-m3-07-track { height: 16px; background: #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 8px; }\n.anim-m3-07-fill { height: 100%; width: 100%; background: #22c55e; border-radius: 8px; transition: width .45s ease, background .45s ease; }\n.anim-m3-07-steps { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }\n.anim-m3-07-chip { padding: 3px 10px; border-radius: 12px; background: #ede9fe; color: #6d28d9; font-size: 12px; animation: anim-m3-07-in .35s ease; }\n.anim-m3-07-empty { background: #f1f5f9; color: #94a3b8; }\n@keyframes anim-m3-07-in { from { transform: scale(.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }\n.anim-m3-07-btns { display: flex; gap: 8px; margin-bottom: 6px; }\n.anim-m3-07-btns button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m3-07-info { font-family: monospace; font-size: 12px; color: #334155; min-height: 30px; }',
      js: function (root) {
        var mode = root.querySelector('.anim-m3-07-mode');
        var r = root.querySelector('.anim-m3-07-r');
        var rv = root.querySelector('.anim-m3-07-rv');
        var fill = root.querySelector('.anim-m3-07-fill');
        var steps = root.querySelector('.anim-m3-07-steps');
        var nextBtn = root.querySelector('.anim-m3-07-next');
        var resetBtn = root.querySelector('.anim-m3-07-reset');
        var info = root.querySelector('.anim-m3-07-info');
        if (!steps || !info || !nextBtn || !fill) return;
        var words = ['我', '昨天', '在', '图书馆', '自习'];
        var idx = -1, mem = 1;
        function curR() {
          if (mode && mode.value === 'lstm') { return 0.95; }
          return r ? Number(r.value) : 0.55;
        }
        function render() {
          fill.style.width = Math.max(1, mem * 100) + '%';
          fill.style.background = mem > 0.4 ? '#22c55e' : (mem > 0.08 ? '#f59e0b' : '#ef4444');
          var html = '', i;
          for (i = 0; i <= idx && i < words.length; i++) {
            html += '<span class="anim-m3-07-chip">' + words[i] + '</span>';
          }
          steps.innerHTML = html || '<span class="anim-m3-07-chip anim-m3-07-empty">（还没开始读）</span>';
          var isL = mode && mode.value === 'lstm';
          var tail = isL ? '（LSTM：细胞状态加法主干道，保留率 ≈ 0.95）' : '（普通 RNN：每步重写记忆）';
          if (idx < 0) { info.textContent = '点「读下一个词」开始逐词阅读，观察第 1 个词信息的残留' + tail; }
          else if (idx < words.length - 1) {
            info.textContent = '已读：' + words.slice(0, idx + 1).join('') + '｜第 1 个词的信息残留 ' + (mem * 100).toFixed(1) + '%' + tail;
          } else {
            info.textContent = '读完全句：第 1 个词（"我"）的信息只剩 ' + (mem * 100).toFixed(1) + '% —— ' +
              (mem > 0.5 ? '记忆基本完好，长距离依赖还在' : '开头早忘了，"谁"在自习已经接不上（长距离依赖丢失）');
          }
          if (rv && r) { rv.textContent = Number(r.value).toFixed(2); }
        }
        nextBtn.addEventListener('click', function () {
          if (idx >= words.length - 1) { info.textContent = '全句读完：点「重读」换个保留率再试'; return; }
          idx++;
          mem *= curR();
          render();
        });
        if (resetBtn) resetBtn.addEventListener('click', function () { idx = -1; mem = 1; render(); });
        if (r) r.addEventListener('input', render);
        if (mode) mode.addEventListener('change', render);
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'RNN 处理句子时，隐状态 h_t 的作用是什么？',
        options: ['把"从头读到当前词"的信息压缩成记忆，传给下一个时间步', '只存当前这个词的词向量', '存整句话的倒序副本', '没有实际作用，只是为了对齐维度'],
        answer: 0,
        explanation: 'h_t = tanh(W·x_t + U·h_{t−1})：它融合当前输入与历史记忆，是 RNN"逐词阅读"的载体，下一步接着用它——这正是"循环"二字的含义。选项 B 混淆了隐状态与词向量（词向量是输入，m4-02）；RNN 也不保存倒序副本；h_t 是模型的核心状态，绝非摆设。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'LSTM 的细胞状态更新以加法为主（c_t = f⊙c_{t−1} + i⊙c̃_t），这让梯度能沿时间更顺畅地流动，从而缓解梯度消失。',
        answer: true,
        explanation: '加法更新的导数近似恒等，避免普通 RNN 那样每步乘一次小于 1 的雅可比、连乘后指数衰减——细胞状态像一条"梯度高速公路"。常见误区：以为 LSTM 消灭了梯度消失（只是显著缓解，超长序列仍会衰减）；也常被追问"三门哪个管删"——遗忘门 f。'
      },
      {
        type: 'order', difficulty: 3,
        question: '把 LSTM 一个时间步内部的计算按正确顺序排列：',
        items: ['输出门决定把细胞状态翻出多少作为 h_t', '遗忘门给旧记忆打"保留比例"', '输入门与候选记忆决定"写入什么、写多少"', '细胞状态更新：c_t = f⊙c_{t−1} + i⊙c̃_t'],
        answer: [1, 2, 3, 0],
        explanation: '正确顺序：遗忘门（1）→ 输入门与候选（2）→ 更新细胞状态（3）→ 输出门（0）。逻辑：先决定旧记忆删多少、新记忆存多少，才能算加法更新 c_t；最后才由输出门从更新后的 c_t 取出 h_t。常见误区：先算输出门（输出依赖更新后的 c_t，顺序颠倒）；或把"更新 c_t"放到门之前（门就是为更新服务的比例系数）。'
      }
    ],
    relations: {
      prerequisites: ['m3-01'],
      successors: ['m4-03'],
      confusables: [
        { other: 'm3-02', tip: 'm3-02 的梯度消失发生在"层与层之间"（激活饱和/权重尺度不当）；RNN 的梯度消失发生在"时间步之间"（同一权重沿时间连乘）。病因同类、位置不同：ReLU/归一化是层间的药方，门控+加法细胞是时间方向的药方。' },
        { other: 'm4-03', tip: 'seq2seq 用两个 RNN：编码器把整句压成一个向量、解码器再展开；句一长，中间那个"一锅炖"向量成为瓶颈——这正是注意力机制（m4-04）要解决的问题，也是 RNN 家族淡出的开始。' },
        { other: 'm5-01', tip: 'RNN 必须逐词串行、远距离信息要走 T 步；自注意力一次并行看到全部位置、任意两词一步直达。理解 RNN 的两大痛点（长依赖 + 无法并行），才能明白 Transformer 为什么赢。' }
      ]
    },
    memory: {
      mnemonic: '逐词读、隐状态记；梯度连乘会健忘；三门管记忆：忘、存、取。',
      selfTest: [
        { q: 'RNN 为什么会"健忘"？数学根源是什么？', a: '训练时梯度沿时间反传，每步乘一次 ∂h_t/∂h_{t−1}（tanh 导数 ≤ 1，系数普遍小于 1），T 步连乘后指数级衰减到接近 0——序列开头的词几乎收不到梯度，长距离依赖学不到。系数大于 1 则梯度爆炸（可用梯度裁剪缓解）。' },
        { q: 'LSTM 的三个门各管什么？细胞状态为什么能缓解梯度消失？', a: '遗忘门（f）管删：旧记忆保留比例；输入门（i）管存：新信息写入比例与内容；输出门（o）管取：记忆输出给外界的比例。细胞状态更新 c_t = f⊙c_{t−1} + i⊙c̃_t 以加法为主、无反复矩阵连乘，梯度可近似无衰减地沿时间直通。' },
        { q: 'RNN 的权重共享和 CNN 的参数共享有何异同？', a: '相同点：都是"一套权重反复复用"。不同点：CNN 在空间位置间共享（同一个核扫全图），适配平移不变性；RNN 在时间步之间共享（每读一个词用同一套 W、U），适配任意长度序列。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：RNN 和 LSTM 的区别是什么？',
      reference: 'RNN 像拿小本子边读边记，本子太小、读越长忘越多；LSTM 给本子装了三个闸门——旧内容删多少（遗忘门）、新内容记多少（输入门）、这回翻出多少用（输出门），重要信息能一路顺畅传到底。'
    }
  }
  ]
});
