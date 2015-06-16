var fs = require('fs'), path = require('path');

var dirs = fs.readdirSync(__dirname).filter(function (filename) {
  var p = path.join(__dirname, filename);
  return fs.statSync(p).isDirectory();
});

var codeTmpl = fs.readFileSync(path.join(__dirname, 'siteTemplate.js'), 'utf8');
module.exports = 'var sites = [];';

dirs.forEach(function (dir) {
  module.exports += codeTmpl.replace(/SITE_NAME/g, JSON.stringify(dir));
});

module.exports += 'module.exports = sites;';
