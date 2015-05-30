_ = require 'lodash'
app = require './app'

refSettings = ->
  chrome.storage.local.get('settings',(x)->
    settings = require 'shared/defaults.cson'
    _.assign settings,(x.settings || {})
    app.$set 'settings',settings
    app.$emit 'settingsUpdated',settings
  )

chrome.storage.onChanged.addListener(refSettings)
refSettings()
