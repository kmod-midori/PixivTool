var sitesReg = require('src/sites');

sitesReg.ready.then(function () {
  sitesReg.filterAndRun(document.location);
});

require('src/common/debug');
