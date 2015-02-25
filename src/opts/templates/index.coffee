require 'script!ember/ember-template-compiler'

Ember.Handlebars.helper 't', (value)->
  return chrome.i18n.getMessage value

compile = (name, src)->
  Ember.TEMPLATES[name] = Ember.Handlebars.compile(src)

compile 'application',require './application.hbs'
compile 'settings',require './settings.hbs'
compile 'manage',require './manage.hbs'
