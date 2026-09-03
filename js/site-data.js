/* site-data.js — 数据注册中心（docs/SCHEMA.md §4）
 * 内容数据文件唯一入口：window.SITE_DATA.registerModule({...})
 * 本文件不包含知识点内容，仅提供注册与查询 API。
 */
(function (global) {
  'use strict';

  var SITE_DATA = {
    // 注册后的模块数组（顺序 = 数据文件加载顺序 = syllabus 模块顺序）
    modules: [],

    /* 数据文件唯一入口。同 id 重复注册时整体替换（stub 被内容阶段覆写的兜底）。 */
    registerModule: function (mod) {
      if (!mod || typeof mod !== 'object' || !mod.module) {
        if (global.console && typeof global.console.warn === 'function') {
          global.console.warn('[SITE_DATA] registerModule 收到非法模块数据，已忽略');
        }
        return;
      }
      for (var i = 0; i < this.modules.length; i++) {
        if (this.modules[i] && this.modules[i].module === mod.module) {
          this.modules[i] = mod;
          return;
        }
      }
      this.modules.push(mod);
    },

    /* 展平的全部课程（模块顺序内保持 lessons 顺序） */
    allLessons: function () {
      var out = [];
      for (var i = 0; i < this.modules.length; i++) {
        var lessons = (this.modules[i] && this.modules[i].lessons) || [];
        for (var j = 0; j < lessons.length; j++) out.push(lessons[j]);
      }
      return out;
    },

    /* 按 id 查课程；找不到返回 undefined */
    getLesson: function (id) {
      var lessons = this.allLessons();
      for (var i = 0; i < lessons.length; i++) {
        if (lessons[i] && lessons[i].id === id) return lessons[i];
      }
      return undefined;
    },

    /* 课程所属模块对象；找不到返回 undefined */
    moduleOf: function (lessonId) {
      for (var i = 0; i < this.modules.length; i++) {
        var lessons = (this.modules[i] && this.modules[i].lessons) || [];
        for (var j = 0; j < lessons.length; j++) {
          if (lessons[j] && lessons[j].id === lessonId) return this.modules[i];
        }
      }
      return undefined;
    },

    /* 在 allLessons() 中的位置（上一课/下一课用）；找不到返回 -1 */
    lessonIndex: function (id) {
      var lessons = this.allLessons();
      for (var i = 0; i < lessons.length; i++) {
        if (lessons[i] && lessons[i].id === id) return i;
      }
      return -1;
    }
  };

  global.SITE_DATA = SITE_DATA;

  // node 单测兼容
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SITE_DATA;
  }
})(typeof window !== 'undefined' ? window : globalThis);
