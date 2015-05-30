app = require './App'
rpc = require 'shared/RpcClient'
polling = require 'shared/polling'

chrome.windows.getCurrent (currWin)->
  chrome.tabs.query {active:true, windowId:currWin.id},(activeTabs)->
    tabId = activeTabs[0].id

    app.setState {tabId}

    port = chrome.tabs.connect(tabId)

    port.onMessage.addListener (msg)->
      app.setState {ready:true,tabData:msg}