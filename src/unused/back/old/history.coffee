_ = require 'lodash'
BSON = require("bson").BSON
zlib = require 'zlib'

historyIds = []
historyFull = []

updateCache = (history)->
  historyIds = _.keys history
  historyFull = history
  console.log 'UPDATE'
  # raw =
  # console.dir BSON.deserialize raw

chrome.storage.onChanged.addListener (changes, area)->
  return if not changes.history?
  updateCache changes.history.newValue

chrome.storage.local.get 'history',(items)->
  updateCache items.history || {}

exports.query = (arr)->
  result = {}
  arr.forEach (id)->result[id] = (historyIds.indexOf(id) != -1)
  return result

exports.add = (key, rawVal)->
  val = (zlib.deflateSync BSON.serialize rawVal).toString 'base64'
  historyFull[key] = val
  console.log 'ADD',key,val
  chrome.storage.local.set {history:historyFull},_.noop

exports.queryAll = ->
  return historyFull
