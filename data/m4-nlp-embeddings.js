/* M4 NLP 与词向量 —— 5 个知识点内容数据（契约见 docs/SCHEMA.md v1）
   事实已联网核实：Word2Vec = Mikolov 等 2013（arXiv:1301.3781；负采样见同年姊妹篇 1301.3245）；
   BLEU = Papineni 等，IBM，ACL 2002；seq2seq = Sutskever 等，NeurIPS 2014；
   注意力 = Bahdanau/Cho/Bengio，ICLR 2015；BPE 用于子词 = Sennrich 等，ACL 2016（BPE 原为 1994 年压缩算法）。 */
window.SITE_DATA.registerModule({
  module: 'M4',
  title: 'NLP 与词向量',
  icon: '📚',
  color: '#14b8a6',
  lessons: [
  {
    id: 'm4-01',
    title: '分词与 Token',
    oneLiner: '文字如何变成机器能吃的数字：切多粗、切不开怎么办',
    estMinutes: 12,
    analogy: {
      title: '备菜切配：食材要切成统一规格',
      body: '厨师开工前先备菜：整只鸡太大，直接下锅夹不动，要切成大小合适的块。讲究的后厨按"标准规格"切，块块对得上号。文字进模型前也要先过案板——把一整句话切成模型能处理的小块，每一块叫一个 <b>Token</b>，这一步叫<b>分词（Tokenization）</b>。切多粗是门学问：切太粗（整词），遇到没见过的生词就傻眼；切太细（单个字符），句子被拆得没了整体感。现代大模型的方案叫 BPE：先把所有食材切成最小丁，再反复把"最常一起出现"的两丁拼成标准块。'
    },
    intuition: [
      { heading: '模型只认数字：先切、再编号', body: '模型做不了"读句子"，它只认数字。所以第一步切 Token，第二步查<b>词表（Vocabulary）</b>，把每个 Token 换成编号（Token ID）。模型真正看到的从来不是"我爱你"，而是 <code>[302, 115, 66]</code> 这样一串数字。编号目前只是"门牌号"，还没有语义——给编号配上语义向量是下一课（m4-02）的事。' },
      { heading: '三种粒度各有苦衷', body: '<b>词级</b>：含义完整，但词表爆炸，而且新词一个不认识就是<b>未登录词（OOV, Out-of-Vocabulary）</b>。<b>字符级</b>：词表极小、永不 OOV，但序列被拉得很长，每个单元几乎没有含义。<b>子词（Subword）</b>是折中方案：常见词保持完整，生僻长词拆成有意义的零件，比如 unhappiness 拆成 un + happi + ness。' },
      { heading: '为什么"太长的词"要被切开', body: '词表不能无限大：几十万已是极限，再大，嵌入矩阵和输出层的开销都吃不消。理想的词表是——真正高频的词独占一个 Token，低频长词（专有名词、拼写变体、化学名）拆开拼装。BPE 的合并规则天然实现了这一点：只有"高频组合"才有资格合体成词，冷门组合永远停在零件状态。' }
    ],
    principle: [
      {
        heading: '分词流水线：切分 → 查表 → 变数字',
        body: '同一段文字，不同模型的分词器切法可以完全不同，所以"一句话有多少 Token"没有绝对答案——API 按 Token 计费、上下文长度按 Token 数算，都是这一步决定的。词级时代遇到词表外的词，统一塞进特殊符号 <code>&lt;unk&gt;</code>（unknown）这个"失物招领箱"，词义信息直接丢失；子词时代基本消灭了 unk：任何新词都能拆回字符级重新拼装。',
        formula: '「我爱NLP」 → 切分 → [我, 爱, N, LP] → 查词表 → [302, 115, 78, 1024]',
        formulaNote: '<ul><li><b>切分</b>：由分词器（Tokenizer）决定粒度，词表定好后规则固定</li><li><b>词表</b>：一张"token ↔ 编号"对照表，训练开始前就固定下来</li><li><b>&lt;unk&gt;</b>：词级方案里词表外词的统一去处，等于"我没学过这个词"</li><li><b>子词方案</b>：生词可拆成已知的子词序列，编码不中断、含义不丢光</li></ul>'
      },
      {
        heading: 'BPE：从字符开始，反复合并最高频相邻对',
        body: '<b>BPE（Byte-Pair Encoding，字节对编码）</b>原本是 1994 年的数据压缩算法，2016 年被 Sennrich 等人引入机器翻译用来处理生词，如今是 GPT 系列分词的基石。它的训练过程出奇地朴素：先统统拆成单字符，然后每一轮统计"相邻 token 对"的出现次数，把最高频的一对合并成一个新 Token 加入词表，再重复。合并次数就是词表预算：想要多大词表，就合并多少步。',
        formula: '每一轮：统计相邻对频次 → 取最高频 (a, b) → 新 token "ab" 入词表 → 重复，直到词表达到预设大小',
        formulaNote: '<ul><li><b>相邻对 (a, b)</b>：同一个词内部紧挨着的两个 token，如 low 里的 (l, o)</li><li><b>最高频优先</b>：像 th、es 这种高频组合最先合体，成为独立 token</li><li><b>贪心合并</b>：每轮只做一件最优的小事，累计起来就是整套切分规则</li><li><b>词表大小</b>：初始字符数 + 合并步数，是人为设定的预算，不是算出来的</li></ul>'
      },
      {
        heading: '面试考点：为什么按 Token 计费、中英文 Token 数不同',
        body: '面试官爱从工程现象切入："为什么调 API 按 token 收费而不是按字数？"因为模型的一切开销（注意力计算、KV Cache、上下文窗口）都挂在 Token 序列长度上。追问："同一段话中文和英文的 token 数一样吗？"不一定——取决于词表对哪种语言更友好：训练语料里中文多，中文就被切得更"整"；语料里中文少，一个汉字可能被拆成多个字节 token，同样的意思要花更多 Token。'
      }
    ],
    animation: {
      title: 'BPE 合并实验台：看高频对一步步合体',
      html: '<div class="anim-m4-01"><div class="anim-m4-01-ctrl"><button class="anim-m4-01-step" type="button">统计并合并最高频对（走 1 步）</button><button class="anim-m4-01-reset" type="button">重置</button></div><p class="anim-m4-01-note">迷你语料：low×5、lower×2、newest×6、widest×3。BPE 只统计<b>词内</b>相邻对，词与词之间不合并。</p><div class="anim-m4-01-chips"></div><div class="anim-m4-01-pairs"></div><div class="anim-m4-01-log"></div></div>',
      css: '.anim-m4-01 { font-size: 13px; }\n.anim-m4-01-ctrl { display: flex; gap: 8px; margin-bottom: 8px; }\n.anim-m4-01-ctrl button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m4-01-note { margin: 0 0 8px; color: #64748b; }\n.anim-m4-01-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; }\n.anim-m4-01-word { display: inline-flex; gap: 2px; padding: 2px; border-radius: 6px; background: #f1f5f9; }\n.anim-m4-01-tok { display: inline-block; min-width: 18px; text-align: center; padding: 3px 5px; border-radius: 4px; background: #e2e8f0; font-family: monospace; transition: background .3s ease, color .3s ease, transform .3s ease; }\n.anim-m4-01-hot { background: #14b8a6; color: #fff; transform: translateY(-3px); }\n.anim-m4-01-pairs { font-family: monospace; font-size: 12px; color: #334155; margin-bottom: 8px; }\n.anim-m4-01-best { color: #0f766e; font-weight: 700; }\n.anim-m4-01-log { font-family: monospace; font-size: 12px; color: #475569; line-height: 1.7; }',
      js: function (root) {
        var words = ['low', 'low', 'low', 'low', 'low', 'lower', 'lower', 'newest', 'newest', 'newest', 'newest', 'newest', 'newest', 'widest', 'widest', 'widest'];
        var toks = [];
        var stepNo = 0;
        var logs = [];
        var chips = root.querySelector('.anim-m4-01-chips');
        var pairsBox = root.querySelector('.anim-m4-01-pairs');
        var log = root.querySelector('.anim-m4-01-log');
        var stepBtn = root.querySelector('.anim-m4-01-step');
        var resetBtn = root.querySelector('.anim-m4-01-reset');
        if (!chips || !pairsBox || !log) { return; }
        function countPairs() {
          var map = {}, order = [];
          toks.forEach(function (t) {
            for (var i = 0; i + 1 < t.length; i++) {
              var k = t[i] + '|' + t[i + 1];
              if (!(k in map)) { map[k] = 0; order.push(k); }
              map[k]++;
            }
          });
          return order.map(function (k) {
            var p = k.split('|');
            return { a: p[0], b: p[1], n: map[k] };
          }).sort(function (x, y) { return y.n - x.n; });
        }
        function render(hotToken) {
          var html = '';
          toks.forEach(function (t) {
            html += '<span class="anim-m4-01-word">';
            t.forEach(function (tk) {
              html += '<span class="anim-m4-01-tok' + (hotToken && tk === hotToken ? ' anim-m4-01-hot' : '') + '">' + tk + '</span>';
            });
            html += '</span>';
          });
          chips.innerHTML = html;
          var ps = countPairs();
          if (ps.length) {
            var ph = ps.slice(0, 8).map(function (p, i) {
              var s = '(' + p.a + ',' + p.b + ')×' + p.n;
              return i === 0 ? '<span class="anim-m4-01-best">' + s + '</span>' : s;
            }).join('  ');
            pairsBox.innerHTML = '词内相邻对频次：' + ph;
          } else {
            pairsBox.innerHTML = '没有可统计的相邻对了';
          }
        }
        function reset() {
          toks = words.map(function (w) { return w.split(''); });
          stepNo = 0;
          logs = ['初始：全部拆成单字符。点上方按钮，看 BPE 一步步合并。'];
          log.innerHTML = logs[0];
          render(null);
        }
        stepBtn.addEventListener('click', function () {
          var ps = countPairs();
          if (!ps.length || ps[0].n < 2) {
            logs.unshift('没有出现 ≥2 次的相邻对了，合并结束（共 ' + stepNo + ' 步）。');
          } else {
            var best = ps[0];
            stepNo++;
            toks = toks.map(function (t) {
              var out = [], i = 0;
              while (i < t.length) {
                if (i + 1 < t.length && t[i] === best.a && t[i + 1] === best.b) {
                  out.push(t[i] + t[i + 1]);
                  i += 2;
                } else {
                  out.push(t[i]);
                  i++;
                }
              }
              return out;
            });
            logs.unshift('第 ' + stepNo + ' 步：(' + best.a + ', ' + best.b + ') 出现 ' + best.n + ' 次 → 合并成新 token「' + best.a + best.b + '」入词表');
            render(best.a + best.b);
          }
          log.innerHTML = logs.slice(0, 3).join('<br>');
        });
        resetBtn.addEventListener('click', reset);
        reset();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '一个词级分词的系统，在推理时遇到词表里从没出现过的新词 <code>glorb</code>，最可能发生什么？',
        options: ['它被替换成特殊符号 <code>&lt;unk&gt;</code>，词义信息基本丢失', '系统自动查字典补上这个词的向量', '模型把它悄悄忽略，当作没看见', '程序直接报错，服务崩溃'],
        answer: 0,
        explanation: '词级方案对词表外的词统一映射为 &lt;unk&gt;，这就是经典的 OOV（未登录词）问题：模型只看到一个"生词筐"，完全不知道 glorb 是什么意思。B 不存在——词表在训练前已冻结，推理时不会现查字典；C 错在不是"忽略"而是"替换成 unk"；D 错在这本就是合法输入，不会崩溃。面试常以"OOV 怎么解决"开场，标准答案就是子词分词。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'BPE 分词从"整词"出发，逐步把低频词拆成更小的子词，直到词表足够小为止。',
        answer: false,
        explanation: '方向完全反了：BPE 从最小的字符单元出发，统计相邻对频率，把<b>最高频</b>的一对合并成新 Token，重复直到词表达到<b>预设上限</b>。结果是高频词最终保持完整、低频长词停在零件状态——"拆整词"是它的效果，不是它的过程。面试考点正是这条贪心合并的方向：字符起步、由小到大。'
      },
      {
        type: 'order', difficulty: 3,
        question: '把 BPE 训练词表的四个步骤按正确顺序排列：',
        items: ['统计语料中所有相邻 token 对的出现次数', '把全部语料拆成单个字符，作为初始 token 集合', '把出现次数最高的一对合并成新 token，加入词表', '不断重复"统计—合并"，直到词表达到预设大小'],
        answer: [1, 0, 2, 3],
        explanation: '正确顺序：先全拆成字符（下标 1）→ 统计相邻对频次（0）→ 合并最高频对为新 token（2）→ 循环直到词表达标（3）。常见误区：先合并再统计（合并的依据正是频次统计），或跳过字符初始化直接从整词开始（那是词级分词，不是 BPE）。这条流程也是 m9-05 手撕 BPE 代码的骨架。'
      }
    ],
    relations: {
      prerequisites: ['m1-04'],
      successors: ['m4-02', 'm9-05'],
      confusables: [
        { other: 'm4-02', tip: '分词给的是"编号"：Token ID 只是门牌号，没有任何语义；经过 Embedding 层才变成有语义的向量。面试易混题："token 是向量吗？"标准答案：token 是离散编号，查嵌入表之后才是向量。' },
        { other: 'm9-05', tip: '本课讲 BPE 的思想与直觉；m9-05 要求亲手写 BPE 代码（统计相邻对、合并、编码三个函数）。先把本课"从字符开始、反复合并最高频对"的流程背熟，写代码就是把它翻译成循环。' }
      ]
    },
    memory: {
      mnemonic: '字符起步，高频合并；生词拆件，永不 unk。',
      selfTest: [
        { q: '词级分词的 OOV 问题是什么？子词方案如何解决它？', a: '词级方案只认识词表内的词，词表外的新词一律替换成 unk，语义全丢。子词方案把新词拆成已知的子词序列（如 unhappiness → un + happi + ness），编码不中断、信息大半保留，从机制上基本消灭了 unk。' },
        { q: 'BPE 的一步合并具体在做什么？什么时候停？', a: '统计语料中所有词内相邻 token 对的出现次数，把最高频的一对合并成一个新 Token 加入词表；不断重复，直到词表达到预设大小（合并步数即词表预算）。当没有相邻对出现 ≥2 次时自然停止。' },
        { q: '为什么"太长的词"会被模型切开？', a: '词表必须控制规模：嵌入矩阵 V×d 与输出 softmax 的开销都随 V 增长。BPE 只让高频组合合体成词，低频长词永远停在子词状态——用少量零件拼装无限生词，是最经济的表示方式。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：AI 是怎么"读"一句话的？',
      reference: '它先把句子切成一块块叫 token 的积木，每块积木查对照表换成一个数字编号，模型读的其实是这串数字——怎么切，决定了模型眼里的句子长什么样。'
    }
  },
  {
    id: 'm4-02',
    title: 'Word2Vec 词向量',
    oneLiner: '看邻居猜词义：把"意思"装进能做算术的坐标',
    estMinutes: 13,
    analogy: {
      title: '新同学是谁？看他总跟谁玩',
      body: '班里转来一位新同学，你不认识他，但你发现他天天和篮球队一起吃饭、一起放学，大致能猜到他爱打球。<b>词也是这样</b>：就算你不懂"香蕉"，只要发现它总跟"黄色""剥皮""猴子"一起出现，就能猜出它和"苹果"是一类——这就是<b>分布假设（Distributional Hypothesis）</b>：看一个词的邻居，就知道它的意思。Word2Vec（Mikolov 等，2013）把这个直觉变成训练任务：让模型反复"看邻居猜词"，猜着猜着，每个词就获得了一张位置合理的"城市坐标"——词向量。'
    },
    intuition: [
      { heading: '编号没有语义，向量才有', body: '上一课的 Token ID 只是门牌号：302 和 303 毫无关系，"猫"编号 88、"狗"编号 51281，也看不出它们是近亲。解决办法是给每个词发一个高维坐标（常见 100~300 维），意思相近的词住得近、关系相似的词方向平行。这张坐标表就是<b>词向量 / 词嵌入（Word Embedding）</b>——把"语义"第一次装进数字的关键一步。' },
      { heading: 'CBOW 与 Skip-gram：一对镜像任务', body: '<b>CBOW（Continuous Bag-of-Words）</b>由周围词猜中心词："这、个、很好吃"→ 猜中心是"苹果"。<b>Skip-gram</b>反过来，由中心词猜周围词："苹果"→ 猜"这、个、很好吃"。两个任务都是借口——训练完把"猜题机"扔掉，留下来的那张坐标表才是真正想要的。经验规律：CBOW 训练更快，Skip-gram 对低频词更友好。' },
      { heading: '词向量会做算术', body: '最出名的结果：国王 − 男人 + 女人 ≈ 女王。向量减法得到"性别"这个方向，加到另一个词上就得到对应性别的词。这说明训练出来的空间里，语义关系被编码成了几何方向——相似词住得近，类比词的连线平行。这是面试的招牌考点："为什么词向量能做加减法？"' }
    ],
    principle: [
      {
        heading: '两个镜像任务的训练目标',
        body: 'Skip-gram 的目标一句话说完：给中心词，让它对窗口内每个真邻居打出的概率尽量高。整张坐标表（输入向量 + 输出向量）就是待学的参数，靠梯度下降（m3-02）把概率推高。CBOW 把方向反过来：用邻居们去认出中心词。任务名叫"猜词"，但真正学到的、也是我们要带走的，是那个向量空间本身。',
        formula: 'Skip-gram 目标：max Σₜ Σ_{−c≤j≤c, j≠0} log P(w_{t+j} | wₜ)　（CBOW 反之：P(wₜ | 周围词)）',
        formulaNote: '<ul><li><b>wₜ</b>：第 t 个位置的中心词，比如句子里的"苹果"</li><li><b>w_{t+j}</b>：窗口里第 j 个邻居，比如"这""个""很好吃"</li><li><b>c</b>：窗口半径，c=2 表示左右各看 2 个词</li><li><b>P(w_{t+j} | wₜ)</b>：模型拿中心词向量去"认出"该邻居的概率</li><li><b>Σ + log</b>：把所有（中心，邻居）配对的得分累加，训练就是把这个总和推到最大</li><li><b>副产品即目标</b>：训练结束真正拿走的是词向量表，"猜词"任务本身可以扔掉</li></ul>'
      },
      {
        heading: '负采样：把"全词表大考"换成"找茬游戏"',
        body: '按概率 P(邻居|中心) 输出，要对整个词表算一遍分数再归一化——词表十万，每训一个样本就要扫十万次，太贵。<b>负采样（Negative Sampling）</b>（Mikolov 等，2013）大刀一挥：真邻居当正例，随机抽 K 个无关词当负例，任务改成二分类——"它是真邻居吗？"真邻居的配对分数拉高，假邻居的压低。计算量从"扫全词表"降到"扫 K+1 个词"。',
        formula: 'L = log σ(v_中心 · u_真邻居) + Σₖ₌₁..K log σ(−v_中心 · u_负例ₖ)',
        formulaNote: '<ul><li><b>v_中心</b>：中心词的输入向量</li><li><b>u_真邻居</b>：真正出现在窗口里的词的输出向量</li><li><b>u_负例ₖ</b>：随机抽的 K 个无关词（按词频加权采样，高频词更常被抽中当"陪练"）</li><li><b>σ</b>：sigmoid 函数（见 m1-06），把点积分数压成 0~1 的"是真邻居吗"把握</li><li><b>直觉</b>：正例点积推大、负例点积压小——一正 K 负反复对比，相近的词自然"住"到一起</li></ul>'
      },
      {
        heading: '相似度、类比与 Word2Vec 的天花板',
        body: '判断两个词像不像，用余弦相似度（见 m1-01）：只比方向、不比长度。类比推理就是向量算术 + 最近邻：算出 king − man + woman 的落点，在词表里找离它最近的词，通常正是 queen。但 Word2Vec 是<b>静态</b>向量：一个词训好后就一个固定坐标，"苹果手机"和"苹果水果"共用同一个向量，一词多义处理不了。这个天花板正是后来上下文向量模型（ELMo、BERT，见 m5-06）要打破的，也是面试追问"Word2Vec 局限"的标准答案。'
      }
    ],
    animation: {
      title: '邻居窗口与语义地图：训练对怎么产生、算术怎么落地',
      html: '<div class="anim-m4-02"><div class="anim-m4-02-ctrl"><button class="anim-m4-02-sg anim-m4-02-on" type="button">Skip-gram：中心 → 邻居</button><button class="anim-m4-02-cbow" type="button">CBOW：邻居 → 中心</button><span class="anim-m4-02-hint">点句中任意一个词作为中心词（窗口 ±1）</span></div><div class="anim-m4-02-sent"></div><div class="anim-m4-02-pairs"></div><div class="anim-m4-02-map"><span class="anim-m4-02-w" style="left:12%;top:71%">男人</span><span class="anim-m4-02-w" style="left:48%;top:29%">国王</span><span class="anim-m4-02-w" style="left:43%;top:78%">女人</span><span class="anim-m4-02-w" style="left:75%;top:32%">女王</span><div class="anim-m4-02-fly" style="left:48%;top:29%"></div></div><button class="anim-m4-02-calc" type="button">计算：国王 − 男人 + 女人 = ？</button><div class="anim-m4-02-result"></div></div>',
      css: '.anim-m4-02 { font-size: 13px; }\n.anim-m4-02-ctrl { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 8px; }\n.anim-m4-02-ctrl button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m4-02-on { background: #14b8a6; color: #fff; border-color: #14b8a6; }\n.anim-m4-02-hint { color: #64748b; font-size: 12px; }\n.anim-m4-02-sent { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }\n.anim-m4-02-tok { padding: 4px 10px; border-radius: 6px; background: #e2e8f0; cursor: pointer; transition: background .3s ease, transform .3s ease, color .3s ease; }\n.anim-m4-02-center { background: #14b8a6; color: #fff; transform: translateY(-4px); font-weight: 700; }\n.anim-m4-02-nb { background: #99f6e4; }\n.anim-m4-02-pairs { font-family: monospace; font-size: 12px; color: #334155; min-height: 18px; }\n.anim-m4-02-map { position: relative; height: 150px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin: 10px 0 8px; }\n.anim-m4-02-w { position: absolute; transform: translate(-50%, -50%); padding: 2px 8px; background: #fff; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 12px; }\n.anim-m4-02-fly { position: absolute; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%; background: #14b8a6; box-shadow: 0 0 0 4px rgba(20,184,166,.25); transition: left .9s ease, top .9s ease; }\n.anim-m4-02-result { font-family: monospace; font-size: 12px; color: #0f766e; margin-top: 6px; line-height: 1.7; }',
      js: function (root) {
        var sent = ['小猫', '追着', '毛线球', '跑过', '客厅'];
        var mode = 'sg';
        var center = 2;
        var sentBox = root.querySelector('.anim-m4-02-sent');
        var pairsBox = root.querySelector('.anim-m4-02-pairs');
        var sgBtn = root.querySelector('.anim-m4-02-sg');
        var cbowBtn = root.querySelector('.anim-m4-02-cbow');
        var fly = root.querySelector('.anim-m4-02-fly');
        var calcBtn = root.querySelector('.anim-m4-02-calc');
        var result = root.querySelector('.anim-m4-02-result');
        if (!sentBox || !pairsBox) { return; }
        function renderPairs() {
          var parts = [];
          if (mode === 'sg') {
            for (var j = center - 1; j <= center + 1; j++) {
              if (j >= 0 && j < sent.length && j !== center) { parts.push(sent[center] + ' → ' + sent[j]); }
            }
            pairsBox.innerHTML = 'Skip-gram 生成的训练对（中心 → 邻居）：<b>' + parts.join('、') + '</b>';
          } else {
            var nbs = [];
            if (center - 1 >= 0) { nbs.push(sent[center - 1]); }
            if (center + 1 < sent.length) { nbs.push(sent[center + 1]); }
            pairsBox.innerHTML = 'CBOW 生成的训练对（邻居 → 中心）：<b>[' + nbs.join(', ') + '] → ' + sent[center] + '</b>';
          }
        }
        function renderSent() {
          var html = '';
          sent.forEach(function (w, i) {
            var cls = 'anim-m4-02-tok';
            if (i === center) { cls += ' anim-m4-02-center'; }
            else if (Math.abs(i - center) === 1) { cls += ' anim-m4-02-nb'; }
            html += '<span class="' + cls + '" data-i="' + i + '">' + w + '</span>';
          });
          sentBox.innerHTML = html;
          Array.prototype.forEach.call(sentBox.querySelectorAll('.anim-m4-02-tok'), function (el) {
            el.addEventListener('click', function () {
              center = Number(el.getAttribute('data-i'));
              renderSent();
              renderPairs();
            });
          });
        }
        if (sgBtn) {
          sgBtn.addEventListener('click', function () {
            mode = 'sg';
            sgBtn.classList.add('anim-m4-02-on');
            if (cbowBtn) { cbowBtn.classList.remove('anim-m4-02-on'); }
            renderPairs();
          });
        }
        if (cbowBtn) {
          cbowBtn.addEventListener('click', function () {
            mode = 'cbow';
            cbowBtn.classList.add('anim-m4-02-on');
            if (sgBtn) { sgBtn.classList.remove('anim-m4-02-on'); }
            renderPairs();
          });
        }
        if (calcBtn && fly && result) {
          calcBtn.addEventListener('click', function () {
            var r0 = (0.9 - 0.1 + 0.8).toFixed(1);
            var r1 = (0.8 - 0.2 + 0.1).toFixed(1);
            fly.style.left = (Number(r0) / 1.8 * 80 + 8) + '%';
            fly.style.top = (85 - Number(r1) * 70) + '%';
            result.innerHTML = '国王(0.9, 0.8) − 男人(0.1, 0.2) + 女人(0.8, 0.1) = (' + r0 + ', ' + r1 + ')<br>离落点最近的词：女王(1.5, 0.75)。向量减法得到的"性别"方向，被词向量学成了几何方向。';
          });
        }
        renderSent();
        renderPairs();
        if (result) { result.innerHTML = '上半场：点词看训练对；下半场：点按钮看语义算术。'; }
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'Word2Vec 的 Skip-gram 模型，训练任务是？',
        options: ['用中心词预测它周围的词', '用周围词预测中心词', '把整句话压缩成一个固定向量', '判断两个句子的语义是否相同'],
        answer: 0,
        explanation: 'Skip-gram = "跳过中心词去猜周围"，用中心词预测窗口内每个邻居；B 恰好是 CBOW（Continuous Bag-of-Words）的任务，两者互为镜像。C 是 seq2seq 编码器（m4-03）的职责；D 属于句对分类任务，与 Word2Vec 无关。面试口诀：Skip 中心撒网，CBOW 围中心。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '同一个"苹果"，在"我买了苹果手机"和"苹果很甜"两句话里，Word2Vec 给出的词向量完全相同。',
        answer: true,
        explanation: 'Word2Vec 是静态词向量：每个词在坐标表里只占一行，训练结束后位置固定，与上下文无关，因此无法区分一词多义。这正是它最常被面试追问的局限，后来的上下文相关表示（ELMo/BERT，见 m5-06）才让"苹果"在不同句子里拿到不同向量。别答反：出题人就是在考"静态"这个词的含义。'
      },
      {
        type: 'single', difficulty: 3,
        question: '负采样把 Word2Vec 的目标从"对整个词表做 softmax"改成"真邻居对 K 个假邻居的二分类"，最主要的原因是？',
        options: ['全词表 softmax 每一步都要扫所有词，计算代价太大；只采样 K 个负例能把开销降为常数', '负例可以让词向量的精度更高，而且不增加任何代价', 'softmax 函数无法处理中文词表', '负采样可以顺便省掉词向量的存储空间'],
        answer: 0,
        explanation: '词表十万级时，每训一个样本都要对全词表算分并归一化，开销 O(V)；负采样只算 1 个正例加 K 个负例的 sigmoid，开销 O(K)，K 通常取 5~20。B 错在"不增加代价"——负采样本质是近似换速度；C 与机制无关，softmax 对任何词表都适用；D 错在嵌入矩阵照存不误。面试考点：负采样与层次 softmax 都是为了绕开全词表归一化这个"昂贵的 softmax"。'
      }
    ],
    relations: {
      prerequisites: ['m4-01', 'm3-01'],
      successors: ['m4-03', 'm8-02'],
      confusables: [
        { other: 'm4-01', tip: 'Token ID 是离散编号（门牌号），词向量是连续坐标（住址 + 邻里关系）：分词先给编号，Embedding 层再按编号查表换向量。面试易混："模型输入的是 token 还是向量？"——输入序列是编号，进网络第一件事就是查表变向量。' },
        { other: 'm8-02', tip: 'Word2Vec 是"词级"静态向量，一词一向量；RAG 检索用的是现代 embedding 模型输出的"句子级"上下文向量，能区分"苹果手机"和"水果"。两者都叫 embedding，但能力代差很大，面试别说成同一个东西。' }
      ]
    },
    memory: {
      mnemonic: '看邻居猜词义；Skip 中心撒网，CBOW 围中心；负采样找茬省算力。',
      selfTest: [
        { q: 'CBOW 和 Skip-gram 谁对低频词更友好？为什么？', a: 'Skip-gram。它对每个中心词都要预测窗口内多个邻居，低频词出现一次也能贡献多个训练对、得到更充分的更新；CBOW 把邻居信息合并起来猜中心，低频词的信号容易被稀释。小语料、低频词多的场景通常选 Skip-gram。' },
        { q: '为什么词向量能做"国王 − 男人 + 女人 ≈ 女王"这类算术？', a: '训练把语义关系编码成了几何结构：同类词位置接近，关系（性别、时态、单复数等）对应近似平行的位移方向。king − man 得到"去掉男性"的方向，再加 woman 即"加上女性"，落点恰好靠近 queen，用余弦最近邻就能找出来。' },
        { q: '负采样解决什么问题？一句话说清机制。', a: '解决全词表 softmax 归一化太贵的问题（每步 O(V)）。机制：真邻居为正例，按词频随机抽 K 个无关词为负例，做 K+1 路 sigmoid 二分类——正例点积推大、负例点积压小，开销降为 O(K)。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：Word2Vec 到底学到了什么？',
      reference: '它让模型反复玩"看邻居猜词"的游戏，玩着玩着每个词都获得了一张城市坐标——意思相近的词住得近，词与词的关系变成方向，甚至能做加减法：国王减男人加女人，约等于女王。'
    }
  },
  {
    id: 'm4-03',
    title: 'seq2seq 与编码器-解码器',
    oneLiner: '读进去、装进箱子、再写出来：翻译流水线与它的瓶颈',
    estMinutes: 13,
    analogy: {
      title: '同传译员与他的小行李箱',
      body: '一位译员听一段中文，听完不许留笔记，只允许把整段话的要点塞进一个<b>固定大小的小行李箱</b>，然后凭箱子里的东西逐句说出英文。句子短时勉强够用；句子一长，箱子塞不下，只好丢三落四。早期神经机器翻译（Sutskever 等，2014）正是这样干活的：<b>编码器（Encoder）</b>读完原句，把全部信息压进一个固定长度的向量（那只行李箱），<b>解码器（Decoder）</b>再凭它一个词一个词写出译文。这个结构叫 <b>seq2seq</b>（序列到序列）：输入是不定长序列，输出也是不定长序列。'
    },
    intuition: [
      { heading: '三步流水线：读 → 压缩 → 写', body: '编码器（通常由 RNN/LSTM 搭成，见 m3-07）逐词读入原句，最后一个隐状态 <code>h_T</code> 就是"全句总结"，称为<b>上下文向量（Context Vector）c</b>。解码器从 c 出发逐词生成译文：每一步都看"已经写了哪些词 + c"，预测下一个词，直到输出结束符 <code>&lt;eos&gt;</code>。读和写是两个独立的网络，训练时一起端到端调参。' },
      { heading: '瓶颈：句子越长，箱子越挤', body: '无论原句是 5 个词还是 50 个词，都要压进同一个固定长度向量（比如 512 维）。信息必然有损：长句的细节被挤掉，翻译到后半段就"忘了开头说了啥"。长句性能骤降，是 seq2seq 最著名的短板，也直接催生了下一课的注意力机制——这是面试最爱问的一条脉络。' },
      { heading: 'teacher forcing：训练时开卷抄答案', body: '解码器每一步的输入是"上一步的输出"。训练初期模型很烂，用它自己的输出接着写，一步错、步步错，收敛极慢。<b>teacher forcing（教师强制）</b>的做法是：训练时不管模型自己写了什么，直接喂<b>真实译文</b>的上一个词，像老师扶着手腕写字。代价是训练时看惯了标准答案、推理时只能看自己的输出，两者不一致（称为 exposure bias，曝光偏差）。' }
    ],
    principle: [
      {
        heading: '形式化：一个条件语言模型',
        body: '翻译被定义成"给定原文 x，逐词生成译文 y"的条件概率问题。整句概率拆成每一步条件概率的连乘，每一步都以前文和上下文向量 c 为条件。这个"链式分解"就是大模型逐 token 生成的思想源头——今天的 GPT 依然是这个公式的形状，只是条件更丰富了。',
        formula: 'P(y₁, …, y_M | x) = Πₜ P(yₜ | y₁, …, y_{t−1}, c)',
        formulaNote: '<ul><li><b>x</b>：原文 token 序列（中文句）</li><li><b>c</b>：上下文向量 = 编码器最终隐状态，即那只"行李箱"</li><li><b>yₜ</b>：要生成的第 t 个译文词</li><li><b>Π 连乘</b>：整句概率 = 各步条件概率相乘，所以任何一步概率低了，整句都被拖累</li><li><b>条件里的前缀</b>：每写一个词都把它拼进条件，这就是自回归（Autoregressive）生成</li></ul>'
      },
      {
        heading: '解码：自回归循环与训练/推理的不对称',
        body: '推理时每步选出概率最高的词（或按采样策略抽词，见 m7-02），把它拼回输入，再预测下一个，直到生成 <code>&lt;eos&gt;</code>。训练时靠 teacher forcing，所有位置的真实前缀一次性已知，损失可以并行算完；推理时没有参考答案，只能一步一步串行走。<b>"训练可并行、推理必须串行"的不对称，从 seq2seq 一路延续到今天的 LLM 推理系统（m7-01）</b>。',
        formula: '训练输入：c + 真实前缀 [y₁ … y_{t−1}]　｜　推理输入：c + 模型自产前缀 [ŷ₁ … ŷ_{t−1}]',
        formulaNote: '<ul><li><b>训练行</b>：teacher forcing——永远喂标准答案的上一个词，稳定、收敛快、可并行</li><li><b>推理行</b>：ŷ 是模型自己生成的，没有标准答案可抄，只能自回归串行</li><li><b>不一致的后果</b>：训练时没见过自己的错误输出，推理时一步小错可能滚雪球（exposure bias）</li><li><b>面试问法</b>："什么是 teacher forcing？好处和副作用各是什么？"</li></ul>'
      },
      {
        heading: '里程碑与它的天花板',
        body: 'Sutskever 等（2014）用多层 LSTM 搭出端到端 seq2seq，在英法翻译上首次大幅超越精心拆零件的统计机器翻译——"端到端"从此成为 NLP 的主流范式。但固定向量瓶颈如影随形：论文里也承认长句是弱项。修补路线有两条：把句子倒过来输入（缓解开头被遗忘）、以及更本质的——给每一步生成装上"回头看"的能力，即下一课的注意力机制。'
      }
    ],
    animation: {
      title: '行李箱流水线：一步步看信息怎么被压扁',
      html: '<div class="anim-m4-03"><div class="anim-m4-03-ctrl"><button class="anim-m4-03-next" type="button">下一步</button><button class="anim-m4-03-reset" type="button">重置</button></div><div class="anim-m4-03-cap"></div><div class="anim-m4-03-lab">原文（编码器输入）</div><div class="anim-m4-03-src"></div><div class="anim-m4-03-lab">上下文向量 c（固定大小的"行李箱"）</div><div class="anim-m4-03-boxrow"><div class="anim-m4-03-box"><div class="anim-m4-03-fill"></div></div><span class="anim-m4-03-boxnote"></span></div><div class="anim-m4-03-lab">译文（解码器输出）</div><div class="anim-m4-03-out"></div></div>',
      css: '.anim-m4-03 { font-size: 13px; }\n.anim-m4-03-ctrl { display: flex; gap: 8px; margin-bottom: 8px; }\n.anim-m4-03-ctrl button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m4-03-cap { min-height: 20px; margin-bottom: 8px; color: #334155; font-weight: 600; }\n.anim-m4-03-lab { font-size: 12px; color: #64748b; margin: 4px 0; }\n.anim-m4-03-src, .anim-m4-03-out { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }\n.anim-m4-03-tok { padding: 4px 10px; border-radius: 6px; background: #e2e8f0; transition: background .4s ease, color .4s ease, transform .4s ease; }\n.anim-m4-03-cur { background: #14b8a6; color: #fff; transform: translateY(-4px); }\n.anim-m4-03-done { background: #99f6e4; }\n.anim-m4-03-eos { background: #fbbf24; }\n.anim-m4-03-boxrow { display: flex; align-items: center; gap: 10px; }\n.anim-m4-03-box { width: 220px; height: 18px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 9px; overflow: hidden; }\n.anim-m4-03-fill { height: 100%; width: 0; background: #14b8a6; border-radius: 9px; transition: width .5s ease; }\n.anim-m4-03-boxnote { font-size: 12px; color: #64748b; }',
      js: function (root) {
        var src = ['我', '喜欢', '机器', '学习'];
        var tgt = ['I', 'love', 'machine', 'learning'];
        var idx = 0;
        var cap = root.querySelector('.anim-m4-03-cap');
        var srcBox = root.querySelector('.anim-m4-03-src');
        var outBox = root.querySelector('.anim-m4-03-out');
        var fill = root.querySelector('.anim-m4-03-fill');
        var note = root.querySelector('.anim-m4-03-boxnote');
        var nextBtn = root.querySelector('.anim-m4-03-next');
        var resetBtn = root.querySelector('.anim-m4-03-reset');
        if (!cap || !srcBox || !outBox || !fill || !nextBtn) { return; }
        function chips(list, clsOf) {
          return list.map(function (w, i) {
            return '<span class="anim-m4-03-tok ' + clsOf(i) + '">' + w + '</span>';
          }).join('');
        }
        function render() {
          var encRead = Math.min(idx, src.length);
          var decCount = idx >= 6 ? idx - 5 : 0;
          srcBox.innerHTML = chips(src, function (i) {
            if (idx >= 1 && idx <= src.length && i === idx - 1) { return 'anim-m4-03-cur'; }
            return i < encRead ? 'anim-m4-03-done' : '';
          });
          var outHtml = chips(tgt.slice(0, decCount), function () { return 'anim-m4-03-done'; });
          if (idx >= 10) { outHtml += '<span class="anim-m4-03-tok anim-m4-03-eos">&lt;eos&gt;</span>'; }
          outBox.innerHTML = outHtml;
          fill.style.width = (encRead / src.length * 100) + '%';
          if (idx === 0) { cap.textContent = '点「下一步」，开始翻译「我喜欢机器学习」'; }
          else if (idx <= src.length) { cap.textContent = '编码器读入第 ' + idx + '/' + src.length + ' 个词「' + src[idx - 1] + '」，隐状态一路更新'; }
          else if (idx === 5) { cap.textContent = '读完了！最终隐状态压缩成上下文向量 c——整句话被塞进一只固定大小的行李箱'; }
          else if (idx <= 9) { cap.textContent = '解码器依据 c 和已生成词，写出第 ' + (idx - 5) + ' 个词「' + tgt[idx - 6] + '」'; }
          else { cap.textContent = '输出结束符 eos，翻译完成。注意：无论原句多长，c 都一样大——句子越长箱子越挤，这正是下一课注意力要修的"信息瓶颈"'; }
          note.textContent = idx >= 5 ? '4 个词 → 1 个固定长度向量；50 个词也是它，这就是瓶颈' : '编码进度决定箱子的"装填量"';
        }
        nextBtn.addEventListener('click', function () {
          if (idx < 10) { idx++; render(); }
        });
        if (resetBtn) {
          resetBtn.addEventListener('click', function () { idx = 0; render(); });
        }
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'seq2seq 模型中，编码器（Encoder）的主要职责是？',
        options: ['把输入序列压缩成一个包含全句信息的上下文向量', '逐词生成输出序列', '统计词频、构建词表', '计算 BLEU 分数'],
        answer: 0,
        explanation: '编码器负责"读"：把不定长的输入序列逐步编码，最终压缩为一个固定长度的上下文向量，交给解码器。B 是解码器的活；C 是分词/预处理阶段的事（m4-01）；D 是事后评估指标（m4-05）。记住分工口诀：编码器读、解码器写、上下文向量是中间的行李箱。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'teacher forcing 指的是：训练解码器时，把模型自己上一步生成的词作为下一步的输入。',
        answer: false,
        explanation: '说反了。teacher forcing 是训练时<b>直接喂真实译文</b>的上一个词（像老师扶着手腕写字），不管模型自己生成了什么；用模型自己的输出接龙，是推理时的自回归做法。teacher forcing 让训练稳定、收敛快且可并行，副作用是训练/推理输入分布不一致（exposure bias）。这是高频口误题：把"自回归"当成 teacher forcing 就错了。'
      },
      {
        type: 'order', difficulty: 3,
        question: '把神经机器翻译一次完整推理的五个步骤按正确顺序排列：',
        items: ['解码器结合上下文向量与已生成的词，预测下一个词', '原文先经过分词，变成 token 序列', '编码器逐个读入 token，隐状态不断更新', '重复上一步，直到生成结束符 eos', '最后一个隐状态被压缩成上下文向量'],
        answer: [1, 2, 4, 0, 3],
        explanation: '正确顺序：分词（下标 1）→ 编码器逐词读入（2）→ 压缩成上下文向量（4）→ 解码器开始逐词预测（0）→ 循环直到 eos（3）。常见误区：还没编码就开始解码（没有行李箱可依据），或把"压缩上下文向量"和"读入"混为一步（压缩发生在读完之后）。这条流水线顺序是面试流程题的经典素材。'
      }
    ],
    relations: {
      prerequisites: ['m3-07', 'm4-02'],
      successors: ['m4-04', 'm4-05'],
      confusables: [
        { other: 'm3-07', tip: 'RNN/LSTM 是"零件"（如何逐步读序列、如何记住长期信息），seq2seq 是用零件搭成的"整机"（编码器 + 解码器完成序列到序列的转换）。面试别把两者当同一层级：问架构答零件、或问零件答架构，都显得概念不清。' },
        { other: 'm4-04', tip: '本课的上下文向量 c 全句只有一个、整场翻译共用（一只行李箱）；下一课注意力让每译一个词都现算一个专属 cₜ（随时翻原文）。区分"一个 c"与"每步一个 cₜ"，就抓住了信息瓶颈问题的解法。' }
      ]
    },
    memory: {
      mnemonic: '一读二压三写出；训练开卷抄答案，推理闭卷自己走。',
      selfTest: [
        { q: '为什么说固定长度的上下文向量是 seq2seq 的瓶颈？', a: '无论原文多长，全部信息都被压进同一个固定维度向量（如 512 维），信息必然有损；句子越长，开头和细节被挤掉得越多，长句翻译质量骤降。解决思路是不做一次性压缩、按需回看原文——即注意力机制（m4-04）。' },
        { q: 'teacher forcing 是什么？好处和副作用各是什么？', a: '训练解码器时，每步输入用真实译文的上一个词，而不是模型自己的输出。好处：训练信号干净、收敛快、所有位置可并行计算损失；副作用：训练时从没见过自己的错误输出，推理时自回归输入与训练分布不一致，小错误会累积（exposure bias）。' },
        { q: '为什么 seq2seq 训练可以并行、推理必须串行？', a: '训练时用 teacher forcing，所有位置的真实前缀已知，各位置损失可同时算；推理时没有参考答案，必须先有第 t−1 个输出才能算第 t 个，只能自回归一步步走。这个不对称延续到今天的 LLM，是推理优化（KV Cache、m7-01）存在的原因。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：seq2seq 是怎么把中文翻成英文的？',
      reference: '先让一个"阅读器"把整句中文读压缩成一段摘要（像塞进一只小行李箱），再让一个"写作器"看着摘要一个词一个词把英文写出来；句子一长，箱子装不下，就成了最大的短板。'
    }
  },
  {
    id: 'm4-04',
    title: '注意力机制的起源',
    oneLiner: '把合上的书翻开：翻译时随时回头查原文',
    estMinutes: 12,
    analogy: {
      title: '从凭记忆到开卷考试',
      body: '上一课的译员把要点塞进行李箱后，就开始凭记忆翻译——箱子小、句子长，难免丢信息。换一个思路：干脆允许他<b>把原文摊开在桌上</b>，每写一个英文词，先扫一眼原文，把目光聚焦在最相关的几个中文词上，抄其要点再落笔。这就是<b>注意力机制（Attention）</b>（Bahdanau、Cho、Bengio，ICLR 2015）。关键是"聚焦"不是非此即彼：每个原文词都分到一个关注度百分比，按比例取用信息；把这些关注度连起来看，恰好就是中英词之间的<b>对齐（Alignment）</b>关系。'
    },
    intuition: [
      { heading: '每个输出词，都有专属的一次"回头看"', body: '译到 "language" 时，目光几乎全落在"语言"上；译到 "processing" 时看向"处理"。上下文向量不再是一个 c 用到底，而是<b>每一步现算一个 cₜ</b>——行李箱被换成了摊开的原文，随时可查。这直接解决了"句子越长箱子越挤"的瓶颈。' },
      { heading: '权重怎么来：先打分、再归一', body: '回头看也要有个章法。一个小的打分网络给"当前解码器状态"和"每个原文位置"的匹配程度打分（分数越高越相关）；再把所有分数过一遍 softmax，变成一组加起来等于 1 的<b>注意力权重</b>。最后按权重把原文各位置的信息加权平均，得到本步的上下文向量 cₜ。' },
      { heading: '副产品：对齐可视化', body: '把每一步的权重画成热力图，行是译文词、列是原文词，亮块连成的对角线就是"谁翻译自谁"的软对齐图——翻译过程第一次变得可解释。更重要的是，这套"打分—加权—取用"的通用套路后来被搬进句子内部让词与词互相关注，就变成了 Transformer 的自注意力（m5-01）。' }
    ],
    principle: [
      {
        heading: '加性注意力：用小网络打分',
        body: 'Bahdanau 等人（ICLR 2015）的打分函数叫<b>加性注意力（Additive Attention）</b>：把解码器当前状态和编码器各位置状态分别做线性变换后相加，过一个 tanh 压缩，再用一个向量 v 压成一个分数。"加性"得名于两个状态"先变换、再相加"的组合方式。它的意义在于给出了通用的打分框架——后来高效得多的点积打分（m5-01）是同一思想的不同实现。',
        formula: 'eₜᵢ = vᵀ · tanh(W₁·sₜ₋₁ + W₂·hᵢ)',
        formulaNote: '<ul><li><b>sₜ₋₁</b>：解码器此刻的状态，代表"我现在想写什么"</li><li><b>hᵢ</b>：编码器第 i 个位置的隐藏状态，代表"原文这里有什么"</li><li><b>W₁、W₂</b>：两把不同的尺子，把两种状态量到同一空间再相加</li><li><b>tanh</b>：把相加结果压到 −1~1，做非线性混合</li><li><b>vᵀ</b>：一个打分向量，把混合结果压成单一分数 eₜᵢ——第 i 个原文位置对第 t 步的相关分</li></ul>'
      },
      {
        heading: 'softmax 归一 + 加权求和',
        body: '分数本身没有统一量纲，要先用 softmax 归一成"关注度百分比"：分数越高的位置权重越大，所有权重加起来恰好为 1。然后拿权重对原文各位置向量加权求和，得到本步专属的上下文向量 cₜ，和解码器状态一起用于预测下一个词。直觉：cₜ 是"按关注度调配的一勺原文信息"。',
        formula: 'αₜᵢ = exp(eₜᵢ) / Σⱼ exp(eₜⱼ)　；　cₜ = Σᵢ αₜᵢ · hᵢ',
        formulaNote: '<ul><li><b>exp / Σ</b>：softmax（见 m1-06），把任意分数变成非负、总和为 1 的权重</li><li><b>αₜᵢ</b>：第 t 步对第 i 个原文词的关注度，如 0.92 表示"九成目光在这里"</li><li><b>cₜ</b>：加权平均出的第 t 步上下文向量——和 m4-03 的区别：c 有了下标，每步一个</li><li><b>和为 1 的意义</b>：注意力是"加权平均"而不是"挑选"，每个源词都多少被看一点（软对齐）</li></ul>'
      },
      {
        heading: '面试必答：注意力为什么解决了信息瓶颈',
        body: '标准答案分三层：① 信息不再预先压缩成一个点，原文每个位置都保留着自己的完整向量 hᵢ，"档案"全摊在桌上；② 每个解码步按需取用，长句后半段依然能精准回看开头；③ 一步生成立刻可以访问全部 N 个位置，信息通路从 1 条变成 N 条。Bahdanau 论文中注意力模型在长句上的优势正来自这里。但也注意它的残留问题：底层仍是 RNN，必须逐位读、逐步写，没法并行——这是 m5 Transformer 要解决的下一个瓶颈。'
      }
    ],
    animation: {
      title: '对齐打分器：看 softmax 怎么分配目光',
      html: '<div class="anim-m4-04"><div class="anim-m4-04-ctrl"><label>当前要译的英文词 <select class="anim-m4-04-target"><option value="0">love</option><option value="1">natural</option><option value="2">language</option><option value="3">processing</option></select></label><label>打分尖锐度 <input class="anim-m4-04-temp" type="range" min="0.2" max="4" step="0.2" value="1"> <span class="anim-m4-04-tval">1.0</span></label></div><p class="anim-m4-04-note">源句：<b>我 热爱 自然 语言 处理</b>。下方是打分网络给每个源词的分（加性注意力 eₜᵢ），softmax 后变成关注度：</p><div class="anim-m4-04-rows"></div><div class="anim-m4-04-sum"></div></div>',
      css: '.anim-m4-04 { font-size: 13px; }\n.anim-m4-04-ctrl { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; margin-bottom: 8px; }\n.anim-m4-04-ctrl select { padding: 2px 6px; }\n.anim-m4-04-note { margin: 0 0 8px; color: #64748b; }\n.anim-m4-04-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }\n.anim-m4-04-word { width: 48px; text-align: center; padding: 3px 0; background: #f1f5f9; border-radius: 6px; transition: background .3s ease, color .3s ease; }\n.anim-m4-04-top { background: #14b8a6; color: #fff; font-weight: 700; }\n.anim-m4-04-score { width: 40px; font-family: monospace; color: #334155; }\n.anim-m4-04-barwrap { flex: 1; height: 14px; background: #eef2f7; border-radius: 7px; overflow: hidden; }\n.anim-m4-04-bar { height: 100%; width: 0; background: #14b8a6; border-radius: 7px; transition: width .4s ease; }\n.anim-m4-04-pct { width: 52px; font-family: monospace; color: #475569; }\n.anim-m4-04-sum { font-family: monospace; font-size: 12px; color: #0f766e; margin-top: 6px; }',
      js: function (root) {
        var srcs = ['我', '热爱', '自然', '语言', '处理'];
        var keys = ['love', 'natural', 'language', 'processing'];
        var scores = {
          love: [5.0, 3.8, 0.2, 0.1, 0.1],
          natural: [0.1, 0.3, 4.6, 2.8, 0.2],
          language: [0.0, 0.2, 2.2, 4.9, 0.8],
          processing: [0.0, 0.2, 0.6, 1.9, 5.2]
        };
        var sel = root.querySelector('.anim-m4-04-target');
        var temp = root.querySelector('.anim-m4-04-temp');
        var tval = root.querySelector('.anim-m4-04-tval');
        var rowsBox = root.querySelector('.anim-m4-04-rows');
        var sumBox = root.querySelector('.anim-m4-04-sum');
        if (!sel || !temp || !rowsBox || !sumBox) { return; }
        function softmax(scoresArr, t) {
          var mx = Math.max.apply(null, scoresArr.map(function (s) { return s * t; }));
          var exps = scoresArr.map(function (s) { return Math.exp(s * t - mx); });
          var sum = exps.reduce(function (a, b) { return a + b; }, 0);
          return exps.map(function (e) { return e / sum; });
        }
        function render() {
          var t = Number(temp.value);
          var name = keys[Number(sel.value)];
          var w = softmax(scores[name], t);
          var top = 0;
          w.forEach(function (p, i) { if (p > w[top]) { top = i; } });
          var html = '';
          srcs.forEach(function (word, i) {
            html += '<div class="anim-m4-04-row">' +
              '<span class="anim-m4-04-word' + (i === top ? ' anim-m4-04-top' : '') + '">' + word + '</span>' +
              '<span class="anim-m4-04-score">' + scores[name][i].toFixed(1) + '</span>' +
              '<span class="anim-m4-04-barwrap"><span class="anim-m4-04-bar" style="width:' + (w[i] * 100).toFixed(1) + '%"></span></span>' +
              '<span class="anim-m4-04-pct">' + (w[i] * 100).toFixed(1) + '%</span></div>';
          });
          rowsBox.innerHTML = html;
          var s = w.reduce(function (a, b) { return a + b; }, 0);
          sumBox.innerHTML = '权重之和 = ' + s.toFixed(2) + '（softmax 保证恒为 1）；目光最集中的源词：「' + srcs[top] + '」（' + (w[top] * 100).toFixed(1) + '%）——这就是本步的对齐目标。' +
            (t >= 2.6 ? '尖锐度调高：分数差距被放大，接近"硬对齐"。' : (t <= 0.4 ? '尖锐度调低：权重趋于平均，像"每个词都扫一眼"。' : ''));
        }
        sel.addEventListener('change', render);
        temp.addEventListener('input', function () {
          if (tval) { tval.textContent = Number(temp.value).toFixed(1); }
          render();
        });
        if (tval) { tval.textContent = Number(temp.value).toFixed(1); }
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '注意力机制最早是为了解决 seq2seq 的什么问题？',
        options: ['固定长度上下文向量的信息瓶颈', '分词粒度太粗', '词向量维度太高', '学习率难以设置'],
        answer: 0,
        explanation: 'Bahdanau 等（ICLR 2015）提出注意力的动机非常明确：编码器把整句压进一个固定向量，长句信息装不下。注意力让解码器每步直接访问编码器所有位置、按权重取信息，绕开了"一次性压缩"。B 是分词问题（m4-01）；C 与词嵌入设计有关；D 是优化问题（m3-03）。面试常考这条问题→方案的因果链。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '每个解码步的注意力权重 αₜᵢ 都是非负的，且对所有源词求和恰好等于 1。',
        answer: true,
        explanation: '注意力权重由 softmax 归一化而来：指数函数保证非负，除以总和保证加起来为 1。由此可知注意力本质是"加权平均"而非"挑选"——每个源词都会分到一点权重，只是多少不同（所以叫软对齐 soft alignment，区别于硬性地一对一挑词）。常见误区：以为注意力是"只选最相关的一个词"，那是硬注意力，实践中少用。'
      },
      {
        type: 'fill', difficulty: 3,
        question: '第 t 步的上下文向量 cₜ = Σᵢ αₜᵢ · hᵢ，其中 αₜᵢ 是第 t 步对第 i 个源词的____（经 softmax 归一化，非负且总和为 1）。',
        accept: ['权重', '注意力权重', 'attention权重', '权值', '关注度'],
        explanation: 'αₜᵢ 是注意力权重：由打分网络给出的原始分数 eₜᵢ 经 softmax 归一化得到，非负、总和为 1；cₜ 就是拿这些权重对编码器各位置向量 hᵢ 做加权平均。填"概率"不严谨——它只满足分布的数学形式，语义上是"关注度/对齐程度"。面试考点：能徒手写出"打分 → softmax → 加权求和"三步链条。'
      }
    ],
    relations: {
      prerequisites: ['m4-03'],
      successors: ['m5-01'],
      confusables: [
        { other: 'm5-01', tip: 'Bahdanau 注意力发生在"解码器与编码器之间"（译英文时看中文原文），目的是对齐；自注意力（m5-01）让"句子内部的词互相看"，目的是每个词融合上下文。前者是翻译的补丁，后者是 Transformer 的核心零件——面试爱考这个演进关系。' },
        { other: 'm4-03', tip: '无注意力的 seq2seq 整句共用一个 c（一只行李箱装到底）；注意力版每一步现算一个专属 cₜ（随时翻原文）。记住下标之差：c → cₜ，就是"信息瓶颈被解决"的标志。' }
      ]
    },
    memory: {
      mnemonic: '先打分，再归一，按关注度取原文；一步一词一个 cₜ。',
      selfTest: [
        { q: '加性注意力的"加性"体现在哪里？', a: '打分函数 e = vᵀ·tanh(W₁s + W₂h) 中，解码器状态 s 与编码器状态 h 先各自做线性变换再"相加"，然后压成一个分数——组合方式是加法，故名加性注意力。对比后来 Transformer 的点积注意力（Q·K），是同一思想的不同打分实现。' },
        { q: '为什么注意力权重能画成"对齐图"？', a: '第 t 步的权重行 αₜ 指出"译这个词时主要在看哪些源词"，把所有步的权重行叠成矩阵，亮块连成的路径就是软对齐关系（language ↔ 语言、processing ↔ 处理）。对齐不是人工标注的，是训练任务逼出来的副产品，因此翻译过程变得可解释。' },
        { q: '注意力解决了信息瓶颈，那还剩什么问题？', a: '底层仍是 RNN：编码器必须逐位读、解码器必须逐步写，串行依赖导致无法大规模并行，长程信息仍要经过多步传递。把"回头看"从编码器-解码器之间搬进句子内部、并让全部位置并行计算，就是 m5 的 Transformer/自注意力。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：注意力机制做了什么？',
      reference: '翻译每个词时不再死记全句，而是回头扫一眼原文，把注意力集中到最相关的几个词上、按重要程度抄要点——相当于把"闭卷凭记忆"升级成了"开卷查资料"。'
    }
  },
  {
    id: 'm4-05',
    title: '语言模型评估',
    oneLiner: '困惑度量纠结、BLEU 量重合：两个指标的算法与局限',
    estMinutes: 10,
    analogy: {
      title: '猜词游戏的纠结程度与"找相同"阅卷',
      body: '想象两个小游戏。第一个：朋友写句子让你猜下一个词——你每次都胸有成竹，说明你"不纠结"；你越纠结，说明心里悬着的候选越多。<b>困惑度（Perplexity, PPL）</b>就是语言模型的"平均纠结程度"，考的是<b>模型本身</b>。第二个：你翻译完一段话，老师拿标准译文跟你"找相同"，重合的关键词组越多分越高——这就是 <b>BLEU</b>（Papineni 等，IBM，ACL 2002），考的是<b>生成结果</b>。一个量"过程准不准"，一个量"答案像不像"。'
    },
    intuition: [
      { heading: 'PPL：平均每个岔路口犹豫几个选项', body: 'PPL 可以理解为"模型心里的有效候选数"。模型笃定到每个词都给接近 1 的概率，PPL 接近 1（毫不纠结）；对 10 万词的词表均匀瞎猜，PPL 约等于 10 万（完全懵）；一个不错的语言模型通常在个位数到几百之间。注意方向：<b>PPL 越低越好</b>——它是少数"数值越小越值得庆祝"的指标。' },
      { heading: 'BLEU：和参考答案比 n-gram 重合', body: 'BLEU 把译文与一篇或多篇人工参考答案对齐：1-gram 看词有没有译对，2/3/4-gram 看搭配是否地道；各级精度做几何平均，再乘一个短句惩罚（防止只译半句骗高分）。取值 0~1，越高说明与参考越像。它便宜、快、语言无关，曾统治机器翻译评测十几年。' },
      { heading: '两者的局限（面试高频）', body: 'PPL 只关心"对真实文本的概率"，不懂语义好坏，而且<b>只有在相同测试集、相同分词方式下才可比</b>——换一个 tokenizer，数字立刻没法对表。BLEU 只看表面重合：同义改写得零分，而语义错误但用词相同的句子反而占便宜。所以现代 LLM 评估更多靠人工评测和"模型评模型"（见 m8-04），这是面试必聊的观点题。' }
    ],
    principle: [
      {
        heading: '困惑度：对数概率的指数还原',
        body: '困惑度建立在"给真实文本打分"上：模型逐词预测下文，把每个真实词的概率取对数、平均、再取负，得到平均负对数似然（也叫交叉熵，单位是比特）；用 2 的幂还原回去，就是困惑度。拆开看：模型给真实词的概率越接近 1，每个 log 项越接近 0，PPL 越接近 1。',
        formula: 'PPL = 2^{ −(1/N) · Σᵢ₌₁..N log₂ P(wᵢ | w₁ … w_{i−1}) }',
        formulaNote: '<ul><li><b>N</b>：测试文本的 token 总数</li><li><b>P(wᵢ | 前文)</b>：模型给第 i 个"真实出现的词"的概率，越高越好</li><li><b>log₂</b>：把连乘变连加，方便求平均（概率连乘会小到下溢）</li><li><b>负号</b>：概率取对数后是负数，加负号变成"损失"，供最小化</li><li><b>2 的幂</b>：指数还原回直观刻度——"平均相当于在几个候选里犹豫"</li><li><b>快速估算</b>：若模型对每个真实词都给概率 p，则 PPL ≈ 1/p；给 0.1 就是 PPL=10</li></ul>'
      },
      {
        heading: 'BLEU：n-gram 精度的几何平均 × 短句惩罚',
        body: '对每个 n（通常 1 到 4），统计候选译文里的 n-gram 有多少出现在参考答案里（同一段重复的词按参考中出现次数截断计数，防刷分），得到精度 pₙ。四个精度做几何平均——只要有一项拉胯，总分就被拖下去，逼着译文"又用词准确又搭配地道"。最后乘短句惩罚 BP：译文比参考短，就按长度比例打折。',
        formula: 'BLEU = BP × (p₁ · p₂ · p₃ · p₄)^{1/4}　，　BP = min(1, e^{1 − r/c})',
        formulaNote: '<ul><li><b>pₙ</b>：n-gram 修正精度——候选里的 n-gram 有多少出现在参考中（重复词截断计数）</li><li><b>几何平均 (…)^{1/4}</b>：任何一级精度低都会重挫总分，防止"堆高频词"拿高分</li><li><b>r / c</b>：参考译文长度 / 候选译文长度（按 token 数）</li><li><b>BP 短句惩罚</b>：c ≥ r 时 BP=1 不罚；c 越短罚得越狠——防止"只译半句"骗取高精度</li><li><b>取值</b>：0~1，越高越像参考；它是"像不像"的代理，不是"对不对"的度量</li></ul>'
      },
      {
        heading: '怎么用、何时失效：面试标准话术',
        body: 'PPL 的正当用途：训练监控（loss 是否还在降）、相同条件下的模型横向比较。BLEU 的正当用途：机器翻译等"答案相对固定"的任务的粗筛。失效场景要说全：① 换 tokenizer/测试集后 PPL 不可比；② 开放式生成（对话、摘要、创意写作）没有唯一参考，BLEU 与人评相关性差；③ 两者都不懂语义。面试一句话总结："统计指标便宜但不聪明，语义任务最终要靠人或更强的模型来评（m8-04）。"'
      }
    ],
    animation: {
      title: '评估双实验台：PPL 感受器 + BLEU 批卷机',
      html: '<div class="anim-m4-05"><div class="anim-m4-05-tabs"><button class="anim-m4-05-tabppl anim-m4-05-on" type="button">① 困惑度感受器</button><button class="anim-m4-05-tabbleu" type="button">② BLEU 批卷机</button></div><div class="anim-m4-05-ppl"><p class="anim-m4-05-note">模型要猜「今天天气真 ____」，正确答案是"好"。点选它心里的概率分布：</p><div class="anim-m4-05-pplbtns"><button class="anim-m4-05-sure" type="button">笃定：p=0.95</button><button class="anim-m4-05-mid" type="button">较自信：p=0.6</button><button class="anim-m4-05-vague" type="button">纠结：p=0.25</button></div><div class="anim-m4-05-pplbar"><div class="anim-m4-05-pplfill"></div></div><div class="anim-m4-05-pplout"></div></div><div class="anim-m4-05-bleu" style="display:none"><p class="anim-m4-05-ref">参考：the cat sat on the mat（6 词）</p><p class="anim-m4-05-cand">译文：the cat on the mat（5 词，漏了 sat）</p><div class="anim-m4-05-btns"><button class="anim-m4-05-step" type="button">下一步</button><button class="anim-m4-05-reset" type="button">重置</button></div><div class="anim-m4-05-stage"></div><div class="anim-m4-05-out"></div></div></div>',
      css: '.anim-m4-05 { font-size: 13px; }\n.anim-m4-05-tabs { display: flex; gap: 8px; margin-bottom: 10px; }\n.anim-m4-05-tabs button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m4-05-on { background: #14b8a6; color: #fff; border-color: #14b8a6; }\n.anim-m4-05-note { margin: 0 0 8px; color: #334155; }\n.anim-m4-05-pplbtns { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }\n.anim-m4-05-pplbtns button { padding: 4px 10px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m4-05-pplbar { height: 16px; background: #eef2f7; border-radius: 8px; overflow: hidden; margin-bottom: 8px; }\n.anim-m4-05-pplfill { height: 100%; width: 0; background: #14b8a6; border-radius: 8px; transition: width .5s ease, background .5s ease; }\n.anim-m4-05-pplout { font-family: monospace; font-size: 12px; color: #0f766e; line-height: 1.8; }\n.anim-m4-05-ref, .anim-m4-05-cand { margin: 0 0 6px; font-family: monospace; color: #334155; }\n.anim-m4-05-btns { display: flex; gap: 8px; margin-bottom: 8px; }\n.anim-m4-05-btns button { padding: 4px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }\n.anim-m4-05-stage { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }\n.anim-m4-05-tok { padding: 3px 8px; border-radius: 5px; background: #e2e8f0; font-family: monospace; transition: background .3s ease, color .3s ease; }\n.anim-m4-05-hit { background: #14b8a6; color: #fff; }\n.anim-m4-05-miss { background: #fecaca; color: #7f1d1d; }\n.anim-m4-05-out { font-family: monospace; font-size: 12px; color: #0f766e; line-height: 1.8; min-height: 36px; }',
      js: function (root) {
        var tabPpl = root.querySelector('.anim-m4-05-tabppl');
        var tabBleu = root.querySelector('.anim-m4-05-tabbleu');
        var pnlPpl = root.querySelector('.anim-m4-05-ppl');
        var pnlBleu = root.querySelector('.anim-m4-05-bleu');
        var pplFill = root.querySelector('.anim-m4-05-pplfill');
        var pplOut = root.querySelector('.anim-m4-05-pplout');
        var stage = root.querySelector('.anim-m4-05-stage');
        var out = root.querySelector('.anim-m4-05-out');
        var stepBtn = root.querySelector('.anim-m4-05-step');
        var resetBtn = root.querySelector('.anim-m4-05-reset');
        function showPpl() {
          if (tabPpl) { tabPpl.classList.add('anim-m4-05-on'); }
          if (tabBleu) { tabBleu.classList.remove('anim-m4-05-on'); }
          if (pnlPpl) { pnlPpl.style.display = ''; }
          if (pnlBleu) { pnlBleu.style.display = 'none'; }
        }
        function showBleu() {
          if (tabBleu) { tabBleu.classList.add('anim-m4-05-on'); }
          if (tabPpl) { tabPpl.classList.remove('anim-m4-05-on'); }
          if (pnlBleu) { pnlBleu.style.display = ''; }
          if (pnlPpl) { pnlPpl.style.display = 'none'; }
        }
        if (tabPpl) { tabPpl.addEventListener('click', showPpl); }
        if (tabBleu) { tabBleu.addEventListener('click', showBleu); }
        function setPpl(p) {
          if (!pplFill || !pplOut) { return; }
          var ppl = 1 / p;
          pplFill.style.width = Math.min(100, Math.max(4, (ppl - 1) / 9 * 100)) + '%';
          pplFill.style.background = ppl < 2 ? '#22c55e' : (ppl < 3.5 ? '#f59e0b' : '#ef4444');
          pplOut.innerHTML = '给真实词的概率 p=' + p + ' → 交叉熵 = −log₂p = ' + (-Math.log2(p)).toFixed(2) + ' 比特<br>PPL = 1/p ≈ ' + ppl.toFixed(2) +
            '（平均相当于在 ' + ppl.toFixed(1) + ' 个候选里犹豫；刻度 1~10）<br>对照：10 万词表均匀瞎猜 → PPL = 100000，彻底懵';
        }
        var b1 = root.querySelector('.anim-m4-05-sure');
        var b2 = root.querySelector('.anim-m4-05-mid');
        var b3 = root.querySelector('.anim-m4-05-vague');
        if (b1) { b1.addEventListener('click', function () { showPpl(); setPpl(0.95); }); }
        if (b2) { b2.addEventListener('click', function () { showPpl(); setPpl(0.6); }); }
        if (b3) { b3.addEventListener('click', function () { showPpl(); setPpl(0.25); }); }
        var bleuIdx = 0;
        function tokHtml(list, hitArr) {
          return list.map(function (w, i) {
            return '<span class="anim-m4-05-tok ' + (hitArr[i] ? 'anim-m4-05-hit' : 'anim-m4-05-miss') + '">' + w + '</span>';
          }).join('');
        }
        function renderBleu() {
          if (!stage || !out) { return; }
          if (bleuIdx === 0) {
            stage.innerHTML = tokHtml(['the', 'cat', 'on', 'the', 'mat'], [false, false, false, false, false]);
            out.innerHTML = '点「下一步」逐步打分：先 1-gram，再 2-gram，再短句惩罚。';
          } else if (bleuIdx === 1) {
            stage.innerHTML = tokHtml(['the', 'cat', 'on', 'the', 'mat'], [true, true, true, true, true]);
            out.innerHTML = '① 1-gram：5 个词参考里全有（the 按参考出现 2 次截断计数）→ p₁ = 5/5 = 1.00';
          } else if (bleuIdx === 2) {
            stage.innerHTML = tokHtml(['the cat', 'cat on', 'on the', 'the mat'], [true, false, true, true]);
            out.innerHTML = '② 2-gram：the-cat ✓、cat-on ✗、on-the ✓、the-mat ✓ → p₂ = 3/4 = 0.75（漏译 sat 拆散了两个搭配）';
          } else if (bleuIdx === 3) {
            stage.innerHTML = 'c = 5 词，r = 6 词';
            out.innerHTML = '③ 短句惩罚：c &lt; r → BP = e^(1−6/5) = e^(−0.2) ≈ 0.82（译文偏短，打折）';
          } else {
            stage.innerHTML = 'BLEU ≈ 0.82 × (1.00 × 0.75)^(1/2) ≈ 0.71';
            out.innerHTML = '④ 只用 2 级演示（标准 BLEU 取 1~4 级几何平均）。只漏译一个词，分数就从满分掉到 0.71；译文更短会被罚得更狠。';
          }
        }
        if (stepBtn) { stepBtn.addEventListener('click', function () { if (bleuIdx < 4) { bleuIdx++; } renderBleu(); }); }
        if (resetBtn) { resetBtn.addEventListener('click', function () { bleuIdx = 0; renderBleu(); }); }
        setPpl(0.6);
        renderBleu();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '关于困惑度 PPL，下列说法正确的是？',
        options: ['PPL 越低，说明模型对真实文本的预测越"不纠结"，通常越好', 'PPL 越高，说明模型越聪明', 'PPL 是专门评价翻译质量的指标', '任何两个模型的 PPL 都可以直接比较大小'],
        answer: 0,
        explanation: 'PPL 是平均负对数似然的指数还原，直觉是"平均在几个候选里犹豫"，越低越好——A 对，B 恰好说反。C 张冠李戴：评译文重合的是 BLEU。D 是高频陷阱：PPL 只在<b>相同测试集、相同分词方式</b>下可比，换了 tokenizer 的两个模型 PPL 不可对表。面试考点就是 A 和 D 这两句话。'
      },
      {
        type: 'fill', difficulty: 2,
        question: 'BLEU = 短句惩罚 BP × n-gram 精度的几何平均，其中 BP 是为了防止候选译文比参考译文过____而虚高。',
        accept: ['短', '太短', '短句', '简短', '偏短', '短了'],
        explanation: 'BP（brevity penalty，短句惩罚）在候选长度 c 小于参考长度 r 时按 e^(1−r/c) 打折，c ≥ r 时为 1。若没有它，"只译半句"会让精度虚高——译得越少，越容易全中。这是 BLEU 设计里最容易被追问的细节：为什么精度还不够、非要补一个长度惩罚。'
      },
      {
        type: 'single', difficulty: 3,
        question: '某机器翻译系统把"猫坐在垫子上"译成"一只猫正坐在那块垫子之上"，语义很好，但 BLEU 分数很低。最主要的原因是？',
        options: ['BLEU 只统计表面 n-gram 重合，不懂语义等价，换一种说法就被重罚', 'BLEU 只能评价英文译文', '短句惩罚过严，导致所有译文都低分', 'BLEU 要求参考答案必须超过 4 个'],
        answer: 0,
        explanation: 'BLEU 的核心机制是与参考答案做 n-gram 表面重合统计：同义改写（一只/正/那块/之上）几乎没有重合 n-gram，分数自然低；反之，用词贴着参考但语义错误的译文反而可能得分不错。这就是"BLEU 不懂语义、只看表面"的标准考点，也是开放式生成任务转向人工评测与模型评模型（m8-04）的原因。B 无此限制；BP 只在译文偏短时生效（C）；BLEU 是 n 取 1~4，与参考答案个数无关（D）。'
      }
    ],
    relations: {
      prerequisites: ['m4-03'],
      successors: [],
      confusables: [
        { other: 'm8-04', tip: '本课的 PPL/BLEU 是自动统计指标：PPL 适合训练监控与同条件对比，BLEU 适合机器翻译粗筛；m8-04 讲 LLM 应用效果评估，开放式对话/摘要没有唯一参考，要靠人工与"模型评模型"。面试别说"上线产品也用 BLEU 把关"。' },
        { other: 'm2-06', tip: '传统 ML 的准确率/F1 评"分类对不对"——有唯一标准答案；PPL/BLEU 评"生成"——概率好不好、文本像不像，没有唯一答案。所以评生成任务不能直接套准确率，这是两套指标体系的分界线。' }
      ]
    },
    memory: {
      mnemonic: 'PPL 低=不纠结，BLEU 高=重合多；一个只看概率，一个只看表面。',
      selfTest: [
        { q: '为什么不同 tokenizer 的模型，PPL 不能直接比较？', a: 'PPL 按"每个 token 的平均负对数概率"计算。切分粒度不同，token 总数 N、每词的概率链都不同：切成更多小片段意味着要预测更多次、每次可能更"容易"。数字的含义依附于切分方式，所以跨 tokenizer、跨测试集的比较没有意义，只能同条件对比。' },
        { q: '写出 BP 的直觉：短句惩罚防的是什么？', a: '防"译得越少越准"的漏洞：候选越短，n-gram 越容易全中，精度虚高。BP 在候选长度 c 小于参考长度 r 时按 e^(1−r/c) 打折（越短罚越狠），c ≥ r 时不罚（长句精度天然会摊薄，不需要额外罚）。' },
        { q: '面试官问"BLEU 为什么不适合评 LLM 对话/摘要"，怎么答？', a: '三点：① 它只统计与参考的表面 n-gram 重合，不懂语义——好的同义改写得低分；② 开放式生成没有唯一标准答案，单一参考覆盖不了多样表达；③ 它与人评的相关性在创意/对话任务上很差。替代方案是人工评测与模型评模型（m8-04）。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：困惑度和 BLEU 分别在量什么？',
      reference: '困惑度量的是模型"写下下一个词之前有多纠结"，越低越好；BLEU 量的是生成文本与参考答案的关键词重合度，越高越好——但前者不懂语义，后者只认表面，都不能代替人的判断。'
    }
  }
  ]
});