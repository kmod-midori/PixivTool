Vue = require 'Vue'
Router = require('director').Router
_ = require 'lodash'

require './foundation/normalize.css'
require './foundation/foundation.css'

require './filters/'
require './partials/'

Vue.config.debug = off

nav = new Vue el:'.top-bar'

settingsHandler = ->
  nav.$add('active', 'settings')
  app = new Vue(require('./settings.vue')).$mount('#main')
  chrome.storage.local.get('settings',(x)->
    _.assign app,x.settings
  )

routes = {
  '/settings':settingsHandler
  '/':settingsHandler
}

router = Router(routes)
router.init('/settings')
