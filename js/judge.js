/* judge.js — 判题器（docs/SCHEMA.md §3 判题语义）
 * 纯函数，不碰 DOM，node 可单测。
 * - normalizeText：trim → 小写 → 全角转半角 → 连续空白折叠
 * - check：按 exercise.type 分派；未知 type 返回 false 且 console.warn 一次
 */
(function (global) {
  'use strict';

  var warnedUnknown = false;

  /* 全角（FF01~FF5E）转半角，全角空格 U+3000 转普通空格 */
  function fullWidthToHalf(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var code = s.charCodeAt(i);
      if (code === 0x3000) {
        out += ' ';
      } else if (code >= 0xff01 && code <= 0xff5e) {
        out += String.fromCharCode(code - 0xfee0);
      } else {
        out += s.charAt(i);
      }
    }
    return out;
  }

  /* §3 fill 归一化：去除首尾空白 → 转小写 → 全角转半角 → 内部连续空白折叠为单个空格 */
  function normalizeText(s) {
    var t = String(s === null || s === undefined ? '' : s);
    t = t.trim();
    t = t.toLowerCase();
    t = fullWidthToHalf(t);
    t = t.replace(/\s+/g, ' ');
    return t.trim();
  }

  function deepEqualArray(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  /* → boolean。userAnswer 形态由题型决定：
   * single: 选中下标(number)；judge: true/false；fill: 字符串；
   * order: items 下标数组；code: 代码字符串 */
  function check(exercise, userAnswer) {
    if (!exercise || typeof exercise !== 'object') return false;

    switch (exercise.type) {
      case 'single':
        return typeof exercise.answer === 'number' && userAnswer === exercise.answer;

      case 'judge':
        return typeof exercise.answer === 'boolean' && userAnswer === exercise.answer;

      case 'fill': {
        if (!Array.isArray(exercise.accept)) return false;
        var ua = normalizeText(userAnswer);
        if (!ua) return false;
        for (var i = 0; i < exercise.accept.length; i++) {
          if (normalizeText(exercise.accept[i]) === ua) return true;
        }
        return false;
      }

      case 'order':
        return deepEqualArray(userAnswer, exercise.answer);

      case 'code': {
        if (typeof userAnswer !== 'string' || !Array.isArray(exercise.checks)) return false;
        var code = userAnswer.toLowerCase();
        for (var j = 0; j < exercise.checks.length; j++) {
          if (code.indexOf(String(exercise.checks[j]).toLowerCase()) === -1) return false;
        }
        return true;
      }

      default:
        if (!warnedUnknown) {
          warnedUnknown = true;
          try {
            global.console.warn('[Judge] 未知题型: ' + exercise.type + '，按答错处理');
          } catch (e) { /* 忽略 */ }
        }
        return false;
    }
  }

  global.Judge = { normalizeText: normalizeText, check: check };

  // node 单测兼容（SCHEMA §4 要求）
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { normalizeText: normalizeText, check: check };
  }
})(typeof window !== 'undefined' ? window : globalThis);
