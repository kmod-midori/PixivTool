# Communication w/ Popup

{EventEmitter} = require 'events'

tabData = {}

emitter = new EventEmitter()
chrome.runtime.onConnect.addListener (port)->
  handler = ->
    port.postMessage tabData
    
  emitter.on 'updated',handler
  
  port.onDisconnect.addListener ->
    emitter.removeListener 'updated',handler
    
  handler()
  
exports.update = (obj)->
  tabData = _.assign tabData,obj
  emitter.emit 'updated'