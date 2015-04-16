require 'Kimochi.css'
Vue = require 'Vue'
Vue.filter 'i18n',(input)->chrome.i18n.getMessage input

app = new Vue
  el:'#popup'
  data:
    active:false
