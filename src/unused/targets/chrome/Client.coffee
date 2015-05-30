evt = require './Events'

connected = new Map()

chrome.runtime.onConnect.addListener (port)->
  return if not port.sender.tab? # Not from a tab
  
  id = port.sender.tab.id
  
  connected.set id, port
  
  evt.emit 'ClientReady',id
  
  port.onDisconnect.addListener ->
    connected.delete id
    evt.emit 'ClientClose',id
    
exports.isReady = (id)-> connected.has id