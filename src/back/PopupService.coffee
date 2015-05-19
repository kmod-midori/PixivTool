manager = require './TabManager'
rpc = require './RpcServer'
{EventEmitter} = require 'events'

class PopupService extends EventEmitter
  constructor: ->
    @handlers = []
    chrome.runtime.onConnect.addListener (port) =>
      return if port.sender.tab?
      @emit 'opened'
      port.onDisconnect.addListener =>
        @emit 'closed'

module.exports = service = new PopupService()

#rpc.addMethod 'tabStatus', rpc.targets.Popup, (param) ->
#  return manager.isConnected param.id
