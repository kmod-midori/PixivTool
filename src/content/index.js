var sites = require('src/sites');

sites.forEach(site=>{
  if (site.matcher()) {
    log.d(`Starting ${site.name}`);
    site.content();
  }
});
