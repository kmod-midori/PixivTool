gulp = require 'gulp'
gutil = require 'gulp-util'
yaml = require 'gulp-yaml'
json2crx = require './plugins/json2crx'
watch = require 'gulp-watch'

path = './locales/*.yml'

gulp.task 'locale', ->
  if options.target is 'chrome'
    gulp.src path
      .pipe yaml()
      .pipe json2crx()
      .pipe gulp.dest 'dist/chrome/_locales'
      .on 'error',gutil.log


gulp.task 'locale:watch',['locale'],->
  watch path,-> gulp.start(['locale'])
