exports.setIcon = (path, tabId)->
  chrome.browserAction.setIcon {path,tabId}
  
exports.setBadgeText = (text, tabId)->
  text = '' + text
  chrome.browserAction.setBadgeText {text,tabId}