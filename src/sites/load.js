var fs = require('fs'), path = require('path');

var dirs = fs.readdirSync(__dirname).filter(function (filename) {
  var p = path.join(__dirname, filename);
  return fs.statSync(p).isDirectory();
});

console.log(dirs);

module.exports = '';
