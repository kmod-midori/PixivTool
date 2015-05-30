{EventEmitter} = require 'events'

class EmitterBridge extends EventEmitter
	constructor:->
		@port = port = chrome.runtime.connect()

		port.onMessage.addListener (msg)=>
			@emit msg.evt,msg.data

		port.onDisconnect.addListener =>
			@emit 'disconnect'

module.exports = new EmitterBridge()

