$ = require 'jquery'
Vue = require 'Vue'
Vue.filter 'i18n',(input)->chrome.i18n.getMessage input
$('<div class="area_new" id="pxtool"></div>').prependTo('.ui-layout-west')
if $('.ui-layout-west').length is 0
  $('<div class="area_new" id="pxtool"></div>').prependTo('.layout-body')
module.exports = (new Vue(require './info-blk.vue')).$mount('#pxtool')
