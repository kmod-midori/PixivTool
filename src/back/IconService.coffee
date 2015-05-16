manager = require './TabManager'

inactiveUrl = 'icons/popup_inactive_38.png'
activeUrl = 'icons/popup_active_38.png'

drawIcon = (tabId,isActive,badge)->
  if isActive
    i = activeUrl
  else
    i = inactiveUrl

  console.log "Set icon of #{tabId} to #{i}"

  chrome.browserAction.setIcon {
    path:
      38: i
    tabId
  }

  if badge?
    chrome.browserAction.setBadgeText {
      text:'' + badge
      tabId
    }

manager.on 'tabConnect',(id)->
  drawIcon(id,true)

manager.on 'tabDisconnect',(id)->
  drawIcon(id,false)
