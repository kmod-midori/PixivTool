exports.invoke = (method, param)->
	new Promise (resolve, reject)->
		chrome.runtime.sendMessage {method,param}, (ret)->
			if ret.status is 'fulfilled'
				resolve ret.result
				return

			if ret.status is 'rejected'
				reject new Error ret.reason
				return