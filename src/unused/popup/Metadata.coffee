rpc = require 'shared/RpcClient'
app = require './App'
polling = require 'shared/polling'

app.$once 'tabReady',->
  polling.poll 1000,(clear)->
    (rpc.invoke 'tabMeta.get',id:app.tabId)
    .then (result)->
      if result?
        app.$emit 'metaReady'
        app.$set 'meta',result
        clear()
