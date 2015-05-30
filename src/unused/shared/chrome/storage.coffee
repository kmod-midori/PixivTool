chromeApiPromisifyAll = require('./chrome_api')
storage = chromeApiPromisifyAll(chrome.storage.local)

{EventEmitter} = require 'events'

class ChromeStorage extends EventEmitter
  constructor: (@name) ->
    chrome.storage.onChanged.addListener (change)=>
      return if @name not in change.keys()
      @emit 'changed', change[@name].newValue

  get: ->
    storage.getAsync(@name).get(@name)

  set: (value) ->
    items = {}
    items[@name] = value
    storage.setAsync(items)

  clear: ->
    @storage.removeAsync(@name)

module.exports = ChromeStorage
