app = require './App'
rpc = require 'shared/RpcClient'
polling = require 'shared/polling'

app.$once 'tabReady',->
  app.active = true

chrome.windows.getCurrent (currWin)->
  chrome.tabs.query {active:true, windowId:currWin.id},(activeTabs)->
    tabId = activeTabs[0].id
    app.$set 'tabId',tabId

    polling.poll 1000, (clear)->
      (rpc.invoke 'tabStatus',id:tabId)
      .then (status)->
        if status
          app.$emit 'tabReady'
          clear()
