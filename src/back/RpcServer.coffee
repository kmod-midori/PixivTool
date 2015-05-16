hasFlag = (a, b)-> (a & b) == b

class RpcServer
  targets:{
    Tab: 1
    Popup: 2
  }

  constructor:->
    @methods = {}
    chrome.runtime.onMessage.addListener @_handleRequest

  _handleRequest:(request, sender, response)=>
    console.debug 'RPC_REQUEST',request
    notFound = ->
      response {
        status:'rejected'
        reason:'Method Not Found'
      }
      return false
    if request.method not in _.keys @methods
      return notFound()

    method = @methods[request.method]

    #Apply filter
    if !hasFlag(method.target, @targets.Tab)
      if sender.tab?
        return notFound()

    if !hasFlag(method.target, @targets.Popup)
      if not sender.tab?
        return notFound()

    #Run
    process.nextTick ->
      result = Promise.try method.callback,[request.param,sender.tab?.id]

      result.then (ret)->
        response {
          status: 'fulfilled'
          result: ret
        }

      result.catch (reason)->
        response {
          status: 'rejected'
          result: reason.toString()
        }

    return true


  addMethod:(name, target, callback)->
    @methods[name] = {target, callback}

module.exports = new RpcServer()
