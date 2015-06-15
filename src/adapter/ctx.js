var {browser} = require('bowser');

require('babel-runtime/core-js/promise').default = require('bluebird');

if (browser.chrome || browser.opera) {
  module.exports = require('./chrome');
}
