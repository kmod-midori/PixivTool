module.exports = (active)->
  inactiveUrl = 'bundles/' + require 'file!./icons/inactive_38.png'
  activeUrl = 'bundles/' + require 'file!./icons/active_38.png'

  if active
    i = activeUrl
  else
    i = inactiveUrl

  icon = {
    38:i
  }

  chrome.browserAction.setIcon path:icon
