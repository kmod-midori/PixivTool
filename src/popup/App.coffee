Vue = require 'Vue'

Vue.filter 'i18n',(input)->chrome.i18n.getMessage input

module.exports = new Vue
  el:'#popup'
  data:
    active:false
