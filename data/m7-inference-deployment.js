/* M7 推理与部署 —— 6 个知识点内容数据（契约见 docs/SCHEMA.md v1）
 * 事实核对：vLLM/PagedAttention（Kwon et al., SOSP 2023, arXiv:2309.06180，KV 浪费 60%~80%、吞吐 2~4 倍）；
 * GPTQ（Frantar et al., 2022, arXiv:2210.17323，Hessian 逐层 one-shot 量化）；AWQ（Lin et al., 2023, arXiv:2306.00978，按激活值保护约 1% 显著权重）；
 * KV 显存公式与 LLaMA-7B 数字（32 层 × 4096 维 × FP16 → 512 KB/token）为标准 MHA 推导。
 */
window.SITE_DATA.registerModule({
  module: 'M7',
  title: '推理与部署',
  icon: '🚀',
  color: '#10b981',
  lessons: [
  {
    id: 'm7-01',
    title: 'KV Cache',
    oneLiner: '自回归生成时复用旧 token 的 K/V，让每步只算"增量"',
    estMinutes: 14,
    analogy: {
      title: '课堂笔记：讲过的内容只记一遍',
      body: '想象你在听一位老师（大模型）逐词续写故事。已经讲过的几百个词，你在笔记本上记下了每个人的"提问要点 K"和"回答要点 V"；老师写下一个新词时，不需要把前文从头重新分析一遍——只需拿着新词的"提问 Q"去翻这份笔记，对照所有 K、加权取 V，就能接着写。而且<b>笔记永远不用重写</b>：后面的新词不会改变前面词的要点。这就是 KV Cache（键值缓存）：把算过的 K/V 存下来反复用，用一点显存空间，换掉大量重复计算。'
    },
    intuition: [
      { heading: '生成是"逐词接龙"，每步都要做注意力', body: '大模型写文章是自回归生成（Autoregressive Generation）：每次只产出 1 个新 token，把它接到句尾，再生成下一个。按 m5-01 的注意力公式，<b>每个新 token 都要和它前面的所有 token 做注意力</b>。如果每一步都把整句话从头算一遍，第 n 步就要重算 n 个 token 的 K/V——写到第 1000 个词时，竟要把前 999 个词的分析工作全部重做。' },
      { heading: '旧 token 的 K/V 永远不变，所以能缓存', body: '关键观察：在因果注意力（Causal Attention，每个 token 只能看前面）里，第 i 个 token 的 K 和 V 只由第 1~i 个 token 决定。新词追加在句尾，<b>不会改变任何旧 token 的输入</b>，所以旧 K/V 一旦算好就永远有效。Q 则不同：每来一个新词都要新算一份 Q 去"提问"。所以缓存的是 K 和 V，不是 Q——这是面试最爱追问的点。' },
      { heading: '空间换时间：长上下文为什么贵', body: 'KV Cache 是典型的空间换时间：缓存越厚（序列越长、并发越多），显存吃得越多。有了缓存，每步只需算"新 token 的 Q 与全部 K/V 打分"，把每步计算量从随 s² 膨胀压到随 s 线性；但 KV 显存随"序列长度 × batch"线性上涨——这就是长上下文、高并发场景显存吃紧、推理变贵的根本原因，也正是 m7-05 和 m7-06 两个后续课题要解决的问题。' }
    ],
    principle: [
      {
        heading: '从注意力公式看"谁会变"',
        body: '回扣 m5-01：注意力 = 新词的 Q 与所有位置的 K 打分，再对 V 加权求和。逐 token 生成时，序列在不断追加：K/V 只增不改，Q 每步全新。把"会变的"和"不变的"分开，缓存方案自然浮出水面——保留并追加 K/V，每步只处理新增的一行。数学结果与全量重算完全一致，它不是新算法，是工程优化。',
        formula: 'Attention(q_new, K, V) = softmax(K·q_new / √dₖ) · V',
        formulaNote: '<ul><li><b>q_new</b>：新 token 的查询向量——每步唯一要新算的"提问"（K/V 只追加不重算）</li><li><b>K、V</b>：全部已生成 token 的键、值矩阵，直接取自缓存，旧内容永不重算</li><li><b>√dₖ</b>：按键向量维度缩放，防止点积过大把 softmax 推向饱和（见 m5-01）</li><li>结果：对旧 token 的加权汇总，用来预测下一个词——与"每次全量重算"的输出一模一样，只是省了重复劳动</li></ul>'
      },
      {
        heading: 'KV Cache 的显存账',
        body: '缓存要实打实占显存，面试常要求现场估算。总账 = 每层每头的 K、V 两份 × 序列长度 × 并发数。以 LLaMA-7B（32 层、隐藏维 4096、FP16）为例：每个 token 的 KV 约为 2×32×4096×2 字节 = 512 KB；4K 上下文的单条请求就要约 2 GB——比很多人的直觉大得多，而权重也才 14 GB。',
        formula: 'KV显存 ≈ 2 × L × n_kv × d_head × s × b × 字节数',
        formulaNote: '<ul><li><b>2</b>：K 和 V 各存一份，天生乘 2</li><li><b>L</b>：Transformer 层数（7B 模型约 32 层），每层注意力都有自己的 K/V，都要缓存</li><li><b>n_kv × d_head</b>：键值头的总维度，普通多头注意力（MHA）下 ≈ 隐藏维 4096；GQA/MQA 可把它压小数倍</li><li><b>s</b>：序列长度（上下文），缓存随它线性涨</li><li><b>b</b>：batch（并发请求数），每条请求各有一份独立缓存</li><li><b>字节数</b>：FP16 每数 2 字节；对 KV 量化后还能再降</li></ul>'
      },
      {
        heading: 'prefill 与 decode：一次推理的两阶段',
        body: '面试加分点：一次推理分两段。<b>prefill（预填充）</b>：把用户输入的整段 prompt 一次性并行算完，建立初始 KV Cache，输出第一个词——它决定首 token 延迟；<b>decode（解码）</b>：之后每步只处理 1 个新 token、给缓存追加一列 K/V。prefill 是算力密集（大矩阵乘法，GPU 吃得饱），decode 是访存密集（每步都要把权重和缓存整个读一遍）——这个区别是理解 m7-06 批处理为什么能大幅提升吞吐的钥匙。'
      }
    ],
    animation: {
      title: '有无 KV Cache：一步步看省了多少计算',
      html: '<div class="anim-m7-01"><div class="anim-m7-01-tokens">已生成序列：今天</div><div class="anim-m7-01-btns"><button class="anim-m7-01-add" type="button">生成下一个词</button><button class="anim-m7-01-reset" type="button">重置</button></div><div class="anim-m7-01-panels"><div class="anim-m7-01-panel"><div class="anim-m7-01-ptitle">无缓存：每步全量重算 K/V</div><div class="anim-m7-01-cells anim-m7-01-nocache"></div><div class="anim-m7-01-count anim-m7-01-nccount"></div></div><div class="anim-m7-01-panel"><div class="anim-m7-01-ptitle">有 KV Cache：只算新词那份</div><div class="anim-m7-01-cells anim-m7-01-cache"></div><div class="anim-m7-01-count anim-m7-01-cacount"></div></div></div><div class="anim-m7-01-note"></div></div>',
      css: '.anim-m7-01 { font-size: 13px; }\n.anim-m7-01-tokens { font-family: monospace; margin: 6px 0; color: #065f46; }\n.anim-m7-01-btns { display: flex; gap: 8px; margin: 6px 0 10px; }\n.anim-m7-01-btns button { padding: 5px 12px; border: 1px solid #10b981; background: #ecfdf5; border-radius: 6px; cursor: pointer; }\n.anim-m7-01-panels { display: flex; gap: 10px; flex-wrap: wrap; }\n.anim-m7-01-panel { flex: 1 1 230px; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; }\n.anim-m7-01-ptitle { font-weight: 700; margin-bottom: 6px; color: #334155; }\n.anim-m7-01-cells { display: flex; flex-wrap: wrap; gap: 4px; min-height: 28px; }\n.anim-m7-01-cell { padding: 3px 6px; border-radius: 5px; background: #f1f5f9; border: 1px solid #cbd5e1; }\n.anim-m7-01-hot { animation: anim-m7-01-red .6s ease-out; border-color: #ef4444; }\n.anim-m7-01-newhot { animation: anim-m7-01-green .6s ease-out; border-color: #22c55e; }\n@keyframes anim-m7-01-red { from { background: #fecaca; transform: scale(1.12); } to { background: #f1f5f9; transform: scale(1); } }\n@keyframes anim-m7-01-green { from { background: #86efac; transform: scale(1.2); } to { background: #f1f5f9; transform: scale(1); } }\n.anim-m7-01-count { margin-top: 6px; color: #475569; }\n.anim-m7-01-note { margin-top: 8px; color: #334155; line-height: 1.6; }',
      js: function (root) {
        var words = ['今天', '天气', '真好', '，', '我们', '出去', '散步', '吧'];
        var n = 1;
        var tok = root.querySelector('.anim-m7-01-tokens');
        var note = root.querySelector('.anim-m7-01-note');
        function render() {
          tok.textContent = '已生成序列：' + words.slice(0, n).join('');
          var h1 = '';
          for (var i = 0; i < n; i++) h1 += '<span class="anim-m7-01-cell anim-m7-01-hot">' + words[i] + '</span>';
          root.querySelector('.anim-m7-01-nocache').innerHTML = h1;
          var h2 = '';
          for (var j = 0; j < n; j++) h2 += '<span class="anim-m7-01-cell' + (j === n - 1 ? ' anim-m7-01-newhot' : '') + '">' + words[j] + '</span>';
          root.querySelector('.anim-m7-01-cache').innerHTML = h2;
          var cumNo = n * (n + 1) / 2 - 1;
          root.querySelector('.anim-m7-01-nccount').textContent = '本步计算 ' + n + ' 次打分 · 累计 ' + cumNo + ' 次';
          root.querySelector('.anim-m7-01-cacount').textContent = '本步计算 1 次打分 · 累计 ' + (n - 1) + ' 次';
          note.textContent = '第 ' + n + ' 个新词“' + words[n - 1] + '”：无缓存要把全部 ' + n + ' 个位置的 K/V 重算一遍；有缓存只算它自己的 K/V，再拿新 Q 与缓存打分。本步省比 ' + n + ' : 1，序列越长省得越狠。';
        }
        root.querySelector('.anim-m7-01-add').addEventListener('click', function () {
          if (n < words.length) { n++; render(); }
          else note.textContent = '序列已到演示最大长度，点“重置”再走一遍，注意两边累计次数的差距。';
        });
        root.querySelector('.anim-m7-01-reset').addEventListener('click', function () { n = 1; render(); });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'KV Cache 缓存的是注意力机制里的哪些量？',
        options: ['每个已生成 token 在每层的 K（键）和 V（值）', '每个已生成 token 的 Q（查询）', '模型全部的权重矩阵', '分词前的原始文字'],
        answer: 0,
        explanation: '缓存对象是旧 token 的 K 和 V：因果注意力下它们只依赖前面的 token，新词追加后永不改变，算一次可反复用。Q 每步随新词变化、无复用价值；权重本来常驻显存、与"缓存"无关；缓存里存的是向量数值，不是文字。面试考点：为什么缓存 K/V 而不缓存 Q。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '有了 KV Cache 之后，生成新词时就不再需要和前面的 K/V 做注意力了。',
        answer: false,
        explanation: '注意力照做不误：新词的 Q 仍要与全部（旧 + 新）K/V 打分、加权求和。KV Cache 省的是"重新计算旧 token 的 K/V"这一步重复劳动，而不是跳过注意力本身。常见误区：把"省去重复计算"理解成"省去注意力"，面试时混淆这两点会显得对机制理解不牢。'
      },
      {
        type: 'fill', difficulty: 3,
        question: 'LLaMA-7B（32 层、隐藏维 4096）在 FP16 下，KV Cache 每新增 1 个 token 约增加 ____ KB（只填数字）。',
        accept: ['512', '512kb', '0.5mb', '524288'],
        explanation: '逐项代公式：2（K 与 V）× 32 层 × 4096 维 × 2 字节 = 524288 字节 = 512 KB/token。由此 4096 token 上下文单请求就是约 2 GB。面试考点：显存估算题必须能逐因子口算，注意"2"是 K+V 两份、字节数别用成 FP32 的 4。'
      }
    ],
    relations: {
      prerequisites: ['m5-01'],
      successors: ['m7-05', 'm7-06'],
      confusables: [
        { other: 'm5-01', tip: 'KV Cache 不改变注意力的数学结果，只是"算过的不重算"——它是工程优化而非新算法，公式仍是 softmax(QKᵀ/√dₖ)V。' },
        { other: 'm7-03', tip: 'KV Cache 是"用显存省时间"（缓存是投资），量化是"用精度省显存"（显存是预算）——两者方向相反，却常在部署方案里组合出现。' },
        { other: 'm9-04', tip: 'm9-04 手撕自注意力是"一次前向、全量矩阵"的视角；推理解码每步只有 1 个新 token 的 Q 进场，KV Cache 正是这种增量计算里的复用技巧。' }
      ]
    },
    memory: {
      mnemonic: 'K/V 只算一遍，新词只带 Q 来。',
      selfTest: [
        { q: '为什么旧 token 的 K/V 可以缓存，而 Q 不行？', a: '因果注意力下第 i 个 token 的 K/V 只依赖第 1~i 个 token，新词追加在后面不会改变它们，算一次永远有效；而 Q 是"当前词去提问"的向量，每生成一个新词都要重新算，没有可复用性。' },
        { q: 'KV Cache 让显存怎么涨？这解释了什么现象？', a: 'KV 显存 ≈ 2×层数×KV头维度×序列长×batch×字节数，随序列长度与并发数线性增长。这解释了长上下文服务贵、并发一高就显存溢出（OOM）的现象，也是 PagedAttention、GQA、KV 量化等技术的共同动机。' },
        { q: 'prefill 和 decode 分别在干什么？', a: 'prefill 把整段输入并行算一遍、建立初始 KV Cache（算力密集，决定 TTFT）；decode 每步只处理 1 个新 token、追加缓存并输出下一个词（访存密集，决定生成速度）。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：KV Cache 为什么能让 AI 聊天越聊越快？',
      reference: '就像做长数学题时把前面算好的结果抄在草稿纸边上：后面每一步只需拿新问题去对照这份"旧账"，而不是把整本账从头重算——多记一点笔记，省下大量重复劳动。'
    }
  },
  {
    id: 'm7-02',
    title: '采样策略',
    oneLiner: '用 temperature / top-k / top-p 三个旋钮控制模型"抽签"的随机性',
    estMinutes: 13,
    analogy: {
      title: '餐厅点单的三个旋钮',
      body: '大模型每写一个词之前，词表里每个候选词都领到一张"得分单"（概率分布），像服务员报菜：宫保鸡丁 50%、鱼香肉丝 25%、麻婆豆腐 15%……怎么从菜单里选一道？给你三个旋钮：<b>temperature</b> 是"胆量旋钮"，拧小只敢点最稳的那道，拧大敢猎奇；<b>top-k</b> 是"只看菜单前几名"；<b>top-p</b> 是"按得票从高到低凑够 p 成就停"，冷门菜直接划掉。三个旋钮一拧，同一个模型能从"背课文的学霸"切换成"即兴诗人"。'
    },
    intuition: [
      { heading: '模型输出的不是答案，是一张概率表', body: '回扣 m5-05：Transformer 最后一层接 softmax（见 m1-06），把词表里每个词的原始得分（logits）变成概率分布。训练时我们拿这张表与标准答案比对；<b>推理生成时则要从表里"抽"一个词</b>——怎么抽，就是解码策略/采样策略（Decoding / Sampling）。抽法不同，同一个模型可以一本正经，也可以天马行空。' },
      { heading: 'temperature：胆量旋钮', body: '做法是先给 logits 除以温度 T 再做 softmax：T 越小，词与词的分差被放大，概率越向最高分集中，模型越保守、确定；T 越大，分布被抹平，冷门词也有机会，输出越发散。<b>T 趋近 0 的极限就是贪心解码（Greedy）：每步永远拿概率第一的词</b>，输出完全确定，适合要复现的场合，但容易复读。' },
      { heading: 'top-k 与 top-p：两种"截胡"', body: '<b>top-k</b>：只保留得分最高的 k 个候选，其余置零、重新归一化后再抽。k 固定，不看分布形状——分布很尖时可能把没戏的候选拉进来，很平时又可能砍掉值得一看的。<b>top-p（核采样，Nucleus Sampling）</b>：把候选按概率从高到低累加，凑够 p（如 0.9）就截断——候选数自适应：模型很确定时候选寥寥几个，犹豫时多留几个，这是它比 top-k 更"懂随机"的地方。另配一个小工具：重复惩罚（Repetition Penalty），把已出现过的词的 logits 打折，专治复读机。' }
    ],
    principle: [
      {
        heading: '温度缩放：改的是分布的锐度',
        body: '温度不是加在概率上，而是加在 softmax 之前的 logits 上。除以 T 会整体拉伸或压缩分差：T < 1 拉大分差（赢者通吃），T > 1 压平分差（人人有份）。面试常问"temperature = 0 是什么"——数学上是 argmax，工程上用极小温度近似。',
        formula: 'P(i) = exp(zᵢ / T) / Σⱼ exp(zⱼ / T)',
        formulaNote: '<ul><li><b>zᵢ</b>：第 i 个候选词的原始得分（logits，softmax 前的数）</li><li><b>T</b>：温度，T 越小分布越尖（保守确定），T 越大越平（越发散）</li><li><b>exp / Σexp</b>：标准 softmax 归一化，把得分变成总和为 1 的概率（回扣 m1-06）</li><li><b>T → 0</b>：最高分者概率趋于 1，等价于贪心解码（每步取 argmax）</li></ul>'
      },
      {
        heading: 'top-k 与 top-p 的精确定义',
        body: '两者都是"先截断、再重归一化、后抽样"：把候选集外的词概率置零，在候选集内按原比例重新分配。区别只在候选集怎么定：top-k 按<b>排名个数</b>定，top-p 按<b>累计概率质量</b>定。工程上两者常叠加使用（先取 top-k 再在其中做 top-p），最后一步在同一候选集内按比例轮盘赌抽样。',
        formula: 'top-p：候选集 = 按概率从高到低累加、首次使 Σ P(i) ≥ p 的最小前缀',
        formulaNote: '<ul><li><b>从高到低排序</b>：先把所有候选词按概率降序排队，头部的词优先入组</li><li><b>累加 ≥ p</b>：逐个把概率加进来，刚凑够 p（如 0.9）就停，后面全部淘汰</li><li><b>最小前缀</b>：入组的词数是"刚好够"的——分布尖时候选可能只有一两个，分布平时自动放宽，这就是自适应</li><li><b>与 top-k 的差别</b>：top-k 固定人数（k 个），top-p 固定票仓（概率质量 p）</li></ul>'
      },
      {
        heading: '三个旋钮的场景化调法',
        body: '面试高频追问"实际怎么设"：<b>事实问答 / 代码补全</b>要稳——低温度（0~0.3）、小 top-k（如 5~20）或小 top-p（0.9），甚至直接贪心；<b>创意写作 / 头脑风暴</b>要活——温度 0.8~1.2、top-p 0.9~0.95；默认常见出发点是 T=1.0、top-p=0.9~1.0。答题框架：先说任务要"确定性"还是"多样性"，再选旋钮组合，并点一句"top-p 自适应候选数，通常比固定 k 更稳"。'
      }
    ],
    animation: {
      title: '三旋钮概率工坊：同一张概率表，抽出不同文风',
      html: '<div class="anim-m7-02"><div class="anim-m7-02-ctrl">temperature <input class="anim-m7-02-t" type="range" min="0.2" max="3" step="0.1" value="1"> <span class="anim-m7-02-tv">1.0</span>　top-k <input class="anim-m7-02-k" type="range" min="1" max="6" step="1" value="4"> <span class="anim-m7-02-kv">4</span>　top-p <input class="anim-m7-02-p" type="range" min="0.1" max="1" step="0.05" value="0.9"> <span class="anim-m7-02-pv">0.90</span> <button class="anim-m7-02-draw" type="button">抽一次</button></div><div class="anim-m7-02-list"></div><div class="anim-m7-02-msg">拖动滑块，观察每个候选"入围/淘汰"与抽中率的变化；再点"抽一次"看命运落谁家。</div></div>',
      css: '.anim-m7-02 { font-size: 13px; }\n.anim-m7-02-ctrl { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 10px; }\n.anim-m7-02-draw { padding: 4px 12px; border: 1px solid #10b981; background: #ecfdf5; border-radius: 6px; cursor: pointer; }\n.anim-m7-02-row { display: flex; align-items: center; gap: 8px; padding: 2px 4px; border-radius: 6px; transition: background .3s; }\n.anim-m7-02-w { width: 44px; }\n.anim-m7-02-track { flex: 1; height: 14px; background: #f1f5f9; border-radius: 7px; overflow: hidden; }\n.anim-m7-02-bar { height: 100%; width: 0; border-radius: 7px; transition: width .35s ease, background .35s ease; }\n.anim-m7-02-pn { width: 96px; color: #64748b; font-size: 12px; }\n.anim-m7-02-tag { width: 112px; font-size: 12px; }\n.anim-m7-02-msg { margin-top: 8px; color: #334155; line-height: 1.6; }',
      js: function (root) {
        var words = ['苹果', '香蕉', '樱桃', '葡萄', '西瓜', '榴莲'];
        var logits = [4.0, 2.8, 2.1, 1.2, 0.4, -0.8];
        var tEl = root.querySelector('.anim-m7-02-t');
        var kEl = root.querySelector('.anim-m7-02-k');
        var pEl = root.querySelector('.anim-m7-02-p');
        var tv = root.querySelector('.anim-m7-02-tv');
        var kv = root.querySelector('.anim-m7-02-kv');
        var pv = root.querySelector('.anim-m7-02-pv');
        var list = root.querySelector('.anim-m7-02-list');
        var msg = root.querySelector('.anim-m7-02-msg');
        var winner = -1;
        var html = '';
        for (var i = 0; i < words.length; i++) {
          html += '<div class="anim-m7-02-row"><span class="anim-m7-02-w">' + words[i] + '</span><div class="anim-m7-02-track"><div class="anim-m7-02-bar"></div></div><span class="anim-m7-02-pn"></span><span class="anim-m7-02-tag"></span></div>';
        }
        list.innerHTML = html;
        function softmaxT(T) {
          var mx = Math.max.apply(null, logits);
          var ex = logits.map(function (z) { return Math.exp((z - mx) / T); });
          var s = ex.reduce(function (a, b) { return a + b; }, 0);
          return ex.map(function (e) { return e / s; });
        }
        function isInSet(probs) {
          var order = probs.map(function (p, i) { return i; }).sort(function (a, b) { return probs[b] - probs[a]; });
          var k = Number(kEl.value), p = Number(pEl.value);
          var cum = 0, inP = {}, inK = {};
          for (var i = 0; i < order.length; i++) { inP[order[i]] = true; cum += probs[order[i]]; if (cum >= p) break; }
          for (var j = 0; j < k && j < order.length; j++) inK[order[j]] = true;
          return probs.map(function (_, i) { return !!(inP[i] && inK[i]); });
        }
        function render() {
          var T = Number(tEl.value);
          tv.textContent = T.toFixed(1);
          kv.textContent = kEl.value;
          pv.textContent = Number(pEl.value).toFixed(2);
          var probs = softmaxT(T);
          var isIn = isInSet(probs);
          var sum = 0;
          for (var i = 0; i < probs.length; i++) if (isIn[i]) sum += probs[i];
          var rows = root.querySelectorAll('.anim-m7-02-row');
          for (var r = 0; r < rows.length; r++) {
            var pct = isIn[r] ? probs[r] / sum * 100 : 0;
            var bar = rows[r].querySelector('.anim-m7-02-bar');
            bar.style.width = Math.max(2, pct) + '%';
            bar.style.background = isIn[r] ? '#10b981' : '#cbd5e1';
            rows[r].querySelector('.anim-m7-02-pn').textContent = '原始 ' + (probs[r] * 100).toFixed(1) + '%';
            var tag = rows[r].querySelector('.anim-m7-02-tag');
            tag.textContent = isIn[r] ? '入围 · 抽中率 ' + pct.toFixed(1) + '%' : '淘汰';
            tag.style.color = isIn[r] ? '#047857' : '#94a3b8';
            rows[r].style.background = r === winner ? '#d1fae5' : 'transparent';
          }
        }
        root.querySelector('.anim-m7-02-draw').addEventListener('click', function () {
          var T = Number(tEl.value);
          var probs = softmaxT(T);
          var isIn = isInSet(probs);
          var pool = [];
          for (var i = 0; i < probs.length; i++) if (isIn[i]) pool.push(i);
          var sum = 0;
          for (var j = 0; j < pool.length; j++) sum += probs[pool[j]];
          var x = Math.random() * sum;
          winner = pool[pool.length - 1];
          for (var m = 0; m < pool.length; m++) { x -= probs[pool[m]]; if (x <= 0) { winner = pool[m]; break; } }
          render();
          msg.textContent = '本轮抽中：' + words[winner] + '（temperature=' + T.toFixed(1) + '，候选 ' + pool.length + ' 个）。把 T 调小多抽几次，它几乎总是同一个词；把 T 调大，冷门词开始频繁爆冷。';
        });
        [tEl, kEl, pEl].forEach(function (el) { el.addEventListener('input', render); });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '把 temperature 从 1.0 调到 0.1，模型输出会怎样？',
        options: ['分布更尖锐，输出更保守、更确定', '分布更平坦，输出更天马行空', '候选词的个数变多', '概率表不变，只是抽签速度更快'],
        answer: 0,
        explanation: 'logits 除以更小的 T 会放大分差，softmax 后概率向最高分集中，输出趋于稳定复现。B 说的是调大温度的效果；候选个数由 top-k/top-p 决定，与温度无关（C 错）；温度只改变分布形状，与速度无关（D 错）。面试考点：温度是 softmax 之前对 logits 的缩放。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'top-k 与 top-p 的本质区别：top-k 固定候选"个数"，top-p 固定候选"概率质量"，因此 top-p 的候选数会随分布形状自适应。',
        answer: true,
        explanation: 'top-k 永远保留得分最高的 k 个，无论分布尖平；top-p 按"累计概率凑够 p 就停"截断——模型很确定时候选自动变少，犹豫时候选自动变多。所以分布尖锐场景下 top-p 通常更稳。常见误区：把两者说成"随机性大小"的差别，其实核心是候选集的确定方式不同。'
      },
      {
        type: 'code', difficulty: 3,
        question: '补全 top-k 采样函数：给定完整概率数组 probs 和保留个数 k，先排序截断前 k 名，再在候选内按重归一化后的概率抽出一个下标。',
        template: 'function topKSample(probs, k) {\n  // probs 是完整概率数组，返回按 top-k 截断后抽中的下标\n  const idx = probs.map((p, i) => [p, i]);\n  // 第一步：按概率从大到小排序\n  idx.____((a, b) => b[0] - a[0]);\n  // 第二步：只保留前 k 个候选\n  const top = idx.____(0, k);\n  // 第三步：候选内重归一化——先算概率总质量\n  const sum = top.reduce((s, x) => s + x[0], 0);\n  // 第四步：轮盘赌抽样——在 [0, sum) 里随机落点\n  let r = Math.random() * sum;\n  for (const [p, i] of top) {\n    r -= p;\n    if (r <= 0) ____ i;\n  }\n  return top[top.length - 1][1];\n}',
        checks: ['sort', 'slice', 'return'],
        solution: 'function topKSample(probs, k) {\n  const idx = probs.map((p, i) => [p, i]);\n  idx.sort((a, b) => b[0] - a[0]);\n  const top = idx.slice(0, k);\n  const sum = top.reduce((s, x) => s + x[0], 0);\n  let r = Math.random() * sum;\n  for (const [p, i] of top) {\n    r -= p;\n    if (r <= 0) return i;\n  }\n  return top[top.length - 1][1];\n}',
        explanation: '四个关键步：排序（降序）→ slice 截断前 k → 在候选内按概率和 sum 归一 → 轮盘赌（r 逐个减去候选概率，落为负即命中）。常见错误：不做截断就在全表抽样（等于没做 top-k），或忘了候选内重归一化、用原始概率抽。面试考点：top-k 的"截断 + 重归一化"两步缺一不可（对照 m9-06 的手撕实现）。'
      }
    ],
    relations: {
      prerequisites: ['m5-05'],
      successors: ['m9-06'],
      confusables: [
        { other: 'm9-06', tip: '本课讲三个旋钮的语义与直觉；m9-06 把 top-k/top-p 写成代码。面试顺序是先说清"截断谁、怎么重归一化"，再动笔写实现。' },
        { other: 'm1-06', tip: 'softmax 是把 logits 变概率的固定工序；temperature 是在 softmax 之前给 logits 除以 T，改变的是分布"锐度"，不是 softmax 本身。' },
        { other: 'm7-04', tip: '蒸馏温度 T 与采样温度 T 同名不同场：前者在训练时软化老师的分布当教材，后者在推理时调节自己抽签的随机性。' }
      ]
    },
    memory: {
      mnemonic: '温度调胆量，top-k 数人头，top-p 攒票到线。',
      selfTest: [
        { q: 'temperature=0 等价于什么解码方式？适合什么场景？', a: '等价于贪心解码（每步取概率最大的词），输出确定可复现，适合代码生成、事实问答等求稳场景；代价是表达单一、容易陷入复读。工程上常用很小的温度（如 0.01）近似。' },
        { q: '分布很"尖"（模型很确定）时，top-k 和 top-p 谁更合适？为什么？', a: 'top-p 更合适。尖分布下 top-p 只留一两个候选，与模型的高确定性匹配；固定 k 的 top-k 仍要凑够 k 个，可能把低质量候选强行拉进候选集，放大噪声。' },
        { q: '重复惩罚解决什么问题？大致怎么做？', a: '解决复读（反复生成同一短语）问题。做法是把本步已出现 token 的 logits 除以大于 1 的系数或减去惩罚值，降低它再次被抽中的概率。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：AI 写作为什么时灵时不灵、时稳时飘？',
      reference: '因为模型每次下笔前都给所有候选词打了分，怎么"抽签"由几个旋钮决定：胆量（temperature）拧小就永远选最稳的词，拧大敢冒险；再配"只看前几名"（top-k）或"凑够九成票就停"（top-p）的截断规则——旋钮一变，文风就变。'
    }
  },
  {
    id: 'm7-03',
    title: '模型量化',
    oneLiner: '把 FP16 权重压到 INT8/INT4，用少量精度换大量显存',
    estMinutes: 12,
    analogy: {
      title: '高清地图折叠进口袋',
      body: '完整版高清地图（FP32/FP16 权重）精确但巨大，出门带不动；把它折叠简化成一张口袋简图（INT4 权重），面积缩到几分之一，主干道、地标都还在，绝大多数导航照样能用，只是个别小巷可能画歪一点。<b>折叠的方式有讲究</b>：重要的交通枢纽（关键权重）要用粗线保留，偏僻小路（不敏感权重）才允许简画——现代量化算法做的正是这种"有区别的简化"。'
    },
    intuition: [
      { heading: '精度阶梯：每个数占的字节变少', body: '深度学习的数有精度等级：<b>FP32</b>（4 字节）→ <b>FP16 / BF16</b>（2 字节）→ <b>INT8</b>（1 字节）→ <b>INT4</b>（0.5 字节）。模型显存 ≈ 参数量 × 每参数字节数，所以 7B 模型 FP16 约 14 GB，INT8 约 7 GB，INT4 约 3.5 GB。量化（Quantization）做的就是这道减法：<b>参数个数不变，只是每个数的"刻度"变粗</b>。' },
      { heading: '为什么压到 4 bit 还能用', body: '两个原因。<b>其一</b>：训练好的权重大多挤在很窄的数值区间里，分布集中，少量刻度就能罩住绝大多数值；<b>其二</b>：模型对"大多数"权重的微小扰动并不敏感，真正的雷区是少数异常值（Outlier）和少数关键通道。所以现代量化都"有区别地压缩"：大多数压到低位宽，少数重要的保高精度或做缩放补偿。注意：激活值（Activation）比权重更难压——分布更散、异常值多，所以主流方案多是只压权重的 weight-only 量化。' },
      { heading: '三大瘦身路线，别混为一谈', body: '模型变小有三条不同的路：<b>量化压数值</b>——参数个数不变，每个数的精度变低（本课）；<b>蒸馏压结构</b>——直接换一个参数更少的小模型去学大模型（m7-04）；<b>剪枝删连接</b>——把不重要的权重或通道直接置零、删除（Pruning）。面试常考三者辨析，一句话记住：量化动"刻度"，蒸馏动"规模"，剪枝动"连接"。' }
    ],
    principle: [
      {
        heading: '线性量化：一个缩放因子搞定',
        body: '最基础的对称线性量化只做两件事：定一个缩放因子（scale），把浮点数按比例压到整数刻度上；用的时候乘回来。误差来自四舍五入，刻度越少（bit 越低）误差越大——这就是"折叠地图"必然的失真。工程上还会按通道（per-channel）各配一个 scale，让数值范围差异大的通道各自对齐。',
        formula: 'q = round(x / scale)，还原 x̂ = q × scale',
        formulaNote: '<ul><li><b>x</b>：原始浮点权重（如 FP16）</li><li><b>scale</b>：缩放因子，把权重取值范围映射到整数刻度（如 INT4 的 −8~7 共 16 级）</li><li><b>q</b>：量化后的整数，存储与搬运都更省</li><li><b>x̂</b>：还原值，与 x 的差就是量化误差；bit 越低刻度越稀，误差越大</li></ul>'
      },
      {
        heading: 'GPTQ 与 AWQ：两种聪明的"有损压缩"',
        body: '后训练量化（PTQ, Post-Training Quantization）不重新训练，直接压训好的模型。<b>GPTQ</b>（Frantar 等，2022）：逐层量化，用近似二阶信息（Hessian 矩阵）估算每个权重的量化误差并互相补偿，能把大模型压到 3~4 bit 而精度损失很小；<b>AWQ</b>（Lin 等，2023）：激活感知——不看权重大小，看<b>激活值大小</b>，找出约 1% 的"显著权重"（乘在大激活上的）做缩放保护，其余照常压。两者都是工业界标配，面试能各说出一句话即可。',
        formula: 'GPTQ：逐层量化 + Hessian 误差补偿；AWQ：按激活幅度锁定 ~1% 显著权重并保护',
        formulaNote: '<ul><li><b>逐层量化</b>：一层一层压，压完一层用少量校准数据评估误差再压下一层</li><li><b>Hessian 误差补偿</b>：压某个权重产生的误差，用调整相邻权重的取值来抵消</li><li><b>激活感知</b>：某通道激活值大 = 它对输出影响大，对应权重被"保护"（等效放大后再量化，误差相对变小）</li><li><b>共同点</b>：都不需要重新训练（PTQ），几小时内可压完百亿参数模型</li></ul>'
      },
      {
        heading: '代价与收益：什么场合该量化',
        body: '收益：显存减半再减半（大模型能上消费级显卡）；decode 阶段是访存密集的，权重变小、读取更快，吞吐反而提升。代价：极低 bit（如 2 bit）精度明显下降；个别硬件对低 bit 计算支持一般。面试实战口算：7B→INT4≈3.5 GB、13B→INT4≈6.5 GB、70B→INT4≈35 GB，再叠加 KV Cache 预算（m7-06）判断"能不能上这张卡"。'
      }
    ],
    animation: {
      title: '量化压榨机：看权重被压到不同精度后的失真与显存',
      html: '<div class="anim-m7-03"><div class="anim-m7-03-btns"><button class="anim-m7-03-p" data-p="fp16" type="button">FP16（2 字节/数）</button><button class="anim-m7-03-p" data-p="int8" type="button">INT8（1 字节/数）</button><button class="anim-m7-03-p" data-p="int4" type="button">INT4（0.5 字节/数）</button></div><div class="anim-m7-03-rows"></div><div class="anim-m7-03-memrow"><span>7B 模型权重显存：</span><div class="anim-m7-03-memtrack"><div class="anim-m7-03-memfill"></div></div><span class="anim-m7-03-memtag">14 GB</span></div><div class="anim-m7-03-verdict"></div></div>',
      css: '.anim-m7-03 { font-size: 13px; }\n.anim-m7-03-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }\n.anim-m7-03-p { padding: 5px 10px; border: 1px solid #cbd5e1; background: #fff; border-radius: 6px; cursor: pointer; }\n.anim-m7-03-on { border-color: #10b981; background: #ecfdf5; font-weight: 700; }\n.anim-m7-03-row { display: flex; align-items: center; gap: 10px; margin: 3px 0; }\n.anim-m7-03-v { width: 130px; font-family: monospace; }\n.anim-m7-03-etrack { flex: 1; height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; }\n.anim-m7-03-efill { height: 100%; background: #ef4444; border-radius: 5px; transition: width .4s ease; }\n.anim-m7-03-memrow { display: flex; align-items: center; gap: 10px; margin-top: 12px; }\n.anim-m7-03-memtrack { flex: 1; height: 16px; background: #f1f5f9; border-radius: 8px; overflow: hidden; }\n.anim-m7-03-memfill { height: 100%; width: 100%; border-radius: 8px; transition: width .5s ease, background .5s ease; }\n.anim-m7-03-verdict { margin-top: 8px; color: #334155; line-height: 1.6; }',
      js: function (root) {
        var vals = [0.62, -1.35, 0.08, 2.10, -0.44, 0.97, -2.05];
        var rows = root.querySelector('.anim-m7-03-rows');
        var fill = root.querySelector('.anim-m7-03-memfill');
        var tag = root.querySelector('.anim-m7-03-memtag');
        var verdict = root.querySelector('.anim-m7-03-verdict');
        var btns = root.querySelectorAll('.anim-m7-03-p');
        function quant(x, steps) {
          var s = 2.10 / steps;
          var q = Math.round(x / s);
          if (q > steps) q = steps;
          if (q < -steps) q = -steps;
          return q * s;
        }
        function render(mode) {
          var steps = mode === 'int8' ? 127 : (mode === 'int4' ? 7 : null);
          var gb = mode === 'fp16' ? 14 : (mode === 'int8' ? 7 : 3.5);
          var html = '';
          var errSum = 0;
          for (var i = 0; i < vals.length; i++) {
            var x = vals[i];
            var y = steps === null ? x : quant(x, steps);
            var e = Math.abs(y - x);
            errSum += e;
            html += '<div class="anim-m7-03-row"><span class="anim-m7-03-v">' + x.toFixed(2) + ' → <b>' + y.toFixed(2) + '</b></span><div class="anim-m7-03-etrack"><div class="anim-m7-03-efill" style="width:' + Math.min(100, e / 0.35 * 100) + '%"></div></div></div>';
          }
          rows.innerHTML = html;
          fill.style.width = (gb / 14 * 100) + '%';
          fill.style.background = mode === 'fp16' ? '#f59e0b' : (mode === 'int8' ? '#3b82f6' : '#10b981');
          tag.textContent = gb + ' GB';
          var avg = errSum / vals.length;
          verdict.textContent = mode === 'fp16'
            ? 'FP16：基准精度，几乎无量化误差，但显存最贵。'
            : (mode === 'int8'
              ? 'INT8：平均误差 ≈ ' + avg.toFixed(4) + '，肉眼几乎不可见，显存省一半。'
              : 'INT4：平均误差 ≈ ' + avg.toFixed(3) + '，失真可见但"主干道"仍在——GPTQ/AWQ 要做的就是把这点失真再压下去。');
        }
        for (var b = 0; b < btns.length; b++) {
          (function (btn) {
            btn.addEventListener('click', function () {
              for (var k = 0; k < btns.length; k++) btns[k].classList.remove('anim-m7-03-on');
              btn.classList.add('anim-m7-03-on');
              render(btn.getAttribute('data-p'));
            });
          })(btns[b]);
        }
        render('fp16');
        btns[0].classList.add('anim-m7-03-on');
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '一个 7B 参数的模型量化到 INT4 后，权重显存大约是多少？',
        options: ['约 3.5 GB', '约 7 GB', '约 14 GB', '约 28 GB'],
        answer: 0,
        explanation: '7×10⁹ 参数 × 0.5 字节（INT4）= 3.5 GB。14 GB 是 FP16、7 GB 是 INT8、28 GB 是 FP32。常见误区：以为量化会减少参数个数——参数个数不变，只是每个数的存储精度变低。面试考点：显存 = 参数量 × 每参数字节数，先报这笔账再谈别的。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '量化会让模型的参数个数变少。',
        answer: false,
        explanation: '参数个数完全不变，变的是每个参数的表示精度（bit 数）——"刻度变粗，个数不减"。真正减少参数个数的是蒸馏（换更小的模型）与剪枝（删连接）。这条辨析是"三大瘦身路线"里最常考的一题，答错基本等于没复习 m7。'
      },
      {
        type: 'single', difficulty: 3,
        question: '关于 GPTQ 与 AWQ 的说法，哪一个是正确的？',
        options: ['GPTQ 逐层量化并用 Hessian 做误差补偿，AWQ 按激活值找出约 1% 显著权重加以保护', 'AWQ 的思想是把所有权重以同等幅度压到 4 bit', 'GPTQ 必须完整重新训练模型才能完成量化', '两者都通过减少参数个数来压缩模型'],
        answer: 0,
        explanation: 'A 是两篇论文的核心思想。B 与 AWQ 的"区别对待"相悖——AWQ 的关键恰恰是不平等待遇；C 混淆了后训练量化（PTQ）与量化感知训练（QAT），GPTQ/AWQ 都属 PTQ，无需重训；D 又回到了"量化减参数"的误区。面试考点：能一句话区分 GPTQ（误差补偿）与 AWQ（激活感知保护）。'
      }
    ],
    relations: {
      prerequisites: ['m5-05'],
      successors: ['m7-06'],
      confusables: [
        { other: 'm7-04', tip: '量化与蒸馏都让模型变小，但量化"刻度变粗、个数不变"，蒸馏"换一个更小的模型"——压缩对象一个是数值精度，一个是网络结构。' },
        { other: 'm6-04', tip: 'LoRA 是训练省显存（冻结原权重、只训低秩增量），量化是推理省显存（压缩已训好的权重）——一个动训练账本，一个动部署账本。' },
        { other: 'm7-01', tip: 'KV Cache 是显存的"大头消耗者"，量化是显存的"节流阀"；KV 本身也可以量化，部署方案里两者经常组合出现。' }
      ]
    },
    memory: {
      mnemonic: '量化砍刻度，不砍参数量。',
      selfTest: [
        { q: '7B 模型在 FP16、INT8、INT4 下各占多少权重显存？', a: '约 14 GB、7 GB、3.5 GB。公式：参数量 × 每参数字节数（FP16=2B、INT8=1B、INT4=0.5B）。这是判断"某张卡能不能跑某个模型"的第一笔账。' },
        { q: '为什么权重能压到 4 bit，而激活值很难压？', a: '训练后权重分布集中、数值范围窄，且模型对大多数权重的微小扰动不敏感；激活值分布更散、常出现大异常值，直接低 bit 量化误差大，所以主流方案是 weight-only（只压权重）。' },
        { q: '量化、蒸馏、剪枝一句话区分？', a: '量化压数值（精度变低、个数不变），蒸馏压结构（换成参数更少的学生模型），剪枝删连接（把不重要的权重置零或删除）。三者可以叠加使用。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：模型量化是怎么回事？',
      reference: '像把高清地图折叠成口袋简图：占地小了好多倍，主干道照样看得清，只是极少数细节被简化——AI 模型把每个数字的"小数点后位数"变短，就能塞进更小的显卡，还跑得更快。'
    }
  },
  {
    id: 'm7-04',
    title: '知识蒸馏',
    oneLiner: '让小模型跟着大模型的"软标签"学，用小参数量逼近大模型效果',
    estMinutes: 12,
    analogy: {
      title: '名师讲课，学生记笔记',
      body: '名师（teacher，大模型）讲一道判断题，不会只说"答案是猫"，而是摊开思路："像猫 70%，像狗 20%，像车 10%"——这份带比例的判断叫<b>软标签（Soft Label）</b>，里面藏着"猫和狗比猫和车更像"的结构信息，行话叫<b>暗知识（Dark Knowledge）</b>。学生（student，小模型）跟着这份笔记学，学到的不是死答案，而是老师看问题的方式；等老师退休（大模型下线），学生也能顶上，还便宜得多。'
    },
    intuition: [
      { heading: '软标签比 one-hot 信息多', body: '标准答案通常是最粗糙的 one-hot：猫=1，其余全 0（回扣 m3-01 的分类输出）。它把"第二名是谁、差多少"全抹掉了。软标签则保留完整的概率结构：狗 0.2 远大于车 0.1，学生一看就知道"猫的近亲是狗"。这些相对关系正是老师功力的浓缩，所以叫暗知识——它不在标准答案里，在老师的"犹豫"里。' },
      { heading: '蒸馏温度：把差异"放大"给学生看', body: '老师原始的 logits 往往过于自信（最高分接近 1、其余接近 0），软标签"太硬"，暗知识看不清。蒸馏用温度 T 给 logits 除以 T 再做 softmax：T > 1 时分布变平滑，非最高项的相对差异变成肉眼可见的比例，学生更容易学到结构。注意它与 m7-02 的采样温度<b>同名不同场</b>：那里是推理时抽签的胆量旋钮，这里是训练时加工教材的火候。' },
      { heading: '在 LLM 里的两种形态', body: '<b>白盒蒸馏</b>：拿得到老师内部输出（logits / 隐状态），直接对齐概率分布；<b>黑盒蒸馏</b>：只有老师生成的文本——比如用大模型批量造"指令-回答"数据去微调小模型（衔接 m6-03 的 SFT 管线），本质是拿老师的答案当教材。无论哪种，目的相同：<b>学生用小参数量逼近大模型效果</b>，部署便宜、延迟低。这与量化（结构不动、只降精度）有本质区别。' }
    ],
    principle: [
      {
        heading: '蒸馏损失：向软分布对齐',
        body: '学生的训练目标是"输出分布尽量像老师"：用 KL 散度衡量两个分布的差距，再按权重与真实标签的交叉熵相加。温度 T 在师生两边同时使用，保证两者看的是同一份"软化后的教材"；推理时学生恢复 T=1 正常工作。',
        formula: 'L = α · KL( softmax(z_t/T) ‖ softmax(z_s/T) ) + (1−α) · CE( y, softmax(z_s) )',
        formulaNote: '<ul><li><b>z_t / z_s</b>：老师 / 学生的 logits（softmax 前的原始得分）</li><li><b>T</b>：蒸馏温度，T > 1 让软分布更平滑、暗知识更明显（师生同用同一个 T）</li><li><b>KL(p‖q)</b>：KL 散度，衡量学生分布 q 偏离老师分布 p 的程度，越小越像</li><li><b>α</b>：权重系数，平衡"向老师学"（软标签项）与"向标准答案学"（硬标签项）</li><li><b>CE(y, ·)</b>：对真实标签 y 的交叉熵，防止学生只像老师却学错了方向</li></ul>'
      },
      {
        heading: '为什么"跟老师"比"跟答案"学得好',
        body: '软标签为每个样本提供了更丰富的监督信号：one-hot 只在正确类上有一个方向的梯度，软标签在所有类别上都有梯度且比例合理——相当于老师告诉你"每条路大概多像"，学生收敛更快、更稳，小模型也能学出决策边界的"形状"。这是 Hinton 等人 2015 年提出的经典思路（Distilling the Knowledge in a Neural Network），如今是大模型小型化（各种小号对话模型）的常用手段之一。'
      },
      {
        heading: '蒸馏 vs 量化 vs 剪枝：十秒讲清',
        body: '面试要求脱口而出：蒸馏<b>换了个更小的模型</b>（参数量下降、结构变了），需要训练，成本高但潜力大；量化<b>参数个数不变</b>、每个数精度变低，几乎零训练成本，收益立等可取；剪枝<b>删掉部分连接</b>，通常再微调补回精度。三者可以叠加——常见的部署组合是"蒸馏出小模型 → 量化到 4 bit → 上卡服务"。'
      }
    ],
    animation: {
      title: '暗知识显微镜：温度 T 如何让软标签"显影"',
      html: '<div class="anim-m7-04"><div class="anim-m7-04-ctrl">蒸馏温度 T <input class="anim-m7-04-t" type="range" min="1" max="8" step="0.5" value="1"> <span class="anim-m7-04-tv">1.0</span></div><div class="anim-m7-04-cols"><div class="anim-m7-04-col"><div class="anim-m7-04-ct">老师软标签（logits：猫 3.2 / 狗 2.5 / 车 0.6）</div><div class="anim-m7-04-bars anim-m7-04-tbars"></div></div><div class="anim-m7-04-col"><div class="anim-m7-04-ct">学生硬学 one-hot（只有标准答案）</div><div class="anim-m7-04-bars anim-m7-04-hbars"></div></div><div class="anim-m7-04-col"><div class="anim-m7-04-ct">学生蒸馏学（模仿软标签）</div><div class="anim-m7-04-bars anim-m7-04-sbars"></div></div></div><div class="anim-m7-04-note"></div></div>',
      css: '.anim-m7-04 { font-size: 13px; }\n.anim-m7-04-ctrl { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }\n.anim-m7-04-cols { display: flex; gap: 10px; flex-wrap: wrap; }\n.anim-m7-04-col { flex: 1 1 200px; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; }\n.anim-m7-04-ct { font-weight: 700; margin-bottom: 6px; color: #334155; font-size: 12px; }\n.anim-m7-04-line { display: flex; align-items: center; gap: 6px; margin: 5px 0; }\n.anim-m7-04-lab { width: 28px; }\n.anim-m7-04-track { flex: 1; height: 14px; background: #f1f5f9; border-radius: 7px; overflow: hidden; }\n.anim-m7-04-fill { height: 100%; background: #10b981; border-radius: 7px; transition: width .4s ease; }\n.anim-m7-04-gray { background: #94a3b8; }\n.anim-m7-04-pct { width: 52px; font-size: 12px; color: #475569; }\n.anim-m7-04-note { margin-top: 8px; color: #334155; line-height: 1.6; }',
      js: function (root) {
        var names = ['猫', '狗', '车'];
        var logits = [3.2, 2.5, 0.6];
        var tEl = root.querySelector('.anim-m7-04-t');
        var tv = root.querySelector('.anim-m7-04-tv');
        var tb = root.querySelector('.anim-m7-04-tbars');
        var hb = root.querySelector('.anim-m7-04-hbars');
        var sb = root.querySelector('.anim-m7-04-sbars');
        var note = root.querySelector('.anim-m7-04-note');
        function build(el, gray) {
          var h = '';
          for (var i = 0; i < names.length; i++) {
            h += '<div class="anim-m7-04-line"><span class="anim-m7-04-lab">' + names[i] + '</span><div class="anim-m7-04-track"><div class="anim-m7-04-fill' + (gray ? ' anim-m7-04-gray' : '') + '"></div></div><span class="anim-m7-04-pct"></span></div>';
          }
          el.innerHTML = h;
        }
        function setBars(el, probs) {
          var fills = el.querySelectorAll('.anim-m7-04-fill');
          var pcts = el.querySelectorAll('.anim-m7-04-pct');
          for (var i = 0; i < fills.length; i++) {
            fills[i].style.width = Math.max(1, probs[i] * 100) + '%';
            pcts[i].textContent = (probs[i] * 100).toFixed(1) + '%';
          }
        }
        build(tb, false);
        build(hb, true);
        build(sb, false);
        function render() {
          var T = Number(tEl.value);
          tv.textContent = T.toFixed(1);
          var ex = logits.map(function (z) { return Math.exp(z / T); });
          var s = ex[0] + ex[1] + ex[2];
          var soft = [ex[0] / s, ex[1] / s, ex[2] / s];
          setBars(tb, soft);
          setBars(hb, [1, 0, 0]);
          setBars(sb, soft);
          note.textContent = 'T=' + T.toFixed(1) + '：老师输出 猫 ' + (soft[0] * 100).toFixed(1) + '%、狗 ' + (soft[1] * 100).toFixed(1) + '%、车 ' + (soft[2] * 100).toFixed(1) + '%。' + (T >= 3 ? '分布平滑，"狗是猫的近亲、车是外人"的暗知识清晰可见，学生学得到结构。' : '老师过度自信：狗和车都趋近 0，学生看不出"谁更像谁"，暗知识被淹没。');
        }
        tEl.addEventListener('input', render);
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '知识蒸馏中，学生模型主要向什么学习？',
        options: ['老师输出的软标签（概率分布）', '老师的模型权重数值', '一份规模更大的新数据集', '量化后的低精度参数'],
        answer: 0,
        explanation: '蒸馏的核心是模仿老师输出的概率结构（软标签/暗知识），而不是复制权重——直接拷权重等于复制模型，得不到小模型；也不必然需要新数据集。面试考点：软标签为什么比 one-hot 信息多（保留类间相对关系）。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '软标签"猫 0.7 / 狗 0.2 / 车 0.1"携带的信息量，比 one-hot"猫=1、其余=0"更多。',
        answer: true,
        explanation: '软标签保留了类别间的相对关系（狗比车更像猫、狗与猫的差距不大），one-hot 把这些结构信息全部抹平。这些"暗知识"帮学生在同样数据上学到类间相似结构，是蒸馏能以小博大的关键。误区：以为概率分布只是"标准答案加了噪声"。'
      },
      {
        type: 'single', difficulty: 3,
        question: '同样是"让模型变小"，蒸馏与量化的本质区别是？',
        options: ['蒸馏换一个参数更少的学生模型（结构变了），量化参数个数不变、只降数值精度', '蒸馏不需要训练，量化需要完整重训', '蒸馏只能用于图像任务，量化只能用于文本任务', '蒸馏压缩的是激活值，量化压缩的是梯度'],
        answer: 0,
        explanation: 'A 是教科书级答案：蒸馏动结构（参数量下降、需要训练），量化动精度（结构不变、近乎零训练成本）。B 把两者说反了；C 无此限制，两者都是通用技术；D 属于凭空捏造的搭配。面试考点：三大瘦身路线（量化/蒸馏/剪枝）的辨析要能一句话说清。'
      }
    ],
    relations: {
      prerequisites: ['m6-02', 'm3-01'],
      successors: [],
      confusables: [
        { other: 'm7-03', tip: '蒸馏与量化是"三大瘦身路线"里最易混的两条：蒸馏换小模型（结构变），量化保结构压精度（个数不变）。' },
        { other: 'm7-02', tip: '蒸馏温度 T 与采样温度 T 同名不同场：蒸馏的 T 在训练时软化老师的分布当教材，采样的 T 在推理时控制抽签随机性。' },
        { other: 'm6-03', tip: '黑盒蒸馏常落地为"大模型生成指令数据 → SFT 小模型"，与 m6-03 的指令微调共享工具链，区别在数据来源是老师模型而非纯人工标注。' }
      ]
    },
    memory: {
      mnemonic: '软标签藏暗知识，温度一高看得清。',
      selfTest: [
        { q: '什么是暗知识（Dark Knowledge）？', a: '老师模型输出概率分布中、one-hot 标准答案里没有的信息：如"猫 0.7 / 狗 0.2 / 车 0.1"里"狗比车更像猫"的相对关系。它反映类间相似结构，是学生能以小博大的关键教材。' },
        { q: '蒸馏温度 T 在损失里起什么作用？', a: '对师生两边的 logits 同时除以 T 再 softmax。T > 1 让分布更平滑、非最高项的相对差异变得可见可学，避免老师过度自信导致软标签退化成近似 one-hot。' },
        { q: 'LLM 时代的黑盒蒸馏是什么？', a: '拿不到老师内部 logits 时，只用老师生成的文本（如大模型产出的指令-回答对）当教材训练小模型；相比白盒蒸馏损失了分布信息，但工程上通用，可直接复用 SFT 管线。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：知识蒸馏是怎么让"小模型"变得能干的？',
      reference: '让小模型当学生，抄大模型老师的"听课笔记"——不是只抄标准答案，而是连老师觉得"七分像猫、两分像狗"的判断比例一起抄，于是用少得多的参数也能学出老师看问题的方式。'
    }
  },
  {
    id: 'm7-05',
    title: '推理框架与 vLLM',
    oneLiner: 'PagedAttention 分页管 KV Cache，continuous batching 随到随算，吞吐翻几倍',
    estMinutes: 12,
    analogy: {
      title: '酒店分房：整层包场 vs 按床位入住',
      body: '老式推理系统像"整层包场"的酒店：客人（请求）一来，先按<b>最长可能的住宿天数</b>预留一整块连续房间（KV Cache 按最大长度预留显存），多数客人实际只住两三天，大半床位空着；而且必须<b>整层人全退房才接新客</b>（静态 batching 等整批完成）。vLLM 的做法像经济型连锁酒店：<b>房间切成标准小床位（KV Cache 分块）</b>，住几天订几天、床位可以不连续，前台用一张房卡表（block table）记录谁住哪；客人随到随入住、退房即腾位（continuous batching）。同样大的酒店，接待能力翻好几倍。'
    },
    intuition: [
      { heading: 'vLLM 为什么快：从显存浪费说起', body: 'vLLM 是目前最流行的开源高吞吐推理框架，核心创新是 PagedAttention（Kwon 等，SOSP 2023）。论文先指出病灶：传统系统给每个请求按最大序列长度预留一整块连续 KV 显存，实测<b>约 60%~80% 的 KV 显存被浪费</b>（预留没用上 + 碎片），GPU 同时只能服务很少请求——吞吐上不去的根源在显存管理，而不是算力不够。' },
      { heading: 'PagedAttention：借鉴操作系统的分页', body: '操作系统早就解决过同类问题：找不到连续大块内存，就把内存切成固定大小的"页"，按需分配、用页表映射（虚拟内存）。PagedAttention 照方抓药：把每个请求的 KV Cache 切成固定大小的块（如 16 个 token 一块），<b>按需分配、物理上不要求连续</b>，用一张块表（Block Table）记录"逻辑块 → 物理块"。KV 显存浪费降到近零，同样显存能塞下多得多的并发请求；相同前缀（如同一条长 system prompt）还能共享物理块，进一步省显存。' },
      { heading: 'continuous batching：随到随上车', body: '静态 batching 把一批请求拼在一起算，<b>必须等最慢的那条生成完才能整体换下一批</b>——短请求干等、GPU 中间吃不饱。continuous batching（逐迭代调度）在"每生成一个 token"的粒度上调度：某请求一完成立刻腾位，排队中的新请求立刻补进当前批，批里始终是活跃请求，GPU 利用率拉满。两招合璧，vLLM 论文实测吞吐达到当时系统的 2~4 倍。' }
    ],
    principle: [
      {
        heading: '静态批的三宗罪',
        body: '面试常让对比静态与动态批。静态批的问题：其一，<b>队头阻塞</b>——批内最长请求决定整批时长；其二，<b>预留浪费</b>——按最大长度预分配 KV；其三，<b>利用率锯齿</b>——批与批交替时 GPU 间隙明显。改进思路：先有动态组批，再进一步是 vLLM 式细粒度显存管理 + continuous batching。',
        formula: 'KV 预留浪费率 ≈ 1 − 实际序列总长 ÷ 预留序列总长',
        formulaNote: '<ul><li><b>实际序列总长</b>：批内各请求真实用到的 token 数之和</li><li><b>预留序列总长</b>：按最大长度给每个请求预分配的 token 数之和</li><li>直觉：请求长短越参差，浪费率越高；PagedAttention 按需分块后，浪费只剩"最后一个未满的块"，近乎零</li></ul>'
      },
      {
        heading: 'PagedAttention 的三个关键词',
        body: '<b>分块（Block）</b>：KV Cache 的最小分配单位，如 16 个 token；<b>块表（Block Table）</b>：逻辑位置到物理块的映射，类似操作系统页表；<b>前缀共享</b>：多个序列的相同前缀指向同一批物理块，写时分叉（copy-on-write 思想）。注意：注意力计算的数学没有任何改动，变的只是"去哪里读 K/V"——它是纯工程优化，收益全部来自省显存、提并发，这与 m7-01"缓存不改变结果"一脉相承。'
      },
      {
        heading: '框架版图与答题框架',
        body: '面试加分：除 vLLM 外还有 TensorRT-LLM（NVIDIA 出品，极致算子优化）、SGLang（RadixAttention 前缀缓存）、LMDeploy、TGI 等，思路殊途同归——把 KV 显存管细、把批调度做活、把算子榨干。回答"如何提升推理服务吞吐"时按三层组织：<b>算法层</b>（GQA / 量化，压权重与 KV）、<b>显存层</b>（PagedAttention / 前缀复用）、<b>调度层</b>（continuous batching）——三层都点到，才是完整答案。'
      }
    ],
    animation: {
      title: '酒店分房实验：整层包场 vs 分页入住的床位利用率',
      html: '<div class="anim-m7-05"><div class="anim-m7-05-btns"><button class="anim-m7-05-add" type="button">入住新请求</button><button class="anim-m7-05-step" type="button">所有请求向前走一步</button><button class="anim-m7-05-out" type="button">最老的请求退房</button><button class="anim-m7-05-reset" type="button">重置</button></div><div class="anim-m7-05-panels"><div class="anim-m7-05-panel"><div class="anim-m7-05-pt">静态批：整层包场（每请求预留 8 格）</div><div class="anim-m7-05-pl">绿=实际在住，橙=预留空床（浪费）</div><div class="anim-m7-05-sreqs"></div><div class="anim-m7-05-pool anim-m7-05-spool"></div><div class="anim-m7-05-pl anim-m7-05-sconc"></div></div><div class="anim-m7-05-panel"><div class="anim-m7-05-pt">PagedAttention：按块入住（块大小 2 格）</div><div class="anim-m7-05-pl">绿=实际在住，红=块内零头（仅轻微浪费）</div><div class="anim-m7-05-preqs"></div><div class="anim-m7-05-pool anim-m7-05-ppool"></div><div class="anim-m7-05-pl anim-m7-05-pconc"></div></div></div><div class="anim-m7-05-note">连续入住几个请求再让它们"走几步"，对比两边床位利用率和可接待的并发数——差距就是 vLLM 吞吐优势的来源。</div></div>',
      css: '.anim-m7-05 { font-size: 13px; }\n.anim-m7-05-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }\n.anim-m7-05-btns button { padding: 5px 10px; border: 1px solid #10b981; background: #ecfdf5; border-radius: 6px; cursor: pointer; }\n.anim-m7-05-panels { display: flex; gap: 10px; flex-wrap: wrap; }\n.anim-m7-05-panel { flex: 1 1 260px; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; }\n.anim-m7-05-pt { font-weight: 700; color: #334155; margin-bottom: 4px; }\n.anim-m7-05-pl { font-size: 12px; color: #64748b; margin-bottom: 6px; }\n.anim-m7-05-req { display: flex; align-items: center; gap: 3px; margin: 3px 0; }\n.anim-m7-05-cell { width: 16px; height: 16px; border-radius: 3px; }\n.anim-m7-05-used { background: #10b981; }\n.anim-m7-05-resv { background: #fde68a; }\n.anim-m7-05-frag { background: #fca5a5; }\n.anim-m7-05-len { font-style: normal; font-size: 11px; color: #64748b; margin-left: 4px; }\n.anim-m7-05-pool { margin-top: 6px; font-size: 12px; color: #334155; }\n.anim-m7-05-empty { color: #94a3b8; font-size: 12px; }\n.anim-m7-05-note { margin-top: 8px; color: #334155; line-height: 1.6; }',
      js: function (root) {
        var CAP = 8, POOL = 24, BLOCK = 2, MAXLEN = 8;
        var staticReqs = [{ len: 4 }, { len: 6 }];
        var pagedReqs = [{ len: 4 }, { len: 6 }, { len: 1 }];
        function alloc(len) { return Math.ceil(len / BLOCK) * BLOCK; }
        function render() {
          var sHtml = '', sUsed = 0, sRes = 0;
          for (var i = 0; i < staticReqs.length; i++) {
            var r = staticReqs[i];
            sUsed += r.len; sRes += CAP;
            sHtml += '<div class="anim-m7-05-req">';
            for (var c = 0; c < CAP; c++) sHtml += '<span class="anim-m7-05-cell ' + (c < r.len ? 'anim-m7-05-used' : 'anim-m7-05-resv') + '"></span>';
            sHtml += '<i class="anim-m7-05-len">客 ' + (i + 1) + '：住 ' + r.len + ' / 包 8</i></div>';
          }
          root.querySelector('.anim-m7-05-sreqs').innerHTML = sHtml || '<div class="anim-m7-05-empty">酒店空了，点"入住新请求"</div>';
          var pHtml = '', pUsed = 0, pAlloc = 0;
          for (var j = 0; j < pagedReqs.length; j++) {
            var q = pagedReqs[j];
            var a = alloc(q.len);
            pUsed += q.len; pAlloc += a;
            pHtml += '<div class="anim-m7-05-req">';
            for (var d = 0; d < a; d++) pHtml += '<span class="anim-m7-05-cell ' + (d < q.len ? 'anim-m7-05-used' : 'anim-m7-05-frag') + '"></span>';
            pHtml += '<i class="anim-m7-05-len">客 ' + (j + 1) + '：住 ' + q.len + ' / 占 ' + a + '</i></div>';
          }
          root.querySelector('.anim-m7-05-preqs').innerHTML = pHtml || '<div class="anim-m7-05-empty">酒店空了，点"入住新请求"</div>';
          root.querySelector('.anim-m7-05-spool').textContent = '总床位 24：已包场 ' + sRes + '，空闲 ' + (POOL - sRes) + ' · 床位利用率 ' + (sRes ? Math.round(sUsed / sRes * 100) : 0) + '%';
          root.querySelector('.anim-m7-05-ppool').textContent = '总床位 24：已占用 ' + pAlloc + '，空闲 ' + (POOL - pAlloc) + ' · 床位利用率 ' + (pAlloc ? Math.round(pUsed / pAlloc * 100) : 0) + '%';
          root.querySelector('.anim-m7-05-sconc').textContent = '当前并发 ' + staticReqs.length + '（上限 3 = 24 ÷ 8 包场）';
          root.querySelector('.anim-m7-05-pconc').textContent = '当前并发 ' + pagedReqs.length + '（按需分配，短请求可远超 3 个）';
        }
        root.querySelector('.anim-m7-05-add').addEventListener('click', function () {
          var sOk = staticReqs.length * CAP + CAP <= POOL;
          var pUsed2 = pagedReqs.reduce(function (s, r) { return s + alloc(r.len); }, 0);
          var pOk = pUsed2 + BLOCK <= POOL;
          if (sOk) staticReqs.push({ len: 1 });
          if (pOk) pagedReqs.push({ len: 1 });
          render();
        });
        root.querySelector('.anim-m7-05-step').addEventListener('click', function () {
          staticReqs.forEach(function (r) { r.len++; });
          pagedReqs.forEach(function (r) { r.len++; });
          staticReqs = staticReqs.filter(function (r) { return r.len <= MAXLEN; });
          pagedReqs = pagedReqs.filter(function (r) { return r.len <= MAXLEN; });
          render();
        });
        root.querySelector('.anim-m7-05-out').addEventListener('click', function () {
          if (staticReqs.length) staticReqs.shift();
          if (pagedReqs.length) pagedReqs.shift();
          render();
        });
        root.querySelector('.anim-m7-05-reset').addEventListener('click', function () {
          staticReqs = [{ len: 4 }, { len: 6 }];
          pagedReqs = [{ len: 4 }, { len: 6 }, { len: 1 }];
          render();
        });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: 'vLLM 提升吞吐的两大核心机制是？',
        options: ['PagedAttention 分页管理 KV Cache + continuous batching 动态调度', '把模型权重压缩到 2 bit', '训练时使用更大的 batch size', '把 Transformer 的层数减少'],
        answer: 0,
        explanation: 'PagedAttention 解决"KV 显存按最大长度预留、浪费 60%~80%"的问题，continuous batching 解决"静态批队头阻塞、GPU 吃不饱"的问题。B 是量化（且 2 bit 通常伤精度，见 m7-03）；C 是训练概念混淆；D 属于改结构（剪枝方向）。面试考点：两大法宝各解决什么问题要分开说清。'
      },
      {
        type: 'judge', difficulty: 2,
        question: 'PagedAttention 改变了注意力的数学公式，所以输出结果和普通注意力不一样。',
        answer: false,
        explanation: '数学完全不变，变的只是 K/V 的存放方式：切成固定大小的块、物理上不连续、靠块表映射定位——读出来的 K/V 与连续存放时一字不差，注意力输出相同。它的收益全部来自显存利用率与并发能力。误区：把工程优化当成算法改动，这正是 m7-01"缓存不改数学"的姊妹题。'
      },
      {
        type: 'single', difficulty: 3,
        question: '静态 batching 最大的问题是？',
        options: ['批内所有请求必须等最长的那个完成才能整体换批，短请求干等、GPU 利用率锯齿波动', '静态批无法使用 KV Cache', '静态批必须把模型切分到多张卡上', '静态批只能处理长度完全相同的 prompt'],
        answer: 0,
        explanation: '队头阻塞是静态批的要害：整批时长由最慢请求决定，批内空转、批间换血，吞吐上不去——continuous batching 正是为此而生。静态批照样用 KV Cache（B 错）；与是否多卡无关（C 错）；prompt 不等长只是要 padding，不是最大问题（D 错）。面试考点：能对比静态/连续批的时间线行为。'
      }
    ],
    relations: {
      prerequisites: ['m7-01'],
      successors: [],
      confusables: [
        { other: 'm7-01', tip: 'KV Cache 是被管理的"数据"，PagedAttention 是管理它的"方法"（分块 + 块表）；先有 m7-01 的缓存，才有 m7-05 的缓存管理难题。' },
        { other: 'm7-06', tip: '批处理算的是"一次前向塞多少请求"的吞吐账，vLLM 解决的是"这些请求的 KV 怎么塞得下"的显存账——两层配合才有吞吐优势。' },
        { other: 'm7-03', tip: '提升吞吐的算法层手段是量化（权重/KV 变小、访存变快），vLLM 是系统层手段（调度与显存管理）；面试答"如何优化推理服务"要两层都提。' }
      ]
    },
    memory: {
      mnemonic: 'KV 分块住酒店，请求随到随上车。',
      selfTest: [
        { q: 'PagedAttention 借鉴了操作系统的什么机制？怎么对应？', a: '虚拟内存分页。KV Cache 切成固定大小的块 ≈ 内存页；块表（逻辑块→物理块）≈ 页表；按需分配、物理不连续 ≈ 分页分配。收益是 KV 显存浪费从 60%~80% 降到近零。' },
        { q: 'continuous batching 与静态 batching 的区别一句话？', a: '静态批要等批内最慢请求完成才能整体换批（队头阻塞）；continuous batching 在每个生成步粒度上增删请求——完成即腾位、新请求即时上车，GPU 始终满载。' },
        { q: '为什么说 vLLM 吞吐高的根源是显存管理而非算力？', a: '传统系统按最大长度预留连续 KV 显存，实测 60%~80% 被浪费，并发请求数被显存卡死、GPU 算力闲置；分页把浪费降到近零后，同样显存能塞下数倍并发，论文实测吞吐提升 2~4 倍。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：vLLM 凭什么让 AI 服务又快又便宜？',
      reference: '它把 AI 记对话的"笔记本"从整本整本地领（大部分页数浪费）改成按页借用、用一页领一页，还让新客人随时入座、不用等一整桌人全吃完——同样的硬件，一次能接待多几倍的客人。'
    }
  },
  {
    id: 'm7-06',
    title: '显存估算与批处理',
    oneLiner: '算清"权重 + KV Cache"两笔账，从容回答"24G 卡能不能跑 13B"',
    estMinutes: 14,
    analogy: {
      title: '一趟货车能装多少货',
      body: '把 GPU 显存想成一辆货车（比如 24 GB 的车斗）。装载分两部分：<b>一批固定重的集装箱</b>——模型权重，发车前装一次全程不动；<b>每位乘客的行李</b>——每个请求的 KV Cache，人多、行李大（上下文长）就堆得高。车斗就那么大：装得下几只集装箱、接几位乘客，必须提前算账。算清"集装箱 14 吨 + 每位乘客行李 2 吨"，就知道这趟车能拉几位客、要不要换小箱子（量化）。'
    },
    intuition: [
      { heading: '第一笔账：权重显存', body: '权重显存 ≈ 参数量 × 每参数字节数。FP16 每参数 2 字节：7B ≈ 14 GB、13B ≈ 26 GB、70B ≈ 140 GB。量化直接改字节数（回扣 m7-03）：INT4 下 7B ≈ 3.5 GB。这是面试白板题的第一行，先写它，再谈别的。' },
      { heading: '第二笔账：KV Cache 显存', body: 'KV Cache 按 m7-01 的公式逐项算：KV显存 ≈ 2 × 层数 × KV头维度 × 序列长 × batch × 字节数。以 LLaMA-7B（32 层、4096 维、FP16）为例，每个 token 约 512 KB：4K 上下文单请求约 2 GB，8 个并发就是 16 GB——往往比权重还大！长上下文服务显存爆掉，几乎都爆在这笔账上。' },
      { heading: 'batch 的收益与代价 + 两个指标', body: 'decode 阶段每生成一个 token 都要把全部权重从显存读一遍：单请求时"读了整箱权重只算一份账"，很亏；batch 加大后，<b>一次权重读取摊给多个请求</b>，吞吐（Throughput，每秒总 token 数）显著上升。代价：KV 显存被 batch 成倍放大，首 token 延迟也承压。两个服务指标要有直觉：<b>TTFT</b>（Time To First Token，首 token 延迟，主要由 prefill 决定，影响"等多久开始出字"）与 <b>TPOT</b>（Time Per Output Token，每个输出 token 的平均间隔，影响"打字机滚动顺不顺滑"）。吞吐与延迟的平衡是推理服务的永恒话题。' }
    ],
    principle: [
      {
        heading: '权重账与速查表',
        body: '先背速查表，面试直接报数：FP16 下 7B→14 GB、13B→26 GB、70B→140 GB；INT8 减半、INT4 再减半。报完权重账，立刻提醒自己"这还没算 KV 与激活"——显式说出这句话，比算得快更能体现工程素养。',
        formula: '权重显存 ≈ 参数量 × 每参数字节数',
        formulaNote: '<ul><li><b>参数量</b>：模型名字里的 B（billion，十亿），7B 即 7×10⁹ 个参数</li><li><b>每参数字节数</b>：FP32=4B、FP16/BF16=2B、INT8=1B、INT4=0.5B（回扣 m7-03 精度阶梯）</li><li>速查（FP16）：7B→14 GB，13B→26 GB，70B→140 GB；INT4 时各除以 4</li><li>这只是权重账，运行时还要加 KV Cache 与激活</li></ul>'
      },
      {
        heading: 'KV 账逐项走一遍',
        body: '把公式代入真实模型练到口算：7B/FP16 每 token 512 KB，4K 上下文单请求约 2 GB；13B（40 层 × 5120 维）每 token 800 KB，4K 上下文约 3.2 GB。面试时一边代公式一边说明每个因子的物理含义，防止背错也展示理解。',
        formula: 'KV显存 ≈ 2 × L × n_kv × d_head × s × b × 字节数',
        formulaNote: '<ul><li><b>2</b>：K、V 各存一份</li><li><b>L</b>：层数（LLaMA-7B 为 32，13B 为 40）</li><li><b>n_kv × d_head</b>：KV 头总维度，普通 MHA 下 ≈ 隐藏维（7B 为 4096）；用 GQA（分组查询注意力）时 KV 头只有几个，此项大幅缩小</li><li><b>s</b>：序列长度；<b>b</b>：并发数——两项是显存爆炸的两大放大器</li><li><b>字节数</b>：FP16=2B；KV 也可量化进一步压缩</li><li>例：7B/FP16/s=4096/b=1 → 2×32×4096×4096×2 B ≈ 2.1 GB</li></ul>'
      },
      {
        heading: '实战题：24G 显卡能不能跑 13B？',
        body: '标准答题框架（面试模板）：① 权重账——13B FP16 ≈ 26 GB > 24 GB，直接装不下；② 换精度——INT8 ≈ 13 GB、INT4 ≈ 6.5 GB，装得下；③ KV 账——按上下文与并发算 KV 预算（13B/FP16 每 token 800 KB，4K 上下文单请求 3.2 GB）；④ 结论——FP16 不行（除非多卡），INT4 可行且有余量给 KV，但精度有损、需评测验证。这道题考的不是背数，是"分账思维 + 逐项估算"。',
        formula: '总显存 ≈ 权重 + KV Cache + 激活与框架开销（留 10%~20% 余量）',
        formulaNote: '<ul><li><b>权重</b>：参数量 × 字节数，常驻不动</li><li><b>KV Cache</b>：随 序列长 × 并发 线性上涨，长上下文/高并发时的主导项</li><li><b>激活与框架开销</b>：运行时缓冲、CUDA 上下文等，工程上留 10%~20% 余量最稳</li></ul>'
      }
    ],
    animation: {
      title: '显存计算器：权重 + KV 两笔账 vs 24 GB 红线',
      html: '<div class="anim-m7-06"><div class="anim-m7-06-ctrl"><label>模型 <select class="anim-m7-06-model"><option value="7">7B</option><option value="13">13B</option><option value="70">70B</option></select></label><label>精度 <select class="anim-m7-06-prec"><option value="2">FP16</option><option value="1">INT8</option><option value="0.5">INT4</option></select></label><label>上下文 <input class="anim-m7-06-ctx" type="range" min="1024" max="32768" step="1024" value="4096"> <span class="anim-m7-06-ctxv">4096</span> token</label><label>并发 batch <input class="anim-m7-06-b" type="range" min="1" max="16" step="1" value="1"> <span class="anim-m7-06-bv">1</span></label></div><div class="anim-m7-06-line anim-m7-06-wline"></div><div class="anim-m7-06-line anim-m7-06-kvline"></div><div class="anim-m7-06-track"><div class="anim-m7-06-wbar"></div><div class="anim-m7-06-kbar"></div><div class="anim-m7-06-ref"></div></div><div class="anim-m7-06-legend">紫=权重，绿=KV Cache，红线=24 GB 显存上限（比例尺随总量自适应）</div><div class="anim-m7-06-verdict"></div></div>',
      css: '.anim-m7-06 { font-size: 13px; }\n.anim-m7-06-ctrl { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 10px; }\n.anim-m7-06-ctrl label { display: flex; align-items: center; gap: 6px; }\n.anim-m7-06-line { font-family: monospace; margin: 4px 0; color: #334155; }\n.anim-m7-06-track { position: relative; height: 22px; background: #f1f5f9; border-radius: 6px; overflow: hidden; display: flex; margin-top: 8px; }\n.anim-m7-06-wbar { height: 100%; background: #6366f1; transition: width .4s ease; }\n.anim-m7-06-kbar { height: 100%; background: #10b981; transition: width .4s ease; }\n.anim-m7-06-ref { position: absolute; top: 0; bottom: 0; width: 2px; background: #ef4444; }\n.anim-m7-06-legend { font-size: 12px; color: #64748b; margin-top: 4px; }\n.anim-m7-06-verdict { margin-top: 8px; font-weight: 600; line-height: 1.6; }',
      js: function (root) {
        var MODELS = { '7': { L: 32, H: 4096 }, '13': { L: 40, H: 5120 }, '70': { L: 80, H: 8192 } };
        var mEl = root.querySelector('.anim-m7-06-model');
        var pEl = root.querySelector('.anim-m7-06-prec');
        var cEl = root.querySelector('.anim-m7-06-ctx');
        var bEl = root.querySelector('.anim-m7-06-b');
        function gb(x) { return x >= 10 ? Math.round(x) + ' GB' : x.toFixed(1) + ' GB'; }
        function render() {
          var m = MODELS[mEl.value];
          var bytes = Number(pEl.value);
          var s = Number(cEl.value);
          var b = Number(bEl.value);
          var params = Number(mEl.value) * 1e9;
          var w = params * bytes / 1e9;
          var kvPerTok = 2 * m.L * m.H * bytes;
          var kv = kvPerTok * s * b / 1e9;
          root.querySelector('.anim-m7-06-wline').textContent = '权重：' + Number(mEl.value) + 'B × ' + bytes + ' 字节 = ' + gb(w);
          root.querySelector('.anim-m7-06-kvline').textContent = 'KV：2×' + m.L + '×' + m.H + '×' + s + '×' + b + '×' + bytes + 'B ≈ ' + gb(kv) + '（每 token 约 ' + Math.round(kvPerTok / 1024) + ' KB）';
          var total = w + kv;
          var scale = Math.max(30, total * 1.15);
          root.querySelector('.anim-m7-06-wbar').style.width = (w / scale * 100) + '%';
          root.querySelector('.anim-m7-06-kbar').style.width = (kv / scale * 100) + '%';
          root.querySelector('.anim-m7-06-ref').style.left = Math.min(100, 24 / scale * 100) + '%';
          var v = root.querySelector('.anim-m7-06-verdict');
          if (total * 1.15 <= 24) {
            v.textContent = '放得下：权重 ' + gb(w) + ' + KV ' + gb(kv) + ' = ' + gb(total) + '，24 GB 还剩约 ' + gb(Math.max(0, 24 - total)) + ' 给激活与余量。';
            v.style.color = '#047857';
          } else {
            v.textContent = '超出 24 GB：合计约 ' + gb(total) + '。先降精度（INT8/INT4）、减 batch 或砍上下文，或多卡切分——这正是"13B 能不能上 24G 卡"的判题过程。';
            v.style.color = '#b45309';
          }
          root.querySelector('.anim-m7-06-ctxv').textContent = s;
          root.querySelector('.anim-m7-06-bv').textContent = b;
        }
        [mEl, pEl, cEl, bEl].forEach(function (el) {
          el.addEventListener('input', render);
          el.addEventListener('change', render);
        });
        render();
      }
    },
    exercises: [
      {
        type: 'single', difficulty: 1,
        question: '7B 参数模型以 FP16 精度加载，仅权重就占多少显存？',
        options: ['约 14 GB', '约 7 GB', '约 28 GB', '约 3.5 GB'],
        answer: 0,
        explanation: '7×10⁹ × 2 字节 = 14 GB。7 GB 是 INT8、3.5 GB 是 INT4、28 GB 是 FP32。面试考点：显存 = 参数量 × 字节数是所有估算的第一行，报完权重账要主动说"还没算 KV 与激活"。'
      },
      {
        type: 'fill', difficulty: 2,
        question: 'LLaMA-7B（32 层、隐藏维 4096）FP16 下，单条请求 4096 token 上下文的 KV Cache 约占 ____ GB（填数字即可）。',
        accept: ['2', '2gb', '2 gb', '2.0', '2.1', '约2', '约2gb'],
        explanation: '每 token KV = 2×32×4096×2B = 512 KB；× 4096 token ≈ 2 GB。面试考点：KV 公式逐项代入，最容易错的三处——漏乘"2"（K+V 两份）、字节数用成 4（FP32）、忘了乘序列长度。'
      },
      {
        type: 'judge', difficulty: 2,
        question: '其他条件相同时，把 batch 从 1 加到 8，吞吐通常会明显上升，但显存占用与首 token 延迟的压力也会增大。',
        answer: true,
        explanation: 'decode 阶段是访存密集的，batch 变大让一次权重读取摊给多个请求，算力利用率与吞吐上升；同时 KV 显存随 batch 线性增长、请求在批内排队使 TTFT 变长。考点：吞吐-延迟-显存的三角权衡，是推理服务调参的核心直觉。'
      },
      {
        type: 'single', difficulty: 3,
        question: '老板问："24 GB 显卡能不能跑 13B 模型的服务？"最专业的回答是？',
        options: ['FP16 权重就要约 26 GB 装不下；换 INT4 约 6.5 GB 可行，再按上下文与并发算 KV 预算，并留 10%~20% 余量', '可以，13B 模型怎么都放得进 24 GB', '不行，13B 模型至少需要 8 张卡', '只看参数量就够了，13B 就是 13 GB，没问题'],
        answer: 0,
        explanation: '标准框架是分账：① 权重账判精度（FP16 26 GB 超了，INT4 6.5 GB 可行）；② KV 账判容量（按上下文 × 并发估算）；③ 留余量（激活 + 框架开销 10%~20%）。B 忽略精度与 KV；C 过度悲观（INT4/INT8 或张量并行皆可）；D 把参数量（个数）当字节数，混淆了 13B 与 13 GB。面试考点：估算题考的是分账思维而非背答案。'
      }
    ],
    relations: {
      prerequisites: ['m7-01', 'm7-03'],
      successors: [],
      confusables: [
        { other: 'm6-04', tip: '训练显存账 ≠ 推理显存账：训练还要存梯度和优化器状态（约为权重数倍），LoRA 正是为砍这笔账而生；推理账只有权重 + KV + 激活，别把两本账混算。' },
        { other: 'm7-01', tip: 'KV 显存公式里的"2"是 K 和 V 两份，不要与"batch=2"或"两条请求"混淆；六因子逐项代，口算才不出错。' },
        { other: 'm7-05', tip: '本课的 batch 是"一次前向并行处理几个请求"的容量账；vLLM 的分页与 continuous batching 是把这份容量用满的手段——先算得下，再塞得满。' }
      ]
    },
    memory: {
      mnemonic: '权重=参数×字节，KV=2×层×维×长×批。',
      selfTest: [
        { q: '口算：13B 模型 INT4 权重占多少显存？', a: '13×10⁹ × 0.5 字节 ≈ 6.5 GB。速查法：参数量 × 精度字节（FP32=4B/FP16=2B/INT8=1B/INT4=0.5B），面试先报权重账，再谈 KV。' },
        { q: 'TTFT 和 TPOT 分别衡量什么？', a: 'TTFT（Time To First Token，首 token 时间）主要由 prefill 决定，影响"等多久开始出字"；TPOT（Time Per Output Token，每 token 平均间隔）由 decode 速度决定，影响"打字机滚得顺不顺"。' },
        { q: '为什么加大 batch 能提升吞吐？代价是什么？', a: 'decode 阶段每步都要把全部权重从显存读一遍（访存密集），batch 大则一次读取服务多个请求，利用率上升；代价是 KV 显存随 batch 线性增长、排队使 TTFT 变长，需在吞吐与延迟/显存间权衡。' }
      ]
    },
    feynman: {
      prompt: '用一句话讲给完全外行听：怎么判断一张显卡能不能跑某个大模型？',
      reference: '像给货车装货：先称固定的大集装箱（模型权重=参数量×每个数占的字节），再按乘客人数和行李大小算行李舱（每个请求的 KV 缓存随对话长度和人数增长），两笔加起来不超过车斗容量（显存）就行；装不下，就换小箱子（量化）。'
    }
  }
  ]
});
