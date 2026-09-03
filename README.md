# 大模型算法岗 · 零基础交互式学习网站

一个专为「零基础冲大模型算法岗面试」准备的纯静态学习站：**10 个模块 · 58 个知识点 · 184 道即判例题**，
每个知识点都按同一套模板讲——生活类比引入 → 小白直觉 → 原理逐项拆解 → 交互动画 → 例题闯关 → 费曼复述 → 知识关联 → 记忆锚点。

**零依赖、零构建、零后端**：纯 HTML/CSS/原生 JS，学习进度存在浏览器本地（localStorage），
克隆下来就能用，推开即能部署到 GitHub Pages。

---

## ✨ 功能

| 功能 | 说明 |
|---|---|
| 🗺️ 学习地图 | 10 个模块树形可折叠，进度圆点标记 未学/进行中/已掌握 |
| 🎬 交互动画 | 每课一个针对核心机制的原生 JS 动画（注意力打分、梯度下降、KV Cache 省了多少计算…） |
| ✏️ 例题闯关 | 单选/判断/填空/排序/代码补全五题型，前端即时判题 + 逐题解析（答错显示正确答案） |
| ⏰ 今日复习 | 艾宾浩斯间隔重复（答对 box+1，间隔 [0,1,3,7,14,30] 天；答错归零），首页自动生成复习队列 |
| 🎲 模块混排测验 | 每模块随机抽 10 题交叉检验，测验结果不计入复习计划 |
| 🕸️ 知识图谱 | 全站 58 课依赖关系 + 大纲序学习路径 + 127 张「易混概念对比」卡 |
| 🔊 朗读本课 | Web Speech API 浏览器原生 TTS，多感官学习，无任何外部服务 |
| 🎤 费曼挑战 | 每课末尾「用一句话讲给外行听」复述挑战，可对照参考表述 |

## 🚀 本地预览

任选其一：

```bash
# 方式一：本地起个静态服务（推荐）
python3 -m http.server 8080
# 打开 http://localhost:8080

# 方式二：直接双击 index.html（本站无 fetch 请求，file:// 协议也能完整运行）
```

## 📦 部署到 GitHub Pages

1. 在 GitHub 新建一个空仓库（公开），**不要**勾选自动生成 README；
2. 本目录下执行：

```bash
git init
git add .
git commit -m "feat: 大模型算法岗零基础学习站 v1.0"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

3. 打开仓库页面 → **Settings → Pages**；
4. **Build and deployment → Source** 选 `Deploy from a branch`；
5. **Branch** 选 `main`，目录选 `/ (root)`，点 Save；
6. 等 1~2 分钟，访问 `https://<你的用户名>.github.io/<仓库名>/` 即可。

> 仓库根目录已放置 `.nojekyll`（跳过 Jekyll 处理），无需任何额外配置。

## 📁 目录结构

```
├── index.html              # 单页入口（hash 路由）
├── css/style.css           # 全站样式（响应式，移动端适配）
├── js/
│   ├── site-data.js        # 数据注册中心 window.SITE_DATA
│   ├── progress.js         # 进度与间隔重复 window.ProgressStore
│   ├── judge.js            # 判题器 window.Judge（纯函数，node 可测）
│   └── app.js              # 路由 + 五个视图渲染
├── data/                   # 内容数据（每模块一个文件，与模板分离）
│   ├── m1-foundations.js        # M1 数学与编程地基（6 课）
│   ├── m2-traditional-ml.js     # M2 传统机器学习（7 课）
│   ├── m3-deep-learning.js      # M3 深度学习基础（7 课）
│   ├── m4-nlp-embeddings.js     # M4 NLP 与词向量（5 课）
│   ├── m5-transformer.js        # M5 Transformer 与 LLM 架构（6 课）
│   ├── m6-training-finetuning.js# M6 预训练与微调（6 课）
│   ├── m7-inference-deployment.js# M7 推理与部署（6 课）
│   ├── m8-llm-applications.js   # M8 LLM 应用（5 课）
│   ├── m9-hand-code.js          # M9 手撕代码（6 课）
│   └── m10-interview-skills.js  # M10 面试软技能（4 课）
├── syllabus.json           # 大纲（唯一事实源：58 课的 id/前置/题型规划）
├── docs/SCHEMA.md          # 数据契约（新增/修改内容的规范）
├── docs/qa/                # 验收截图
├── tools/
│   ├── validate-data.js    # 数据校验器（结构 + 题型覆盖 + 大纲一致性）
│   └── test-judge.js       # 判题器单测 + 全站 184 题官方答案一致性测试
├── DECISIONS.md            # 架构与内容决策记录
└── .nojekyll               # GitHub Pages 跳过 Jekyll
```

## 🧪 校验与测试

```bash
node tools/validate-data.js --all    # 全站数据校验（要求 58 课全覆盖）→ PASS
node tools/test-judge.js             # 判题语义单测 + 全站官方答案一致性 → PASS
npm run validate && npm run test:judge
```

## ✍️ 如何新增/修改知识点

1. 改 `syllabus.json`：在对应模块的 `lessons` 里加一行（id、前置、题型规划）；
2. 按规范编辑对应 `data/m{N}-*.js`（字段契约见 `docs/SCHEMA.md`，8 要素缺一不可）；
3. 跑上面两条校验命令，全绿即完成——页面无需任何改动（地图/图谱/测验自动发现新内容）。

## ⚠️ 已知限制

- 代码补全题按「关键 token 子串匹配」判题（忽略大小写），能区分会不会，但不等价于真实运行代码；
- 进度存在浏览器 localStorage，换浏览器/设备/隐私模式不互通，清除浏览器数据会清空进度；
- 朗读功能依赖设备本地 TTS 音色，不同浏览器音质不一，不支持朗读的浏览器会自动隐藏按钮；
- 内容按 2026-09 时点的大模型领域常识编写（关键论文/出处已经内容子代理联网核对，
  标注 `knowledge_source: "internal"` 的文件为内部知识生成），模型迭代快，学习时请以最新版本文档为准。
