gulp = require 'gulp'
gutil = require 'gulp-util'
yaml = require 'gulp-yaml'
rename = require 'gulp-rename'

gulp.task 'manifest', ->
  filename = ''
  switch options.target
    when "chrome"
      filename = 'manifest.json'
    when "firefox"
      filename = "package.json"
      
  gulp.src './manifest/' + options.target + '.yml'
    .pipe yaml space:2
    .pipe rename filename
    .pipe gulp.dest 'dist/' + options.target
    .on 'error',gutil.log
    
gulp.task 'manifest:watch',['manifest'], ->
  gulp.watch './manifest/*',['manifest']