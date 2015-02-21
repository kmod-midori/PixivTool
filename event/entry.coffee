_ = require 'lodash'
EventEmitter = (require 'events').EventEmitter

emitter = new EventEmitter()

(require './db')(emitter)
(require './download')(emitter)
chrome.runtime.onMessage.addListener (request, sender, sendResponse)->
  rep = (response)->
    sendResponse(response)

  emitter.emit(request.type,request,rep)

chrome.webRequest.onBeforeSendHeaders.addListener(((details)->
  if details.tabId == -1
    details.requestHeaders.push({name:'Referer',value:'http://www.pixiv.net'})
  return {requestHeaders: details.requestHeaders}
  ),{urls:["http://*.pixiv.net/*"],tabId:-1},
["blocking", "requestHeaders"])
