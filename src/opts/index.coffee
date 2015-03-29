require './styles/app.scss'

require 'script!jquery'
require 'script!toastr/toastr.js'
require 'style!css!toastr/toastr.css'
require 'script!handlebars'
require 'script!ember'
require 'script!ember-data'
require 'script!FileSaver.js/FileSaver.js'
gf = require 'shared/genFilename'
__ = require 'shared/i18n'
pm = require 'shared/pm'

require './templates'
App = Ember.Application.create()

App.Router.map ->
  @resource 'settings',path:'/'
  @resource 'manage',path:'/manage'

App.ExSetting = DS.Model.extend
  mark:DS.attr()
  filename:DS.attr()
  bgColor:DS.attr()

  patterns:require 'json!./pattern.json'

  renderOutput:(->gf(@get('filename'),require './eg.cson')).property 'filename'
  output:(->@get('renderOutput').result).property 'renderOutput'
  invalid:(->@get('renderOutput').warnings.length != 0).property 'renderOutput'
  warnings:(->@get('renderOutput').warnings).property 'renderOutput'

App.ExSettingAdapter = DS.Adapter.extend
  find:-> new Ember.RSVP.Promise (resolve,reject)->
    chrome.storage.local.get 'settings',(items)->
      if chrome.runtime.lastError
        return reject chrome.runtime.lastError
      setting = items.settings || {}
      def = require('shared/defaults.cson')
      $.extend def,setting
      def.id = 0
      resolve def
  updateRecord:(store,type,record)->
    new Ember.RSVP.Promise (resolve,reject)->
      chrome.storage.local.set {settings:record.serialize()},->
        if chrome.runtime.lastError
          return reject chrome.runtime.lastError
        resolve()

App.SettingsRoute = Ember.Route.extend
  model:->
    return @store.find('exSetting',0)

  actions:
    save:->
      return if @currentModel.get 'invalid'
      @currentModel.save()
        .then ->toastr.success __ 'settings_saved'
        .catch ->toastr.error __ 'save_failed'

App.ManageRoute = Ember.Route.extend
  actions:
    export:->
      pm.queryAll (items)->
        blob = new Blob([JSON.stringify items], {type: "text/json;charset=utf-8"})
        saveAs(blob, "export.json")
    import:->
      $('input[type=file]').one('change',(e)->
        file = e.target.files[0]
        if(!/\.json$/.test file.name)
          alert __ 'not_json'
          return
        reader = new FileReader()
        reader.onload = (e)->
          content = e.target.result
          try
            content = JSON.parse content
          catch e
            alert __ 'parse_failed',e
            return
          if confirm(__ 'import_confirm',(_.keys content).length)
            chrome.storage.local.set {history:content}
        reader.readAsText(file)
        ).click()
