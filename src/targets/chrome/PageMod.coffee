globToRegExp = require('glob-to-regexp')
module.exports = (urls, scripts)->
  urls = urls.map(globToRegExp).map(String).map (s)->
    {
      urlMatches: s.substring(1, s.length - 1)  #Strip head and tail
    }

  chrome.webNavigation.onDOMContentLoaded.addListener (details)->
    scripts.forEach (path)->
      if DEBUG
        console.log "Injecting #{path} into tab ##{details.tabId}"
        
      chrome.tabs.executeScript details.tabId,{file:path}
  ,{url:urls}