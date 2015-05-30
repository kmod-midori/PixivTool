var {browser} = require('bowser');

if (browser.chrome || browser.opera) {
  module.exports = require('./chrome');
}
