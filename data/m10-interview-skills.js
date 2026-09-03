// knowledge_source: "internal"
/* M10 面试软技能 —— 4 个知识点内容数据（契约见 docs/SCHEMA.md v1） */
window.SITE_DATA.registerModule({
  module: 'M10',
  title: '面试软技能',
  icon: '🎯',
  color: '#f97316',
  lessons: [
  {
    id: 'm10-01',
    title: '项目深挖与 STAR 法则',
    oneLiner: '把经历装进面试官爱听的故事骨架',
    estMinutes: 12,
    analogy: {
      title: '装修完工汇报',
      body: '你替家里操办了一次旧房翻新，完工后要向全家人汇报。若只说一句"我装修得挺好的"，爸妈只会将信将疑。会讲话的人这么汇报：先交代背景——"房子是 2005 年的老房，水电老化，冬天跳闸"（情境）；再给任务——"预算 8 万、三个月内必须住人"（任务）；然后讲行动——"我跑了三家建材市场比价，水电全改还加了独立回路"（行动）；最后给结果——"最终花了 7.6 万、提前两周完工，电工师傅把我的方案要走了"（结果）。全家瞬间信服。<b>STAR 法则（STAR Method）</b>就是把任何一段经历装进这个"全家爱听的汇报结构"里。'
    },
    intuition: [
      { heading: '面试官不是在听故事，是在找证据', body: '面试官一天听几十个项目介绍，早就不在意情节多精彩，而在找三个问题的证据：你<b>真的做过</b>吗？你<b>理解为什么这么做</b>吗？事情是<b>你推动的</b>还是别人推动的？STAR 之所以成为行为面试（Behavioral Interview）的标准框架，就是因为它恰好把这三种证据按顺序摆出来：情境与任务证明事情真实发生，行动证明是你的手笔，结果证明它有效。' },
      { heading: '为什么"结果必须量化"', body: '装修完跟家人说"装得挺好的"，没人知道好不好；说"花了 7.6 万、预算内、提前两周完工"，所有人立刻信服。面试同理："效果不错"无法验证也无法比较，而"badcase 率 18% 降到 6%"能让面试官瞬间建立信任。更重要的是，数字会自然引出他最想问的问题：基线怎么定的？评测集怎么来的？——正好把你准备过的评估细节引出来，把追问变成你的主场。' },
      { heading: 'STAR 讲的不是经历，是取舍', body: '一个项目能讲的东西很多，STAR 逼你做减法：与主线无关的技术细节砍掉，S 和 T 各压到一两句，把时间留给 A（行动）和 R（结果）。判断标准很简单——每句话要么为"这事难"做铺垫，要么为"你能干"做证据，否则就删。能把十分钟的经历裁成九十秒的高密度版本，本身就是工程师素养的体现。' }
    ],
    principle: [
      {
        heading: 'STAR 四步：故事的标准骨架',
        body: '四个字母各司其职，时间分配参考 S : T : A : R ≈ 1 : 1 : 4 : 2：<br><b>S（Situation 情境）</b>：一两句交代业务背景与痛点，让面试官理解"这事为什么难"。<br><b>T（Task 任务）</b>：一句给出你的目标与约束——时间、指标、资源。<br><b>A（Action 行动）</b>：主角，占一半篇幅——你做了什么、怎么选的、为什么这么选。<br><b>R（Result 结果）</b>：量化收尾，必须带对比基线（从 X 到 Y），最好再加一个"影响外溢"（方案被复用/成为模板）。'
      },
      {
        heading: '一段可直接背诵的示范回答',
        body: '面试官问"介绍一个你最有挑战的项目"，示范（智能客服项目，90 秒版）：<br><b>「</b><i>（S）当时客服团队日均 3000 条咨询全靠人工，高峰期用户要等半小时。 （T）领导要求我两个月内上线智能客服，自动解决率做到 60%。 （A）我先搭基线：关键词规则只能解决 25%；再对比两条路线——知识库每周更新，微调要重训和评审，所以我选 RAG：文档切分入库、混合检索加重排、prompt 模板迭代三轮，并自建 500 条评测集做验收。 （R）上线三个月，自动解决率 62%，平均响应从 30 分钟降到 8 秒，这套方案被两条业务线复用。</i><b>」</b><br>注意三处细节：有基线对比（25%）、有选型理由（更新频率 vs 重训成本）、有量化结果（62%、8 秒）。换成你自己的项目，骨架不变，替换事实即可。'
      },
      {
        heading: '深挖追问树：提前备好四张追问卡',
        body: '讲完 STAR 不是结束，而是把面试官引到你的主场。每个项目提前准备四张卡的答案：<ul><li><b>为什么这么选？</b>——给出约束条件与对比维度（成本 / 时延 / 效果 / 维护）。</li><li><b>对比过哪些方案？</b>——至少说两条备选路线与放弃原因。</li><li><b>最大的坑是什么？</b>——准备一个真实踩坑细节与解决过程，这是"亲历者"的最强证据。</li><li><b>重做会改什么？</b>——体现反思能力："现在我会一开始就建评测集，而不是上线后补。"</li></ul>这四问答不上，STAR 就成了背诵表演；答得好，一个项目能讲十分钟且全程你占主动。'
      }
    ],
    animation: {
      title: 'STAR 四格归类小游戏：这段话属于哪一格',
      html: '<div class="anim-m10-01"><div class="anim-m10-01-head">把下面 4 句项目描述归入 STAR 的正确格子，点选即判分</div><div class="anim-m10-01-score">进度 0/4 · 答对 0</div><div class="anim-m10-01-item"><p class="anim-m10-01-sent">当时客服团队日均 3000 条咨询全靠人工，高峰期用户要等半小时</p><div class="anim-m10-01-btns"><button type="button" data-k="S">S 情境</button><button type="button" data-k="T">T 任务</button><button type="button" data-k="A">A 行动</button><button type="button" data-k="R">R 结果</button></div><div class="anim-m10-01-fb"></div></div><div class="anim-m10-01-item"><p class="anim-m10-01-sent">领导要求我两个月内上线，自动解决率不低于 60%</p><div class="anim-m10-01-btns"><button type="button" data-k="S">S 情境</button><button type="button" data-k="T">T 任务</button><button type="button" data-k="A">A 行动</button><button type="button" data-k="R">R 结果</button></div><div class="anim-m10-01-fb"></div></div><div class="anim-m10-01-item"><p class="anim-m10-01-sent">我对比了微调与 RAG 两条路线，知识每周更新所以选 RAG，并自建 500 条评测集验收</p><div class="anim-m10-01-btns"><button type="button" data-k="S">S 情境</button><button type="button" data-k="T">T 任务</button><button type="button" data-k="A">A 行动</button><button type="button" data-k="R">R 结果</button></div><div class="anim-m10-01-fb"></div></div><div class="anim-m10-01-item"><p class="anim-m10-01-sent">上线三个月，自动解决率 62%，响应时长从 30 分钟降到 8 秒</p><div class="anim-m10-01-btns"><button type="button" data-k="S">S 情境</button><button type="button" data-k="T">T 任务</button><button type="button" data-k="A">A 行动</button><button type="button" data-k="R">R 结果</button></div><div class="anim-m10-01-fb"></div></div><div class="anim-m10-01-final"></div><button type="button" class="anim-m10-01-reset">重新开始</button></div>',
      css: '.anim-m10-01 { font-size: 13px; }\n.anim-m10-01-head { font-weight: 600; color: #c2410c; margin-bottom: 6px; }\n.anim-m10-01-score { display: inline-block; background: #ffedd5; color: #9a3412; border-radius: 10px; padding: 2px 10px; margin-bottom: 8px; }\n.anim-m10-01-item { border: 1px solid #fed7aa; border-radius: 8px; padding: 8px 10px; margin-bottom: 8px; transition: border-color .3s, background .3s; }\n.anim-m10-01-item.anim-m10-01-ok { border-color: #22c55e; background: #f0fdf4; }\n.anim-m10-01-item.anim-m10-01-bad { border-color: #ef4444; background: #fef2f2; }\n.anim-m10-01-sent { margin: 0 0 6px; color: #1e293b; }\n.anim-m10-01-btns { display: flex; flex-wrap: wrap; gap: 6px; }\n.anim-m10-01-btns button { border: 1px solid #fdba74; background: #fff; color: #9a3412; border-radius: 6px; padding: 3px 10px; cursor: pointer; }\n.anim-m10-01-btns button:hover { background: #ffedd5; }\n.anim-m10-01-fb { margin-top: 6px; color: #475569; min-height: 1em; }\n.anim-m10-01-final { font-weight: 600; color: #c2410c; margin: 6px 0; }\n.anim-m10-01-reset { border: 1px solid #fdba74; background: #fff7ed; color: #9a3412; border-radius: 6px; padding: 4px 12px; cursor: pointer; }',
      js: function (root) {
        var DATA = [
          { k: 'S', why: '背景与痛点，还没轮到"你"出场。' },
          { k: 'T', why: '目标数字加时间约束，为行动定靶。' },
          { k: 'A', why: '有对比、有理由、有动作，这才是属于"你"的证据。' },
          { k: 'R', why: '两个可核对的数字，故事在这里收口。' }
        ];
        var items = root.querySelectorAll('.anim-m10-01-item');
        var scoreEl = root.querySelector('.anim-m10-01-score');
        var finalEl = root.querySelector('.anim-m10-01-final');
        var done = 0, right = 0;
        function refresh() {
          scoreEl.textContent = '进度 ' + done + '/4 · 答对 ' + right;
          if (done === 4) {
            finalEl.textContent = right === 4
              ? '满分！你的 STAR 结构感已经在线。'
              : '再看一遍解析：S 给背景，T 给目标，A 讲你怎么做，R 用数字收尾。';
          }
        }
        Array.prototype.forEach.call(items, function (item, i) {
          var btns = item.querySelectorAll('button');
          Array.prototype.forEach.call(btns, function (btn) {
            btn.addEventListener('click', function () {
              if (item.getAttribute('data-done')) return;
              item.setAttribute('data-done', '1');
              var ok = btn.getAttribute('data-k') === DATA[i].k;
              if (ok) right++;
              item.className = 'anim-m10-01-item ' + (ok ? 'anim-m10-01-ok' : 'anim-m10-01-bad');
              item.querySelector('.anim-m10-01-fb').textContent =
                (ok ? '正确：' : '不对，这句属于 ' + DATA[i].k + '：') + DATA[i].why;
              done++;
              refresh();
            });
          });
        });
        root.querySelector('.anim-m10-01-reset').addEventListener('click', function () {
          done = 0; right = 0;
          Array.prototype.forEach.call(items, function (item) {
            item.removeAttribute('data-done');
            item.className = 'anim-m10-01-item';
            item.querySelector('.anim-m10-01-fb').textContent = '';
          });
          finalEl.textContent = '';
          refresh();
        });
        refresh();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'STAR 法则中，最应占篇幅、也是面试官判断"是不是你亲手做的"这一核心依据的部分是？',
        options: ['A：你采取的具体行动与选择理由', 'S：项目的业务背景', 'T：任务的截止时间', 'R：团队获得的荣誉'],
        answer: 0,
        explanation: 'STAR 里 S 和 T 各一两句即可，A（Action）是主角：面试官靠"你具体做了什么、为什么这么做"来判断真实参与度与技术深度。常见误区：把大段篇幅花在介绍公司业务与团队分工上，听着热闹却没有任何属于"你"的证据。面试官在筛的信号：你是亲历者还是旁观者。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '描述项目成果时，"项目取得了不错的成绩，大家都非常认可"比"badcase 率从 18% 降到 6%，人工审核工时省了一半"更值得写进简历和口头表达。',
        answer: false,
        explanation: '结果必须量化。形容词无法验证、无法比较，数字才能让面试官立刻建立信任，而且量化结果会自然引出他最关心的追问（怎么测的、基线怎么定的），正好把你准备过的评估细节亮出来。常见误区：怕数字被挑战就不敢给——不给数字才会被判定为"没做过或没做好"。面试官在筛的信号：你有没有结果意识和评估习惯。'
      },
      {
        type: 'order', difficulty: 3,
        question: '面试官问"介绍一个你最有挑战的项目"，下面四句话被打乱了，请按 STAR 的正确讲述顺序排列：',
        items: [
          'R：上线三个月，自动解决率 62%，响应时长从 30 分钟压到 8 秒，这套做法被两条业务线复用',
          'S：当时客服团队日均 3000 条咨询全靠人工，高峰期用户要等半小时，投诉率持续走高',
          'A：我对比了微调与 RAG 两条路线，因为知识库每周更新选了 RAG，并自建 500 条评测集做验收',
          'T：领导要求两个月内上线，自动解决率不低于 60%'
        ],
        answer: [1, 3, 2, 0],
        explanation: '正确顺序是 S→T→A→R：先用背景建立问题的严重性，再用目标给出约束，行动才有依据，最后用数字收束。乱序的最大问题是"行动失去依据、结果失去参照"，面试官要自己在脑中拼时间线，体验极差。面试官在筛的信号：表达是否有结构——它间接反映你做事是否有章法。'
      },
      {
        type: 'single', difficulty: 3,
        question: '（场景模拟）你讲完 RAG 项目后，面试官追问："为什么选 RAG 而不是微调？"下列哪种回答最好？',
        options: [
          '知识库每周更新一次，微调要走重训和评审流程，RAG 只需替换文档索引即可生效，且答案可溯源到原始文档',
          '因为 RAG 是目前最火的技术，大家都在用',
          '我们没有算力做微调，所以只能选 RAG',
          '微调效果差，RAG 效果好，没什么可比的'
        ],
        answer: 0,
        explanation: '好答案 = 事实约束 + 对比维度 + 可验证理由。选项 1 给出"更新频率"这一关键约束，并从生效成本、可溯源性两个维度对比，还暗示你理解两者的适用边界。选项 2 是从众、选项 3 是被动妥协、选项 4 是无论证的绝对化结论。面试官在筛的信号：技术选型是权衡出来的，还是跟风抄来的。'
      }
    ],
    relations: {
      prerequisites: [],
      successors: ['m10-03', 'm10-04'],
      confusables: [
        { other: 'm8-04', tip: '项目结果的量化与 LLM 效果评估同源：面试里说"准确率提升 X%"时，要能立刻说清指标怎么定义、评测集怎么来的（m8-04 的内容），否则追问一句就被问穿。' },
        { other: 'm8-05', tip: '示范话术里"RAG 还是微调"的选型理由，就是微调 vs RAG 选型的实战应用：背结论没用，要能按业务约束（更新频率、数据量、成本）推理出来。' }
      ]
    },
    memory: {
      mnemonic: '背景一句、目标一句、行动是主角、数字来收尾。',
      selfTest: [
        { q: 'STAR 四步分别对应什么？时间上怎么分配？', a: 'S 情境（业务背景与痛点）、T 任务（目标与约束）、A 行动（你做了什么、为什么）、R 结果（量化 + 对比基线）；参考比例 1:1:4:2，A 占一半篇幅。' },
        { q: '面试官深挖项目时最常问的四个问题是什么？', a: '为什么这么选？对比过哪些方案？最大的坑是什么？重做会改什么？每个项目都要提前备好这四张追问卡。' },
        { q: '结果量化要注意什么？', a: '给数字必须带对比基线（从 X 到 Y），并想清楚指标定义与评测来源——数字一定会被追问，答得出处是加分，答不出反而露怯。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：STAR 法则是什么？',
      reference: '把一件事按"当时什么情况、我的任务是什么、我具体做了什么、最后数字上带来了什么变化"四步讲清楚，让不懂技术的人也能判断这件事是不是你干成的。'
    }
  },
  {
    id: 'm10-02',
    title: '场景设计题',
    oneLiner: '用四步拆解法稳接住"让你做个 XX"这类题',
    estMinutes: 14,
    analogy: {
      title: '在小区开一家餐馆',
      body: '朋友问你："我想在咱们小区开个餐馆，你觉得怎么搞？"你不能张口就是"买最贵的食材、请米其林大厨"，那是堆砌。会做生意的回答是：先问清——小区多少住户、上班族多还是家庭多、预算多少、对面已有几家店（<b>澄清目标与约束</b>）；再给整体方案——主打快手简餐、堂食加外卖双渠道（<b>整体架构</b>）；然后讲权衡——为什么不做日料：本地客群与供应链都不匹配（<b>关键权衡</b>）；最后说怎么验证——试营业两周看复购率再调整（<b>评估与迭代</b>）。场景设计题考的就是这套"先问病情、再开药方"的生意头脑。'
    },
    intuition: [
      { heading: '面试官在考工程判断力，不是名词量', body: '场景设计题看似开放，其实评分点非常明确：你是否先澄清约束？方案是否完整（含兜底）？每个选择能否说出理由？有没有验证手段？四个点全中是 Pass；反过来，堆一堆听来的名词——"上大模型、加 Agent、搞多模态"——却说不出为什么，是典型 Fail 信号，面试官会判断你只在教程里见过世界。' },
      { heading: '约束不同，方案天差地别', body: '同样是"给客服上 LLM"：日均 5000 条、延迟宽松、预算紧张，一个开源小模型加 RAG 可能就够；日均 50 万条、要求 1 秒响应、涉及金融合规，就要考虑私有化部署、专用检索与严格兜底。所以第一步永远是把量级（QPS）、延迟、预算、合规问清楚，或者自己给假设并说出口——这不是怯场，这是工程师的职业习惯。' },
      { heading: '没有完美方案，只有讲得清的方案', body: '小白误区是追求"最优解"，而面试官更看重"你知不知道自己方案的代价"。说"我选 RAG，代价是检索质量决定上限，所以我会重点做评测与重排"，比"我选 RAG 因为它很强大"高一个段位。永远主动补一句"如果不 work 怎么办"——兜底思维是老手的标志。' }
    ],
    principle: [
      {
        heading: '四步拆解法',
        body: '<b>① 澄清目标与约束：</b>量级（日请求量 / QPS）、延迟要求、预算与人力、合规红线；面试官没给条件就自己给假设并说出口。<br><b>② 给整体方案架构：</b>模型选型（开源 / 闭源、尺寸）+ 知识接入（RAG）+ 交互编排（Agent / 工具调用）+ 兜底路径，一张嘴画出一张架构图。<br><b>③ 讲清关键权衡：</b>每个关键选择给"为什么选 A 不选 B"，至少一组像样的对比。<br><b>④ 定评估与迭代：</b>离线评测集 + 灰度上线 + 核心指标，说明怎么判断成功、不达标怎么回滚。'
      },
      {
        heading: '完整示范：客服场景',
        body: '面试官："我们客服每天 5 万条咨询，想上一个 LLM，你怎么设计？"示范：<br><b>「</b><i>我先对齐几个约束：5 万条按 12 小时摊开、峰值按 5 倍估，延迟希望 3 秒内，客户数据不能出内网（①）。方案上我做意图识别分流：知识咨询走 RAG——文档入库、混合检索加重排、答案带引用；订单物流类不走生成，直接调内部 API 返回结构化结果；涉敏感或低置信度的问题兜底转人工（②）。两个关键权衡：选 RAG 不选微调，因为客服知识每周更新，RAG 换文档即生效；选小模型加检索不选超大模型直答，因为成本差一个量级且直答会编造（③）。评估上先建 300 条真实咨询评测集，离线看解决率与幻觉率，再灰度 5% 流量对比人工组，两周达标后放量，全程留回滚开关（④）。</i><b>」</b><br>这段话约 90 秒，四个评分点全中。'
      },
      {
        heading: '高频失分点',
        body: '<ul><li><b>不澄清直接堆名词：</b>"上大模型、加 Agent、做多模态"——没有约束的方案等于没有方案。</li><li><b>只讲 happy path：</b>不说检索不到、模型胡说、用户愤怒时怎么办；兜底（转人工 / 降级规则）必须主动讲。</li><li><b>没有评估就上线：</b>说不出怎么验证有效，面试官会判定你没上线过任何东西。</li><li><b>忽视成本：</b>大模型 API 按量计费，"5 万条 / 天"的账单量级要能口算。</li></ul>'
      }
    ],
    animation: {
      title: '四步拆解法步进演示：客服场景方案逐步展开',
      html: '<div class="anim-m10-02"><div class="anim-m10-02-q">面试官："我们客服每天 5 万条咨询，想上一个 LLM，你怎么设计？"——点「下一步」看四步拆解法怎么落地。</div><div class="anim-m10-02-steps"></div><div class="anim-m10-02-ctrl"><button type="button" class="anim-m10-02-next">下一步 ①</button><button type="button" class="anim-m10-02-reset">重来</button></div></div>',
      css: '.anim-m10-02-q { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 8px 10px; color: #9a3412; margin-bottom: 8px; font-size: 13px; }\n.anim-m10-02-steps { min-height: 40px; }\n.anim-m10-02-step { border-left: 3px solid #f97316; background: #fffbeb; border-radius: 0 8px 8px 0; padding: 8px 10px; margin-bottom: 8px; animation: anim-m10-02-in .45s ease both; }\n.anim-m10-02-step b { color: #c2410c; display: block; margin-bottom: 4px; }\n.anim-m10-02-step p { margin: 0; color: #334155; font-size: 13px; }\n.anim-m10-02-ctrl { display: flex; gap: 8px; }\n.anim-m10-02-ctrl button { border: 1px solid #fdba74; background: #fff; color: #9a3412; border-radius: 6px; padding: 4px 14px; cursor: pointer; }\n.anim-m10-02-ctrl button:disabled { opacity: .5; cursor: default; }\n@keyframes anim-m10-02-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }',
      js: function (root) {
        var STEPS = [
          { k: '① 澄清目标与约束', b: '先把条件钉死：日均 5 万条按 12 小时摊开，峰值按 5 倍估；延迟目标 3 秒内；客户数据不出内网；预算限定为开源模型自部署。——面试官没给的条件，就自己给假设并说出口。' },
          { k: '② 给整体方案架构', b: '意图识别分流：知识咨询走 RAG（文档入库、混合检索加重排、答案带引用）；订单物流类直接调内部 API 工具返回结构化结果；敏感或低置信的问题兜底转人工。' },
          { k: '③ 讲清关键权衡', b: '为什么 RAG 不选微调：客服知识每周更新，RAG 换文档即生效，微调要重训评审；为什么不上超大模型直答：成本差一个量级，且直答会编造、无法溯源。' },
          { k: '④ 定评估与迭代', b: '先建 300 条真实咨询评测集，离线测解决率与幻觉率；灰度 5% 流量对比人工组，两周达标再放量；全程留回滚开关。' }
        ];
        var idx = 0;
        var box = root.querySelector('.anim-m10-02-steps');
        var next = root.querySelector('.anim-m10-02-next');
        var labels = ['下一步 ①', '下一步 ②', '下一步 ③', '下一步 ④'];
        function onNext() {
          if (idx >= STEPS.length) return;
          var d = document.createElement('div');
          d.className = 'anim-m10-02-step';
          d.innerHTML = '<b>' + STEPS[idx].k + '</b><p>' + STEPS[idx].b + '</p>';
          box.appendChild(d);
          idx++;
          if (idx >= STEPS.length) {
            next.disabled = true;
            next.textContent = '方案讲完了：约 90 秒，四个评分点全中';
          } else {
            next.textContent = labels[idx];
          }
        }
        function onReset() {
          idx = 0;
          box.innerHTML = '';
          next.disabled = false;
          next.textContent = labels[0];
        }
        next.addEventListener('click', onNext);
        root.querySelector('.anim-m10-02-reset').addEventListener('click', onReset);
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '拿到一道场景设计题"如果让你给公司知识库做一个问答助手，你怎么设计？"，第一步应该做什么？',
        options: ['澄清使用量级、延迟、预算与数据合规等约束', '直接说用最强的闭源大模型', '把 Agent、多模态等听过的技术都列上', '先谈前端界面怎么做'],
        answer: 0,
        explanation: '第一步永远是澄清目标与约束：量级决定成本与架构、延迟决定模型尺寸与推理优化、合规决定能否用外部 API。约束不明就给方案，等于不做诊断就开药。常见误区：把"听过多少技术"当能力展示，而面试官在筛的信号恰恰相反——是"知不知道先问清问题"。'
      },
      {
        type: 'order', difficulty: 2,
        question: '四步拆解法的四个环节被打乱了，请排出正确顺序：',
        items: [
          '搭 300 条离线评测集，灰度 5% 流量上线，达标后逐步放量',
          '问清日请求量、延迟要求、预算与合规红线',
          '解释为什么选 RAG 而不是微调、为什么选小模型而不是超大模型',
          '给出架构：意图分流 + RAG 知识库 + 工具调用 + 兜底转人工'
        ],
        answer: [1, 3, 2, 0],
        explanation: '顺序是澄清→架构→权衡→评估。澄清放最前，因为所有后续选择都依赖约束；权衡紧跟架构，因为架构图里每个组件都该能回答"为什么是它"；评估收尾，证明方案可验证、可迭代。面试官在筛的信号：你是否具备"先定义问题再解决问题"的工程素养。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '面试官说"这些条件你不用问我，你自己定就行"，正确的做法是：自己给出合理假设并明确说出口（如"我假设日均 5 万条、峰值 5 倍"），然后基于假设继续设计。',
        answer: true,
        explanation: '自给假设并说出口完全正确：它既推进了对话，又把"主动澄清"的职业习惯展示了出来；面试官还能顺着你的假设继续深挖，形成良性互动。常见误区：以为"面试官让我自己定"就可以不交代假设、闷头设计——评估基准缺失，方案优劣将无从判断。'
      },
      {
        type: 'single', difficulty: 3,
        question: '（场景模拟）电商客服场景：用户问题一半是查订单物流，一半是退换货政策咨询。下列方案设计最稳妥的是？',
        options: [
          '意图分流：订单类走 API 工具直接返回结构化结果，政策类走 RAG 带引用作答，低置信兜底转人工',
          '所有问题统一交给大模型自由发挥，架构最简单',
          '把全部历史客服对话微调进模型，用户问什么都能答',
          '纯关键词规则匹配，零成本零风险'
        ],
        answer: 0,
        explanation: '选项 1 做对了三件事：能确定性解决的问题用确定性手段（API 查询比生成可靠且零幻觉）、需要知识的问题用 RAG 且带引用可追溯、为失败路径留了兜底。选项 2 会编造订单状态这类事实性灾难；选项 3 混淆了"记知识"与"调知识"，时效性一塌糊涂；选项 4 覆盖不了自然语言变体。面试官在筛的信号：你是否理解"确定性任务优先用确定性方案"这条工程铁律。'
      }
    ],
    relations: {
      prerequisites: ['m8-02', 'm8-03'],
      successors: [],
      confusables: [
        { other: 'm8-05', tip: '第③步"关键权衡"的高频考点就是微调 vs RAG 选型：知识更新频繁走 RAG，风格固定且数据充足才考虑微调——设计题要按业务约束推理，不能只报结论。' },
        { other: 'm8-04', tip: '第④步"评估与迭代"就是 LLM 效果评估的现场应用：没有评测集与指标的方案，在面试官眼里等于"没打算验证"。' }
      ]
    },
    memory: {
      mnemonic: '先问清、再画图、讲权衡、留评估。',
      selfTest: [
        { q: '场景设计四步法每一步的产出是什么？', a: '①澄清→一组明确约束或假设（量级 / 延迟 / 预算 / 合规）；②架构→模型 + RAG + 工具 + 兜底的完整图；③权衡→每个关键选择的"为什么不是它"；④评估→离线评测集 + 灰度 + 核心指标。' },
        { q: '客服场景示范方案里有哪四个组件？', a: '意图识别分流、RAG 知识库（答案带引用）、订单类走 API 工具调用、敏感 / 低置信兜底转人工；配套 300 条评测集与 5% 灰度上线。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给外行听：拿到"设计一个智能客服"这类题该怎么答？',
      reference: '像开餐馆一样回答：先问清客人是谁、预算多少，再说主打什么菜、为什么不做别的菜，最后说怎么知道生意好不好、不好怎么调。'
    }
  },
  {
    id: 'm10-03',
    title: '开放题与追问应对',
    oneLiner: '三板斧 + 追问应对：不会也不慌',
    estMinutes: 12,
    analogy: {
      title: '亲戚追问"网游毁不毁孩子"',
      body: '过年饭桌，长辈问你："网游会不会毁掉孩子？"直接答"会"或"不会"都显得武断。聪明的回答是三步：先定义——"毁掉"指的是成绩下滑、视力受损还是社交缺失？再拆分——适度游戏能锻炼协作与反应，无节制的沉迷才伤学业；最后给有条件的结论——"在没有规则约束、每天超四小时的情况下大概率有害，但家长参与并有时间约定时，反而可能是孩子的社交货币"。面试里的开放题（比如"大模型会取代算法工程师吗"）就是同一种题：<b>考的不是立场，是你把模糊问题讲清楚的能力</b>。'
    },
    intuition: [
      { heading: '开放题没有标准答案，只有好坏答案', body: '面试官抛出开放题时，多半自己也没有唯一结论。他要观察的是：面对模糊问题，你是慌乱地赌一个立场，还是能把它拆开、分层、给出带条件的判断。这与算法岗的日常高度一致——真实业务里"该不该上大模型""要不要微调"从来不是有标准答案的选择题，而是要你定义清楚后给出权衡（Trade-off）判断。' },
      { heading: '三板斧为什么有效', body: '①<b>定义术语与范围</b>：把"取代""好"这类模糊词钉死，避免鸡同鸭讲，还为自己争取思考时间；②<b>拆子问题分层讨论</b>：大问题拆成"哪些任务会被替代、哪些不会"，每一层单独判断，观点立刻立体；③<b>有条件的结论</b>：不说"会 / 不会"，说"在 X 场景下大概率 Y，Z 条件下例外"——留边界不是软弱，是专业。' },
      { heading: '诚实是追问战里唯一防得住的姿势', body: '追问（Follow-up）的设计目的就是探你的边界：不懂装懂，两三个"为什么"就会被击穿，而且面试官对"编造"的容忍度远低于"不会"——编造摧毁的是信任，不会只是知识缺口。正确姿势：听不懂就复述确认，不会就给思路加划界："这个我没实际做过，但我会从……入手。"诚实不是示弱，而是把面试从"对错考试"拉回"合作排查"。' }
    ],
    principle: [
      {
        heading: '开放题三板斧完整示范',
        body: '问题："大模型会取代算法工程师吗？"示范：<br><b>「</b><i>先对齐一下"取代"的口径：我理解您问的是三五年内，算法岗的日常工作是否会被模型本身大量替代（①定义）。我把算法工程师的工作拆成四块看（②拆分）：数据与评测建设——需要理解业务、定义什么叫"好"，短期最难被替代；模型选型与调优——工具化趋势明显，单体效率会大幅提升；方案与 prompt 设计——部分会被自动化，但"在约束下做权衡"仍需要人；纯执行类工作（跑实验、写脚本）——会最先被替代。所以我的判断是（③条件结论）：三五年内，以执行层为主的岗位会被大幅压缩，但"定义问题、评估效果、承担责任"这三件事仍然需要人；如果推理与 Agent 能力持续突破，替代边界会继续上移。</i><b>」</b><br>注意：每个判断都挂在具体任务上，结论自带前提条件，面试官顺着任何一层追问你都有话说。'
      },
      {
        heading: '追问应对三招',
        body: '<ul><li><b>听不懂 → 复述确认：</b>"我想确认下，您是想问 A 还是 B？"把模糊的大问题变成具体的小问题再作答。</li><li><b>不会 → 答思路 + 划界：</b>"这个我没实际做过，不敢下结论；如果让我解决，我会先……再……。"给方法论而不是编结论。</li><li><b>被质疑 → 不辩解，给证据：</b>"您的怀疑有道理，我的评测集是这样抽的……两个数据源互相印证。"把质疑变成展示严谨的机会。</li></ul>三招的共同底座是诚实：知识缺口可以当天补，信任崩了这轮面试就结束了。'
      },
      {
        heading: '反面教材：不懂装懂的三连击穿',
        body: '面试官："你们检索用的什么重排模型？"候选（不懂装懂）："就用那个……交叉编码器。"追问："哪个版本？精度多少？推理时延多少？"候选开始含糊："就……最新的，效果挺好的。"再追问："和 BM25 的混排比例怎么定的？"候选："呃……调过，差不多五五开。"——三个回合，面试官已确认：知识点是背的，没实践过。对比正确姿势："具体模型名和指标我记不准，不敢乱报数字；但我能讲清选重排模型的三个标准：精度提升、时延预算、能否离线蒸馏。"前者输掉整场信任，后者只输掉一道题，孰轻孰重一目了然。'
      }
    ],
    animation: {
      title: '追问应对树：三类追问的应答示范',
      html: '<div class="anim-m10-03"><div class="anim-m10-03-tip">面试官的追问分三类，点节点看应答示范——核心都是"诚实 + 有条理"。</div><div class="anim-m10-03-nodes"><button type="button" data-i="0" class="anim-m10-03-node">听不懂的问题</button><button type="button" data-i="1" class="anim-m10-03-node">不会的问题</button><button type="button" data-i="2" class="anim-m10-03-node">被质疑的问题</button></div><div class="anim-m10-03-panel"></div></div>',
      css: '.anim-m10-03-tip { color: #9a3412; margin-bottom: 8px; font-size: 13px; }\n.anim-m10-03-nodes { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }\n.anim-m10-03-node { border: 1px solid #fdba74; background: #fff; color: #9a3412; border-radius: 16px; padding: 4px 14px; cursor: pointer; }\n.anim-m10-03-node.anim-m10-03-active { background: #f97316; border-color: #f97316; color: #fff; }\n.anim-m10-03-panel { display: none; }\n.anim-m10-03-panel.anim-m10-03-show { display: block; animation: anim-m10-03-in .4s ease both; }\n.anim-m10-03-q { background: #f1f5f9; border-radius: 8px; padding: 8px 10px; color: #334155; margin-bottom: 8px; font-size: 13px; }\n.anim-m10-03-a { border: 1px solid #fed7aa; background: #fff7ed; border-radius: 8px; padding: 8px 10px; color: #7c2d12; font-size: 13px; }\n.anim-m10-03-a b { color: #c2410c; }\n.anim-m10-03-a p { margin: 4px 0 0; }\n@keyframes anim-m10-03-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }',
      js: function (root) {
        var CASES = [
          { tag: '复述确认', q: '面试官："检索 recall 掉了，你觉得是 embedding 侧还是 chunking 侧的问题？"', a: '"我想先确认一下：您是想问召回率下降时，先排查向量编码环节，还是先排查文档切分策略，对吗？我分别说说两条线的排查方法……"——把模糊的大问题变成具体的小问题再作答。' },
          { tag: '划界 + 答思路', q: '面试官："分布式训练的梯度同步，你们用的哪种 all-reduce 实现？"', a: '"这个我没实际配置过，不敢乱说细节；如果让我解决，我会先查训练框架文档确认默认实现，再在两台机器上做小规模带宽压测，确认瓶颈在通信还是计算。"——承认边界，展示方法论。' },
          { tag: '不辩解，给证据', q: '面试官："62% 的解决率，我怀疑是评测集太简单刷出来的。"', a: '"您的怀疑很合理。评测集是按真实咨询分布抽的 500 条，抽样口径我可以展开讲；另外灰度期间人工抽检了 200 条，结果是 58%，两个数据源互相印证。"——用证据回应质疑，而不是用情绪。' }
        ];
        var nodes = root.querySelectorAll('.anim-m10-03-node');
        var panel = root.querySelector('.anim-m10-03-panel');
        function render(i) {
          var c = CASES[i];
          panel.innerHTML = '<div class="anim-m10-03-q">' + c.q + '</div><div class="anim-m10-03-a"><b>应对 · ' + c.tag + '</b><p>' + c.a + '</p></div>';
          panel.className = 'anim-m10-03-panel anim-m10-03-show';
        }
        Array.prototype.forEach.call(nodes, function (n) {
          n.addEventListener('click', function () {
            Array.prototype.forEach.call(nodes, function (m) { m.className = 'anim-m10-03-node'; });
            n.className = 'anim-m10-03-node anim-m10-03-active';
            render(Number(n.getAttribute('data-i')));
          });
        });
      }
    },
    exercises: [
      {
        type: 'judge', difficulty: 1,
        question: '被问到完全不会的问题时，凭第一感觉快速编一个听起来合理的答案，比承认不会更能给面试官留下好印象。',
        answer: false,
        explanation: '面试官的追问链就是为识别编造而设计的，两三层"为什么"就能击穿；一旦被识别为编造，损失的不只是这道题，而是整场面试的信任。正确做法是答思路加划界："我没实际做过，但我会从……入手。"面试官在筛的信号：面对未知，你是诚实且有条理，还是侥幸碰运气。'
      },
      {
        type: 'single', difficulty: 2,
        question: '回答"大模型会取代算法工程师吗"这类开放题，第一步应该做什么？',
        options: ['先定义"取代"的含义与时间范围，钉住讨论口径', '旗帜鲜明地说"不会"，展现自信', '罗列大模型的最新进展刷专业性', '把问题抛回给面试官'],
        answer: 0,
        explanation: '三板斧第一步是定义术语与范围："取代"指岗位消失还是结构变化？三五年还是十年？口径不清，任何结论都无法讨论。选项 2 是赌立场、选项 3 是答非所问、选项 4 偶尔可用但不能当第一步。面试官在筛的信号：你能否把模糊问题变成可讨论的问题——这正是算法工程师的日常功课。'
      },
      {
        type: 'order', difficulty: 3,
        question: '开放题三板斧的三个步骤被打乱了，请排出正确顺序：',
        items: [
          '给出有条件的判断：在 X 场景下大概率 Y，但 Z 条件下例外',
          '先定义题目中模糊的术语与讨论范围',
          '把大问题拆成若干子问题，分层逐个讨论'
        ],
        answer: [1, 2, 0],
        explanation: '顺序是定义→拆分→条件结论。先定义才能避免答偏；先拆分才能避免笼统站队；最后给带边界的结论，既显专业又为追问留出空间。面试官在筛的信号：结构化思维——观点是否经得起"如果条件变了呢"这类追问。'
      },
      {
        type: 'single', difficulty: 3,
        question: '（场景模拟）面试官问："你们线上 badcase 率 15%，你打算怎么降？"你并没有独立做过线上优化，最佳应答是？',
        options: [
          '坦承没独立操盘过，但给出分析路径：先抽样归类 badcase、按影响面排优先级、逐类给对策并小流量验证',
          '直接答"多训练几轮就好了"',
          '说这个问题太复杂，一两句讲不清楚',
          '背诵一篇 RLHF 论文的结论来撑场面'
        ],
        answer: 0,
        explanation: '选项 1 同时用了两件武器：诚实划界（没做过不装做过）与答思路（归因→分级→对策→验证的方法论），面试官要的正是"没吃过猪肉但知道怎么找猪"的潜质。选项 2 无视归因、选项 3 是逃避、选项 4 答非所问且必被追问击穿。面试官在筛的信号：诚实度 + 解决问题的框架感。'
      }
    ],
    relations: {
      prerequisites: ['m10-01'],
      successors: [],
      confusables: [
        { other: 'm10-02', tip: '场景设计题输出的是"方案"，开放题输出的是"带条件的观点"：前者靠四步拆解法，后者靠三板斧；共同点是先澄清定义再展开，别混成"想到哪说到哪"。' },
        { other: 'm8-01', tip: '开放题里讨论"大模型能力边界"时，Prompt Engineering 的常识是论据来源之一：能说出"许多单点任务已被 prompt 方案解决，说明执行层最先被替代"，观点立刻有支撑。' }
      ]
    },
    memory: {
      mnemonic: '先定义、再拆层、结论带条件；不会就划界。',
      selfTest: [
        { q: '追问应对的三招分别用在什么场景？', a: '听不懂→复述确认，把模糊问题变具体；不会→答思路加划界（"没做过，但我会从……入手"）；被质疑→不辩解，给证据并让多个数据源互相印证。共同底座是诚实。' },
        { q: '为什么"有条件的结论"比"鲜明站队"更好？', a: '真实技术问题依赖前提条件，带条件的结论说明你理解边界；鲜明站队一旦被追问反例就崩塌，且暴露思维粗糙。留边界不是软弱，是专业。' },
        { q: '反面教材的核心教训是什么？', a: '不懂装懂经不起两三层追问，被识破后损失的是整场信任；承认不会只损失一道题，用"答思路"还能部分止损。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给外行：遇到没有标准答案的开放题，怎么答才显得专业？',
      reference: '先把题目里模糊的词问清楚，再把大问题拆成几个小问题分别说，最后给一个"在什么情况下会怎样"的结论，而不是简单地说会或不会。'
    }
  },
  {
    id: 'm10-04',
    title: '反问与复盘',
    oneLiner: '反问是送分题，复盘是迭代飞轮',
    estMinutes: 10,
    analogy: {
      title: '相亲结束前的十分钟',
      body: '相亲快结束时，只问对方"工资多少、房有几套"，气氛立刻变味——你暴露了自己只在乎条件。换成"你平时怎么平衡工作与爱好""你最近在为什么目标努力"，既拿到了真实信息，又展示了你是个有想法的人。面试最后十分钟的反问就是同一扇窗口：面试官把提问权交给你，是在邀请你展示关注点。面试结束也不是终点：学车的人会把熄火最多的那个路口记在本子上下次重点练，面试者也应该在 24 小时内把被问住的问题补进错题本——下一轮面试，就是下次上车。'
    },
    intuition: [
      { heading: '反问是最后一道加分题', body: '多数候选人把面试当成"被审问"，到反问环节只会说"没有问题了"——这等于把送分题退回去。好的反问一举三得：拿到内部视角的真实信息（帮助自己决策 offer）、展示你对业务与技术的好奇心、把面试从考试变成双向交流，面试官对你的记忆会更立体。' },
      { heading: '好反问问"事"，坏反问只问"价"', body: '好反问的共同点：问业务、问技术、问成长——团队技术栈、业务核心指标、新人成长路径、当前最大的技术挑战，每一条都传递"我想来干活并且能干好"。坏反问的共同点：只关心付出与回报（薪资、加班），或问网上五分钟能查到的信息（公司主营业务是什么）——前者显得没诚意，后者暴露没做功课。薪资当然要谈，但放到 offer 阶段与 HR 谈。' },
      { heading: '复盘是几轮面试之间的迭代飞轮', body: '校招常有 3~5 轮面试，每轮之间你其实有"再训练"的机会：面试后 24 小时内，凭记忆写下被问住的问题与当时的回答，当天补齐知识缺口并写进错题本，下一轮前只复习错题本。这就形成飞轮：每轮面试产生训练数据（被问住的点）→ 当天补齐 → 下一轮表现提升。放任不管，同样的坑你会踩三轮。' }
    ],
    principle: [
      {
        heading: '四类好反问与示范话术',
        body: '<b>问业务：</b>"咱们业务当前最核心的一个指标是什么？算法团队主要通过哪些工作影响它？"<br><b>问技术：</b>"团队现在的技术栈大致什么样？比如检索和生成分别怎么做的？"<br><b>问挑战：</b>"这个岗位当前面临的最大技术挑战是什么？"<br><b>问成长：</b>"新人入职前三个月一般做什么？团队怎么帮助上手？"<br>任选两三个即可，每个都是"展示思考深度 + 获取真实信息"的双赢。追问式反问更佳："您刚才提到评估很难做，咱们目前主要卡在标注一致性还是指标定义上？"——基于面试内容现场生成的反问，最显功力。'
      },
      {
        heading: '坏反问清单',
        body: '<ul><li><b>只问待遇：</b>"加班多吗？几点下班？多久涨薪？"——不是不能关心，而是技术面第一反问就问这些，传递的信号只有"在乎付出"。</li><li><b>问公开信息：</b>"公司主营什么业务？有哪些产品？"——官网十分钟功课，一问暴露零准备。</li><li><b>问评分：</b>"您觉得我今天表现怎么样？能过吗？"——把压力抛给面试官，且大概率只得到客套话。</li><li><b>没有问题：</b>"没有想问的了。"——主动放弃展示窗口，也显得对岗位无感。</li></ul>'
      },
      {
        heading: '24 小时复盘表模板',
        body: '面试当晚趁记忆新鲜填一张表，五列即可：<br><b>被问住的问题 → 当时的回答 → 缺口在哪 → 补齐动作 → 状态</b>。<br>例如："为什么 RAG 检索精度上不去？"→"当时只答了调 chunk 大小"→"不知道混合检索与重排序"→"当晚补齐混合检索 + RRF 融合 + 重排的知识，用自己的话写 200 字"→"已进错题本"。<br>配套纪律：错题本只收"被问住的"知识类问题，不收"答对但表达磕绊的"（那是表达问题不是知识问题）；下一场面试前 30 分钟只看错题本。几轮面试之间就这样滚起飞轮：每场面试都是下一场的训练数据。'
      }
    ],
    animation: {
      title: '反问分拣机：这句反问是加分还是减分',
      html: '<div class="anim-m10-04"><div class="anim-m10-04-head">判断下面每句反问是加分还是减分，点选即判分</div><div class="anim-m10-04-score">进度 0/5 · 判对 0</div><div class="anim-m10-04-item"><p class="anim-m10-04-sent">业务当前最核心的指标是什么？算法团队怎么影响它？</p><div class="anim-m10-04-btns"><button type="button" data-good="1">好反问</button><button type="button" data-good="0">坏反问</button></div><div class="anim-m10-04-fb"></div></div><div class="anim-m10-04-item"><p class="anim-m10-04-sent">这个岗位当前最大的技术挑战是什么？</p><div class="anim-m10-04-btns"><button type="button" data-good="1">好反问</button><button type="button" data-good="0">坏反问</button></div><div class="anim-m10-04-fb"></div></div><div class="anim-m10-04-item"><p class="anim-m10-04-sent">新人入职前三个月主要做什么？团队怎么帮助上手？</p><div class="anim-m10-04-btns"><button type="button" data-good="1">好反问</button><button type="button" data-good="0">坏反问</button></div><div class="anim-m10-04-fb"></div></div><div class="anim-m10-04-item"><p class="anim-m10-04-sent">咱们公司主营什么业务？有哪些产品？</p><div class="anim-m10-04-btns"><button type="button" data-good="1">好反问</button><button type="button" data-good="0">坏反问</button></div><div class="anim-m10-04-fb"></div></div><div class="anim-m10-04-item"><p class="anim-m10-04-sent">加班多吗？多久能涨薪？</p><div class="anim-m10-04-btns"><button type="button" data-good="1">好反问</button><button type="button" data-good="0">坏反问</button></div><div class="anim-m10-04-fb"></div></div><div class="anim-m10-04-final"></div><button type="button" class="anim-m10-04-reset">重新开始</button></div>',
      css: '.anim-m10-04 { font-size: 13px; }\n.anim-m10-04-head { font-weight: 600; color: #c2410c; margin-bottom: 6px; }\n.anim-m10-04-score { display: inline-block; background: #ffedd5; color: #9a3412; border-radius: 10px; padding: 2px 10px; margin-bottom: 8px; }\n.anim-m10-04-item { border: 1px solid #fed7aa; border-radius: 8px; padding: 8px 10px; margin-bottom: 8px; transition: border-color .3s, background .3s; }\n.anim-m10-04-item.anim-m10-04-ok { border-color: #22c55e; background: #f0fdf4; }\n.anim-m10-04-item.anim-m10-04-bad { border-color: #ef4444; background: #fef2f2; }\n.anim-m10-04-sent { margin: 0 0 6px; color: #1e293b; }\n.anim-m10-04-btns { display: flex; flex-wrap: wrap; gap: 6px; }\n.anim-m10-04-btns button { border: 1px solid #fdba74; background: #fff; color: #9a3412; border-radius: 6px; padding: 3px 10px; cursor: pointer; }\n.anim-m10-04-btns button:hover { background: #ffedd5; }\n.anim-m10-04-fb { margin-top: 6px; color: #475569; min-height: 1em; }\n.anim-m10-04-final { font-weight: 600; color: #c2410c; margin: 6px 0; }\n.anim-m10-04-reset { border: 1px solid #fdba74; background: #fff7ed; color: #9a3412; border-radius: 6px; padding: 4px 12px; cursor: pointer; }',
      js: function (root) {
        var DATA = [
          { good: true, why: '把技术和业务价值连起来，是面试官最想听到的信号。' },
          { good: true, why: '传递"我准备好解决难题"，还能听到团队的真实痛点。' },
          { good: true, why: '关注成长路径，暗示你打算长期投入。' },
          { good: false, why: '官网十分钟功课，一问就暴露零准备。' },
          { good: false, why: '不是不能关心，但技术面第一反问就问它，只剩"在乎付出"一个信号；放到 offer 阶段谈更专业。' }
        ];
        var items = root.querySelectorAll('.anim-m10-04-item');
        var scoreEl = root.querySelector('.anim-m10-04-score');
        var finalEl = root.querySelector('.anim-m10-04-final');
        var done = 0, right = 0;
        function refresh() {
          scoreEl.textContent = '进度 ' + done + '/5 · 判对 ' + right;
          if (done === 5) {
            finalEl.textContent = right === 5
              ? '全对！你已经会用反问传递"想干事"的信号了。'
              : '记住口诀：好反问问事（业务 / 技术 / 成长），坏反问只问价或问网上能查到的信息。';
          }
        }
        Array.prototype.forEach.call(items, function (item, i) {
          var btns = item.querySelectorAll('button');
          Array.prototype.forEach.call(btns, function (btn) {
            btn.addEventListener('click', function () {
              if (item.getAttribute('data-done')) return;
              item.setAttribute('data-done', '1');
              var ok = (btn.getAttribute('data-good') === '1') === DATA[i].good;
              if (ok) right++;
              item.className = 'anim-m10-04-item ' + (ok ? 'anim-m10-04-ok' : 'anim-m10-04-bad');
              item.querySelector('.anim-m10-04-fb').textContent =
                (ok ? '正确：这是' : '不对，这是') + (DATA[i].good ? '好反问。' : '坏反问。') + DATA[i].why;
              done++;
              refresh();
            });
          });
        });
        root.querySelector('.anim-m10-04-reset').addEventListener('click', function () {
          done = 0; right = 0;
          Array.prototype.forEach.call(items, function (item) {
            item.removeAttribute('data-done');
            item.className = 'anim-m10-04-item';
            item.querySelector('.anim-m10-04-fb').textContent = '';
          });
          finalEl.textContent = '';
          refresh();
        });
        refresh();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '下列四个反问中，最能向面试官展示思考深度的是？',
        options: ['这个岗位当前面临的最大技术挑战是什么？', '咱们公司是做什么业务的？', '工资能给到多少？加班严重吗？', '您觉得我今天的面试表现怎么样？'],
        answer: 0,
        explanation: '问挑战传递的信号是"我准备好解决难题了"，同时能听到团队真实痛点，是双赢反问。选项 2 暴露没做功课，选项 3 时机错误（应放到 offer 阶段与 HR 谈），选项 4 让面试官为难且得不到真话。面试官在筛的信号：你是来找一份工作，还是来找"这个具体的问题"的。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '面试结束、走出会议室后，这场面试能带来的价值就结束了，接下来只需安静等待结果。',
        answer: false,
        explanation: '面试后 24 小时内的复盘是价值最高的一步：趁记忆新鲜记录被问住的问题，当天补齐缺口并写进错题本；多轮面试之间靠这个飞轮持续提升。把它当成"只等通知"，等于同一个坑每次都重新踩一遍。面试官也真的在筛这个信号：会复盘的候选人，下一轮的表现会明显不同。'
      },
      {
        type: 'single', difficulty: 3,
        question: '（场景模拟）一面被"你们的 RAG 检索精度为什么上不去"问住了，当时只答出"调 chunk 大小"。下面哪个后续动作价值最大？',
        options: [
          '24 小时内补齐"混合检索 + RRF 融合 + 重排序"知识，用自己的话写 200 字并进错题本，二面前复习',
          '祈祷二面不会再问检索相关的问题',
          '在社交平台发帖吐槽面试官问得太细',
          '判定这题超出了岗位要求，不用理会'
        ],
        answer: 0,
        explanation: '选项 1 完整执行了复盘闭环：记录缺口→当天补齐→内化输出（写 200 字）→进错题本→考前复习，把一次失败直接转化成下一轮的得分点；而检索是 RAG 岗位的高频考点，二面大概率再遇。选项 2 是赌博，选项 3 与选项 4 都是归因于外，不会带来任何提升。面试官在筛的信号：面对挫折你是归因于己并行动，还是归因于环境。'
      }
    ],
    relations: {
      prerequisites: ['m10-01'],
      successors: [],
      confusables: [
        { other: 'm10-01', tip: '复盘表是 STAR 的闭环：把"被问住的问题"按 S-T-A-R 重写成可重讲的答案，上一轮的失败点就成了下一轮的 R（可展示的进步）。' },
        { other: 'm10-03', tip: '反问环节本质是你向面试官出开放题：先想清楚想了解什么、这句话传递什么信号再开口；盲目反问等于把 m10-03 的主动权拱手让出。' }
      ]
    },
    memory: {
      mnemonic: '反问问事不问价，复盘当晚进错题。',
      selfTest: [
        { q: '四类好反问分别是什么？', a: '问业务（核心指标与算法的影响路径）、问技术（团队技术栈）、问挑战（当前最大技术难题）、问成长（新人前三个月与培养路径）；最好基于面试内容做追问式反问。' },
        { q: '复盘表的五列是什么？', a: '被问住的问题 → 当时的回答 → 缺口在哪 → 补齐动作 → 状态；当晚填、缺口当天补，只收"被问住的"知识类问题。' },
        { q: '薪资加班为什么不适合技术面反问？', a: '技术面反问的评分点是好奇心与业务理解，第一反问只问待遇会覆盖掉这些信号；待遇在 offer 阶段与 HR 谈更专业也更有效。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给外行：面试最后该问面试官点什么？面试完还要做什么？',
      reference: '问团队在做什么、难在哪、新人怎么成长这类"事"的问题；走出面试间 24 小时内把没答上来的问题搞懂记进错题本，下一场面试就不怕再遇到。'
    }
  }
  ]
});
