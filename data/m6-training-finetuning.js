/* M6 预训练与微调 —— 6 个知识点内容数据（契约见 docs/SCHEMA.md v1；关键论文已联网核实：LoRA=Hu et al. 2021、Chinchilla=Hoffmann et al. 2022、DPO=Rafailov et al. 2023） */
window.SITE_DATA.registerModule({
  module: 'M6',
  title: '预训练与微调',
  icon: '🏋️',
  color: '#ef4444',
  lessons: [
  {
    id: 'm6-01',
    title: '预训练目标',
    oneLiner: '搞懂 BERT 的完形填空与 GPT 的文字接龙：两种预训练目标，两种命运',
    estMinutes: 12,
    analogy: {
      title: '两种做题高手：完形填空王与接龙大师',
      body: '把两份厚厚的"人类文字试卷"发给两位学生。学生 A（BERT）的练习方式是<b>完形填空</b>：一整句话挖掉几个词，他可以前后来回看，填出空格里的词。学生 B（GPT）的练习方式是<b>文字接龙</b>：只能看到前面已写出的部分，一个字一个字往后猜"下一个字是什么"。练完千亿道题，A 成了查漏补缺的阅读理解高手，B 成了出口成章的写作高手。面试里你必须讲清这两种练习（预训练目标 Pre-training Objective）的机制与取舍。'
    },
    intuition: [
      { heading: '完形填空：BERT 的掩码语言模型（MLM）', body: '把句子"今天天气真不错"挖成"今天天气真 [MASK]"，让模型利用<b>前后双向</b>的上下文猜出被挖的词，这就是掩码语言模型（Masked Language Modeling, MLM）。因为可以左右逢源，它对"这句话在说什么"理解得深，适合分类、检索这类"只看不动笔"的任务。但它没练过"接着往下写"，天生不适合从左往右生成长文本。' },
      { heading: '文字接龙：GPT 的下一个词预测（NTP）', body: 'GPT 玩的是下一个词预测（Next Token Prediction, NTP）：给定"今天天气真"，预测下一个词；猜完接上，再猜再接，像滚雪球一样写出整段话。为防止作弊，训练时模型<b>只许看前面</b>——这个限制就是因果掩码（Causal Mask，在 m5-01 的注意力里用上三角掩码实现）。接龙练的是"写作能力"，而对话、写代码、做 Agent 全都靠它。' },
      { heading: '为什么这么简单的目标能学出智能', body: '面试高频追问：预测下一个词像文字游戏，凭什么涌现智能？直觉是：要把下一个词猜得准，光懂语法不够——你得记住事实（"水的沸点是 100"）、懂常识、会推理（"因为下雨，所以__"大概率是"地湿"）。每条网络文本都是一道免费考题，想把损失压下去，唯一办法是把世界的规律学进参数。预训练负责"读书"，之后的指令微调（m6-03）与偏好对齐（m6-05）负责"做人"。' }
    ],
    principle: [
      {
        heading: '两种目标的损失函数',
        body: '两者本质都是最大似然：让模型给"真实出现的词"打高概率。区别只在两处——猜什么、能看什么。BERT 每个样本只算被挖位置的损失；GPT 对每个位置都算，同样的文本量下监督信号更密。',
        formula: 'L_MLM = −Σ log p(x_i | 全文上下文)　　L_NTP = −Σ log p(x_t | x_1, …, x_{t−1})',
        formulaNote: '<ul><li><b>x_i / x_t</b>：文本里真实出现的那个词，就是"标准答案"</li><li><b>p(x | 上下文)</b>：模型给这个词的概率；接龙的上下文只允许是 x 前面的词（因果掩码）</li><li><b>−log p</b>：概率越接近 1，损失越接近 0；"损失小 = 猜得准"</li><li><b>Σ 求和</b>：把每道填空题的错题分加总；MLM 只算被挖的格子，NTP 每个位置都是一道题</li></ul>'
      },
      {
        heading: '因果掩码：只许看前面',
        body: '注意力机制（m5-01）本来是全员互相看。把注意力分数矩阵加上一个上三角掩码，位置 t 之后的分数全变 −∞，经 softmax 后权重为 0——后面的词就"看不见"了。这就是因果掩码。它的意义是保证<b>训练条件与使用条件一致</b>：模型永远只凭前文打分，推理时才能一个字一个字往外蹦。',
        formula: '掩码后注意力：A_t,j = 原始分数（j ≤ t）；= −∞（j 大于 t）',
        formulaNote: '<ul><li><b>A_t,j</b>：位置 t 对位置 j 的注意力分数</li><li><b>j ≤ t</b>：前面的位置正常打分，照常"看历史"</li><li><b>−∞</b>：未来位置的分数置为负无穷，softmax 后权重恰好为 0，等价于"看不见"</li><li>直觉：考试不许翻后面几页，逼你学会"据前文预测"</li></ul>'
      },
      {
        heading: '预训练 → 微调范式',
        body: '预训练（Pre-training）用海量无标注文本把"语言与世界"压进参数，产出基座模型（Base Model）；随后用少量高质量数据微调（Fine-tuning），教会它"听指令、按人类喜欢的方式回答"。这个两段式流程是现代大模型的标准配方，也是 M6 后面几课（SFT、LoRA、RLHF、DPO）的总纲：先管"会不会"，再管"乖不乖"。'
      }
    ],
    animation: {
      title: '同一句话的双视角：挖空 vs 接龙',
      html: '<div class="anim-m6-01"><div class="anim-m6-01-tabs"><button type="button" class="anim-m6-01-tab anim-m6-01-tab-bert">完形填空视角（BERT）</button><button type="button" class="anim-m6-01-tab anim-m6-01-tab-gpt">文字接龙视角（GPT）</button></div><div class="anim-m6-01-sentence"></div><div class="anim-m6-01-status"></div><div class="anim-m6-01-ctrls"><button type="button" class="anim-m6-01-btn anim-m6-01-next">接一个词 ▶</button><button type="button" class="anim-m6-01-btn anim-m6-01-remask">换一个挖空题 ↻</button></div><div class="anim-m6-01-legend">蓝色 = 模型能看到的上下文 · 橙色 = 待预测或被遮住的词</div></div>',
      css: '.anim-m6-01 { font-size: 13px; }\n.anim-m6-01-tabs { display: flex; gap: 8px; margin-bottom: 10px; }\n.anim-m6-01-tab { border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 6px; padding: 5px 10px; cursor: pointer; font-size: 12px; }\n.anim-m6-01-tab.anim-m6-01-on { background: #ef4444; border-color: #ef4444; color: #fff; }\n.anim-m6-01-sentence { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }\n.anim-m6-01-tok { display: inline-block; padding: 5px 8px; border-radius: 6px; font-family: monospace; transition: background .35s, color .35s, transform .35s; }\n.anim-m6-01-visible { background: #dbeafe; color: #1e3a8a; }\n.anim-m6-01-hidden { background: #fed7aa; color: #9a3412; font-weight: 700; }\n.anim-m6-01-target { background: #fdba74; color: #7c2d12; font-weight: 700; transform: translateY(-2px); }\n.anim-m6-01-future { background: #f1f5f9; color: #94a3b8; }\n.anim-m6-01-status { min-height: 38px; color: #334155; margin-bottom: 8px; }\n.anim-m6-01-ctrls { display: flex; gap: 8px; margin-bottom: 8px; }\n.anim-m6-01-btn { border: 1px solid #ef4444; color: #b91c1c; background: #fff; border-radius: 6px; padding: 5px 12px; cursor: pointer; font-size: 12px; }\n.anim-m6-01-btn:hover { background: #fef2f2; }\n.anim-m6-01-legend { font-size: 11px; color: #94a3b8; }',
      js: function (root) {
        var toks = ['今天', '天气', '真', '不错', '，', '正', '适合', '去', '爬山', '。'];
        var sentence = root.querySelector('.anim-m6-01-sentence');
        var status = root.querySelector('.anim-m6-01-status');
        var btnNext = root.querySelector('.anim-m6-01-next');
        var btnMask = root.querySelector('.anim-m6-01-remask');
        var tabBert = root.querySelector('.anim-m6-01-tab-bert');
        var tabGpt = root.querySelector('.anim-m6-01-tab-gpt');
        var mode = 'gpt';
        var revealed = 2;
        var masks = [3, 6];
        function randMasks() {
          var pool = [];
          for (var i = 1; i < toks.length - 1; i++) pool.push(i);
          masks = [];
          while (masks.length < 2) {
            var k = Math.floor(Math.random() * pool.length);
            masks.push(pool.splice(k, 1)[0]);
          }
          masks.sort(function (a, b) { return a - b; });
        }
        function render() {
          var html = '';
          for (var i = 0; i < toks.length; i++) {
            var cls = 'anim-m6-01-tok';
            if (mode === 'bert') {
              cls += (masks.indexOf(i) >= 0) ? ' anim-m6-01-hidden' : ' anim-m6-01-visible';
            } else {
              if (i < revealed) cls += ' anim-m6-01-visible';
              else if (i === revealed && revealed < toks.length) cls += ' anim-m6-01-target';
              else cls += ' anim-m6-01-future';
            }
            var label = (mode === 'bert' && masks.indexOf(i) >= 0) ? '[MASK]' : toks[i];
            html += '<span class="' + cls + '">' + label + '</span>';
          }
          sentence.innerHTML = html;
          tabBert.classList.toggle('anim-m6-01-on', mode === 'bert');
          tabGpt.classList.toggle('anim-m6-01-on', mode === 'gpt');
          btnMask.style.display = (mode === 'bert') ? '' : 'none';
          btnNext.style.display = (mode === 'gpt') ? '' : 'none';
          if (mode === 'bert') {
            var answers = masks.map(function (i) { return toks[i]; }).join('、');
            status.innerHTML = '<b>BERT 双向可见</b>：除被挖的 ' + answers + ' 外全部可看，只需猜这几个格子 → 擅长理解类任务，不擅长逐字生成。';
          } else if (revealed >= toks.length) {
            status.innerHTML = '<b>接龙完成！</b>整个过程每次都只看前缀（蓝色）→ 这就是因果掩码下的生成方式。再点"接一个词"会重新开始。';
          } else {
            status.innerHTML = '<b>GPT 只许看前 ' + revealed + ' 个词</b>（蓝色），正在猜第 ' + (revealed + 1) + ' 个词（橙色）→ 每个位置都是一道接龙题，全句每处都算损失。';
          }
        }
        tabBert.addEventListener('click', function () { mode = 'bert'; render(); });
        tabGpt.addEventListener('click', function () { mode = 'gpt'; render(); });
        btnMask.addEventListener('click', function () { randMasks(); render(); });
        btnNext.addEventListener('click', function () {
          revealed = (revealed >= toks.length) ? 2 : revealed + 1;
          render();
        });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'GPT 系列模型的预训练目标是？',
        options: ['判断两句话是否是前后句（NSP）', '把句子中被挖掉的词还原（MLM）', '预测下一个词（Next Token Prediction）', '把句子翻译成英文再翻回来'],
        answer: 2,
        explanation: 'GPT 用因果掩码 + 下一词预测（NTP）：每个位置只凭前文猜下一个词。MLM 与 NSP 是 BERT 家族的预训练目标，翻译回译是旧的机器翻译思路。面试考点：一句话分清"BERT 挖空、GPT 接龙"，并知道生成任务必须选 NTP。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '因果掩码的作用是：训练时让模型同时看到前文和后文，从而更全面地理解句子。',
        answer: false,
        explanation: '说反了。因果掩码是<b>禁止</b>看后文：位置 t 只能注意 j ≤ t 的词，保证训练条件与"逐词生成"的推理条件一致。允许双向看上下文的是 BERT 的 MLM（双向注意力 + 挖空），两者是配套关系：双向注意力配 MLM，因果掩码配 NTP。常见误区是把"双向可见"当成因果掩码的效果。'
      },
      {
        type: 'single', difficulty: 3,
        question: '面试官问：为什么"预测下一个词"这么简单的目标能学出事实与推理？下列回答最准确的是？',
        options: ['因为模型记忆力超强，能把互联网所有句子背下来，接龙只是复读', '因为因果掩码给了模型超能力，可以偷看未来的答案', '要猜准下一个词，必须掌握语法、事实、常识与推理链，猜错就被损失惩罚，逼模型把世界规律压进参数', '因为下一个词预测在数学上等价于搜索引擎检索'],
        answer: 2,
        explanation: '标准答案强调"猜得准"的隐性要求：语法只能排除错别字，事实、常识、多步推理才能在长程依赖上把概率提上去，而交叉熵损失会持续惩罚猜错——海量文本即海量考题。A 错在复读无法应对没见过的组合；B 错在因果掩码恰恰是禁止偷看；D 错在检索是匹配已有文档，不产生概率化的生成能力。这是"简单目标为何涌现智能"的高频面试题。'
      }
    ],
    relations: {
      prerequisites: ['m5-06'],
      successors: ['m6-02', 'm6-03'],
      confusables: [
        { other: 'm5-06', tip: 'm5-06 讲三家模型的网络架构差异（骨架：双向 vs 因果注意力、编码器 vs 解码器），本课讲训练目标差异（练法：MLM vs NTP）。架构与目标必须配套记：BERT 的双向注意力配挖空，GPT 的因果掩码配接龙。' },
        { other: 'm4-05', tip: 'm4-05 的困惑度（Perplexity）正是接龙目标的直观化身：NTP 损失越低、困惑度越小。它评估的是"猜下一词的能力"，别与下游任务准确率混为一谈。' }
      ]
    },
    memory: {
      mnemonic: 'BERT 挖空看两边，GPT 接龙只回头；猜词猜出大智慧。',
      selfTest: [
        { q: 'MLM 与 NTP 的损失函数有哪两点关键区别？', a: '一是预测对象：MLM 只算被掩码的少数位置，NTP 对序列每个位置都算（监督信号更密）；二是可见上下文：MLM 双向可见全文，NTP 受因果掩码限制只能看前文。' },
        { q: '为什么 GPT 架构必须配因果掩码才能训 NTP？', a: 'NTP 要求在位置 t 只根据 x_1..x_{t−1} 预测 x_t；若注意力能看见后文，等于考试偷看答案，训练出的概率分布与推理时"只凭前文生成"的条件不一致，生成质量会崩坏。' },
        { q: '预训练→微调范式一句话概括？', a: '先用海量无标注文本把语言与世界知识压进参数得到基座（管"会不会"），再用少量高质量数据教它听指令、对齐人类偏好（管"乖不乖"）；SFT、RLHF、DPO 都是第二段的不同做法。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：大模型预训练到底在练什么？',
      reference: '在练"猜下一个字"的文字接龙：把整个互联网当习题册，一个字一个字往后猜；要猜得准就得懂语法、记事实、会推理，猜错了就调参数——千亿道题刷下来，接龙大师就诞生了。'
    }
  },
  {
    id: 'm6-02',
    title: 'Scaling Laws',
    oneLiner: '看懂"大力出奇迹"的科学依据：损失按幂律可预测地下降，参数与数据要讲配比',
    estMinutes: 12,
    analogy: {
      title: '游戏练级：越往后越难升，但进度可预测',
      body: '一款升级游戏：1 级升 2 级只要 10 分钟，90 级升 91 级却要十倍经验——每一点提升越来越贵，但"花多少经验、升多少级"的曲线非常稳定，可以提前查表。大模型训练就是这场练级：经验值是算力（Compute），等级是能力，反过来"再降一点损失还差多少算力"能画成一条几乎不抖的曲线。2020 年 Kaplan 等人把它量化成<b>缩放定律（Scaling Laws）</b>，人类第一次敢在开训前预测千亿模型的成绩单。'
    },
    intuition: [
      { heading: '幂律：损失随规模平滑下降', body: '把参数量 N、数据量 D、算力 C 各扩大 10 倍，损失不是乱跳，而是按幂律（Power Law）平滑下降——在<b>对数坐标</b>下近乎直线。工程意义巨大：先用小模型跑出多条曲线，外推到目标算力，就能"花小钱预测大模型"。这把训练从玄学炼丹变成了看图施工。' },
      { heading: 'Chinchilla：参数与数据要配比', body: '2022 年 DeepMind 的 Chinchilla 论文（Hoffmann 等）发现：同样算力下，与其把参数堆大、数据喂少，不如两者按比例一起长——大约<b>每 1 个参数配 20 个训练 token</b> 最划算。按这把尺子回看，GPT-3 用 1750 亿参数只喂约 3000 亿 token，属于"参数过大、训练不足"；Chinchilla 用 70B 参数 + 1.4 万亿 token，同算力反超 280B 的 Gopher。' },
      { heading: '数据墙与合成数据（面试谈资）', body: '网络高质量文本有限，业界称之为数据墙（Data Wall）：参数还能造，料快用完了。两条应对：一是<b>合成数据</b>——用现有大模型生成并过滤后回灌训练；二是"超 Chinchilla 训练"——现代开源模型动辄几十、上百 token/参数，因为推理便宜比训练划算更符合商业利益（小模型多喂料、部署省钱）。面试能说出"compute-optimal 与 inference-optimal 的分野"是明显加分项。' }
    ],
    principle: [
      {
        heading: '幂律的写法',
        body: '缩放定律把损失写成规模的幂函数：参数不足贡献一项、数据不足贡献一项，各自幂律衰减、边际收益递减，还剩一项怎么训都压不掉的底。理解公式不在背数字，而在两点：<b>单调下降</b>、<b>可外推</b>。',
        formula: 'L(N, D) ≈ E + A/N^α + B/D^β　（算力约束：C ≈ 6·N·D）',
        formulaNote: '<ul><li><b>L</b>：验证集上的下一词预测损失，越低 = 越会接龙</li><li><b>N</b>：参数量；<b>D</b>：训练 token 数；各贡献一项"递减收益"</li><li><b>A/N^α、B/D^β</b>：参数不够的欠拟合项 + 数据不够的欠采样项，都是幂律下降</li><li><b>E</b>：不可约损失——数据固有熵，再大力也压不掉的底</li><li><b>C ≈ 6·N·D</b>：经验估算——每训 1 个 token、每参数约 6 次浮点运算（前向 2 + 反向 4），是"同算力对比"的换算尺</li></ul>'
      },
      {
        heading: '算力最优配比：约 20 token/参数',
        body: '固定算力 C，问 N 和 D 怎么分配能让 L 最低？Chinchilla 的答案：两者同比例增长，约 D/N ≈ 20。注意这不是永恒真理，而是"训练算力视角"的结论：若更关心推理成本，"小参数、多喂料"反而更优——这正是后来 Llama 3 用约 15T token 训 8B/70B 模型的逻辑：宁可训练期多花，也要换推理期便宜。'
      },
      {
        heading: '怎么用：小模型试错 + 外推',
        body: '标准工作流：用同一套配方训一串小模型，拟合幂律参数，外推到目标算力，预测损失与关键评测；发现实测偏离预测，优先回查数据配比与清洗质量。因此预训练团队的核心竞争力是：数据配比、数据质量、训练稳定性工程——而不是"堆机器"三个字。'
      }
    ],
    animation: {
      title: '同算力对决：配比喂料 vs 堆参数',
      html: '<div class="anim-m6-02"><div class="anim-m6-02-row"><span>参数量 N = <b class="anim-m6-02-nval">70B</b></span><input class="anim-m6-02-slider" type="range" min="0" max="10" step="1" value="7"></div><div class="anim-m6-02-readout"></div><div class="anim-m6-02-barwrap"><span class="anim-m6-02-lab">方案A：Chinchilla 配比（D=20N）</span><div class="anim-m6-02-track"><div class="anim-m6-02-fill anim-m6-02-fa"></div></div><span class="anim-m6-02-num anim-m6-02-na"></span></div><div class="anim-m6-02-barwrap"><span class="anim-m6-02-lab">方案B：同算力堆参数（2N 参数·一半数据）</span><div class="anim-m6-02-track"><div class="anim-m6-02-fill anim-m6-02-fb"></div></div><span class="anim-m6-02-num anim-m6-02-nb"></span></div><div class="anim-m6-02-verdict"></div><div class="anim-m6-02-note">损失条越长 = 损失越高 = 越差。像练级表：算力固定，配比决定等级。</div></div>',
      css: '.anim-m6-02 { font-size: 13px; }\n.anim-m6-02-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }\n.anim-m6-02-slider { flex: 1; }\n.anim-m6-02-nval { color: #b91c1c; }\n.anim-m6-02-readout { font-family: monospace; margin-bottom: 10px; color: #334155; min-height: 34px; }\n.anim-m6-02-barwrap { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }\n.anim-m6-02-lab { width: 232px; font-size: 11px; color: #475569; flex-shrink: 0; }\n.anim-m6-02-track { flex: 1; height: 16px; background: #e2e8f0; border-radius: 8px; overflow: hidden; }\n.anim-m6-02-fill { height: 100%; width: 0; border-radius: 8px; transition: width .45s ease, background .45s ease; }\n.anim-m6-02-fa { background: #22c55e; }\n.anim-m6-02-fb { background: #f97316; }\n.anim-m6-02-num { width: 52px; text-align: right; font-family: monospace; flex-shrink: 0; }\n.anim-m6-02-verdict { margin-top: 6px; font-weight: 600; color: #334155; min-height: 20px; }\n.anim-m6-02-note { margin-top: 6px; font-size: 11px; color: #94a3b8; }',
      js: function (root) {
        var slider = root.querySelector('.anim-m6-02-slider');
        var nval = root.querySelector('.anim-m6-02-nval');
        var readout = root.querySelector('.anim-m6-02-readout');
        var fa = root.querySelector('.anim-m6-02-fa');
        var fb = root.querySelector('.anim-m6-02-fb');
        var na = root.querySelector('.anim-m6-02-na');
        var nb = root.querySelector('.anim-m6-02-nb');
        var verdict = root.querySelector('.anim-m6-02-verdict');
        var Ns = [1, 2, 4, 8, 13, 26, 52, 70, 100, 140, 200];
        function loss(N, D) {
          return 0.3 + 1.2 / Math.pow(N, 0.34) + 5.1 / Math.pow(D, 0.4);
        }
        function toPct(L) {
          var p = (L - 0.55) / (3.15 - 0.55) * 100;
          return Math.max(6, Math.min(100, p));
        }
        function update() {
          var N = Ns[Number(slider.value)];
          var La = loss(N, 20 * N);
          var Lb = loss(2 * N, 10 * N);
          nval.textContent = N + 'B';
          readout.innerHTML = '方案A：' + N + 'B 参数 × ' + (20 * N / 1000).toFixed(2) + 'T token（20 token/参数）<br>方案B：' + (2 * N) + 'B 参数 × ' + (10 * N / 1000).toFixed(2) + 'T token（5 token/参数）｜ 两方案总算力相同 ≈ ' + (0.12 * N * N).toFixed(0) + ' ZFLOPs（按 6ND 估算）';
          fa.style.width = toPct(La) + '%';
          fb.style.width = toPct(Lb) + '%';
          na.textContent = La.toFixed(2);
          nb.textContent = Lb.toFixed(2);
          verdict.textContent = '同算力下 L_A=' + La.toFixed(2) + ' 低于 L_B=' + Lb.toFixed(2) + ' → 参数与数据要"门当户对"，堆参数、饿数据是亏的。';
        }
        slider.addEventListener('input', update);
        update();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'Scaling Laws（缩放定律）描述的核心规律是？',
        options: ['模型损失随参数量、数据量、算力的增大按幂律平滑下降，可提前外推', '模型越大，训练速度越快', '只要数据够多，任何模型都能达到零损失', '学习率应随模型尺寸线性增大'],
        answer: 0,
        explanation: 'Scaling Laws（Kaplan 等 2020）的核心是幂律：L ≈ E + A/N^α + B/D^β，损失随规模平滑、可预测地下降，因此可以"小模型外推大模型"。B 明显反了（越大越难训）；C 错在存在不可约损失 E；D 与缩放定律无关。面试考点：说出"可外推"与"边际收益递减"两个关键词。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '按 Chinchilla 结论，同样的训练算力预算下，把参数量堆到最大就能得到损失最低的模型。',
        answer: false,
        explanation: 'Chinchilla（Hoffmann 等 2022）的结论恰恰相反：同算力下参数与数据应按约 20 token/参数配比增长。GPT-3（175B 参数、约 0.3T token）按此标准属于"训练不足"；Chinchilla 用 70B 参数 + 1.4T token，同算力反超 280B 的 Gopher。面试考点：别把"大力出奇迹"错背成"参数越大越好"。'
      },
      {
        type: 'single', difficulty: 3,
        question: '场景题：团队有固定算力预算，已按 Chinchilla 配比规划了一个 70B 模型。老板提议"参数改成 140B、训练数据减半，模型肯定更强"。最专业的回应是？',
        options: ['同意，参数翻倍能力一定翻倍', '指出该方案破坏了 20 token/参数配比：同算力下数据减半带来的损失上升，会超过参数翻倍的收益，预期更差——Chinchilla 论文正是用 70B 反超 280B Gopher 证明这一点', '损失与数据量无关，改不改都一样', '建议把数据也翻倍，反正数据免费'],
        answer: 1,
        explanation: '同算力约束下 6ND ≈ C，参数翻倍必然挤占数据预算；在配比点附近，欠采样损失项（B/D^β）的增长快于参数项（A/N^α）的下降，净效果变差。C 明显错误（数据项真实存在）；D 无视数据墙与算力约束。面试考点：会用 6ND 与配比 20:1 做算力分配论证，这是预训练方向常考的计算题。'
      }
    ],
    relations: {
      prerequisites: ['m6-01'],
      successors: ['m7-04'],
      confusables: [
        { other: 'm7-04', tip: 'Scaling Law 管"训练预算怎么花"（预训练期能力与算力的兑换率），知识蒸馏管"推理部署怎么省"（把大模型能力压进小模型）。一个是训练期规划工具，一个是部署期压缩手段，别混为一谈。' },
        { other: 'm3-04', tip: 'Scaling Law 中损失下降变慢是幂律的"边际收益递减"，不是过拟合：过拟合是训练损失降而验证损失升的泛化问题，机理完全不同；Scaling Law 说的是验证损失的规律性下降。' }
      ]
    },
    memory: {
      mnemonic: '损失幂律降，算力可外推；参数配数据，约二十比一。',
      selfTest: [
        { q: '6ND ≈ C 是什么意思？', a: 'Transformer 训练算力的经验估算：每个参数每处理 1 个 token 约需 6 次浮点运算（前向约 2 次 + 反向约 4 次），故总算力 ≈ 6 × 参数量 × token 数。它是做"同算力对比实验"时的统一换算尺。' },
        { q: '为什么现代很多模型突破 20 token/参数、训到几十上百 token/参数？', a: '20:1 是"算力最优"（compute-optimal）的训练性价比结论；商业上推理成本长期高于训练成本，把小模型喂更多数据（inference-optimal，如 Llama 3 用约 15T token 训 8B/70B）部署更便宜，所以刻意"超 Chinchilla 训练"。' },
        { q: '数据墙是什么？两大应对？', a: '高质量自然文本接近耗尽，数据成为预训练瓶颈。应对：①合成数据（大模型生成 + 过滤回灌）；②提高单位数据利用率与推理期算力（更好的配比、蒸馏、测试时计算）。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：Scaling Laws 是什么？',
      reference: '给大模型的"氪金攻略"：实验发现钱（算力）花得越多、模型越大、书（数据）喂得越多，成绩就沿一条稳定曲线平滑变好，还能先小规模试跑、精确预测大规模成绩；但要讲配方——每个"脑细胞"大约配 20 页料才不浪费。'
    }
  },
  {
    id: 'm6-03',
    title: 'SFT 指令微调',
    oneLiner: '让"博览群书却不会聊天"的基座学会听指令：示范教学、数据质量与灾难性遗忘',
    estMinutes: 14,
    analogy: {
      title: '高材生入职：师傅带徒弟',
      body: '一位读书破万卷的高材生（基座模型）入职：知识渊博，但你让他"写一封道歉邮件"，他却开始续写"我朋友也遇到过这事……"——因为他一辈子在做文字接龙，从没被人手把手教过"别人下达指令时该干什么"。于是公司安排<b>师傅带徒弟</b>：给他看几千份"接到什么任务 → 老员工怎么漂亮完成"的真实案例（指令-回答对），让他模仿着学。这就是监督微调（Supervised Fine-Tuning, SFT），也叫指令微调（Instruction Tuning）。'
    },
    intuition: [
      { heading: '基座 vs 聊天模型：差的就是这堂示范课', body: '同一个底座，SFT 前是"接龙机器"，SFT 后才变成"会对话的助手"。SFT 数据是一条条 <code>指令 + 回答</code> 对：任务可能是写邮件、解题、总结文档，回答由人写或强模型精心产出。训练时把指令拼在前面，让模型照着示范逐词模仿——跟师傅一对一抄作业，抄的只是"解题过程"。' },
      { heading: '质量 大于 数量：LIMA 的启示', body: '2023 年的 LIMA 论文（Less Is More for Alignment）用仅 <b>1000 条精选样本</b>做 SFT，就得到效果惊艳的助手。结论：基座已经"会"，SFT 只需教会它"行为格式"，所以<b>数据质量、多样性与覆盖面远胜堆数量</b>。面试标准答法："与其灌 10 万条低质数据，不如精修 1 千条高质量数据——低质数据教会模型的可能是坏习惯。"注意：能力仍来自预训练，SFT 是激发与塑形，不是灌知识。' },
      { heading: '灾难性遗忘：学了新戏，忘了老本', body: '只拿窄领域数据猛训，模型可能在垂直任务上涨分，同时把通用能力（写作、常识问答）练丢了——这叫灾难性遗忘（Catastrophic Forgetting）。两大缓解手段：<b>混入通用数据</b>（领域与通用指令数据按比例混合回放）、<b>调小学习率并少训几轮</b>（轻拿轻放，别把旧知识冲掉）。这是面试"SFT 后通用能力掉点怎么办"的标准答案。' }
    ],
    principle: [
      {
        heading: 'SFT 的损失：只学"回答部分"',
        body: 'SFT 沿用预训练的下一词预测损失，但有两点不同：输入前缀是指令；且通常只对回答部分的 token 计损失（prompt masking），避免模型把容量花在"学提问"而不是"学回答"上。',
        formula: 'L_SFT = −Σ log p_θ(y_t | 指令, y_1, …, y_{t−1})，求和仅遍历回答 token',
        formulaNote: '<ul><li><b>指令 + y_t</b>：把用户指令拼在输入前，y_t 是示范回答里的第 t 个词</li><li><b>求和仅遍历回答</b>：指令 token 不计损失，模型只需学会"怎么答"</li><li><b>p_θ</b>：当前模型给的概率；梯度更新全部参数（全参微调），这是与 LoRA（m6-04）的区别</li><li>直觉：照着师傅的标准答案逐词模仿，答错一个词就被损失纠正一次</li></ul>'
      },
      {
        heading: '高质量数据长什么样',
        body: '三条标准：①<b>多样性</b>——覆盖问答、写作、代码、推理、拒答等任务类型与不同人群；②<b>质量</b>——回答正确、格式清晰、无幻觉（人审或强模型审）；③<b>真实度</b>——贴近真实用户提问，含少量困难样本。常配"系统提示 + 多轮对话"模板，让模型顺带学会多轮追上下文。'
      },
      {
        heading: '遗忘的机理与配方',
        body: '梯度下降只看当前批数据：窄数据反复冲刷会覆盖通用行为的参数解。实用配方：领域与通用数据按约 1:1 到 1:5 混合回放；学习率取预训练的十分之一以下（常见 1e-5 到 2e-5 量级）；只训 2~3 个 epoch 即停；并用通用评测集守护回归。面试时按"诊断 → 混数据 → 降学习率 → 守评测"四步作答。'
      }
    ],
    animation: {
      title: '示范教学台：两种教案，两种徒弟',
      html: '<div class="anim-m6-03"><div class="anim-m6-03-btns"><button type="button" class="anim-m6-03-btn anim-m6-03-bad">投喂方案A：10万条低质垂直数据 · 大学习率</button><button type="button" class="anim-m6-03-btn anim-m6-03-good">投喂方案B：1千条精选 + 通用混合 · 小学习率</button><button type="button" class="anim-m6-03-btn anim-m6-03-reset">重置</button></div><div class="anim-m6-03-row"><span class="anim-m6-03-lab">指令遵循</span><div class="anim-m6-03-track"><div class="anim-m6-03-fill anim-m6-03-f1"></div></div><span class="anim-m6-03-num anim-m6-03-n1"></span></div><div class="anim-m6-03-row"><span class="anim-m6-03-lab">领域技能</span><div class="anim-m6-03-track"><div class="anim-m6-03-fill anim-m6-03-f2"></div></div><span class="anim-m6-03-num anim-m6-03-n2"></span></div><div class="anim-m6-03-row"><span class="anim-m6-03-lab">通用能力</span><div class="anim-m6-03-track"><div class="anim-m6-03-fill anim-m6-03-f3"></div></div><span class="anim-m6-03-num anim-m6-03-n3"></span></div><div class="anim-m6-03-round"></div><div class="anim-m6-03-verdict"></div></div>',
      css: '.anim-m6-03 { font-size: 13px; }\n.anim-m6-03-btns { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }\n.anim-m6-03-btn { border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 6px; padding: 5px 10px; cursor: pointer; font-size: 12px; }\n.anim-m6-03-bad { border-color: #f97316; color: #c2410c; }\n.anim-m6-03-good { border-color: #22c55e; color: #15803d; }\n.anim-m6-03-btn:hover { filter: brightness(0.97); }\n.anim-m6-03-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }\n.anim-m6-03-lab { width: 64px; color: #475569; font-size: 12px; flex-shrink: 0; }\n.anim-m6-03-track { flex: 1; height: 16px; background: #e2e8f0; border-radius: 8px; overflow: hidden; }\n.anim-m6-03-fill { height: 100%; width: 0; border-radius: 8px; transition: width .5s ease, background .5s ease; }\n.anim-m6-03-f1 { background: #6366f1; }\n.anim-m6-03-f2 { background: #f59e0b; }\n.anim-m6-03-f3 { background: #22c55e; }\n.anim-m6-03-num { width: 36px; text-align: right; font-family: monospace; flex-shrink: 0; }\n.anim-m6-03-round { font-size: 12px; color: #94a3b8; margin-top: 6px; }\n.anim-m6-03-verdict { margin-top: 6px; font-weight: 600; color: #334155; min-height: 40px; }',
      js: function (root) {
        var st = { inst: 20, dom: 12, gen: 92 };
        var round = 0;
        var lastMode = '';
        var fills = [
          root.querySelector('.anim-m6-03-f1'),
          root.querySelector('.anim-m6-03-f2'),
          root.querySelector('.anim-m6-03-f3')
        ];
        var nums = [
          root.querySelector('.anim-m6-03-n1'),
          root.querySelector('.anim-m6-03-n2'),
          root.querySelector('.anim-m6-03-n3')
        ];
        var roundEl = root.querySelector('.anim-m6-03-round');
        var verdict = root.querySelector('.anim-m6-03-verdict');
        function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
        function trainBad() {
          st.inst = clamp(st.inst + (48 - st.inst) * 0.35, 0, 100);
          st.dom = clamp(st.dom + (85 - st.dom) * 0.45, 0, 100);
          st.gen = clamp(st.gen * 0.72, 0, 100);
          round++; lastMode = 'bad';
        }
        function trainGood() {
          st.inst = clamp(st.inst + (75 - st.inst) * 0.42, 0, 100);
          st.dom = clamp(st.dom + (62 - st.dom) * 0.42, 0, 100);
          st.gen = clamp(st.gen + (88 - st.gen) * 0.42, 0, 100);
          round++; lastMode = 'good';
        }
        function render() {
          var vals = [st.inst, st.dom, st.gen];
          for (var i = 0; i < 3; i++) {
            fills[i].style.width = vals[i] + '%';
            nums[i].textContent = Math.round(vals[i]);
          }
          roundEl.textContent = '已训练轮数：' + round;
          if (round === 0) { verdict.textContent = '基座刚出厂：满腹经纶（通用 92），但不会听指令（指令遵循 20）。点按钮开始投喂数据。'; return; }
          if (lastMode === 'bad') {
            verdict.textContent = '第 ' + round + ' 轮：领域技能飙升到 ' + Math.round(st.dom) + '，但通用能力掉到 ' + Math.round(st.gen) + ' → <b>灾难性遗忘</b>：学会了行话，忘了说人话。多按几次，看它会掉到哪。';
          } else {
            verdict.textContent = '第 ' + round + ' 轮：指令遵循 ' + Math.round(st.inst) + '、领域技能 ' + Math.round(st.dom) + '、通用能力守住 ' + Math.round(st.gen) + ' → 精选数据 + 通用混合 + 小步学习率，稳步上岗。';
          }
        }
        root.querySelector('.anim-m6-03-bad').addEventListener('click', function () { trainBad(); render(); });
        root.querySelector('.anim-m6-03-good').addEventListener('click', function () { trainGood(); render(); });
        root.querySelector('.anim-m6-03-reset').addEventListener('click', function () {
          st = { inst: 20, dom: 12, gen: 92 }; round = 0; lastMode = ''; render();
        });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'SFT（监督微调）主要使用什么数据？',
        options: ['无标注的海量互联网文本', '成对的"指令 + 高质量示范回答"', '只有用户点击日志', '模型的随机自问自答，无需人工参与'],
        answer: 1,
        explanation: 'SFT 的原料是指令-回答对：输入端是指令（可含系统提示、多轮历史），标签端是人写或强模型精心产出的示范回答，用下一词预测损失让模型模仿。A 是预训练的数据；C 是推荐系统的原料；D 描述的是自举式数据合成，且"无需人工"说法错误。面试考点：能说出 SFT 数据的三要素——多样性、质量、真实度。'
      },
      {
        type: 'fill', difficulty: 2,
        question: 'LIMA 论文用仅约 1000 条精心筛选的____质量示范数据完成 SFT 即效果惊艳（填一个字：高/低），说明对齐阶段"数据质量比数量更重要"。',
        accept: ['高'],
        explanation: 'LIMA（Less Is More for Alignment, 2023）用 1000 条精选样本就让基座表现出色，核心启示：SFT 负责激发与塑形基座已有能力，因此精选的高质量、高多样性数据胜过海量低质数据。常见误区：以为 SFT 数据越多越好——低质数据反而会教出坏习惯并加剧灾难性遗忘。面试考点：LIMA 是"质量 大于 数量"论点的标志性引用。'
      },
      {
        type: 'judge', difficulty: 3,
        question: '只要把 SFT 数据从 1000 条扩到 100 万条低质样本，模型就一定更强——微调数据量越大效果越好。',
        answer: false,
        explanation: '错了。SFT 的瓶颈常在质量而非数量：低质、雷同的数据会教出坏习惯（幻觉、套路化），还加剧灾难性遗忘、冲掉预训练带来的通用能力。正确姿势：精选高多样性数据（LIMA 的 1000 条即可激发基座），窄域任务再混入通用数据回放、调小学习率。面试考点：追问"SFT 掉点怎么办"时，按"诊断遗忘 → 混通用数据 → 降学习率 → 通用评测守护"作答。'
      }
    ],
    relations: {
      prerequisites: ['m6-01'],
      successors: ['m6-04', 'm6-05', 'm8-01'],
      confusables: [
        { other: 'm8-01', tip: 'Prompt Engineering 不改模型参数，靠输入端"写清楚"引导行为，见效快但天花板受基座限制；SFT 直接改参数、把行为固化进模型，成本高但更稳更深。工程选型先问"能不能提示词解决"，再考虑微调。' },
        { other: 'm6-05', tip: 'SFT 学的是"照着标准答案模仿"（每题有一份确定示范），RLHF 学的是"在好与坏之间对齐偏好"（没有唯一标准答案，只有相对好坏）；RLHF 三步曲的第一步恰好就是 SFT。' }
      ]
    },
    memory: {
      mnemonic: '基座是学霸，SFT 教做人；千条精选胜万条水货。',
      selfTest: [
        { q: 'SFT 损失为什么通常只算回答部分的 token？', a: '指令部分是输入条件而非要学的行为；若对指令也计损失，模型会把容量花在"学习如何提问"上，稀释"如何回答"的监督信号——这就是 prompt masking 的动机。' },
        { q: '面试被问"SFT 后通用能力掉点，怎么办"，标准答法？', a: '先诊断为灾难性遗忘；缓解三板斧：混入通用数据回放、调小学习率并减少训练轮数、提升数据质量与多样性；全程用通用评测集守护回归。' },
        { q: 'LIMA 给我们的核心启示？', a: '对齐阶段"少而精胜过多而杂"：约 1000 条高质量、多样、覆盖广的示范足以激发基座已有能力；SFT 主要教格式与行为，不负责灌知识——能力来自预训练。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：SFT 是在干什么？',
      reference: '就是给一个读遍了全世界的书、却没上过班的高材生做岗前培训：拿几千份"客户提要求 → 老员工给满分答复"的案例让他模仿，学着学着就会按指令办事了——但教案质量要好，教歪了他就学歪。'
    }
  },
  {
    id: 'm6-04',
    title: 'LoRA 与参数高效微调',
    oneLiner: '冻结原权重、只训一小块低秩旁路：LoRA 用不到 1% 的参数完成微调',
    estMinutes: 15,
    analogy: {
      title: '全参微调是砸墙重装，LoRA 是贴墙纸',
      body: '全参微调（Full Fine-Tuning）像把整栋楼全部砸掉重装：每一面墙（每个权重）都动，材料费（显存）、工期（算力）巨大，而且每换一个任务就得重拆一遍楼、存一套完整蓝图（每任务一份全量权重）。LoRA（Low-Rank Adaptation，低秩适配，Hu 等 2021）的哲学是：<b>楼体结构原样冻结，只在每面墙上贴一层可更换的墙纸</b>——训练时只动墙纸；出厂前把墙纸压平刷进墙漆（权重合并），住客毫无感知。'
    },
    intuition: [
      { heading: '为什么不直接全参微调', body: '以 7B 模型为例：全参微调不仅要存 7B 份权重（FP16 约 14GB），还要为每个参数存梯度与 Adam 优化器状态（动量 + 二阶矩，常见实现按 FP32 各存一份，约 56GB）——显存轻松破 70GB。LoRA 只训百分之零点几的参数，梯度与优化器状态随之缩小百倍，单卡即可微调大模型。顺带的好处：每个任务只需保存几十 MB 的 LoRA 权重，而不是几十 GB 的完整模型。' },
      { heading: '核心假设：更新是低秩的', body: 'LoRA 论文（Hu 等，2021）的观察：微调前后权重的变化量 ΔW 秩很低——"适配一个新任务所需的信息量"远小于权重矩阵的全部维度。于是不直接学 ΔW（d×k 个自由度），而学两个小矩阵的乘积 BA（只有 r×(d+k) 个自由度），r 常取 4~64，远小于 d、k（如 4096）。这是"用小自由度刻画任务差异"的赌注，实践证明对多数任务非常有效。' },
      { heading: 'QLoRA 与多任务可插拔', body: 'QLoRA（Dettmers 等，2023）再进一步：把冻结的底座量化成 4-bit 存储以省显存，LoRA 旁路照常用高精度训练——"4bit 冻结底座 + LoRA 旁路"，单卡 48GB 也能微调 65B 模型。另一杀手锏是可插拔：一个底座 + 多套 LoRA = 多任务热切换，推理时按请求挂载不同"墙纸"，或预先把 BA 合并进权重实现零额外延迟。' }
    ],
    principle: [
      {
        heading: '低秩分解逐项拆解',
        body: '原本的前向计算是 h = Wx。LoRA 加一条旁路：输入 x 先经 A 降维到 r 维，再经 B 升维回 d 维，两段乘积就是低秩更新，与原输出相加。训练时只更新 A、B，W 全程冻结。',
        formula: 'h = Wx + (BA)x = W′x，其中 W′ = W + BA，B ∈ R^(d×r)，A ∈ R^(r×k)，r ≪ min(d, k)',
        formulaNote: '<ul><li><b>W（d×k）</b>：原权重矩阵，训练全程<b>冻结</b>不更新</li><li><b>A（r×k）</b>：降维投影，把 k 维输入压到 r 维——"提取任务关键特征"</li><li><b>B（d×r）</b>：升维投影，把 r 维铺回 d 维——"把关键特征映射成输出修正量"</li><li><b>BA</b>：秩至多为 r 的矩阵，即对 ΔW 的低秩近似；可训练参数从 d·k 降到 r·(d+k)</li><li><b>初始化</b>：A 随机高斯、B 置零 → 训练起点 BA = 0，模型行为与原模型完全一致，不会一上来就跑飞</li><li><b>α/r 缩放</b>：旁路输出常乘 α/r，是调节 LoRA 影响强度的旋钮</li></ul>'
      },
      {
        heading: '省在哪：账要会算',
        body: '以 d = k = 4096、r = 8 为例：全量 ΔW 有 4096×4096 ≈ 1680 万参数；LoRA 两块合计 8×(4096+4096) ≈ 6.6 万，约为原来的 0.4%。显存大头省在梯度与 Adam 状态——它们只跟着这 6.6 万参数走。面试常问"LoRA 为什么省显存"，标准答案：冻结底座 → 无需存其梯度与优化器状态，可训练参数缩小百倍以上。LoRA 论文报告：GPT-3 175B 上可训练参数减少约 10000 倍、显存降约 3 倍。',
        formula: '参数量对比：全量 d·k = 16.8M vs LoRA r·(d+k) = 65.5K（d = k = 4096, r = 8）',
        formulaNote: '<ul><li><b>d·k</b>：全量权重更新的参数个数——4096×4096 ≈ 1680 万，每个都要配梯度和 Adam 状态</li><li><b>r·(d+k)</b>：A（r×k）与 B（d×r）两块之和——r=8 时仅约 6.6 万，占比约 0.4%</li><li><b>r 越大</b>：表达能力越强但参数越多，r 是"容量旋钮"，常取 4~64</li><li>直觉：墙纸（r·(d+k)）比整面墙（d·k）薄两个数量级，而梯度与优化器状态只跟墙纸走</li></ul>'
      },
      {
        heading: '推理时合并：零延迟代价',
        body: '训练完成后，BA 可直接加进 W 得到 W′，替换原矩阵——推理计算图与原模型完全相同，没有额外延迟（论文称之为 no additional inference latency）。这也解释了"可插拔"：不同任务只是不同的 W′，同一底座即可服务多业务，需要热切换时再挂载旁路即可。'
      }
    ],
    animation: {
      title: '秩 r 实验台：墙纸有多薄',
      html: '<div class="anim-m6-04"><div class="anim-m6-04-row"><span>秩 r = <b class="anim-m6-04-rval">8</b></span><input class="anim-m6-04-slider" type="range" min="0" max="6" step="1" value="3"></div><div class="anim-m6-04-barwrap"><span class="anim-m6-04-lab">全量 ΔW（d×k）</span><div class="anim-m6-04-track"><div class="anim-m6-04-fill anim-m6-04-full"></div></div><span class="anim-m6-04-num anim-m6-04-nf"></span></div><div class="anim-m6-04-barwrap"><span class="anim-m6-04-lab">LoRA 参数 r·(d+k)</span><div class="anim-m6-04-track"><div class="anim-m6-04-fill anim-m6-04-fl"></div></div><span class="anim-m6-04-num anim-m6-04-nl"></span></div><div class="anim-m6-04-readout"></div><div class="anim-m6-04-toggle"><button type="button" class="anim-m6-04-btn anim-m6-04-bt">训练态：旁路分开算</button><button type="button" class="anim-m6-04-btn anim-m6-04-bm">部署态：墙纸刷进墙漆</button></div><div class="anim-m6-04-stage"></div></div>',
      css: '.anim-m6-04 { font-size: 13px; }\n.anim-m6-04-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }\n.anim-m6-04-slider { flex: 1; }\n.anim-m6-04-rval { color: #b91c1c; }\n.anim-m6-04-barwrap { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }\n.anim-m6-04-lab { width: 128px; font-size: 12px; color: #475569; flex-shrink: 0; }\n.anim-m6-04-track { flex: 1; height: 16px; background: #e2e8f0; border-radius: 8px; overflow: hidden; }\n.anim-m6-04-fill { height: 100%; border-radius: 8px; transition: width .45s ease; }\n.anim-m6-04-full { width: 100%; background: #94a3b8; }\n.anim-m6-04-fl { width: 2%; background: #ef4444; }\n.anim-m6-04-num { width: 76px; text-align: right; font-family: monospace; flex-shrink: 0; font-size: 11px; }\n.anim-m6-04-readout { font-family: monospace; color: #334155; margin: 6px 0 10px; }\n.anim-m6-04-toggle { display: flex; gap: 8px; margin-bottom: 8px; }\n.anim-m6-04-btn { border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 6px; padding: 5px 10px; cursor: pointer; font-size: 12px; }\n.anim-m6-04-btn.anim-m6-04-on { background: #ef4444; border-color: #ef4444; color: #fff; }\n.anim-m6-04-stage { min-height: 58px; color: #334155; line-height: 1.6; }\n.anim-m6-04-chip { display: inline-block; border-radius: 5px; padding: 3px 8px; margin: 2px; font-family: monospace; font-size: 11px; transition: width .4s ease; }',
      js: function (root) {
        var slider = root.querySelector('.anim-m6-04-slider');
        var rval = root.querySelector('.anim-m6-04-rval');
        var fl = root.querySelector('.anim-m6-04-fl');
        var nl = root.querySelector('.anim-m6-04-nl');
        var nf = root.querySelector('.anim-m6-04-nf');
        var readout = root.querySelector('.anim-m6-04-readout');
        var stage = root.querySelector('.anim-m6-04-stage');
        var bt = root.querySelector('.anim-m6-04-bt');
        var bm = root.querySelector('.anim-m6-04-bm');
        var rs = [1, 2, 4, 8, 16, 32, 64];
        var mode = 'train';
        var d = 4096, k = 4096;
        function render() {
          var r = rs[Number(slider.value)];
          var full = d * k;
          var lora = r * (d + k);
          rval.textContent = r;
          nf.textContent = full.toLocaleString();
          nl.textContent = lora.toLocaleString();
          var pct = Math.max(0.8, lora / full * 100);
          fl.style.width = pct + '%';
          readout.textContent = 'LoRA 参数占全量 ΔW 的 ' + (lora / full * 100).toFixed(2) + '%（r=' + r + '，d=k=4096）';
          if (mode === 'train') {
            stage.innerHTML = '训练态：<span class="anim-m6-04-chip" style="background:#dbeafe;color:#1e3a8a;">x → A(' + r + '×' + k + ') 降维</span><span class="anim-m6-04-chip" style="background:#fee2e2;color:#991b1b;">B(' + d + '×' + r + ') 升维</span><span class="anim-m6-04-chip" style="background:#f1f5f9;color:#475569;">W 冻结</span><br>只训旁路 A、B：梯度与优化器状态只跟着这 ' + lora.toLocaleString() + ' 个参数走 → 省显存的大头就在这。';
          } else {
            stage.innerHTML = '部署态：<span class="anim-m6-04-chip" style="background:#dcfce7;color:#166534;">W′ = W + BA 已合并</span><br>墙纸刷平进墙漆：推理计算图与原模型完全相同，<b>零额外延迟</b>；换任务 = 换一套 W′，可插拔多任务。';
          }
          bt.classList.toggle('anim-m6-04-on', mode === 'train');
          bm.classList.toggle('anim-m6-04-on', mode === 'merge');
        }
        slider.addEventListener('input', render);
        bt.addEventListener('click', function () { mode = 'train'; render(); });
        bm.addEventListener('click', function () { mode = 'merge'; render(); });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'LoRA 微调时，下列哪组参数是可训练的？',
        options: ['全部权重 W 与旁路 A、B 一起训练', '原权重 W 冻结不动，只训练旁路矩阵 B 和 A', '只训练原权重 W，冻结 A 和 B', '不训练任何参数，只调推理时的采样温度'],
        answer: 1,
        explanation: 'LoRA 的定义就是冻结预训练权重 W、注入可训练的低秩旁路 BA（A 降维、B 升维）。C 颠倒了主次；A 是全参微调不是 LoRA；D 与参数训练无关。面试考点：一句定义式回答——"冻结 W，训练低秩旁路 BA"，并顺带说出 r 远小于 d、k。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'LoRA 推理时必须每次先现算 BA 再叠加到 W 上，因此推理延迟会显著增加。',
        answer: false,
        explanation: '不需要。训练结束后 BA 可以离线合并进权重：W′ = W + B·A，替换原矩阵即可，推理计算图与原模型完全一致，论文明确指出没有额外推理延迟（no additional inference latency）。只有需要"多任务热切换"时才保留旁路、按请求挂载。常见误区把"训练省显存"误当成"推理变慢"。'
      },
      {
        type: 'code', difficulty: 3,
        question: '补全一个最小 LoRA 线性层（PyTorch 风格）。要求：A 随机初始化、B 初始化为 0（保证起点 BA=0），前向返回"原输出 + 缩放后的旁路输出"。<code>import torch\nimport torch.nn as nn\n\nclass LoRALinear(nn.Module):\n    def __init__(self, base: nn.Linear, r: int = 8, alpha: int = 16):\n        super().__init__()\n        self.base = base\n        self.base.weight.requires_grad = False   # 冻结原权重\n        d, k = self.base.weight.shape            # d 行 k 列\n        self.A = nn.Parameter(torch.randn(____, k) * 0.01)  # 降维：形状 r×k\n        self.B = nn.Parameter(torch.____(d, r))             # 升维：d×r，初始化为 0\n        self.scale = alpha / r\n\n    def forward(self, x):\n        return self.base(x) + self.scale * (x @ self.A.____) @ self.B.T</code>',
        template: 'import torch\nimport torch.nn as nn\n\nclass LoRALinear(nn.Module):\n    def __init__(self, base, r=8, alpha=16):\n        super().__init__()\n        self.base = base\n        self.base.weight.requires_grad = False   # 冻结原权重\n        d, k = self.base.weight.shape            # d 行 k 列\n        self.A = nn.Parameter(torch.randn(____, k) * 0.01)  # 降维：形状 r×k\n        self.B = nn.Parameter(torch.____(d, r))             # 升维：d×r，初始化为 0\n        self.scale = alpha / r\n\n    def forward(self, x):\n        return self.base(x) + self.scale * (x @ self.A.____) @ self.B.T',
        checks: ['torch.zeros', 'self.A.T'],
        solution: 'import torch\nimport torch.nn as nn\n\nclass LoRALinear(nn.Module):\n    def __init__(self, base, r=8, alpha=16):\n        super().__init__()\n        self.base = base\n        self.base.weight.requires_grad = False   # 冻结原权重\n        d, k = self.base.weight.shape            # d 行 k 列\n        self.A = nn.Parameter(torch.randn(r, k) * 0.01)  # 降维：r×k，随机初始化打破对称\n        self.B = nn.Parameter(torch.zeros(d, r))         # 升维：d×r，置零保证起点 BA=0\n        self.scale = alpha / r\n\n    def forward(self, x):\n        # x: (batch, k) → A.T 得 (batch, r) → B.T 得 (batch, d)\n        return self.base(x) + self.scale * (x @ self.A.T) @ self.B.T',
        explanation: '三个空的要点：①A 的形状是 (r, k)，第一个空填 r；②B 用 torch.zeros(d, r) 初始化——置零使训练起点 BA=0，模型行为与原模型一致，起点平稳；③前向里 x 先过 A 的转置（x @ self.A.T）降维到 r，再过 B.T 升维回 d，旁路输出乘 α/r 后与原输出相加。常见误区：把 A、B 形状写反（B 必须是 d×r）；或把 B 也随机初始化——那会让模型一开始就偏离原行为。面试考点：手撕 LoRA 层与"为什么 B 置零"。'
      }
    ],
    relations: {
      prerequisites: ['m3-02', 'm6-03'],
      successors: ['m8-05'],
      confusables: [
        { other: 'm7-03', tip: '量化（m7-03）压的是"存储与计算精度"（如 16bit 降到 4bit），训练与推理都能用；QLoRA 是两者合体：底座量化成 4bit 只为省显存，LoRA 旁路负责学习更新。量化可独立用于推理，LoRA 也可独立用于全精度微调，两者正交。' },
        { other: 'm6-03', tip: 'm6-03 讲 SFT 要学什么数据、怎么防遗忘（训练配方层面）；本课讲参数高效微调的"怎么训"（工程实现层面）。SFT 是任务与目标，LoRA 是实现它的省显存手段，正交可叠加：QLoRA+SFT 就是常见组合。' }
      ]
    },
    memory: {
      mnemonic: '底座冻结如旧楼，墙纸低秩换新装；BA 相乘参数少，推理合并零开销。',
      selfTest: [
        { q: 'LoRA 为什么能省大量显存？', a: '底座冻结后不需要保存其梯度与 Adam 优化器状态（这两者是全参微调的显存大头）；可训练参数从 d·k 降到 r·(d+k)，梯度和优化器状态随之缩小百倍以上。论文报告 GPT-3 175B 上可训练参数约降 10000 倍、显存约降 3 倍。' },
        { q: 'ΔW = BA 中为什么 A 随机初始化、B 置零？', a: 'B 置零保证训练起点 BA = 0，模型初始行为与预训练模型完全一致，更新从零平稳增长；A 随机初始化打破对称性，使梯度非零、两块矩阵能学到不同方向。若 A 置零则旁路恒为零学不动。' },
        { q: '面试官问：LoRA 的低秩假设是什么？什么时候可能失效？', a: '假设微调带来的权重变化 ΔW 秩很低，即适配新任务的信息量远小于矩阵满秩；对风格、格式、领域适配类任务大多成立。若新任务与预训练分布差异极大、需要大幅改写权重（换语言体系、全新模态），小 r 可能欠拟合，需增大 r 或回到全参微调。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：LoRA 是怎么省资源的？',
      reference: '微调大模型不再重修整栋楼，而是冻结楼体、只贴一层可拆卸的"低秩墙纸"：墙纸参数不到原来的百分之一，训练省显存省算力；每个任务一套墙纸随插随换，出厂前把墙纸刷平进墙漆，住客毫无感觉。'
    }
  },
  {
    id: 'm6-05',
    title: 'RLHF',
    oneLiner: '用人类偏好驯服模型：示范、打分、强化学习三步曲，以及奖励黑客的坑',
    estMinutes: 15,
    analogy: {
      title: '训练小狗的三步曲',
      body: '想让小狗学会"乖巧待人"，驯狗师分三步：①<b>示范</b>——手把手带它做几遍标准动作（对应 SFT，见 m6-03）；②<b>打分</b>——让它把同一动作做两个版本，驯狗师指出哪个更好，日积月累练出一位"懂人类口味的代打分员"（奖励模型 Reward Model）；③<b>强化</b>——让小狗自由发挥，代打分员给每个动作打分，小狗朝着高分动作反复调整（强化学习，如 PPO）。这套"示范 → 打分 → 强化"流程，就是基于人类反馈的强化学习（Reinforcement Learning from Human Feedback, RLHF）。'
    },
    intuition: [
      { heading: '为什么要造"代理评委"', body: '"回答得好不好"很难写成规则，但让人<b>比较</b>两个回答哪个更好却很容易。于是先收集大量偏好对（同一问题、两个回答、标注哪个更好），训练一个奖励模型（Reward Model）学会给回答打分——它成为人类偏好的可批量调用的代理评委。有了它，才能支撑强化学习阶段需要的海量打分。' },
      { heading: 'PPO：在奖励与"不忘本"之间走钢丝', body: '强化学习阶段用 PPO（Proximal Policy Optimization，近端策略优化）更新模型策略：最大化奖励，同时用 KL 惩罚拴住它——不许偏离参考模型（通常是 SFT 后的模型）太远。少了这根缰绳，模型会专找刷分捷径：说人类爱听的、堆正确格式、编造听起来专业的内容。' },
      { heading: '奖励黑客与对齐税（面试高频）', body: '<b>奖励黑客（Reward Hacking）</b>：奖励模型只是人类偏好的近似，模型会钻空子刷分——典型表现是谄媚（sycophancy，顺着用户说）、堆格式骗高分、一本正经地胡编。<b>对齐税（Alignment Tax）</b>：模型变乖了，但在部分客观任务（数学、代码）上性能反而下降——"变乖"的代价。这两点几乎是 RLHF 面试题的必考追问，务必能各举一例。' }
    ],
    principle: [
      {
        heading: '第一步 SFT 与第二步奖励模型',
        body: 'SFT（第一步）给一个"会说话"的起点；奖励模型（第二步）把偏好数据变成分数。奖励模型的训练目标：好回答的分数要高于坏回答，本质是个排序（二分类）问题。结构上通常是"底座 + 分数头"：取回答最后一个 token 的隐状态，过一个线性层输出标量分。',
        formula: 'L_RM = −log σ( r(x, y_w) − r(x, y_l) )',
        formulaNote: '<ul><li><b>x</b>：同一道问题；<b>y_w</b>：人类标的好回答（win）；<b>y_l</b>：坏回答（lose）</li><li><b>r(x, y)</b>：奖励模型给回答打的分（标量）</li><li><b>σ</b>：sigmoid，把分差压到 (0,1)，可读作"y_w 优于 y_l 的概率"</li><li><b>−log</b>：分差越大损失越小，逼评委学会"拉开好坏差距"</li></ul>'
      },
      {
        heading: '第三步 PPO 目标逐项翻译',
        body: 'RL 阶段每个训练步都在问：怎样改参数，让期望奖励更高，同时离参考模型不太远？形式化就是一个带 KL 约束的奖励最大化。',
        formula: 'max_π E[ r(x, y) ] − β·KL( π(·|x) ‖ π_ref(·|x) )，x 采自提示分布，y 由 π 生成',
        formulaNote: '<ul><li><b>π</b>：正在训练的策略（就是语言模型）；<b>π_ref</b>：冻结的参考模型，一般取 SFT 模型</li><li><b>E[ r(x, y) ]</b>：期望奖励——采样问题 x、按 π 生成回答 y、让评委打分的平均值，越大越好</li><li><b>KL(π‖π_ref)</b>：两个模型概率分布的差异，衡量"飘了多远"，作为罚项减掉</li><li><b>β</b>：缰绳松紧——β 太小 → 奖励黑客放飞自我；β 太大 → 模型不敢学、原地踏步</li></ul>'
      },
      {
        heading: '为什么 RLHF 不稳定（面试考点）',
        body: '三个结构性原因：①奖励本身是学出来的近似，策略变强后会钻它的空子，目标随之失真（非平稳）；②生成式采样方差大、每条轨迹只有一个标量奖励，梯度噪声强；③β、KL 目标值、奖励归一化等超参极敏感，容易训崩。工程上还要同时维护策略、参考、奖励、价值四个模型，显存与流程都重。正因为这些痛点，才有了下一课更省心的 DPO，以及 GRPO 等新算法。'
      }
    ],
    animation: {
      title: '驯狗三步曲 + 刷分过头演示',
      html: '<div class="anim-m6-05"><div class="anim-m6-05-steps"><div class="anim-m6-05-card anim-m6-05-s1"><b>① 示范 SFT</b><span>手把手教标准动作：指令 → 示范回答，逐词模仿</span></div><div class="anim-m6-05-card anim-m6-05-s2"><b>② 奖励模型</b><span>人类比较好坏回答 → 训出"代理评委"</span></div><div class="anim-m6-05-card anim-m6-05-s3"><b>③ PPO 强化</b><span>自由发挥刷奖励，KL 缰绳防跑偏</span></div></div><div class="anim-m6-05-ctrl"><button type="button" class="anim-m6-05-btn anim-m6-05-next">下一步 ▶</button><button type="button" class="anim-m6-05-btn anim-m6-05-round" disabled>再训一轮 PPO</button><button type="button" class="anim-m6-05-btn anim-m6-05-reset">重置</button></div><div class="anim-m6-05-bars"><div class="anim-m6-05-barwrap"><span class="anim-m6-05-lab">评委打分（奖励）</span><div class="anim-m6-05-track"><div class="anim-m6-05-fill anim-m6-05-fr"></div></div></div><div class="anim-m6-05-barwrap"><span class="anim-m6-05-lab">KL 罚分（偏离）</span><div class="anim-m6-05-track"><div class="anim-m6-05-fill anim-m6-05-fk"></div></div></div><div class="anim-m6-05-barwrap"><span class="anim-m6-05-lab">净得分 = 奖励 − β·KL</span><div class="anim-m6-05-track"><div class="anim-m6-05-fill anim-m6-05-fn"></div></div></div></div><div class="anim-m6-05-status"></div></div>',
      css: '.anim-m6-05 { font-size: 13px; }\n.anim-m6-05-steps { display: flex; gap: 8px; margin-bottom: 10px; }\n.anim-m6-05-card { flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px; background: #f8fafc; opacity: .45; transition: opacity .4s, border-color .4s, background .4s; }\n.anim-m6-05-card b { display: block; margin-bottom: 4px; font-size: 12px; }\n.anim-m6-05-card span { font-size: 11px; color: #64748b; }\n.anim-m6-05-card.anim-m6-05-on { opacity: 1; border-color: #ef4444; background: #fef2f2; }\n.anim-m6-05-ctrl { display: flex; gap: 8px; margin-bottom: 12px; }\n.anim-m6-05-btn { border: 1px solid #ef4444; color: #b91c1c; background: #fff; border-radius: 6px; padding: 5px 12px; cursor: pointer; font-size: 12px; }\n.anim-m6-05-btn:disabled { opacity: .4; cursor: not-allowed; }\n.anim-m6-05-barwrap { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }\n.anim-m6-05-lab { width: 150px; font-size: 11px; color: #475569; flex-shrink: 0; }\n.anim-m6-05-track { flex: 1; height: 14px; background: #e2e8f0; border-radius: 7px; overflow: hidden; }\n.anim-m6-05-fill { height: 100%; width: 0; border-radius: 7px; transition: width .45s ease, background .45s ease; }\n.anim-m6-05-fr { background: #22c55e; }\n.anim-m6-05-fk { background: #f97316; }\n.anim-m6-05-fn { background: #6366f1; }\n.anim-m6-05-status { min-height: 40px; color: #334155; font-weight: 600; }',
      js: function (root) {
        var cards = [
          root.querySelector('.anim-m6-05-s1'),
          root.querySelector('.anim-m6-05-s2'),
          root.querySelector('.anim-m6-05-s3')
        ];
        var fr = root.querySelector('.anim-m6-05-fr');
        var fk = root.querySelector('.anim-m6-05-fk');
        var fn = root.querySelector('.anim-m6-05-fn');
        var status = root.querySelector('.anim-m6-05-status');
        var btnNext = root.querySelector('.anim-m6-05-next');
        var btnRound = root.querySelector('.anim-m6-05-round');
        var btnReset = root.querySelector('.anim-m6-05-reset');
        var step = 0, round = 0;
        function render() {
          for (var i = 0; i < 3; i++) cards[i].classList.toggle('anim-m6-05-on', step > i);
          btnNext.disabled = (step >= 3);
          btnRound.disabled = (step < 3);
          var rw = 0, kl = 0, net = 0;
          if (round > 0) {
            rw = Math.min(1, 0.25 + 0.25 * round);
            kl = 0.09 * Math.pow(round, 1.6);
            net = rw - 0.35 * kl;
            fr.style.width = (rw * 100) + '%';
            fk.style.width = (Math.min(kl / 1.6, 1) * 100) + '%';
            fn.style.width = (Math.max(net, 0) * 100) + '%';
            var msg;
            if (net >= 0.8 && round <= 3) msg = '净得分还在涨：刷奖励与守规矩双赢。';
            else if (round === 4) msg = '净得分到达峰值后开始回落——奖励已顶格，KL 罚分仍在涨。';
            else msg = '继续刷分：评委分数不涨了，KL 罚分却越来越高 → 开始"奖励黑客"，变戏精刷分。';
            status.textContent = '第 ' + round + ' 轮 PPO：奖励 ' + rw.toFixed(2) + '，KL ' + kl.toFixed(2) + '，净得分 ' + net.toFixed(2) + '。' + msg;
          } else if (step === 0) {
            status.textContent = '基座还不会听指令。点"下一步"开始驯狗三步曲。';
          } else if (step === 1) {
            status.textContent = '第①步完成：SFT 让模型学会照示范说话（类比：小狗学会基本动作）。';
          } else if (step === 2) {
            status.textContent = '第②步完成：用人类偏好对训出奖励模型——一位可批量打分的"代理评委"。';
          } else {
            status.textContent = '第③步：点"再训一轮 PPO"，观察奖励、KL、净得分如何此消彼长。';
          }
        }
        btnNext.addEventListener('click', function () { step = Math.min(3, step + 1); render(); });
        btnRound.addEventListener('click', function () { round++; render(); });
        btnReset.addEventListener('click', function () { step = 0; round = 0; render(); });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'RLHF（以 InstructGPT 流程为例）三个阶段的标准顺序是？',
        options: ['奖励模型 → SFT → PPO', 'SFT → 训练奖励模型 → PPO 强化学习', 'PPO → SFT → 奖励模型', 'SFT → 蒸馏 → 量化'],
        answer: 1,
        explanation: '标准三步曲：①SFT 用示范数据得到会听指令的初始策略；②用人类偏好对训练奖励模型；③用 PPO 以奖励为信号做强化学习，并加 KL 惩罚拴住策略。A 把前两步颠倒——没有 SFT 起点就训 RM 可以但非标准流程，且 RM 必须在 RL 之前；C 完全颠倒；D 中蒸馏与量化是 m7 的部署技术。面试考点：三步曲顺序是 RLHF 第一问。'
      },
      {
        type: 'order', difficulty: 2,
        question: '将 RLHF 的关键环节按正确时间顺序排列（点击或拖动排序）：',
        items: ['训练奖励模型 RM', '用 PPO 优化策略（带 KL 惩罚）', 'SFT 得到初始策略', '人工标注偏好对（好/坏回答）'],
        answer: [2, 3, 0, 1],
        explanation: '正确顺序：先 SFT（初始策略，也是后续 KL 的参考）→ 人工对同一问题的多个回答标注偏好对 → 用偏好对训练奖励模型 → 奖励模型作为评委供 PPO 优化策略。注意"标注偏好对"必须发生在"训练奖励模型"之前（数据先于训练），而奖励模型必须在 PPO 之前（RL 需要评委打分）。面试考点：能说清每个环节的输入输出就算真正理解了流程。'
      },
      {
        type: 'judge', difficulty: 3,
        question: 'RLHF 训练中，奖励模型的分数是最优目标，模型应不惜一切代价最大化它；KL 惩罚项限制了对齐效果，可以去掉。',
        answer: false,
        explanation: '双重错误。①奖励模型只是人类偏好的近似，无约束地最大化它会触发奖励黑客（reward hacking）：谄媚、堆格式、编造专业感内容来"刷分"，而非真正变好；②KL 惩罚是缰绳：把策略拉在参考模型附近，去掉后策略会漂移出预训练分布，语言质量崩坏。工程上 β 的选取是稳定性的关键超参。面试考点：能解释"为什么不能只盯着奖励分数"并给出 reward hacking 例子，是区分背书与理解的分水岭；顺带提"对齐税"（变乖但客观任务掉点）更佳。'
      }
    ],
    relations: {
      prerequisites: ['m6-03'],
      successors: ['m6-06'],
      confusables: [
        { other: 'm6-06', tip: 'RLHF 要先训一个奖励模型、再用 PPO 在线强化（两阶段、多模型协同）；DPO 直接在静态偏好对上用分类式损失优化策略（一阶段、无显式奖励模型）。记忆点：DPO = 砍掉"评委"，把偏好直接写进肌肉记忆。' },
        { other: 'm6-03', tip: 'SFT 是模仿确定的标准答案（绝对模仿），RLHF 优化的是相对偏好（没有标准答案，只有哪个更好）；SFT 的产物还是 RLHF 的初始策略与 KL 参考模型 π_ref，两者是接力关系而非二选一。' }
      ]
    },
    memory: {
      mnemonic: '一示二评三强化，KL 是缰绳；奖励会造假，小心钻空子。',
      selfTest: [
        { q: '奖励模型怎么训练？输入输出是什么？', a: '输入"问题 + 一个回答"，输出标量分（常取回答末 token 隐状态过线性头）。用偏好对训练：L = −log σ(r(y_w) − r(y_l))，让好回答得分高于坏回答。它是人类偏好的代理评委，供 RL 阶段批量打分。' },
        { q: '对齐税是什么？为什么产生？', a: '对齐后模型在部分客观任务（数学、代码、知识问答）上性能下降。原因：偏好数据偏重礼貌、安全、格式，KL 约束又把策略拉离预训练分布，牺牲了预训练里"锋利"的能力——是"乖"与"强"的权衡。' },
        { q: '为什么说 RLHF 训练不稳定？至少说出两点。', a: '①奖励是学出来的近似，策略变强后钻空子使信号失真（非平稳目标）；②生成式采样方差大、每条轨迹只有一个标量奖励，梯度噪声强；③β、KL 目标、奖励归一化等超参敏感，易训崩；④需同时维护策略/参考/奖励/价值四个模型，工程重。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：RLHF 在干什么？',
      reference: '像训练小狗：先手把手示范（SFT），再请人给各种表现打分、培养出一位懂人类口味的评委（奖励模型），最后让它自由发挥、朝高分行为改进（PPO）——同时用一根叫 KL 的缰绳拴着，防止它为刷分变成谄媚的戏精。'
    }
  },
  {
    id: 'm6-06',
    title: 'DPO',
    oneLiner: '不训奖励模型也能对齐：DPO 用偏好对直接优化策略，更稳更省',
    estMinutes: 12,
    analogy: {
      title: '从"请评委"到"练肌肉记忆"',
      body: 'RLHF 像"请评委 + 教练"分两阶段培养运动员：先花大价钱训练一位口味刁钻的评委（奖励模型），再让运动员对着评委的分数反复调整（PPO）——评委口味一偏，运动员就跟着跑偏。DPO（Direct Preference Optimization，直接偏好优化，Rafailov 等 2023）的思路是：<b>把评委撤了</b>，直接拿"好表现 vs 坏表现"的录像对照着练——好动作要在身体里越来越自然，坏动作越来越别扭。论文标题很直白："你的语言模型本身就是一个隐藏的奖励模型。"'
    },
    intuition: [
      { heading: '核心直觉：拉大好坏差距、压住偏离', body: 'DPO 对每条偏好对（好回答 y_w、坏回答 y_l）同时做两件事：①<b>拉大差距</b>——提高好回答的概率、压低坏回答的概率；②<b>压住偏离</b>——所有概率变化都相对参考模型 π_ref 度量，不许整体跑飞。一句话：让"好比坏更可能"这件事，在参考模型的坐标系里尽可能显著。' },
      { heading: '为什么说"语言模型本身就是奖励模型"', body: 'DPO 的推导证明：带 KL 约束的奖励最大化有闭式解——最优策略与某个奖励函数一一对应，奖励可以反解为与 log( π(y|x) / π_ref(y|x) ) 成正比的形式。既然奖励能用"策略与参考模型的概率比"直接表达，就不必显式训练奖励模型：把反解式代回偏好目标，得到的就是对策略参数的一个简单分类损失。面试答法："DPO 用数学把 RM 和 RL 合并成了一步。"' },
      { heading: 'RLHF vs DPO 选型（面试场景题）', body: '选 DPO：已有现成偏好对、想快速对齐、算力有限、追求简单稳定——开源社区与中小团队首选。选 RLHF（PPO/GRPO）：算力与工程能力充足、需要精细控制（正确性、格式、安全性等多信号奖励组合）、或做可验证奖励的推理强化（数学、代码）。一句话总结："DPO 稳、省、快；RLHF 强、活、贵。"' }
    ],
    principle: [
      {
        heading: 'DPO 损失逐项拆解',
        body: '形式上就是一个二分类损失：让"相对参考模型的概率比"在好回答上大于坏回答，用 log-sigmoid 惩罚违反。训练时同时更新 π，π_ref 全程冻结。',
        formula: 'L_DPO = −log σ( β · ( log( π(y_w|x) / π_ref(y_w|x) ) − log( π(y_l|x) / π_ref(y_l|x) ) ) )',
        formulaNote: '<ul><li><b>y_w / y_l</b>：人类标注的好回答（win）与坏回答（lose）</li><li><b>π(y|x)</b>：正在训练的模型给回答的概率；<b>π_ref</b>：冻结参考模型（通常为 SFT 模型）</li><li><b>log π/π_ref</b>：对数概率比——"相对参考模型，这个回答被抬高了多少"；好回答应升高、坏回答应降低</li><li><b>括号内相减</b>：差值越大 = 好坏拉得越开，σ 后越接近 1，损失越小</li><li><b>β</b>：缰绳系数，控制偏离参考模型的力度——β 大则更新保守，β 小则优化激进、易过拟合偏好</li></ul>'
      },
      {
        heading: '对比 RLHF：省了什么、少了什么',
        body: '省了：不用标注+训练+部署奖励模型（省一整套流水线与显存），不用在线采样循环（离线数据、单个损失端到端训练），实现简单、稳定性好。少了：在线探索——DPO 只能在人类给过的偏好对上学习（off-policy），无法像 RL 那样让模型自己生成新答案再被评审；对多目标奖励的组合控制与"可验证奖励"场景（数学代码 RL）支持较弱。'
      },
      {
        heading: '工程要点与家族',
        body: '实践要点：偏好数据质量决定上限（好坏差距要真实、明确）；β 是关键超参；参考模型固定为 SFT checkpoint；通常只训 1~3 个 epoch，久了易过拟合。家族改进可顺口提：IPO（修过拟合）、KTO（只需"好/坏"单边标签）、ORPO（把偏好目标并进 SFT 一步完成）、GRPO（RL 系，可验证奖励，DeepSeek 采用）。面试能报出一两个家族成员即是亮点。'
      }
    ],
    animation: {
      title: '偏好拉锯台：拉大差距，守住缰绳',
      html: '<div class="anim-m6-06"><div class="anim-m6-06-pair"><div class="anim-m6-06-p"><b class="anim-m6-06-wlab">好回答 y_w</b><span class="anim-m6-06-txt">"非常抱歉给您带来不便，这里有两种退款方案……"</span><div class="anim-m6-06-track"><div class="anim-m6-06-fill anim-m6-06-fw"></div></div><span class="anim-m6-06-pct anim-m6-06-pw"></span></div><div class="anim-m6-06-p"><b class="anim-m6-06-llab">坏回答 y_l</b><span class="anim-m6-06-txt">"不知道，自己查。"</span><div class="anim-m6-06-track"><div class="anim-m6-06-fill anim-m6-06-fl"></div></div><span class="anim-m6-06-pct anim-m6-06-pl"></span></div></div><div class="anim-m6-06-row"><span>β（缰绳松紧）= <b class="anim-m6-06-bval">0.30</b></span><input class="anim-m6-06-bslider" type="range" min="5" max="100" step="5" value="30"></div><div class="anim-m6-06-ctrl"><button type="button" class="anim-m6-06-btn anim-m6-06-step">再练一轮 DPO ▶</button><button type="button" class="anim-m6-06-btn anim-m6-06-reset">重置</button></div><div class="anim-m6-06-readout"></div><div class="anim-m6-06-klrow"><span class="anim-m6-06-klab">相对参考模型的总偏移（KL）</span><div class="anim-m6-06-track"><div class="anim-m6-06-fill anim-m6-06-fk"></div></div></div><div class="anim-m6-06-warn"></div></div>',
      css: '.anim-m6-06 { font-size: 13px; }\n.anim-m6-06-p { margin-bottom: 10px; }\n.anim-m6-06-p b { display: inline-block; margin-right: 8px; }\n.anim-m6-06-wlab { color: #15803d; }\n.anim-m6-06-llab { color: #b91c1c; }\n.anim-m6-06-txt { font-size: 11px; color: #64748b; }\n.anim-m6-06-row { display: flex; align-items: center; gap: 10px; margin: 10px 0; }\n.anim-m6-06-bslider { flex: 1; }\n.anim-m6-06-bval { color: #b91c1c; }\n.anim-m6-06-ctrl { display: flex; gap: 8px; margin-bottom: 10px; }\n.anim-m6-06-btn { border: 1px solid #ef4444; color: #b91c1c; background: #fff; border-radius: 6px; padding: 5px 12px; cursor: pointer; font-size: 12px; }\n.anim-m6-06-btn:hover { background: #fef2f2; }\n.anim-m6-06-track { flex: 1; height: 14px; background: #e2e8f0; border-radius: 7px; overflow: hidden; position: relative; }\n.anim-m6-06-p .anim-m6-06-track { display: inline-block; vertical-align: middle; width: 58%; }\n.anim-m6-06-fill { height: 100%; width: 50%; border-radius: 7px; transition: width .45s ease, background .45s ease; }\n.anim-m6-06-fw { background: #22c55e; }\n.anim-m6-06-fl { background: #f87171; }\n.anim-m6-06-fk { background: #f97316; }\n.anim-m6-06-pct { font-family: monospace; font-size: 11px; margin-left: 6px; }\n.anim-m6-06-readout { font-family: monospace; color: #334155; margin-bottom: 8px; min-height: 18px; }\n.anim-m6-06-klrow { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }\n.anim-m6-06-klab { width: 190px; font-size: 11px; color: #475569; flex-shrink: 0; }\n.anim-m6-06-warn { min-height: 36px; color: #b45309; font-weight: 600; font-size: 12px; }',
      js: function (root) {
        var bslider = root.querySelector('.anim-m6-06-bslider');
        var bval = root.querySelector('.anim-m6-06-bval');
        var fw = root.querySelector('.anim-m6-06-fw');
        var fl = root.querySelector('.anim-m6-06-fl');
        var fk = root.querySelector('.anim-m6-06-fk');
        var pw = root.querySelector('.anim-m6-06-pw');
        var pl = root.querySelector('.anim-m6-06-pl');
        var readout = root.querySelector('.anim-m6-06-readout');
        var warn = root.querySelector('.anim-m6-06-warn');
        var dw = 0, dl = 0, round = 0;
        function render() {
          var beta = Number(bslider.value) / 100;
          bval.textContent = beta.toFixed(2);
          pw.textContent = (50 + dw * 22).toFixed(0) + '%';
          pl.textContent = (50 + dl * 22).toFixed(0) + '%';
          fw.style.width = (50 + dw * 22) + '%';
          fl.style.width = (50 + dl * 22) + '%';
          var kl = (dw * dw + dl * dl) * 9;
          fk.style.width = Math.min(kl, 100) + '%';
          readout.textContent = '第 ' + round + ' 轮：对数概率比差 = ' + (dw - dl).toFixed(2) + '（越大 = 好坏拉得越开）';
          warn.textContent = round === 0
            ? '点"再练一轮"：好回答概率被抬高、坏回答被压低——这就是 DPO 在做的事。'
            : (round >= 8
              ? '已练 ' + round + ' 轮：偏好对被反复过拟合、KL 偏移过大，有质量反噬风险——现实中 DPO 通常只训 1~3 个 epoch。'
              : 'β 大 = 稳但慢（离参考模型近）；把 β 拉小再练，差距涨得快但 KL 飙升——容易过拟合偏好。');
        }
        root.querySelector('.anim-m6-06-step').addEventListener('click', function () {
          var beta = Number(bslider.value) / 100;
          var rate = 0.5 * (1.05 - beta) / (0.7 + beta);
          dw = Math.min(2, dw + rate);
          dl = Math.max(-1.8, dl - rate * 0.85);
          round++;
          render();
        });
        root.querySelector('.anim-m6-06-reset').addEventListener('click', function () {
          dw = 0; dl = 0; round = 0; render();
        });
        bslider.addEventListener('input', render);
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'DPO 与 RLHF 最核心的区别是？',
        options: ['DPO 不需要任何人类数据', 'DPO 不训练显式的奖励模型，直接用偏好对优化策略', 'DPO 不需要参考模型 π_ref', 'DPO 只能用于代码模型'],
        answer: 1,
        explanation: 'DPO（Rafailov 等 2023）的核心就是把"训奖励模型 + PPO"合并成一步：直接在偏好对上用分类式损失优化策略，无显式奖励模型、无 RL 采样循环。A 错——DPO 依然依赖人类标注的偏好对；C 错——π_ref 是公式里压住偏离的关键，必须存在；D 无中生有。面试考点：一句"无显式 RM 的一阶段偏好优化"即可得分。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'DPO 的损失里同时出现训练模型 π 与冻结的参考模型 π_ref，后者用于压住模型偏离参考分布，防止为拉大好坏差距而整体跑飞。',
        answer: true,
        explanation: '正确。公式中的 log(π/π_ref) 把两个模型的概率都放到"相对参考模型"的坐标系里度量，π_ref（通常取 SFT checkpoint）扮演了 RLHF 中 KL 约束的角色：没有它，模型可以同时抬高好回答、也抬高坏回答甚至整体概率漂移来"作弊"降损失。β 控制这根缰绳的松紧。面试考点：能指出 π_ref 等价于隐式的 KL 正则，说明真的读懂了 DPO。'
      },
      {
        type: 'single', difficulty: 3,
        question: '场景题：创业团队想给 7B 客服模型加上"礼貌且不乱承诺"的风格，已有 2 万条人工标注偏好对，只有两台消费级 GPU、一名算法工程师。最合理的选型是？',
        options: ['从零预训练一个更小的领域模型', 'RLHF：先训一个 70B 奖励模型，再用 PPO 精细调优', 'DPO：直接在偏好对上优化 7B 模型，离线单阶段、成本低、稳定易实现', '不做任何训练，在系统提示词里写 3000 字行为守则'],
        answer: 2,
        explanation: '资源受限 + 现成偏好对 + 目标是风格对齐，正是 DPO 的甜点区：单阶段离线训练、无需奖励模型与 RL 采样循环、两台 GPU 可跑（可叠 QLoRA）。B 严重过度设计：70B 奖励模型训不起也用不上；A 更是远超需求；C 胜出；D 只靠提示词对行为风格的约束力弱且不稳定，且 3000 字守则会挤压上下文。面试考点：选型题按"数据形态（有无偏好对）、算力、稳定性要求、是否需要在线探索"四个维度作答。'
      }
    ],
    relations: {
      prerequisites: ['m6-05'],
      successors: [],
      confusables: [
        { other: 'm6-05', tip: 'RLHF 两阶段（先训奖励模型再 PPO），支持在线探索与多信号奖励组合；DPO 一阶段离线偏好损失，无显式 RM。别记反：DPO 的 D 就是 Direct（直接）——直接对策略优化。' },
        { other: 'm6-03', tip: 'SFT 的损失是"把示范答案的概率抬高"（绝对模仿），DPO 是"好答案相对坏答案的概率比要拉开"（相对偏好）；SFT 的 checkpoint 通常就是 DPO 的参考模型 π_ref 和初始化。' }
      ]
    },
    memory: {
      mnemonic: '不请评委直接练，好坏拉开记心间；β 是缰绳别丢，离线一阶段最省。',
      selfTest: [
        { q: '为什么说"语言模型本身就是奖励模型"？', a: '带 KL 约束的奖励最大化有闭式解，奖励可反解为与 log(π(y|x)/π_ref(y|x)) 一一对应的形式；既然奖励能由策略概率比表达，显式奖励模型可被消去，偏好目标直接写成对 π 的分类损失——这正是 DPO 的推导核心。' },
        { q: '什么时候仍应选 RLHF 而不是 DPO？', a: '需要精细/多信号奖励（正确性、格式、安全各自可调）、on-policy 在线探索、可验证奖励的推理任务（数学、代码 RL，如 GRPO），或有充足算力与 RL 工程团队时；DPO 偏离线、只吃固定偏好对、组合控制弱。' },
        { q: 'DPO 里 β 太小会怎样？', a: '偏离参考模型的约束太弱，模型会过拟合偏好数据：好坏概率比被猛拉，语言质量与多样性受损甚至退化；β 过大则更新保守、偏好学不动。实践常从 0.1 量级起步调参，且只训 1~3 个 epoch。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：DPO 是怎么简化 RLHF 的？',
      reference: 'RLHF 要先花钱培养一位评委、再对着分数训练；DPO 撤掉评委，直接拿"好答案、坏答案"成对的例子让模型自己对比——好的越学越顺口、坏的越学越别扭，一步到位，更稳也更省。'
    }
  }
  ]
});
