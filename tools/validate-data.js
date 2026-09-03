#!/usr/bin/env node
/* 数据文件校验器（P2/P3 验收门禁）
 * 用法:
 *   node tools/validate-data.js data/m1-foundations.js [more files...]
 *   node tools/validate-data.js --all      # 校验 data/*.js 全部并要求 syllabus 全覆盖
 * 退出码: 0=PASS, 1=FAIL
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const syllabus = JSON.parse(fs.readFileSync(path.join(ROOT, 'syllabus.json'), 'utf8'));
const lessonById = new Map(syllabus.lessons.map(l => [l.id, l]));
const moduleIds = new Set(syllabus.modules.map(m => m.id));
const VALID_TYPES = ['single', 'judge', 'fill', 'order', 'code'];

function typeSpecificCheck(e, errs, tag) {
  switch (e.type) {
    case 'single':
      if (!Array.isArray(e.options) || e.options.length < 2) { errs.push(tag + ' options 至少 2 项'); break; }
      if (new Set(e.options).size !== e.options.length) errs.push(tag + ' options 存在重复项');
      if (!Number.isInteger(e.answer) || e.answer < 0 || e.answer >= e.options.length)
        errs.push(tag + ' answer 必须是 options 的合法下标');
      break;
    case 'judge':
      if (typeof e.answer !== 'boolean') errs.push(tag + ' judge 题 answer 必须是 true/false');
      break;
    case 'fill':
      if (!Array.isArray(e.accept) || e.accept.length < 1 ||
          !e.accept.every(s => typeof s === 'string' && s.trim().length > 0))
        errs.push(tag + ' fill 题 accept 必须是非空字符串数组(≥1)');
      break;
    case 'order': {
      if (!Array.isArray(e.items) || e.items.length < 3) { errs.push(tag + ' order 题 items 至少 3 项'); break; }
      const n = e.items.length;
      const ok = Array.isArray(e.answer) && e.answer.length === n &&
        [...e.answer].sort((a, b) => a - b).every((v, i) => v === i);
      if (!ok) errs.push(tag + ' order 题 answer 必须是 items 下标的完整排列');
      break;
    }
    case 'code':
      if (typeof e.template !== 'string' || e.template.trim().length < 10) errs.push(tag + ' code 题缺少 template');
      if (!Array.isArray(e.checks) || e.checks.length < 1 || e.checks.length > 5 ||
          !e.checks.every(s => typeof s === 'string' && s.trim()))
        errs.push(tag + ' code 题需 1~5 个非空 checks');
      if (typeof e.solution !== 'string' || e.solution.trim().length < 10) errs.push(tag + ' code 题缺少完整 solution');
      break;
    default:
      errs.push(tag + ' 未知题型: ' + e.type);
  }
}

function validateFile(file, errs, warns, seenIds) {
  const abs = path.resolve(ROOT, file);
  if (!fs.existsSync(abs)) { errs.push(file + ' 不存在'); return null; }
  const code = fs.readFileSync(abs, 'utf8');
  const registered = [];
  const stub = { SITE_DATA: { registerModule(mod) { registered.push(mod); } } };
  try {
    new Function('window', code)(stub);
  } catch (err) {
    errs.push(file + ' 执行失败: ' + err.message);
    return null;
  }
  if (registered.length !== 1) { errs.push(file + ' 必须且只能调用一次 registerModule（实际 ' + registered.length + '）'); return null; }
  const mod = registered[0];
  if (!moduleIds.has(mod.module)) { errs.push(file + ' module 非法: ' + mod.module); return null; }
  if (typeof mod.title !== 'string' || !mod.title) errs.push(file + ' 缺少模块 title');

  const planned = syllabus.lessons.filter(l => l.module === mod.module);
  const plannedIds = planned.map(l => l.id);
  const gotIds = (mod.lessons || []).map(l => l.id);

  if ((mod.lessons || []).length === 0) { warns.push(file + ' 是空壳(stub)，0 个知识点'); return mod; }

  for (const gid of gotIds) {
    if (seenIds.has(gid)) errs.push(file + ' 知识点 id 重复注册: ' + gid);
    seenIds.add(gid);
    if (!lessonById.has(gid)) errs.push(file + ' 知识点 id 不在 syllabus 中: ' + gid);
  }
  for (const pid of plannedIds) {
    if (!gotIds.includes(pid)) errs.push(file + ' 缺少 syllabus 规定的知识点: ' + pid);
  }
  if (gotIds.length !== plannedIds.length)
    warns.push(file + ' 知识点数 ' + gotIds.length + ' ≠ syllabus 规定 ' + plannedIds.length);

  (mod.lessons || []).forEach((L, li) => {
    const tag = file + ' lessons[' + li + '](' + (L.id || '?') + ')';
    const S = lessonById.get(L.id);
    if (S) {
      if (L.title !== S.title) warns.push(tag + ' title 与 syllabus 不一致: ' + L.title + ' ≠ ' + S.title);
      if (Array.isArray(L.relations) && JSON.stringify(L.relations.prerequisites || []) !== JSON.stringify(S.prerequisites)) { /* 仅提示，relations 允许补充 */ }
    }
    if (typeof L.oneLiner !== 'string' || L.oneLiner.length < 5) errs.push(tag + ' 缺 oneLiner');
    if (!L.analogy || typeof L.analogy.title !== 'string' || typeof L.analogy.body !== 'string' ||
        L.analogy.body.length < 30) errs.push(tag + ' ①类比缺失或过短');
    if (!Array.isArray(L.intuition) || L.intuition.length < 2 ||
        !L.intuition.every(s => s && s.heading && typeof s.body === 'string' && s.body.length >= 20))
      errs.push(tag + ' ②直觉讲解需 ≥2 段且每段 ≥20 字');
    if (!Array.isArray(L.principle) || L.principle.length < 1 ||
        !L.principle.every(s => s && s.heading && typeof s.body === 'string' && s.body.length >= 20))
      errs.push(tag + ' ③原理拆解缺失或过短');
    for (const s of (L.principle || [])) {
      if (s.formula && (!s.formulaNote || s.formulaNote.length < 20))
        errs.push(tag + ' 有 formula 必须给逐项 formulaNote');
    }
    const A = L.animation;
    if (!A || typeof A.title !== 'string' || typeof A.html !== 'string' || A.html.length < 40)
      errs.push(tag + ' ④动画缺失（需 title + ≥40 字符 html）');
    if (A) {
      if (A.css && typeof A.css !== 'string') errs.push(tag + ' animation.css 须为字符串');
      if (A.js && typeof A.js !== 'function') errs.push(tag + ' animation.js 须为函数');
      for (const piece of [A.html || '', A.css || '']) {
        if (/https?:\/\//i.test(piece)) errs.push(tag + ' 动画禁止外部 URL 资源');
      }
    }
    const EX = L.exercises;
    if (!Array.isArray(EX) || EX.length < 2) { errs.push(tag + ' ⑤例题至少 2 道'); }
    else {
      EX.forEach((e, ei) => {
        const t2 = tag + ' ex[' + ei + ']';
        if (!VALID_TYPES.includes(e.type)) { errs.push(t2 + ' 非法题型'); return; }
        if (![1, 2, 3].includes(e.difficulty)) errs.push(t2 + ' difficulty 必须是 1/2/3');
        if (typeof e.question !== 'string' || e.question.length < 5) errs.push(t2 + ' 缺题干');
        if (typeof e.explanation !== 'string' || e.explanation.length < 20) errs.push(t2 + ' ⑥解析缺失或过短');
        typeSpecificCheck(e, errs, t2);
      });
      const diffs = EX.map(e => e.difficulty || 0);
      if (diffs.some((d, i) => i > 0 && d < diffs[i - 1])) warns.push(tag + ' 例题难度未递进');
      if (S && Array.isArray(S.exerciseTypes)) {
        for (const t of S.exerciseTypes) {
          if (!EX.some(e => e.type === t)) errs.push(tag + ' 未覆盖 syllabus 规划题型: ' + t);
        }
      }
    }
    const R = L.relations;
    if (!R || !Array.isArray(R.prerequisites) || !Array.isArray(R.successors) || !Array.isArray(R.confusables))
      errs.push(tag + ' ⑦知识关联卡缺失（relations 三数组必备）');
    else {
      for (const pid of [...R.prerequisites, ...R.successors]) {
        if (!lessonById.has(pid)) errs.push(tag + ' 关联 id 不存在: ' + pid);
      }
      if (R.confusables.length < 1) errs.push(tag + ' ⑦缺易混概念对比（confusables ≥1）');
      else R.confusables.forEach(c => {
        if (!c || !lessonById.has(c.other) || typeof c.tip !== 'string' || c.tip.length < 10)
          errs.push(tag + ' confusable 需 {other: 合法id, tip: ≥10字}');
      });
      for (const pid of R.prerequisites) {
        const pi = syllabus.lessons.findIndex(l => l.id === pid);
        const ci = syllabus.lessons.findIndex(l => l.id === L.id);
        if (pi >= 0 && ci >= 0 && pi > ci) warns.push(tag + ' 前置 ' + pid + ' 在大纲中顺序靠后，请检查');
      }
    }
    const M = L.memory;
    if (!M || typeof M.mnemonic !== 'string' || M.mnemonic.length < 5 ||
        !Array.isArray(M.selfTest) || M.selfTest.length < 2 ||
        !M.selfTest.every(c => c && c.q && c.a))
      errs.push(tag + ' ⑧记忆锚点缺失（口诀 + ≥2 张自测卡）');
    if (!L.feynman || typeof L.feynman.prompt !== 'string' || typeof L.feynman.reference !== 'string' ||
        L.feynman.prompt.length < 5 || L.feynman.reference.length < 10)
      errs.push(tag + ' 费曼挑战缺失（prompt + reference）');
  });
  return mod;
}

function main() {
  const args = process.argv.slice(2);
  const errs = [], warns = [], seenIds = new Set();
  const mods = [];
  if (args.length === 0) { console.error('用法: node tools/validate-data.js <file...> | --all'); process.exit(1); }
  const files = args.includes('--all')
    ? syllabus.modules.map(m => m.dataFile)
    : args;
  for (const f of files) {
    const mod = validateFile(f, errs, warns, seenIds);
    if (mod) mods.push({ file: f, mod });
  }
  if (args.includes('--all')) {
    const covered = seenIds.size;
    const total = syllabus.lessons.length;
    if (covered !== total) errs.push('--all 覆盖率不足: ' + covered + '/' + total);
    for (const id of syllabus.lessons.map(l => l.id)) {
      if (!seenIds.has(id)) errs.push('未实现的知识点: ' + id);
    }
  }
  console.log('==========================================');
  for (const w of warns) console.log('  [WARN] ' + w);
  for (const e of errs) console.log('  [ERROR] ' + e);
  console.log((errs.length ? 'FAIL' : 'PASS') + ' — ' + mods.length + ' 个文件, ' + seenIds.size + ' 个知识点, ' +
    errs.length + ' 错误, ' + warns.length + ' 警告');
  process.exit(errs.length ? 1 : 0);
}
main();
