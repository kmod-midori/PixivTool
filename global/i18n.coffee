module.exports = ->
  arguments[0] = chrome.i18n.getMessage(arguments[0])
  return require('util').format.apply(this, arguments)
