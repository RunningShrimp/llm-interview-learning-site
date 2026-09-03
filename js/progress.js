/* progress.js — ProgressStore（docs/SCHEMA.md §4）
 * - 持久化：localStorage key 'llmsite.progress.v1'，读写全程 try/catch
 *   （file:// 隐私模式下访问 localStorage 可能抛 SecurityError，降级为内存存储，不抛错）
 * - 间隔重复：间隔表 [0,1,3,7,14,30] 天；答对 box+1（封顶 5），答错 box 归 0
 * - due = lastCorrectTs + interval[box] 天
 */
(function (global) {
  'use strict';

  var KEY = 'llmsite.progress.v1';
  var INTERVALS = [0, 1, 3, 7, 14, 30]; // 天，index = box（0~5）
  var MAX_BOX = 5;
  var DAY_MS = 24 * 60 * 60 * 1000;

  var fallbackMemory = null; // localStorage 不可用时的内存兜底
  var state = load();

  function storage() {
    try {
      if (typeof localStorage === 'undefined') return null;
      // 触发一次真实读取：隐私模式下访问本身就会抛错，由 catch 兜住
      localStorage.getItem(KEY);
      return localStorage;
    } catch (e) {
      return null;
    }
  }

  function emptyState() {
    return { lessons: {} };
  }

  function load() {
    try {
      var s = storage();
      if (s) {
        var raw = s.getItem(KEY);
        if (raw) {
          var obj = JSON.parse(raw);
          if (obj && typeof obj === 'object' && obj.lessons && typeof obj.lessons === 'object') {
            return obj;
          }
        }
      }
    } catch (e) {
      /* JSON 损坏视为首次使用 */
    }
    return emptyState();
  }

  function save() {
    var s = storage();
    if (!s) {
      fallbackMemory = state;
      return;
    }
    try {
      s.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      fallbackMemory = state; // 写入失败（配额/隐私模式）降级内存
    }
  }

  function ensure(lessonId) {
    if (!state.lessons[lessonId] || typeof state.lessons[lessonId] !== 'object') {
      // lastCorrectTs 为内部字段（不写入 get() 返回值，保持 SCHEMA 形状）
      state.lessons[lessonId] = { visited: false, answers: {}, box: 0, due: 0, lastTs: 0, lastCorrectTs: 0 };
    }
    return state.lessons[lessonId];
  }

  /* 该课是否至少提交过一道题（复习队列只收做过题的课） */
  function hasAnswers(r) {
    return !!(r && r.answers && Object.keys(r.answers).length > 0);
  }

  var ProgressStore = {
    /* → { visited, answers, box, due, lastTs } 或 null（SCHEMA §4 形状） */
    get: function (lessonId) {
      var r = state.lessons[lessonId];
      if (!r) return null;
      var answers = {};
      for (var k in r.answers) {
        if (Object.prototype.hasOwnProperty.call(r.answers, k)) answers[k] = r.answers[k];
      }
      return { visited: !!r.visited, answers: answers, box: r.box || 0, due: r.due || 0, lastTs: r.lastTs || 0 };
    },

    markVisited: function (lessonId) {
      var r = ensure(lessonId);
      r.visited = true;
      r.lastTs = Date.now();
      save();
    },

    /* 正确 box+1（封顶5），错误 box 归 0；due = lastCorrectTs + interval[box] 天 */
    recordAnswer: function (lessonId, exIndex, correct) {
      var r = ensure(lessonId);
      var now = Date.now();
      r.visited = true;
      r.lastTs = now;

      var key = String(exIndex);
      var a = r.answers[key] || { correct: false, ever: false, ts: 0 };
      a.correct = !!correct;
      a.ever = a.ever || !!correct; // mastered 用：该题至少答对过一次
      a.ts = now;
      r.answers[key] = a;

      if (correct) {
        r.box = Math.min(MAX_BOX, (r.box || 0) + 1);
        r.lastCorrectTs = now;
        r.due = now + INTERVALS[r.box] * DAY_MS;
      } else {
        r.box = 0;
        // due = lastCorrectTs + interval[0](0 天)；从未答对过则从现在起立即到期
        r.due = (r.lastCorrectTs || now) + INTERVALS[0] * DAY_MS;
      }
      save();
    },

    /* 全部例题（对照 exercise 数组长度）至少答对过一次 */
    mastered: function (lessonId) {
      var r = state.lessons[lessonId];
      if (!r) return false;
      var lesson = null;
      try {
        lesson = global.SITE_DATA ? global.SITE_DATA.getLesson(lessonId) : null;
      } catch (e) {
        lesson = null;
      }
      if (!lesson || !Array.isArray(lesson.exercises) || !lesson.exercises.length) return false;
      for (var i = 0; i < lesson.exercises.length; i++) {
        var a = r.answers[String(i)];
        if (!a || !a.ever) return false;
      }
      return true;
    },

    /* 已访问过且 due ≤ now 的课程 id 数组，按 due 升序
     * 只统计至少答过一题的课：纯浏览不产生记忆负担，不进复习队列 */
    dueForReview: function () {
      var now = Date.now();
      var out = [];
      for (var id in state.lessons) {
        if (!Object.prototype.hasOwnProperty.call(state.lessons, id)) continue;
        var r = state.lessons[id];
        if (r && r.visited && hasAnswers(r) && (r.due || 0) <= now) out.push({ id: id, due: r.due || 0 });
      }
      out.sort(function (a, b) { return a.due - b.due; });
      return out.map(function (x) { return x.id; });
    },

    /* → { total, visited, mastered, dueToday } */
    stats: function () {
      var total = 0;
      try {
        total = global.SITE_DATA && global.SITE_DATA.allLessons ? global.SITE_DATA.allLessons().length : 0;
      } catch (e) {
        total = 0;
      }
      var now = Date.now();
      var visited = 0;
      var mastered = 0;
      var dueToday = 0;
      for (var id in state.lessons) {
        if (!Object.prototype.hasOwnProperty.call(state.lessons, id)) continue;
        var r = state.lessons[id];
        if (!r || !r.visited) continue;
        visited += 1;
        if (hasAnswers(r) && (r.due || 0) <= now) dueToday += 1;
        if (ProgressStore.mastered(id)) mastered += 1;
      }
      return { total: total, visited: visited, mastered: mastered, dueToday: dueToday };
    }
  };

  global.ProgressStore = ProgressStore;

  // node 单测兼容（SCHEMA §4 要求）
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProgressStore: ProgressStore, INTERVALS: INTERVALS, KEY: KEY };
  }
})(typeof window !== 'undefined' ? window : globalThis);
