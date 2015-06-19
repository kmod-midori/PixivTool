var sitesReg = require('src/sites');

log.d(sitesReg);

sitesReg.ready.then(function () {
  log.d('Sites ready');
  sitesReg.filterAndRun(document.location);
});
