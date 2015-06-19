/* eslint-env mocha */

require('file?name=test-client.html!./test-client.html');
require('file?name=test-server.html!./test-server.html');

require('chai').should();

if (window.__pxCtx === 'back') {
  require('./server');
} else {
  require('./client');
}
