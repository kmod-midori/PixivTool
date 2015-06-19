var sites = require('src/sites');

sites.forEach(site=>{
  if (site.matcher(document.location)) {
    log.d(`Starting ${site.name}`);
    site.content();
  }
});
