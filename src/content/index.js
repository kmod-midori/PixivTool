var sites = require('src/sites');

var enabled = _.filter(sites, function (site) {
  return site.match();
});

//Call run on all enabled sites.
_.invoke(enabled, 'run');
