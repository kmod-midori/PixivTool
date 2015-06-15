gulp = require 'gulp'

gulp.task 'default',['watch']

gulp.task 'watch',['webpack:watch', 'watch:assets']

gulp.task 'watch:assets',['manifest:watch','locale:watch']

gulp.task 'build',['manifest','locale','webpack:production']

gulp.task 'clean', (cb)->
  (require 'del') ['./dist'],cb
