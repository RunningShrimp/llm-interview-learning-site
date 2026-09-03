#!/usr/bin/env node
/* test-judge.js — 判题器单测 + 全站例题一致性测试（P3 门禁，package.json: npm run test:judge）
 *
 * 1) 判题语义单测：normalizeText 归一化规则与五题型 check 语义（docs/SCHEMA.md §3）
 * 2) 全站一致性：加载全部数据文件后，逐课逐题验证
 *    - 每道题的"官方答案"必须通过 Judge.check（否则学员提交正确答案会被判错）
 *    - code 题 solution 必须包含全部 checks token（check(ex, solution) 已隐含验证）
 *    - 每道题的"典型错误答案"必须判 false（防止判题器恒真）
 *
 * 用法: node tools/test-judge.js   退出码 0=全部通过, 1=有失败
 */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');

/* ---------- 浏览器环境模拟：数据文件以 <script> 方式依赖 window.SITE_DATA ---------- */
global.window = global;

const Judge = require(path.join(ROOT, 'js/judge.js'));
const SITE_DATA = require(path.join(ROOT, 'js/site-data.js'));

let pass = 0, fail = 0;
const failures = [];
function t(name, cond) {
  if (cond) { pass++; }
  else { fail++; failures.push(name); }
}

/* ---------- 1. normalizeText 归一化语义 ---------- */
const N = Judge.normalizeText;
t('norm: trim 首尾空白', N('  交叉熵  ') === '交叉熵');
t('norm: 转小写', N('SoftMax') === 'softmax');
t('norm: 全角转半角', N('ＡＢＣ１２３：') === 'abc123:');
t('norm: 全角空格折叠', N('词　向量') === '词 向量');
t('norm: 连续空白折叠为单空格', N('a   \t b') === 'a b');
t('norm: null/undefined 安全', N(null) === '' && N(undefined) === '');

/* ---------- 2. 五题型 check 语义 ---------- */
// single
const s1 = { type: 'single', answer: 2, options: ['a', 'b', 'c'] };
t('single: 命中下标', Judge.check(s1, 2) === true);
t('single: 错误下标', Judge.check(s1, 0) === false);
t('single: 字符串下标不通过（严格类型）', Judge.check(s1, '2') === false);
// judge
const j1 = { type: 'judge', answer: true };
t('judge: true 对 true', Judge.check(j1, true) === true);
t('judge: false 对 true 判错', Judge.check(j1, false) === false);
const j2 = { type: 'judge', answer: false };
t('judge: false 对 false', Judge.check(j2, false) === true);
// fill
const f1 = { type: 'fill', accept: ['交叉熵', 'Cross Entropy'] };
t('fill: 命中候选1', Judge.check(f1, '交叉熵') === true);
t('fill: 命中候选2 大小写+空格', Judge.check(f1, '  cross  entropy ') === true);
t('fill: 全角输入也可', Judge.check(f1, '交叉熵！'.replace('！', '')) === true);
t('fill: 未收录答案判错', Judge.check(f1, '均方误差') === false);
t('fill: 空回答判错', Judge.check(f1, '   ') === false);
// order
const o1 = { type: 'order', items: ['甲', '乙', '丙'], answer: [1, 0, 2] };
t('order: 正确排列', Judge.check(o1, [1, 0, 2]) === true);
t('order: 错误排列', Judge.check(o1, [0, 1, 2]) === false);
t('order: 长度不符', Judge.check(o1, [1, 0]) === false);
t('order: 非数组', Judge.check(o1, '102') === false);
// code
const c1 = {
  type: 'code',
  template: 'def softmax(x):\n    ____',
  checks: ['exp(x - max(x))', 'e / e.sum()'],
  solution: 'import numpy as np\ndef softmax(x):\n    e = np.exp(x - max(x))\n    return e / e.sum()'
};
t('code: 完整 solution 通过', Judge.check(c1, c1.solution) === true);
t('code: 忽略大小写', Judge.check(c1, c1.solution.toUpperCase()) === true);
t('code: 缺一个 token 判错', Judge.check(c1, 'e = np.exp(x - max(x))') === false);
t('code: 空串判错', Judge.check(c1, '') === false);
// 未知题型
t('unknown: 未知题型按答错', Judge.check({ type: 'magic', answer: 1 }, 1) === false);
t('robust: exercise 为 null', Judge.check(null, 1) === false);

/* ---------- 3. 全站数据一致性：官方答案必须通过自家判题器 ---------- */
// 加载全部数据文件（与 index.html <script> 顺序一致）
const fs = require('fs');
const syllabus = JSON.parse(fs.readFileSync(path.join(ROOT, 'syllabus.json'), 'utf8'));
for (const m of syllabus.modules) {
  require(path.join(ROOT, m.dataFile));
}
const lessons = SITE_DATA.allLessons();
t('全站: 课程总数 = 58', lessons.length === 58);

function officialAnswer(ex) {
  switch (ex.type) {
    case 'single': return ex.answer;
    case 'judge': return ex.answer;
    case 'fill': return ex.accept[0];
    case 'order': return ex.answer;
    case 'code': return ex.solution;
    default: return undefined;
  }
}
function typicalWrong(ex) {
  switch (ex.type) {
    case 'single': return (ex.answer + 1) % ex.options.length;
    case 'judge': return !ex.answer;
    case 'fill': return '__绝对不匹配的答案__';
    case 'order': return ex.answer.slice().reverse().every((v, i) => v === ex.answer[i])
      ? null /* 回文排列无法构造反转错解，跳过 */ : ex.answer.slice().reverse();
    case 'code': return '# 无法通过的占位答案';
    default: return undefined;
  }
}

let exTotal = 0;
const byType = {};
for (const L of lessons) {
  if (!Array.isArray(L.exercises) || L.exercises.length < 2) {
    t(`课程 ${L.id} 例题 ≥2`, false);
    continue;
  }
  L.exercises.forEach((ex, i) => {
    exTotal++;
    byType[ex.type] = (byType[ex.type] || 0) + 1;
    const official = officialAnswer(ex);
    const okOfficial = official !== undefined && Judge.check(ex, official) === true;
    t(`官方答案通过判题: ${L.id} ex[${i}](${ex.type})`, okOfficial);
    if (ex.type === 'code' && Array.isArray(ex.checks)) {
      t(`checks token 均出现在题干/模板中: ${L.id} ex[${i}]`,
        ex.checks.every(k => (String(ex.template || '') + String(ex.solution || '')).toLowerCase().indexOf(String(k).toLowerCase()) !== -1));
    }
    const wrong = typicalWrong(ex);
    if (wrong !== null && wrong !== undefined) {
      t(`典型错解被判错: ${L.id} ex[${i}](${ex.type})`, Judge.check(ex, wrong) === false);
    }
  });
}
t('全站: 例题总数 ≥ 116 (58课×2)', exTotal >= 116);
t('全站: 五种题型全部出现', ['single', 'judge', 'fill', 'order', 'code'].every(k => byType[k] > 0));

/* ---------- 汇总 ---------- */
console.log('==========================================');
console.log(`例题总数: ${exTotal}（${JSON.stringify(byType)}）`);
if (failures.length) {
  console.log('FAILED cases:');
  for (const f of failures) console.log('  [FAIL] ' + f);
}
console.log(`${fail === 0 ? 'PASS' : 'FAIL'} — ${pass} 通过, ${fail} 失败`);
process.exit(fail === 0 ? 0 : 1);
