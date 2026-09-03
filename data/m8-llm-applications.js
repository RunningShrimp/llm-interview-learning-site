/* M8 LLM 应用 —— 5 个知识点内容数据（契约见 docs/SCHEMA.md v1）
   关键事实已联网核实：RAG 出自 Lewis et al., 2020（arXiv:2005.11401，NeurIPS 2020，Meta AI）；
   ReAct 出自 Yao et al., 2022（arXiv:2210.03629，ICLR 2023）；
   LLM-as-a-judge 的长度/位置/自我偏好偏差见 Zheng et al., 2023（MT-Bench/Chatbot Arena，NeurIPS 2023）等。 */
window.SITE_DATA.registerModule({
  module: 'M8',
  title: 'LLM 应用',
  icon: '🧩',
  color: '#3b82f6',
  lessons: [
  {
    id: 'm8-01',
    title: 'Prompt Engineering',
    oneLiner: '把话说明白是一门手艺',
    estMinutes: 12,
    analogy: {
      title: '给过度听话的新员工写岗位说明书',
      body: '想象你带了一位极度听话、字面理解一切的新员工。你说"帮我整理下这份报告"，他可能原样复制全文交给你——因为你没说要"提炼要点"；你说"别写太长"，他真的只交回一行字。但只要说明书里写清楚四件事：<b>他是谁（角色）</b>、<b>要做什么（任务）</b>、<b>什么算做好（约束）</b>、<b>照什么样子做（示例）</b>，他就能交付得又快又稳。大模型（LLM）正是这样一位新员工：能力很强，但完全按字面办事。<b>Prompt Engineering（提示词工程）</b>，就是给这位新员工写岗位说明书的手艺。'
    },
    intuition: [
      { heading: '模型"过度听话"：你不写，它就猜', body: '大模型没有办公室里的默契，你省略的每个信息，它都会按"训练数据里最常见的样子"补全。只问"苹果"不加限定，它可能聊水果也可能聊公司，因为两种回答在语料里都常见。所以写 Prompt 的第一条铁律是：<b>别让模型猜你的意图，把意图明明白白写出来</b>。' },
      { heading: '好 Prompt 四件套：角色 + 任务 + 约束 + 示例', body: '角色（Role）给模型戴上帽子："你是资深电商客服"，语气和知识面立刻就位。任务（Task）用明确动词说清做什么："判断这条评价是好评还是差评"。约束（Constraint）划定边界："只输出两个字，不要解释"。示例（Example）给出样板："照这个输入→输出的样子做"。四件套不必每次全上，但缺哪一件，模型就在哪一件上自由发挥。' },
      { heading: '要 JSON 就给 JSON 模板；警惕三个高频坑', body: '结构化输出（Structured Output）的关键是"给它抄的骨架"：直接在 Prompt 里写出目标 JSON 模板让它填空，成功率远高于一句"请输出 JSON"。三个高频坑：①指令模糊（"写好一点"没有可执行的标准）；②一次塞太多任务（模型会漏做排在后面的）；③忘了约定输出格式（下游程序解析直接崩）。面试里"如何让模型稳定吐 JSON"是高频追问。' }
    ],
    principle: [
      {
        heading: '四件套逐项拆解（面试可背的框架）',
        body: '把写 Prompt 当成填一张四格表：角色定语气与知识面，任务定动词与对象，约束定格式、长度与禁项，示例定风格基线。面试 order 题常考"怎么组织一段好 Prompt"，标准顺序就是：<b>先角色、再任务、后约束、末尾示例</b>。约束紧跟任务不易被长上下文"冲淡"，示例压轴当参照物。'
      },
      {
        heading: 'Few-shot：示例是最强的格式控制器',
        body: '在 Prompt 里给几个输入输出示例叫少样本提示（Few-shot Prompting），不给则叫零样本（Zero-shot）。示例不必多，2~3 个覆盖典型情况即可；示例之间格式必须完全一致，因为模型会忠实模仿示例的格式——连同示例里的毛病一起学。它与 m6-03 的指令微调（SFT）形成对照：SFT 把格式"焊进"模型权重，Few-shot 只在本次对话里临时演示，换次对话就失效。'
      },
      {
        heading: '排查表：输出不对，按固定顺序查',
        body: '面试排查题可以按这个顺序问自己：①任务是否一句能说清？说不清就先拆任务，别指望一次调用全做。②是否写明输出格式？没写就补模板。③有没有给对比例子？没有就补 few-shot。④任务是否需要多步推理？可以让模型"先写推理步骤再给答案"，即思维链（Chain-of-Thought, CoT）提示的思想。逐条排查，比推翻重写整个 Prompt 快得多。'
      }
    ],
    animation: {
      title: '烂 Prompt vs 好 Prompt：同题对照输出机',
      html: '<div class="anim-m8-01"><div class="anim-m8-01-bar"><label>场景 <select class="anim-m8-01-scene"><option value="0">判断评论好评/差评</option><option value="1">提取订单信息</option><option value="2">写会议通知</option></select></label><button type="button" class="anim-m8-01-run">同时发给模型</button><span class="anim-m8-01-note">右侧好 Prompt 用颜色标出四件套：紫=角色、蓝=任务、橙=约束、绿=示例</span></div><div class="anim-m8-01-cols"><div class="anim-m8-01-col anim-m8-01-bad"><div class="anim-m8-01-tag">随手写的烂 Prompt</div><div class="anim-m8-01-prompt"></div><div class="anim-m8-01-tag2">模型输出（不可控）</div><div class="anim-m8-01-out"></div></div><div class="anim-m8-01-col anim-m8-01-good"><div class="anim-m8-01-tag">四件套好 Prompt</div><div class="anim-m8-01-prompt"></div><div class="anim-m8-01-tag2">模型输出（稳定可用）</div><div class="anim-m8-01-out"></div></div></div></div>',
      css: '.anim-m8-01 { font-size: 13px; }\n.anim-m8-01-bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 8px; }\n.anim-m8-01-note { color: #64748b; font-size: 12px; }\n.anim-m8-01-cols { display: flex; gap: 10px; flex-wrap: wrap; }\n.anim-m8-01-col { flex: 1 1 260px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; min-width: 0; }\n.anim-m8-01-bad { background: #fef2f2; border-color: #fecaca; }\n.anim-m8-01-good { background: #f0fdf4; border-color: #bbf7d0; }\n.anim-m8-01-tag { font-weight: 700; margin-bottom: 4px; }\n.anim-m8-01-bad .anim-m8-01-tag { color: #b91c1c; }\n.anim-m8-01-good .anim-m8-01-tag { color: #15803d; }\n.anim-m8-01-tag2 { font-weight: 600; color: #64748b; margin: 6px 0 2px; font-size: 12px; }\n.anim-m8-01-prompt, .anim-m8-01-out { background: rgba(255,255,255,.8); border-radius: 6px; padding: 6px 8px; line-height: 1.65; }\n.anim-m8-01-show { animation: anim-m8-01-in .45s ease; }\n@keyframes anim-m8-01-in { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }\n.anim-m8-01-run, .anim-m8-01-scene { cursor: pointer; padding: 4px 10px; border-radius: 6px; border: 1px solid #93c5fd; background: #dbeafe; }',
      js: function (root) {
        var DATA = [
          {
            bad: '帮我看看这条评论："耳机用了两天就哑了，客服还爱答不理。"是好评还是差评？分析一下，顺便给点回复建议。',
            badOut: '这条评论整体偏负面：产品耐用性与服务态度均受到质疑……建议您可以这样回复："亲爱的用户，您好！非常抱歉给您带来不好的体验……"（输出了没人要的长篇分析加回复模板，且每次格式都不一样）',
            good: '【角色】你是电商评论标注员。【任务】判断评论的情感倾向。【约束】只输出两个字：好评 或 差评，不要任何解释。【示例】"物流很快，包装完好" → 好评；"用了三天就坏了" → 差评。现在请判断："耳机用了两天就哑了，客服还爱答不理。"',
            goodOut: '差评'
          },
          {
            bad: '帮我把这句话里的信息整理一下："订单号A1024，两箱苹果，收件人张先生。"',
            badOut: '好的！这条信息涉及订单查询。建议您：1. 联系客服核实物流状态；2. 保留好订单号 A1024 以便查询；3. 关注收货短信……（模型跑去"帮忙处理问题"而不是提取字段，下游程序根本无法解析）',
            good: '【任务】从句子中提取订单信息。【约束】严格按此 JSON 模板输出，缺失字段填 null，除 JSON 外不要任何文字：{"订单号":"","商品":"","收件人":""}。【示例】"订单B7788的一箱橙子给李女士" → {"订单号":"B7788","商品":"一箱橙子","收件人":"李女士"}。句子："订单号A1024，两箱苹果，收件人张先生。"',
            goodOut: '{"订单号":"A1024","商品":"两箱苹果","收件人":"张先生"}'
          },
          {
            bad: '写个通知，别太长。',
            badOut: '通知：近期有活动，请留意。（"别太长"被字面执行到底，时间、地点、内容全靠它自己编，根本没法发）',
            good: '【角色】你是公司行政。【任务】写一则 9 月 15 日下午 3 点在 3 楼会议室开季度会的通知。【约束】80 字以内，必须包含时间与地点两个要点，语气正式，输出纯文本。【示例】"各位同事：9 月 1 日上午 10 点于 2 楼会议室召开月度例会，请准时参加。"',
            goodOut: '各位同事：9 月 15 日下午 3 点在 3 楼会议室召开季度会议，请提前安排好工作，准时参加。'
          }
        ];
        function hl(t) {
          return t
            .replace(/【角色】/g, '<b style="color:#7c3aed">【角色】</b>')
            .replace(/【任务】/g, '<b style="color:#2563eb">【任务】</b>')
            .replace(/【约束】/g, '<b style="color:#d97706">【约束】</b>')
            .replace(/【示例】/g, '<b style="color:#059669">【示例】</b>');
        }
        var sel = root.querySelector('.anim-m8-01-scene');
        var badP = root.querySelector('.anim-m8-01-bad .anim-m8-01-prompt');
        var badO = root.querySelector('.anim-m8-01-bad .anim-m8-01-out');
        var goodP = root.querySelector('.anim-m8-01-good .anim-m8-01-prompt');
        var goodO = root.querySelector('.anim-m8-01-good .anim-m8-01-out');
        function show(el, html) {
          el.innerHTML = html;
          el.classList.remove('anim-m8-01-show');
          void el.offsetWidth;
          el.classList.add('anim-m8-01-show');
        }
        root.querySelector('.anim-m8-01-run').addEventListener('click', function () {
          var d = DATA[Number(sel.value)] || DATA[0];
          show(badP, d.bad);
          show(goodP, hl(d.good));
          show(badO, d.badOut);
          show(goodO, d.goodOut);
        });
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '好 Prompt 的「四件套」<b>不包括</b>下面哪一项？',
        options: ['给模型设定角色（如：你是资深电商客服）', '用明确动词写清任务（如：判断这条评价的情感倾向）', '约定输出约束（如：只输出两个字、80 字以内）', '要求模型重新训练自己来适应这个任务'],
        answer: 3,
        explanation: '四件套 = 角色 + 任务 + 约束（外加示例），全部作用在"输入"层面。Prompt 无法改变模型权重——想让模型永久改变"能力与习惯"要靠微调（见 m6-03）。常见误区：把提示词层和训练层混为一谈。面试考点：分清两种干预手段的边界，是应用岗的第一道分水岭。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '在 Prompt 里给 2~3 个格式完全一致的输入输出示例（Few-shot），通常比只说一句"请按 JSON 格式输出"更能稳定控制输出格式。',
        answer: true,
        explanation: '模型对示例的模仿能力极强，"给样板照抄"永远比"口头要求"可靠，示例是最直接的格式控制器。常见误区：示例越多越好——过多示例会占用上下文窗口，且示例里的错误与坏格式也会被一并模仿。面试考点：Few-shot 与 SFT 的区别——前者是临时演示、不改权重，后者把行为写进参数、永久生效。'
      },
      {
        type: 'order', difficulty: 3,
        question: '面试场景：要把一段模糊 Prompt 改造成高质量 Prompt，请按合理顺序排列以下四个步骤。',
        items: ['补上 2 个格式一致的输入输出示例（Few-shot）', '写清任务动词与对象（判断什么 / 提取什么 / 改写什么）', '加上输出约束（格式、长度、禁项）', '先设定角色与场景（你是谁、处于什么情境）'],
        answer: [3, 1, 2, 0],
        explanation: '标准顺序是四件套口诀：角色 → 任务 → 约束 → 示例。角色先定语气与知识面；任务紧随其后，模型才知道"做什么"；约束限定输出形态；示例压轴当参照物，模型对离得近的信息更敏感。常见误区：把示例放最前、约束放最后——格式要求离生成位置越远越容易被"冲淡"。面试考点："怎么组织一段好 Prompt"是 order 题高频素材。'
      }
    ],
    relations: {
      prerequisites: ['m6-03'],
      successors: ['m8-02', 'm8-03'],
      confusables: [
        { other: 'm6-03', tip: 'Prompt 是"临时口头交代"，只改本次输入、不改权重，下个对话就失效；SFT 微调是"入职培训"，把行为写进参数、永久生效，但需要训练数据与算力。' },
        { other: 'm7-02', tip: '采样参数（temperature / top-p）控制"随机性大小"，Prompt 控制"说什么、什么格式"；输出发散失控时应先查 Prompt 是否模糊，再考虑调采样参数。' }
      ]
    },
    memory: {
      mnemonic: '角色任务加约束，示例压轴定乾坤。',
      selfTest: [
        { q: '模型输出的 JSON 总是解析失败，按什么顺序排查？', a: '①有没有给 JSON 模板让它"填空"；②有没有 few-shot 示例演示格式；③格式要求是否被前后长文冲淡（可挪到 Prompt 末尾再强调一次）；④仍不稳定就改用函数调用/结构化输出功能（见 m8-03 Function Calling）。' },
        { q: '为什么"一次让模型做五件事"效果差？怎么改？', a: '多个任务互相干扰，模型容易漏做靠后的任务或混用格式。应拆成多次调用，每次聚焦一个任务；需要串联时用 Agent 编排（m8-03），让每一步的输入输出都可控。' },
        { q: 'Few-shot 示例有什么副作用？', a: '模型会忠实模仿示例的格式与瑕疵，示例本身有错就会被跟着学错；同时示例占用上下文窗口。示例宜精不宜多，2~3 个覆盖典型情况、格式严格一致即可。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：Prompt Engineering 到底在干嘛？',
      reference: '就是给一位能力超强但"你说啥他做啥"的新员工写清楚岗位说明书：他是谁、干什么、怎么算干好、照哪个样子干——说明书写得越明白，他交付得越稳。'
    }
  },
  {
    id: 'm8-02',
    title: 'RAG 检索增强',
    oneLiner: '开卷考试：先查资料再回答',
    estMinutes: 15,
    analogy: {
      title: '从闭卷考试到开卷考试',
      body: '让模型凭"背在脑子里的知识"（参数）答题，就像让学生<b>闭卷</b>考试：考纲之外不会做，记混了还会硬编一个答案交卷——这就是<b>幻觉（Hallucination）</b>。<b>检索增强生成（RAG, Retrieval-Augmented Generation）</b>把考试改成<b>开卷</b>：先去书堆里翻出最相关的几段（检索），垫在草稿纸上（拼进 Prompt），照着资料写答案（生成），还能注明"出自第几页"（溯源）。记住这个类比，下面每一步都能在开卷考试里找到对应动作。'
    },
    intuition: [
      { heading: '为什么闭卷不够用', body: '参数里的知识有两个硬伤：<b>截止日期</b>——训练之后发生的事一概不知；<b>私有盲区</b>——你公司的制度文档，全网语料里根本没有。靠重新训练补知识又贵又慢。RAG 的思路是：知识放在外面（向量库），模型只负责"读懂资料、组织答案"，资料随时换，模型不用动。' },
      { heading: '离线建库 + 在线问答，两段流水线', body: 'RAG 分两段。<b>离线建库</b>：把文档切片，逐段用嵌入（Embedding）模型转成向量存进向量库。<b>在线问答</b>：用户问题也转成向量，去库里检索最相似的 Top-K 段，拼进 Prompt，让模型生成带出处的回答。面试基本要求是"五步说全"：<b>切片 → 向量化 → 检索 → 拼接 → 生成</b>。' },
      { heading: 'chunk 大小：太小丢上下文，太大掺噪音', body: '切片（Chunk）大小是 RAG 第一个要调的旋钮。切太碎：一句话被拦腰截断，检索到了也读不懂前因后果。切太大：一段里混进大量无关内容，既稀释重点又挤占上下文。常见起点是几百字一段、段间留少量重叠，并借助文档标题、段落结构辅助切分。没有万能值，最终要靠评测集验证（见 m8-04）。' }
    ],
    principle: [
      {
        heading: '五步流水线逐步拆解（面试必背）',
        body: '① <b>文档切片</b>：整本文档拆成适合检索的小段。② <b>Embedding 向量化</b>：每个切片过嵌入模型变成一串数字（向量）——这正是 m4-02 词向量思想的工程化：语义相近的文本，向量也相近。③ <b>相似度检索 Top-K</b>：问题同样变成向量，与库中所有切片算相似度，取最高的 K 段。④ <b>拼进 Prompt</b>：把 K 段资料按模板垫在问题前，并要求"仅根据资料回答、注明出处"。⑤ <b>生成</b>：模型照着资料作答，资料里没有就明说"未找到"。前两步属于离线建库，后三步是每次问答都在线的部分。'
      },
      {
        heading: '检索那一步在算什么：余弦相似度',
        body: '检索的核心是给"问题向量"和每个"切片向量"打相近分，再排序取前 K 名。',
        formula: 'cos θ = (q · d) / (‖q‖ × ‖d‖)',
        formulaNote: '<ul><li><b>q</b>：问题（Query）的向量，例如"年假有几天"被编码成的一串数字</li><li><b>d</b>：某个文档切片（Document）的向量</li><li><b>q · d</b>：两个向量的点积，对应位置相乘再求和（见 m1-01）</li><li><b>除以两个模长</b>：消除向量长度影响，只比较方向</li><li><b>cos θ</b>：越接近 1 越相似；对全库打分后取 Top-K 就是检索</li></ul>'
      },
      {
        heading: '什么时候该上 RAG（选型题半壁江山）',
        body: '三个信号：①<b>知识常更新</b>（法规、价格、产品文档）——改文档即可生效，不用动模型；②<b>要溯源</b>——回答能附上出自哪个文档哪一段，可核查、可审计；③<b>私有文档</b>——公司内部知识库，训练语料里本来就没有。反过来，RAG 的短板是"改不了行为"：说话风格、格式习惯这类问题要靠微调解决（见 m8-05）。RAG 一词出自 Lewis 等人 2020 年的论文，最初就是把检索器接在生成模型前面。'
      }
    ],
    animation: {
      title: '开卷考试五步流水线：点「下一步」走完全程',
      html: '<div class="anim-m8-02"><div class="anim-m8-02-steps"><span class="anim-m8-02-step">1 切片</span><span class="anim-m8-02-step">2 向量化</span><span class="anim-m8-02-step">3 检索 Top-K</span><span class="anim-m8-02-step">4 拼 Prompt</span><span class="anim-m8-02-step">5 生成</span></div><div class="anim-m8-02-bar"><button type="button" class="anim-m8-02-next">下一步 ▶</button><button type="button" class="anim-m8-02-reset">重来</button><span class="anim-m8-02-note">场景：员工手册问答「年假有几天？」</span></div><div class="anim-m8-02-stage"></div></div>',
      css: '.anim-m8-02 { font-size: 13px; }\n.anim-m8-02-steps { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }\n.anim-m8-02-step { padding: 4px 10px; border-radius: 999px; background: #e2e8f0; color: #475569; font-size: 12px; transition: background .35s ease, color .35s ease; }\n.anim-m8-02-on { background: #3b82f6; color: #fff; }\n.anim-m8-02-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; }\n.anim-m8-02-note { color: #64748b; font-size: 12px; }\n.anim-m8-02-next, .anim-m8-02-reset { cursor: pointer; padding: 4px 12px; border-radius: 6px; border: 1px solid #93c5fd; background: #dbeafe; }\n.anim-m8-02-reset { background: #f1f5f9; border-color: #cbd5e1; }\n.anim-m8-02-next:disabled { opacity: .5; cursor: default; }\n.anim-m8-02-stage { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; line-height: 1.7; min-height: 120px; }\n.anim-m8-02-h { font-weight: 700; color: #1d4ed8; margin-bottom: 6px; }\n.anim-m8-02-tip { color: #64748b; }',
      js: function (root) {
        var CONTENT = [
          { t: '第 1 步 · 文档切片（离线建库）', h: '《员工手册》整本 PDF 太长，先切成小段（chunk）：<br><br>• chunk-1：考勤与作息：工作日 9:00–18:00……<br>• <b>chunk-2：第五章 休假：年假按司龄 5～15 天，需提前 3 天申请……</b><br>• chunk-3：报销流程：出差报销需在 30 天内提交……<br><br>按标题与段落切，几百字一段、段间留少量重叠，避免把一句话拦腰切断。' },
          { t: '第 2 步 · Embedding 向量化（离线建库）', h: '每个 chunk 过嵌入（Embedding）模型变成一串数字（向量），语义越接近、向量方向越接近（m4-02 词向量思想的工程化）：<br><br>• chunk-1 → [0.21, −0.40, 0.02, …]<br>• <b>chunk-2 → [0.88, 0.15, −0.32, …]</b><br>• chunk-3 → [0.05, −0.11, 0.74, …]<br><br>全部向量连同原文一起存入向量库。这一步只在建库或文档更新时做。' },
          { t: '第 3 步 · 相似度检索 Top-K（在线）', h: '用户提问：<b>「年假有几天？」</b>问题用<b>同一个</b>嵌入模型变成向量，与库中每个 chunk 算余弦相似度：<br><br>• chunk-1（作息）相似度 0.41<br>• <b>chunk-2（休假）相似度 0.93 ✔ 入选</b><br>• chunk-3（报销）相似度 0.28<br><br>取最高的 K 段（如 K=2 时还会带上 chunk-1 作次要参考）。' },
          { t: '第 4 步 · 拼进 Prompt（在线）', h: '把检索到的资料按模板垫在问题前面，并立好规矩：<br><br><b>【资料1】</b>第五章 休假：年假按司龄 5～15 天……<br><b>【资料2】</b>考勤与作息：……<br><b>【问题】</b>年假有几天？<br><b>【要求】</b>仅根据资料回答；资料中没有就明说；注明出自哪条资料。' },
          { t: '第 5 步 · 生成回答（在线）', h: '模型照着资料组织答案：<br><br>「根据《员工手册》第五章，<b>年假按司龄为 5～15 天</b>，需提前 3 天申请。（出处：资料1）」<br><br>对比闭卷：模型不再凭记忆硬编，答案可溯源可核查。若检索一无所获，合格的系统应回答"资料中未找到"，而不是瞎编。' }
        ];
        var steps = root.querySelectorAll('.anim-m8-02-step');
        var stage = root.querySelector('.anim-m8-02-stage');
        var next = root.querySelector('.anim-m8-02-next');
        var i = -1;
        function paint() {
          steps.forEach(function (s, k) { s.classList.toggle('anim-m8-02-on', k <= i); });
          if (i < 0) {
            stage.innerHTML = '<div class="anim-m8-02-tip">点「下一步」，按顺序走完 RAG 五步流水线，观察每一步的产物长什么样。</div>';
          } else {
            stage.innerHTML = '<div class="anim-m8-02-h">' + CONTENT[i].t + '</div><div>' + CONTENT[i].h + '</div>';
          }
          var done = i >= CONTENT.length - 1;
          next.disabled = done;
          next.textContent = done ? '已完成，点「重来」' : '下一步 ▶';
        }
        next.addEventListener('click', function () { if (i < CONTENT.length - 1) { i++; paint(); } });
        root.querySelector('.anim-m8-02-reset').addEventListener('click', function () { i = -1; paint(); });
        paint();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'RAG 五步流水线的正确顺序是？',
        options: ['切片 → 向量化 → 检索 Top-K → 拼进 Prompt → 生成', '向量化 → 切片 → 拼进 Prompt → 检索 Top-K → 生成', '检索 Top-K → 切片 → 向量化 → 生成 → 拼进 Prompt', '切片 → 检索 Top-K → 向量化 → 生成 → 拼进 Prompt'],
        answer: 0,
        explanation: '对应开卷考试：先把书切成段落做成向量索引（离线），考试时拿问题去查（检索），把查到的垫在题目前面（拼接），照着写答案（生成）。常见误区：向量化必须发生在切片之后（对每段切片分别编码）；拼接必须在检索之后（检索结果就是拼接的原料）。面试考点：RAG 五步是必背基本功，顺序说错直接暴露没做过。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '把文档切成很大的 chunk（比如一整章作为一段）通常效果更好，因为模型能看到的上下文更多。',
        answer: false,
        explanation: 'chunk 太大有双重代价：一是检索定位变粗，一段里混入大量无关内容，命中精度下降；二是塞进 Prompt 占用上下文窗口、稀释重点，还可能触发长度限制。反过来切太碎又会丢上下文、检索到了也读不通。常见误区是"多多益善"，实际要按评测集调参，几百字加段间重叠是常见起点。面试考点：chunk 权衡是 RAG 调优的第一问。'
      },
      {
        type: 'order', difficulty: 2,
        question: '知识库已建好，用户提问「公司差旅报销标准是多少」。请按 RAG <b>在线阶段</b>的事件顺序排列以下步骤。',
        items: ['把 Top-K 切片与用户问题按模板拼进 Prompt', '把问题用同一个 Embedding 模型转成向量', '模型根据资料生成带出处的回答', '在向量库中计算相似度，取出 Top-K 相关切片'],
        answer: [1, 3, 0, 2],
        explanation: '在线四步：问题向量化 → 相似度检索 → 拼接 → 生成。特别注意第 1 步的细节：问题必须用与建库<b>同一个</b>嵌入模型编码，否则两套向量空间对不上号，相似度全部失真——这是面试爱挖的实现细节。常见误区：以为建库和提问可以随便换嵌入模型。'
      },
      {
        type: 'single', difficulty: 3,
        question: '面试场景题：公司上线 RAG 后，用户反馈"答非所问"，检查发现检索回来的片段本身就和问题无关。最应该<b>先</b>排查哪一项？',
        options: ['换一个更大的生成模型', '检查查询与建库是否用了同一个 Embedding 模型、切片大小与重叠设置是否合理', '把 temperature 调到 0', '在 Prompt 里加一句"请认真仔细地回答"'],
        answer: 1,
        explanation: '"检索片段就跑偏"说明问题出在检索链路而非生成端：两段用了不同嵌入模型（向量空间不一致）或切片粒度不当是最高频的两个原因。换大模型只改善"组织答案"，不改善"找资料"；temperature 只影响生成随机性；加敬语式指令无济于事。面试考点：RAG 排查的标准第一刀是先定位"检索错"还是"生成错"，再对症下药。'
      }
    ],
    relations: {
      prerequisites: ['m8-01', 'm4-02'],
      successors: ['m8-04', 'm8-05', 'm10-02'],
      confusables: [
        { other: 'm8-05', tip: 'RAG 补"知识与事实"（常更新、要溯源、私有文档），微调改"行为与能力"（风格、格式、领域语感）；两者不冲突，常见组合是先 SFT 定风格、再挂 RAG 供知识。' },
        { other: 'm4-02', tip: 'Word2Vec 是静态词向量：一个词一个固定向量；RAG 用的嵌入模型输出的是语境化的句/段向量，一整段文本编码成一个向量，表达整段语义。' },
        { other: 'm8-03', tip: 'RAG 是"检索一次就作答"的固定流水线；Agent 是"想-做-看"的多轮自主循环，还可以把 RAG 检索收纳为它工具箱里的一个工具。' }
      ]
    },
    memory: {
      mnemonic: '一切二嵌三检索，四拼五答带出处。',
      selfTest: [
        { q: '为什么说 RAG 能减少幻觉？能完全消除吗？', a: '回答被要求"仅根据检索到的资料作答"，模型从凭记忆硬编变成照着资料总结，且资料可溯源可核查，没有资料时还能明说"未找到"。但不能 100% 消除：若检索回错误或无关的资料，模型照样可能错着组织答案。' },
        { q: '建库用嵌入模型 A、查询用嵌入模型 B，会发生什么？', a: '两个模型的向量空间不一致，余弦相似度失去意义，检索质量骤降。问题和文档必须用同一个嵌入模型（最好同版本）编码，换模型就要全库重建。' },
        { q: '知识频繁更新的场景，为什么选 RAG 而不是微调？', a: 'RAG 只需更新向量库里的文档，分钟级生效、可随时回滚、可溯源；微调要重新准备数据、训练、评估、发版，周期长成本高，还容易把旧知识"记死"、与新知识冲突。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：RAG 是什么？',
      reference: '就是给 AI 一场开卷考试：先去资料库里翻出最相关的几页垫在面前，再照着资料回答，还要注明出自哪一页——所以它懂新知识、能给出处、不容易瞎编。'
    }
  },
  {
    id: 'm8-03',
    title: 'Agent 智能体',
    oneLiner: '会定计划、会用工具的实习生',
    estMinutes: 14,
    analogy: {
      title: '一个能干的实习生',
      body: '你对实习生说："查下北京明天天气，要是下雨就把下午团建改成线上，并通知参会的人。"他不会等你一步步教，而是<b>先想</b>（得先看天气）、<b>再动手</b>（打开天气 App）、<b>看结果</b>（有雨）→ <b>又想</b>（那就改线上）→ <b>再动手</b>（改日程、发通知）→ 最后向你汇报。<b>智能体（Agent）</b>就是把这套"边想边做"的本领交给大模型：模型负责想和决策，<b>工具（Tool）</b>负责真正动手——查数据库、调接口、发邮件。模型自己只会"说"，接上工具才让它"做"。'
    },
    intuition: [
      { heading: '裸模型只会说，Agent = 模型 + 工具 + 循环', body: '直接问模型"明天天气如何"，它只能凭训练数据里的旧信息猜。Agent 在模型外面套一个循环：模型每一步可以"申请调用某个工具"，程序真正执行工具、把结果喂回给它，直到它认为任务完成。三个要件缺一不可：<b>会规划的模型（大脑）、可调用的工具（手脚）、能多轮循环的调度程序（把结果喂回去的传送带）</b>。' },
      { heading: 'ReAct：想 → 做 → 看 的循环', body: '最经典的 Agent 模式叫 <b>ReAct</b>（Reasoning + Acting，Yao 等人 2022 年提出）：模型交替输出"想法（Thought）"、动作（Action，比如调用某个工具）、观察（Observation，工具返回的真实结果），循环往复，直到信息够了给出最终答案。它的好处是把"想清楚"和"做出来"绑在一起：先想再动，看到反馈再修正。' },
      { heading: '能力越大，越要校验', body: 'Agent 会把工具返回的一切当成事实——工具返回错误数据、或模型幻觉出一个根本不存在的工具，错误就会沿着循环一路放大。所以生产系统必须：限制工具清单（模型只能选真实存在的工具）、校验调用参数的格式、对发钱删数据这类不可逆动作加人工确认。面试问"Agent 的风险"，答幻觉 + 错误传播 + 安全审批这三条就到位。' }
    ],
    principle: [
      {
        heading: 'ReAct 循环拆解（order 题素材）',
        body: '一轮完整的 ReAct：①接收任务；②<b>Thought</b>：模型想"要完成任务，先缺什么信息"；③<b>Action</b>：选定工具并给出参数，形如 <code>查天气(城市="北京")</code>；④<b>Observation</b>：程序执行工具，把真实结果填回对话；⑤回到②继续想，直到能回答，输出最终答案（Final Answer）。整个过程像实习生的工作日志：每一步都有想法、有动作、有反馈，可追溯、可调试——这也是它比"一口气瞎编"可靠的原因。'
      },
      {
        heading: 'Function Calling：模型点菜，程序炒菜',
        body: '函数调用（Function Calling）是工具调用的标准化做法：开发者把工具清单（名称、功能描述、参数格式）写进 Prompt；模型并不真的执行，而是输出一个结构化的"调用申请"（工具名 + 参数 JSON）；由你的程序去真正执行，再把结果回填给模型继续推理。一句话记住分工：<b>模型只负责决定"调哪个工具、传什么参数"，执行权永远在程序手里</b>——这也正是安全边界所在。'
      },
      {
        heading: '多 Agent 分工与风险控制',
        body: '复杂任务可以拆给多个 Agent 协作：比如"写作 Agent 出稿、审查 Agent 挑错、执行 Agent 落地"，各管一段、互相制衡，类似公司里的岗位分工。风险管理三条要背：工具最小化（只挂必需工具）、参数与返回结果双重校验、高危动作人工审批。ReAct 的原始论文也指出：推理与行动交替进行，能显著缓解纯生成式方法的幻觉与错误累积。'
      }
    ],
    animation: {
      title: 'ReAct 循环：查天气任务的工作日志（点按钮逐条推进）',
      html: '<div class="anim-m8-03"><div class="anim-m8-03-task">任务：查北京明天天气；若下雨，把下午团建改为线上并通知参会人。</div><div class="anim-m8-03-log"></div><div class="anim-m8-03-bar"><button type="button" class="anim-m8-03-next">推进一步 ▶</button><button type="button" class="anim-m8-03-reset">重置</button><span class="anim-m8-03-hint">ReAct = 想(Thought) → 做(Action) → 看(Observation)，循环到能给出最终答案</span></div></div>',
      css: '.anim-m8-03 { font-size: 13px; }\n.anim-m8-03-task { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 8px 10px; margin-bottom: 8px; color: #1e40af; }\n.anim-m8-03-log { display: flex; flex-direction: column; gap: 6px; min-height: 60px; margin-bottom: 8px; }\n.anim-m8-03-row { display: flex; gap: 8px; align-items: flex-start; animation: anim-m8-03-in .4s ease; }\n@keyframes anim-m8-03-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }\n.anim-m8-03-chip { flex: 0 0 auto; color: #fff; font-size: 12px; border-radius: 999px; padding: 2px 8px; white-space: nowrap; }\n.anim-m8-03-txt { line-height: 1.6; }\n.anim-m8-03-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }\n.anim-m8-03-next, .anim-m8-03-reset { cursor: pointer; padding: 4px 12px; border-radius: 6px; border: 1px solid #93c5fd; background: #dbeafe; }\n.anim-m8-03-reset { background: #f1f5f9; border-color: #cbd5e1; }\n.anim-m8-03-next:disabled { opacity: .5; cursor: default; }\n.anim-m8-03-hint { font-size: 12px; color: #64748b; }',
      js: function (root) {
        var FLOW = [
          { k: 'T', label: '想 Thought', text: '要判断改不改线上，得先知道明天北京下不下雨——先查天气。' },
          { k: 'A', label: '做 Action', text: '调用工具：查天气(城市="北京")' },
          { k: 'O', label: '看 Observation', text: '工具返回：明天小雨，降水概率 80%。' },
          { k: 'T', label: '想 Thought', text: '有雨，按任务要求把团建改线上——先改日程。' },
          { k: 'A', label: '做 Action', text: '调用工具：改日程(名称="团建", 形式="线上会议")' },
          { k: 'O', label: '看 Observation', text: '日程已更新：团建改为线上会议，参会 12 人。' },
          { k: 'T', label: '想 Thought', text: '日程改好了，还得让所有参会人知道——发通知。' },
          { k: 'A', label: '做 Action', text: '调用工具：发通知(内容="团建改为线上，链接见日程")' },
          { k: 'O', label: '看 Observation', text: '通知已发送给 12 位参会人。' },
          { k: 'F', label: '答 Final Answer', text: '明天北京有雨，团建已改为线上会议，并已通知全部 12 位参会人。任务完成。' }
        ];
        var log = root.querySelector('.anim-m8-03-log');
        var next = root.querySelector('.anim-m8-03-next');
        function color(k) { return k === 'T' ? '#7c3aed' : (k === 'A' ? '#2563eb' : (k === 'O' ? '#d97706' : '#059669')); }
        var i = 0;
        function step() {
          if (i >= FLOW.length) return;
          var f = FLOW[i];
          var row = document.createElement('div');
          row.className = 'anim-m8-03-row';
          row.innerHTML = '<span class="anim-m8-03-chip" style="background:' + color(f.k) + '">' + f.label + '</span><span class="anim-m8-03-txt">' + f.text + '</span>';
          log.appendChild(row);
          i++;
          if (i >= FLOW.length) { next.disabled = true; next.textContent = '任务完成 ✔'; }
        }
        function resetAll() {
          log.innerHTML = '';
          i = 0;
          next.disabled = false;
          next.textContent = '推进一步 ▶';
        }
        next.addEventListener('click', step);
        root.querySelector('.anim-m8-03-reset').addEventListener('click', resetAll);
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '下面哪件事是<b>裸 LLM</b>（不加工具、不加循环）<b>做不到</b>的？',
        options: ['把一段话改写得更礼貌', '查询仓库此刻的真实库存并下单补货', '把英文合同翻译成中文', '总结一篇长文章的要点'],
        answer: 1,
        explanation: '改写、翻译、总结都是纯文本生成，是模型本行；"查实时库存并下单"需要访问外部系统并产生真实世界的动作——模型只会"说"不会"做"，必须靠 Agent 的工具调用由程序代为执行。面试考点：这条"模型 vs Agent"的分界线是概念题常客，答"模型负责决策、工具负责执行"即可。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '在 Function Calling 机制中，模型会亲自执行工具函数并返回执行结果。',
        answer: false,
        explanation: '模型只输出"调用申请"（工具名 + 参数 JSON），真正执行的是外部程序，程序再把结果回填给模型继续推理。执行权在程序侧而不在模型侧，这既是工程上的安全边界，也让参数校验、权限控制成为可能。面试考点：能用"模型点菜、程序炒菜"一句话讲清分工，是 Agent 岗的加分答法。'
      },
      {
        type: 'order', difficulty: 3,
        question: '请按 ReAct 模式排列 Agent 处理「查上海天气并给出是否带伞建议」时一次完整流程的先后步骤。',
        items: ['输出 Action：调用 查天气(城市="上海")', 'Thought：要给带伞建议，先弄清明天上海下不下雨', 'Observation：明天有雨，降水概率 90%', 'Final Answer：明天有雨，建议带伞', '接收用户任务'],
        answer: [4, 1, 0, 2, 3],
        explanation: 'ReAct 的固定节拍：任务进来先"想"（需要什么信息），再"做"（调工具），再"看"（观察结果），信息足够才输出最终答案。常见误区：一上来就 Action——没想清楚调什么工具；或跳过 Observation 直接编结果——那就退化成了幻觉。面试考点：ReAct 五步流程是 order 高频题，记"任务→想→做→看→答"即可。'
      }
    ],
    relations: {
      prerequisites: ['m8-01'],
      successors: ['m10-02'],
      confusables: [
        { other: 'm8-02', tip: 'RAG 是"检索一次→作答"的固定流水线；Agent 是"想-做-看"的多轮自主循环，循环次数由模型按任务需要决定，且可以把 RAG 当作它众多工具中的一个（检索工具）。' },
        { other: 'm8-01', tip: 'Prompt 是单次输入的说明书；Agent 是在 Prompt 之上叠加"工具 + 循环 + 状态管理"的系统工程——而 Agent 每一轮内部，依然要靠好 Prompt 来约束行为。' }
      ]
    },
    memory: {
      mnemonic: '先想后做再看，循环到能答为止。',
      selfTest: [
        { q: 'Agent 的三要件是什么？', a: '会规划的模型（大脑）、可调用的工具（手脚）、能多轮循环的调度程序（把工具结果喂回模型）。缺了循环只是单次 Function Calling，缺了工具只是普通聊天，缺了规划就是无脑乱调。' },
        { q: '为什么高危动作（发钱、删数据）必须人工确认？', a: '模型可能因幻觉选错工具或传错参数，工具也可能返回错误数据并被当成事实一路传播（错误累积）。不可逆动作必须卡人工审批，把"执行权"牢牢留在程序与人这一侧。' },
        { q: '模型幻觉出一个不存在的工具怎么办？', a: '把工具清单显式写进 Prompt，并在程序侧做解析校验：工具名不在清单内直接拒绝并提示可用工具，参数不符合约定格式也拒绝。校验靠程序，不靠模型自觉。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：AI Agent 和普通聊天机器人差在哪？',
      reference: '聊天机器人只会说，Agent 还会做：它像实习生一样接到任务先想步骤，动手调用日历、搜索这些工具，看一眼结果再调整，直到把事情真正办完。'
    }
  },
  {
    id: 'm8-04',
    title: 'LLM 效果评估',
    oneLiner: '怎么证明你的模型变好了',
    estMinutes: 12,
    analogy: {
      title: '没有体重秤的减肥都是感觉流',
      body: '减肥的人都懂：不称体重、不拍对比照，练两周只会说"感觉瘦了"——既无法服众，也无法比较两种方案哪个更有效。<b>评估（Evaluation）</b>就是 AI 系统的体重秤。难点在于：分类题有标准答案好打分，而"这段回答写得好不好"往往<b>没有唯一标准答案</b>。所以业界的做法是搭"三层秤"：<b>自动指标</b>（客观题秒出分）、<b>LLM-as-judge</b>（请一位 AI 阅卷老师给主观题打分）、<b>人工抽检</b>（专家终审定金标准）。秤都没装就开始改系统，所有"优化"都只是感觉流。'
    },
    intuition: [
      { heading: '先建评测集，再动手优化', body: '评测集（Eval Set）是一批固定的"考题 + 参考答案"，覆盖产品的主要使用场景，它是一切改进的前提。没有它，你改完 Prompt 只能回答"这条好像变好了"，无法回答"整体真的变好了吗"。正确姿势：先固定考题，再改系统，每改一版全量跑一遍考题对比分数。面试金句：<b>没有评测集的优化都是盲调</b>。' },
      { heading: '第一层：自动指标——能算则算', body: '有标准答案的任务用自动指标：分类看<b>准确率（Accuracy）</b>，检索和抽取看<b>命中率（Hit Rate）</b>、召回（Recall）。优点：客观、便宜、秒出结果、可反复回归测试。局限：只适用于"答案能对号入座"的场景；文本相似度类指标（如 ROUGE）与"真的好不好"相关性弱，只宜当粗筛，别当裁判。' },
      { heading: '第二、三层：LLM-as-judge 与人工抽检', body: '开放式回答没有唯一答案，就请一个强模型当评委（LLM-as-a-judge）：给出评分标准和参考答案，让它给候选回答打分。便宜、可规模化，但要警惕评委的三个偏差：<b>偏长回答</b>（verbosity bias，显得内容多就加分）、<b>偏位置</b>（position bias，偏爱摆在特定位置的那个答案）、<b>偏自己风格</b>（self-enhancement，给同类模型的输出打高分）。最上层保留小规模人工抽检当金标准，定期校准前两层。' }
    ],
    principle: [
      {
        heading: '三层评估怎么配合（面试答题框架）',
        body: '标准答法一句话：<b>能自动的自动（客观题指标），不能自动的找评委（LLM-as-judge），评委拿不准的抽人工</b>。工程上分两条线：离线评测——每版发布前在固定评测集上跑分，防回归；在线评测——看真实用户的点赞点踩、任务完成率、人工复核。两条线要互相印证：离线分数涨了但线上点踩变多，往往说明评测集过时、泄漏，或被"应试"了。'
      },
      {
        heading: 'LLM-as-judge 的三个偏差与缓解',
        body: '三个偏差要会背：①<b>长度偏差</b>：评委偏爱更长的回答，哪怕内容更差；②<b>位置偏差</b>：二选一时偏爱特定位置（如摆在后面的那个）；③<b>自我偏好</b>：评委偏爱自己（或同门模型）的输出风格。缓解办法：交换两个候选的位置各评一次再合并、在评分标准里显式声明"长度不加分"、请多个不同厂的模型当评委、抽样人工校准评委的打分。这些偏差在 2023 年 MT-Bench 等研究中被系统证实。'
      },
      {
        heading: '评测集本身也会"腐化"',
        body: '评测集要防两件事：<b>数据泄漏</b>——考题混进训练数据，分数虚高；<b>过拟合评测集</b>——团队只对着考题优化，真实场景却没变好。对策：定期换题、保留一部分"隐藏测试题"不进日常迭代、按真实用户请求的分布配比场景。能不能聊到这一层，是面试区分"背过概念"和"真做过评估"的分水岭。'
      }
    ],
    animation: {
      title: '评委偏差小法庭：换个位置，评分翻转',
      html: '<div class="anim-m8-04"><div class="anim-m8-04-q">问题：蓝牙耳机连不上手机怎么办？（候选 A 简短全对；候选 B 冗长且含错误步骤——AI 评委看得出来吗？）</div><div class="anim-m8-04-cands"><div class="anim-m8-04-card"><div class="anim-m8-04-name1"></div><div class="anim-m8-04-body1"></div></div><div class="anim-m8-04-card"><div class="anim-m8-04-name2"></div><div class="anim-m8-04-body2"></div></div></div><div class="anim-m8-04-bar"><button type="button" class="anim-m8-04-b1">评委评（A 在左）</button><button type="button" class="anim-m8-04-b2">评委评（B 在左）</button><button type="button" class="anim-m8-04-b3">自动指标：对照标准答案</button></div><div class="anim-m8-04-verdict">先点上方按钮：让"评委"给两个候选打分，再用自动指标揭底。</div></div>',
      css: '.anim-m8-04 { font-size: 13px; }\n.anim-m8-04-q { font-weight: 700; margin-bottom: 8px; color: #1e3a8a; line-height: 1.6; }\n.anim-m8-04-cands { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }\n.anim-m8-04-card { flex: 1 1 240px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; background: #f8fafc; min-width: 0; }\n.anim-m8-04-card div { line-height: 1.65; }\n.anim-m8-04-name1, .anim-m8-04-name2 { font-weight: 700; color: #334155; }\n.anim-m8-04-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }\n.anim-m8-04-bar button { cursor: pointer; padding: 4px 10px; border-radius: 6px; border: 1px solid #93c5fd; background: #dbeafe; }\n.anim-m8-04-verdict { border: 1px dashed #cbd5e1; border-radius: 8px; padding: 8px 10px; line-height: 1.7; background: #fff; }\n.anim-m8-04-show { animation: anim-m8-04-in .45s ease; }\n@keyframes anim-m8-04-in { from { opacity: 0; } to { opacity: 1; } }',
      js: function (root) {
        var A = '①检查耳机电量，重启耳机；②手机蓝牙开关关掉再打开；③删除旧配对记录后重新配对。';
        var B = '这个问题其实挺复杂的，原因有很多方面。首先要考虑手机系统版本问题，建议先升级系统到最新；如果还是不行，可以考虑将手机恢复出厂设置，一般能解决大部分蓝牙问题。总之蓝牙连接涉及很多因素，需要逐一耐心排查，必要时联系售后……';
        var name1 = root.querySelector('.anim-m8-04-name1');
        var body1 = root.querySelector('.anim-m8-04-body1');
        var name2 = root.querySelector('.anim-m8-04-name2');
        var body2 = root.querySelector('.anim-m8-04-body2');
        var verdict = root.querySelector('.anim-m8-04-verdict');
        function setCard(n, b, tag, text) { n.textContent = '候选 ' + tag; b.textContent = text; }
        function render(swap) {
          if (swap) { setCard(name1, body1, 'B', B); setCard(name2, body2, 'A', A); }
          else { setCard(name1, body1, 'A', A); setCard(name2, body2, 'B', B); }
        }
        function say(html) {
          verdict.innerHTML = html;
          verdict.classList.remove('anim-m8-04-show');
          void verdict.offsetWidth;
          verdict.classList.add('anim-m8-04-show');
        }
        root.querySelector('.anim-m8-04-b1').addEventListener('click', function () {
          render(false);
          say('<b>LLM-as-judge 判定：「候选 B 更好」——论述更充分、覆盖面更广。</b><br>⚠️ 揭底：其实 A 三步全对，B 含错误建议（让普通用户盲目恢复出厂设置）。评委被"更长 + 摆在后面"带偏——这就是长度偏差叠位置偏差，评分与质量脱钩。');
        });
        root.querySelector('.anim-m8-04-b2').addEventListener('click', function () {
          render(true);
          say('<b>LLM-as-judge 判定：「候选 A 更好」——简洁清晰、可执行性强。</b><br>⚠️ 两个答案一个字没改，只是交换了摆放位置，评委结论就翻转——这是位置偏差（position bias）的经典实验。缓解法：换位各评一次，结论一致才采信。');
        });
        root.querySelector('.anim-m8-04-b3').addEventListener('click', function () {
          render(false);
          say('<b>自动指标（对照标准答案要点）：</b>A 命中 3/3（重启耳机 / 重开蓝牙 / 删除配对重连）；B 命中 1/3，且含 1 个错误步骤。<br>结论：有标准答案时优先自动指标——客观、便宜、不受长度与位置影响。开放式任务才需要评委，且评委要定期用人工抽检校准。');
        });
        render(false);
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '下列哪一项<b>不属于</b> LLM 应用常用的「三层评估」？',
        options: ['自动指标（准确率 / 命中率）', 'LLM-as-judge（强模型当评委打分）', '人工抽检（专家金标准）', '把模型参数量当作效果指标'],
        answer: 3,
        explanation: '三层评估 = 自动指标 + LLM-as-judge + 人工抽检。参数量只是模型规模属性，与"在你这个任务上效果好不好"没有必然关系——精心微调过的小模型完全可能胜过通用大模型。面试考点：评估三层框架是开放式问答的入门必背，答题时最好按"能自动就自动"的顺序讲。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'LLM-as-judge 完全客观公正，成熟后可以彻底替代人工评估。',
        answer: false,
        explanation: '评委模型自身带三个已证实的偏差：偏长回答（长度偏差）、偏特定摆放位置（位置偏差）、偏自己风格（自我偏好），而且评委自己也可能产生幻觉。正确用法是"规模化粗筛 + 缓解手段（换位重评、多评委、评分标准去长度化）+ 人工抽检校准"，而不是全盘替代。面试考点：能说出三个偏差的名字并给出对应缓解办法，是这题的满分形态。'
      },
      {
        type: 'single', difficulty: 2,
        question: '评测发现：换用"更啰嗦"的 Prompt 后 LLM-as-judge 打分上升，但线上用户点踩率也上升了。最可能的原因是？',
        options: ['评测集太大导致跑分太慢', '评委模型的长度偏差：更长不等于更好，线上用户反而嫌啰嗦', '用户暂时不习惯新风格，过几天就好了', 'judge 打分和用户满意度本来就应该一致'],
        answer: 1,
        explanation: '这是典型的"离线指标与线上体验背离"：评委偏爱长回答（长度偏差），把啰嗦误判为充分；真实用户要的是简洁准确，于是用点踩投票。正确动作是修尺子（评分标准里声明长度不加分、抽样人工校准）并尊重线上信号。误区：把背离归因于"用户需要适应期"——线上负反馈通常就是真信号。面试考点：离线涨、线上跌的归因思路是场景题高频。'
      },
      {
        type: 'fill', difficulty: 3,
        question: '团队还没建评测集，就反复改 Prompt 和参数，每次都凭个别案例说"感觉变好了"。这种没有统一标尺、不可度量的调整，业内称为____（两个字）。',
        accept: ['盲调'],
        explanation: '没有固定评测集与指标，就无法回答"变好了吗、好了多少"，调整全凭手感，业内戏称"盲调"。正确流程：先建覆盖主要场景的评测集并冻结版本，再迭代系统，每版全量跑分对比，必要时用隐藏题防应试。面试金句：没有评测集的优化都是盲调——这句话本身就是考点。'
      }
    ],
    relations: {
      prerequisites: ['m8-02'],
      successors: [],
      confusables: [
        { other: 'm2-06', tip: '传统 ML 的评估指标（准确率/精确率/召回/F1）假设"答案唯一"；LLM 生成任务常无唯一答案，所以要叠加 LLM-as-judge 与人工两层——其中自动指标那一层仍沿用 m2-06 的定义。' },
        { other: 'm6-05', tip: 'RLHF 里的人类偏好标注是在"造训练用的奖励信号"，评估里的人工抽检是在"做验收测试"；都用人工，但一个为了训练模型，一个为了度量系统。' }
      ]
    },
    memory: {
      mnemonic: '能自动就自动，不自动找评委，评委旁边留人工。',
      selfTest: [
        { q: 'LLM-as-judge 的三个偏差是什么？怎么缓解？', a: '长度偏差（偏爱长回答）、位置偏差（偏爱特定摆放位）、自我偏好（偏爱自己风格）。缓解：两个候选换位各评一次、评分标准声明长度不加分、用多个不同厂的模型当评委、抽样人工校准。' },
        { q: '为什么必须"先建评测集再优化"？', a: '评测集是固定的尺子：每次改动全量跑分，才能区分"真变好"与"这一条恰好变好"；没有尺子的迭代是盲调，还极容易对见过的少数案例过拟合。' },
        { q: '离线分数涨了、线上点踩变多，应该查什么？', a: '①评测集是否过时、泄漏或被应试；②离线场景与线上真实请求分布是否错位；③评委偏差是否在奖励"看起来好"（更长、辞藻华丽）。以线上真实反馈为准去修评测这把尺子。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：怎么证明一个 AI 应用变好了？',
      reference: '就像减肥要称体重：先固定一套考题（评测集），能自动打分的自动打分，没有标准答案的请一位 AI 评委打分（但要防它偏爱长回答），最后留一小部分人工终审把关——每改一版就上秤称一次。'
    }
  },
  {
    id: 'm8-05',
    title: '微调 vs RAG 选型',
    oneLiner: '修发动机还是装导航',
    estMinutes: 10,
    analogy: {
      title: '修发动机还是装导航',
      body: '你的车有两类毛病。一类是"跑起来没劲、换挡顿挫"——这是<b>发动机的问题</b>，得开进车间修发动机：周期长、花钱多，但修好了车本身变强。另一类是"不认识路、地图还是三年前的"——这是<b>知识的问题</b>，装一个实时更新的导航就行：即插即用，地图天天更新。对大模型同理：<b>微调（Fine-tuning）是修发动机</b>，改"行为与能力"（说话风格、输出格式、领域语感）；<b>RAG 是装导航</b>，补"知识与事实"（新知识、私有文档、可溯源）。选型的第一步永远是分辨：毛病出在"会不会"，还是"知不知道"——你不会为了"不知道新开的商场"去大修发动机。'
    },
    intuition: [
      { heading: '一张决策表定方向', body: '面试选型题按表走：知识常更新 → RAG；要给出处、可溯源 → RAG；私有文档没进过训练语料 → RAG；说话风格 / 输出格式不达标 → 微调；领域术语听不懂、任务模式特殊 → 微调；预算小、要快速上线 → 先 RAG。口诀：<b>补知识找 RAG，改行为用微调</b>。' },
      { heading: '成本与延迟对比', body: 'RAG 的成本在"链路"：要维护向量库、检索服务、嵌入模型，每次问答多一跳检索延迟；但<b>无需训练</b>，知识更新分钟级生效、可随时回滚。微调的成本在"训练与发版"：要造数据、训练（即使用 m6-04 的 LoRA 也要算力）、评估、发版，知识更新得重训；换来的是<b>线上无额外链路</b>、延迟低、不依赖外部存储。' },
      { heading: '不是二选一：组合拳才是常态', body: '成熟方案常常两个都用：先微调把<b>风格、格式、领域语感</b>焊进模型（比如让它稳定输出法务 JSON、说话像资深法务），再挂 RAG 供给<b>时时更新的知识</b>（比如最新法规原文）。一句话分工：微调教它"怎么说话"，RAG 喂它"说什么依据"。答题时主动提出组合方案，并说清每一步用什么评测集验收（见 m8-04），是明确的加分项。' }
    ],
    principle: [
      {
        heading: '微调擅长什么（边界要说清）',
        body: '微调改变模型参数，适合稳定的"行为模式"：固定口吻的品牌客服、严格的输出格式、特定领域的表达习惯与术语理解（手段见 m6-03 SFT 与 m6-04 LoRA）。它<b>不适合灌知识</b>：靠训练记住的事实既难更新（改知识要重训）、又容易和后来注入的新知识打架，还会"记串"产生幻觉。要给模型补事实，外挂（RAG）永远比"背书"（训练）可靠。'
      },
      {
        heading: 'RAG 擅长什么（同样有边界）',
        body: 'RAG 把知识放在外部、随取随用：文档更新即刻生效、可回滚、答案可溯源到具体段落、天然减少幻觉。但 RAG <b>改不了模型"怎么说话"</b>：语气散漫、格式不稳、不会用领域行话，检索来再好的资料也组织不好；此外多一跳检索就多一分延迟与故障点，效果上限由检索质量决定（工程细节见 m8-02）。'
      },
      {
        heading: '面试选型题的标准答法（四步）',
        body: '①<b>先问需求</b>：知识来源与更新频率、要不要溯源、风格格式要求、预算与延迟约束——先分清问题是"知不知道"还是"会不会"；②<b>给判断</b>：按决策表定性——知识问题走 RAG，行为问题走微调；③<b>给方案</b>：落到组件（嵌入模型、向量库、K 值；训练数据、LoRA 配置）；④<b>给验证</b>：说清用什么评测集与指标验收（接 m8-04）。四步答完，就是面试官想听的完整闭环。'
      }
    ],
    animation: {
      title: '选型决策台：点一个场景，看推荐方案',
      html: '<div class="anim-m8-05"><div class="anim-m8-05-tip">选型第一问：毛病出在"知不知道"（知识 → RAG）还是"会不会"（行为 → 微调）？点一个场景试试：</div><div class="anim-m8-05-list"><button type="button" class="anim-m8-05-case">口吻散漫、格式乱</button><button type="button" class="anim-m8-05-case">法规每周更新、要引出处</button><button type="button" class="anim-m8-05-case">3 万份私有文档问答</button><button type="button" class="anim-m8-05-case">听不懂医疗行话</button><button type="button" class="anim-m8-05-case">品牌语气 + 实时价格</button></div><div class="anim-m8-05-panel">等待选择一个场景……</div></div>',
      css: '.anim-m8-05 { font-size: 13px; }\n.anim-m8-05-tip { margin-bottom: 8px; line-height: 1.6; color: #334155; }\n.anim-m8-05-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }\n.anim-m8-05-case { cursor: pointer; padding: 5px 10px; border-radius: 999px; border: 1px solid #93c5fd; background: #dbeafe; font-size: 12px; }\n.anim-m8-05-panel { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; line-height: 1.7; min-height: 90px; color: #475569; }\n.anim-m8-05-show { animation: anim-m8-05-in .4s ease; }\n@keyframes anim-m8-05-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n.anim-m8-05-scene { font-weight: 600; color: #1e3a8a; margin-bottom: 4px; }\n.anim-m8-05-verdict { color: #15803d; margin-bottom: 4px; }',
      js: function (root) {
        var CASES = [
          { c: '客服机器人口吻散漫、回复格式千奇百怪（知识本身没问题）', v: '微调（SFT / LoRA）', why: '这是"行为问题"：说话风格与格式要写进参数才稳定，RAG 只喂知识、改不了语气。做法：备一批符合品牌语气的问答对做微调，并用评测集验收格式合规率。' },
          { c: '法规库每周更新，回答必须引用最新条文并注明出处', v: 'RAG', why: '这是"知识问题"，且高频更新 + 要溯源：把法规文档切片入向量库，更新即生效、可引到具体条文；微调根本追不上每周变化，还容易把旧法条记死。' },
          { c: '公司内部 3 万份技术文档要做成问答，这些内容训练语料里从来没有', v: 'RAG', why: '私有知识走外挂最划算：无需训练、文档可随时增删、答案可溯源到具体文档。为私有文档做全量微调成本高、更新难、还容易过拟合到少量语料。' },
          { c: '医疗问答模型听不懂"窦性心律""室早"这类行话，总用大白话', v: '微调（可再组合 RAG）', why: '领域语感与术语理解是"能力问题"，要用领域语料做 SFT 让参数内化；如果还要求引用最新诊疗指南，再挂 RAG 供给指南原文——组合拳各管一半。' },
          { c: '既要品牌专属语气，又要每天更新的商品价格与库存', v: '组合：先微调定语气，再挂 RAG 供实时数据', why: '两种需求各归各位：语气、格式交给微调（稳定不变），价格、库存交给 RAG（实时可更新）。面试时主动给出"组合方案 + 各自验收指标"是满分结构。' }
        ];
        var panel = root.querySelector('.anim-m8-05-panel');
        var btns = root.querySelectorAll('.anim-m8-05-case');
        btns.forEach(function (b, k) {
          b.addEventListener('click', function () {
            var d = CASES[k];
            panel.innerHTML = '<div class="anim-m8-05-scene">场景：' + d.c + '</div><div class="anim-m8-05-verdict">判定 → 推荐：<b>' + d.v + '</b></div><div>' + d.why + '</div>';
            panel.classList.remove('anim-m8-05-show');
            void panel.offsetWidth;
            panel.classList.add('anim-m8-05-show');
          });
        });
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '模型说话风格总不达标（太口语、格式乱），但知识本身没问题。最合适的改进是？',
        options: ['给知识库加更多文档（RAG）', '用领域数据做微调（SFT / LoRA）', '换一个更大的向量库', '把 temperature 调高一点'],
        answer: 1,
        explanation: '风格与格式是"行为"问题，靠微调把行为写进参数最有效；RAG 补的是知识，喂再多文档也改不了语气；调高 temperature 只会更发散。面试考点：先分清"行为问题"与"知识问题"再开药方，是所有选型题的第一步。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '要让大模型掌握"每天都在变化的商品价格"，微调是比 RAG 更合适的方案。',
        answer: false,
        explanation: '时效性知识是典型的"知识问题"：微调需要反复重训，还会把旧价格"记死"、与新价格冲突；RAG 只需更新向量库里的文档，分钟级生效，还能溯源到价格表。微调适合稳定不变的行为模式，不适合追新知识。面试考点：知识更新频率是选型时要问的第一个问题。'
      },
      {
        type: 'single', difficulty: 3,
        question: '面试场景题：公司要做一个法务助手——回答必须使用严谨的法言法语、输出固定 JSON 结构，且引用内部最新法规条文。最优方案是？',
        options: ['只用 RAG：挂上法规库即可，风格模型自己会学好', '只用微调：把法规全部训练进模型', '微调定风格与 JSON 格式 + RAG 供给最新法规原文', '直接换最大的模型，什么都不用做'],
        answer: 2,
        explanation: '题面埋了双重需求："严谨法言法语 + 固定 JSON"是行为问题，交给微调（SFT/LoRA）；"引用最新法规"是知识问题，交给 RAG——组合拳各管一半：微调教"怎么说话"，RAG 喂"说什么依据"。单用 RAG 管不住风格，单用微调追不上法规更新且易记串条文；换大模型解决不了私有知识与时效。面试考点：高质量选型题通常埋双重需求，能主动拆解并提出组合方案与验收指标，才是满分答法。'
      }
    ],
    relations: {
      prerequisites: ['m6-04', 'm8-02'],
      successors: [],
      confusables: [
        { other: 'm6-04', tip: 'LoRA 让微调变便宜，但没有改变边界：它改的仍然是"行为与能力"；再低成本的微调也不适合拿来追"天天变的知识"。' },
        { other: 'm6-03', tip: 'SFT 指令微调是"教会固定行为"的训练手段；在选型题里它对应"风格 / 格式"这一侧，而知识那一侧永远优先考虑 RAG。' },
        { other: 'm8-02', tip: '本课是"何时用 RAG"的决策课；m8-02 讲的是"怎么用好 RAG"（切片、检索、排查），两者是选型与实施的关系。' }
      ]
    },
    memory: {
      mnemonic: '补知识挂 RAG，改行为上微调，都要就组合。',
      selfTest: [
        { q: '面试被问"微调还是 RAG"，第一句应该说什么？', a: '先澄清需求：知识是否常更新、要不要溯源、是否私有文档、风格与格式要求、预算与延迟约束——先分清问题是"知不知道"（知识→RAG）还是"会不会"（行为→微调），再给判断和方案。' },
        { q: '为什么说"微调不适合灌知识"？', a: '训练注入的事实难更新（改知识要重训发版）、易与外部新知识冲突、还会产生记忆干扰与幻觉；知识放外部库（RAG）可增删、可溯源、分钟级生效，职责清晰。' },
        { q: '组合方案的上线顺序通常是怎样的？', a: '先微调（SFT/LoRA）把风格、格式、领域语感定下来并用评测集验收，再接入 RAG 供给动态知识；两个变量分开改、分开验收（m8-04），否则出了问题无法归因。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：什么时候该微调，什么时候该用 RAG？',
      reference: '车没劲是发动机问题，开去修（微调，改它本身的能力和习惯）；不认路是地图问题，装个实时导航（RAG，外挂随时更新的知识）——先搞清楚毛病在哪，别为了不认路去大修发动机。'
    }
  }
  ]
});
