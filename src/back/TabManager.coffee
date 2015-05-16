{EventEmitter} = require 'events'
class TabManager extends EventEmitter
  constructor: ->
    @activeTabs = new Set()
    @on 'tabConnect', Set.prototype.add.bind @activeTabs
    @on 'tabDisconnect', Set.prototype.delete.bind @activeTabs

    chrome.runtime.onConnect.addListener (port)=>
      return if not port.sender.tab?

      id = port.sender.tab.id
      @emit 'tabConnect',id

      port.onDisconnect.addListener =>
        @emit 'tabDisconnect',id


  isConnected:(id)->@activeTabs.has id


module.exports = new TabManager()
