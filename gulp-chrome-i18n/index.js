var through = require('through');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var _ = require('lodash');

var pluginName = 'gulp-chrome-i18n';


module.exports = function() {
  var inputFiles = [];
  var firstFile;

  function bufferFile(file) {

    if (file.isNull()) {
      return;
    }

    if (file.isStream()) {
      return this.emit('error',
        new PluginError(pluginName, 'Streaming not supported'));
    }

    var db = {}

    try {
      db = JSON.parse(file.contents)
    } catch (e) {
      return this.emit('error',
        new PluginError(pluginName, 'Failed to parse ' + file.relative));
    }

    if (!firstFile) {
      firstFile = file;
    }
    for (var msg in db) {
      if (typeof db[msg].locales === 'undefined') {
        return this.emit('error',
          new PluginError(pluginName, [
            'Missing \'locales\' field @',
            msg,
            ' (', file.relative, ')'
          ].join('')));
      }
    }

    inputFiles.push(db);
  }

  function endStream() {
    if (inputFiles.length === 0) {
      return this.emit('end');
    }

    var out = {}

    for (var i/*file*/ in inputFiles) {
      var db = inputFiles[i];

      for (var j/*message*/ in db) {
        var msg = db[j];

        for (var k/*language*/ in msg.locales) {
          if (typeof out[k] === 'undefined') {
            out[k] = {}
          }

          out[k][j] = { message: msg.locales[k] };
        }
      }
    }

    for (var i in out) {
      var outFile = firstFile.clone({ contents: false });
      outFile.path = path.join(firstFile.base, i, 'messages.json');
      outFile.contents = new Buffer(JSON.stringify(out[i]));
      this.emit('data', outFile);
    }
    this.emit('end')
  }

  return through(bufferFile, endStream);
};
