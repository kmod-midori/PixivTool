{browser} = require 'bowser'

if browser.chrome || browser.opera
  module.exports = {
    PageMod:require './chrome/PageMod.coffee'
  }