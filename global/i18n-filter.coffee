Vue = require 'Vue'
Vue.filter 'i18n',(input)->
  return chrome.i18n.getMessage input || ''
