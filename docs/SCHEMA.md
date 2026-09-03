# 数据契约（SCHEMA v1）— 所有内容数据文件的唯一规范

本文件是「主 Agent ↔ 骨架代码 ↔ 内容数据」三方之间**唯一契约**。
骨架渲染代码与内容数据若与本文件冲突，以本文件为准。

## 1. 文件与加载方式

- 目录：`/data/`，每个模块一个文件，文件名以 `syllabus.json` 中 `modules[].dataFile` 为准
  （如 `data/m1-foundations.js`）。
- 纯 JS 文件（非 JSON），由 `index.html` 用 `<script>` 标签顺序加载，**禁止 fetch、禁止任何网络请求**。
- 每个文件在**末尾且仅一次**调用注册函数：

```js
window.SITE_DATA.registerModule({
  module: "M1",              // 与 syllabus.json modules[].id 一致
  title: "数学与编程地基",
  icon: "🧮",
  color: "#6366f1",
  lessons: [ /* Lesson 对象，顺序即学习顺序 */ ]
});
```

- 文件顶层可以有 `/* 注释 */`；若内容未经联网核实，首行加注释 `// knowledge_source: "internal"`。

## 2. Lesson 对象（知识点页面模板的 8 要素 + 费曼挑战）

```js
{
  id: "m1-01",                    // 必须与 syllabus.json 完全一致，不得增删改
  title: "向量与矩阵",             // 与 syllabus.json 一致
  oneLiner: "一句话说明本课解决什么问题",
  estMinutes: 10,
  analogy: {                      // ① 生活类比引入
    title: "类比标题（如：外卖点单）",
    body: "类比正文，可含 <b>/<i>/<code> 等内联 HTML"
  },
  intuition: [                    // ② 小白直觉讲解，2~3 段
    { heading: "小节标题", body: "讲解正文（内联 HTML）" }
  ],
  principle: [                    // ③ 原理拆解，2~3 小节；公式必须逐项翻译
    {
      heading: "小节标题",
      body: "讲解正文（内联 HTML）",
      formula: "Attention(Q,K,V) = softmax(QK^T / √d_k) V",   // 可选，纯文本/简单 <sup> 等
      formulaNote: "<ul><li><b>Q</b>：查询，我想找什么…</li>…</ul>"  // 有 formula 时必给，逐项解释
    }
  ],
  animation: {                    // ④ 动画可视化（必填，交互式）
    title: "动画标题",
    html: "<div class='anim-m1-01'>…控件与展示区…</div>",   // ≥40 字符，结构完整
    css: ".anim-m1-01 { … }",     // 可选，动画私有样式（类名必须以 anim-{lesson id} 开头）
    js: function (root) { … }     // 可选；root=动画容器 DOM。所有交互在闭包内完成
  },
  exercises: [ /* Exercise，≥2 道，难度递进，见 §3 */ ],
  relations: {                    // ⑦ 知识关联卡
    prerequisites: ["m1-01"],     // 前置依赖（syllabus 真实 id，可为空数组）
    successors: ["m1-03"],        // 后继衔接
    confusables: [                // 易混概念对比，≥1 条
      { other: "m2-03", tip: "与逻辑回归的区别：…" }
    ]
  },
  memory: {                       // ⑧ 记忆锚点
    mnemonic: "一句话口诀",
    selfTest: [ { q: "自测问题", a: "参考答案" } ]   // ≥2 张可折叠自测卡
  },
  feynman: {                      // 费曼复述挑战
    prompt: "用一句话讲给完全外行听：什么是…？",
    reference: "参考表述（学员作答后展开对照）"
  }
}
```

### 硬性要求
- `id`/`title`/`prerequisites` 与 `syllabus.json` 一致；`exercises` 至少覆盖 syllabus 中该课
  `exerciseTypes` 列出的每种题型各 1 道，总数 ≥2。
- 正文语言：中文；术语首次出现附英文（如「注意力（Attention）」）。
- 学员画像：纯小白。先类比、后直觉、再公式；`formulaNote` 必须逐项翻译公式含义与直觉。
- `animation`：原生 HTML/CSS/JS 自包含；交互由按钮/滑块事件驱动，过渡用 CSS；
  **禁止** `setInterval`/`setTimeout` 轮询、外部库、`http(s)://` 资源、全局变量泄漏、
  内联 `onclick`（用 `root.querySelector(...).addEventListener`）。
- 所有动画类名前缀 `anim-{lesson id}`，避免与站点样式冲突。

## 3. Exercise 对象（按 type 判别的五类）

| type | 判题语义 | 专属字段 |
|---|---|---|
| `single` | 用户所选下标 === answer | `options: string[]`（≥2，不重复）；`answer: number` |
| `judge`  | 用户选对/错 === answer | `answer: boolean` |
| `fill`   | 归一化后与 accept 任一项相等 | `accept: string[]`（≥1） |
| `order`  | 用户排序数组深度等于 answer | `items: string[]`（≥3）；`answer: number[]`（下标完整排列） |
| `code`   | 用户代码包含全部 checks（忽略大小写的子串匹配） | `template: string`（含 `____` 占位）；`checks: string[]`（1~5 个关键 token）；`solution: string` 完整参考代码 |

公共字段（每题必备）：

```js
{
  type: "single" | "judge" | "fill" | "order" | "code",
  difficulty: 1 | 2 | 3,          // 难度递进：入门/巩固/挑战
  question: "题干（可含 <code> 内联代码）",
  explanation: "逐题解析（≥20 字，讲清为什么对、错误选项/常见误区错在哪）",
  ...专属字段
}
```

- `fill` 归一化规则（判题器实现）：去除首尾空白 → 转小写 → 全角转半角 → 内部连续空白折叠为单个空格。
- `order` 的 `answer` 给出**正确顺序的下标数组**，如 items=[甲,乙,丙] 正确顺序为 乙→甲→丙 则 `answer:[1,0,2]`。

## 4. 运行时全局 API（骨架实现，数据文件只依赖 SITE_DATA）

```js
window.SITE_DATA = {
  modules: [],                                   // 注册后的模块数组（顺序=加载顺序）
  registerModule(mod),                           // 数据文件唯一入口
  allLessons(),                                  // 展平的全部课程（模块顺序内保持 lessons 顺序）
  getLesson(id),                                 // 按 id 查课程；找不到返回 undefined
  moduleOf(lessonId),                            // 课程所属模块对象
  lessonIndex(id)                                // 在 allLessons() 中的位置（上一课/下一课用）
};

window.ProgressStore = {                         // localStorage 持久化，key: 'llmsite.progress.v1'
  get(lessonId),                                 // → { visited, answers, box, due, lastTs } 或 null
  markVisited(lessonId),
  recordAnswer(lessonId, exIndex, correct),      // 正确 box+1（封顶5），错误 box 归 0；due=lastCorrect+interval[box]
  mastered(lessonId),                            // 全部例题至少答对过一次
  dueForReview(),                                // 已学且 due ≤ now 的课程 id 数组
  stats()                                        // → { total, visited, mastered, dueToday }
};
// 间隔重复间隔表（天）：[0, 1, 3, 7, 14, 30]，box 初始 0

window.Judge = {
  normalizeText(s),                              // §3 fill 归一化
  check(exercise, userAnswer)                    // → boolean，纯函数（node 可测）
};
// judge.js/progress.js 需支持 node 单测：文件末尾
// if (typeof module !== 'undefined') { module.exports = {...}; }
```

## 5. 路由与页面（骨架实现）

| hash | 页面 |
|---|---|
| `#/` | 学习地图（模块→课程树形可折叠 + 总进度 + 今日复习入口） |
| `#/lesson/{id}` | 知识点页（8 要素 + 费曼 + 判题 + 朗读 + 上一课/下一课） |
| `#/review` | 今日复习队列（dueForReview + 未学推荐） |
| `#/quiz/{moduleId}` | 模块混排测验（该模块全部课程随机抽 10 题） |
| `#/graph` | 全站知识关联图谱（模块分组 + 依赖/后继链接 + 依赖序学习路径） |

## 6. 校验

```bash
node tools/validate-data.js data/m1-foundations.js   # 单文件校验，必须 PASS
node tools/validate-data.js --all                    # 全站校验（要求 58 课全覆盖）
node tools/test-judge.js                             # 判题器单测
```
