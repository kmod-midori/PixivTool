_ = require 'lodash'

historyIds = []
historyFull = []

updateCache = (history)->
  historyIds = _.keys history
  historyFull = history

chrome.storage.onChanged.addListener (changes, area)->
  return if not changes.history?
  updateCache changes.history

chrome.storage.local.get 'history',(items)->
  updateCache items.history || {}

exports.query = (arr)->
  result = {}
  arr.forEach (id)->result[id] = (historyIds.indexOf(id) != -1)
  return result
