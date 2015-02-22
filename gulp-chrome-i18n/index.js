var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var pluginName = 'gulp-chrome-i18n';


module.exports = function() {
  var stream = through.obj(function (file,enc,cb) {
    var infile = JSON.parse(file.contents);

    var langs = [];
    for (var msgid in infile) {
      for(var lang in infile[msgid]){
        langs[lang] = langs[lang] || {};
        langs[lang][msgid] = {
          message:infile[msgid][lang]
        };
      }
    }

    for(var i in langs){
      var outFile = file.clone({ contents: false });
      outFile.path = path.join(file.base, i, 'messages.json');
      outFile.contents = new Buffer(JSON.stringify(langs[i]));
      this.push(outFile);
    }
    cb();
  });

  return stream;
};
