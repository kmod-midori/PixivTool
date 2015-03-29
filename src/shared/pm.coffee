EventEmitter = (require 'events').EventEmitter
emitter = new EventEmitter()
uuid = require 'uuid'

port = chrome.runtime.connect()

port.onMessage.addListener (msg)->
  console.log 'REP',msg
  emitter.emit msg.id,msg.payload

request = (payload,cb)->
  id = uuid.v4()
  port.postMessage {id,payload}
  if cb?
    emitter.once id,cb

exports.queryId = (q, cb)->
  request {op:'queryHistory', data:q},cb
exports.queryAll = (cb)->
  request {op:'queryHistoryAll'},cb

exports.requestDownload = (work, urls, tmpl)->
  request {op:'download',data:{work,urls,tmpl}}
