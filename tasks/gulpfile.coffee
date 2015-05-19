gulp = require 'gulp'

gulp.task 'default',['watch']

gulp.task 'watch',['watch:assets', 'webpack:watch']

gulp.task 'watch:assets',['manifest:watch','overlay:watch','locale:watch']

gulp.task 'build',['manifest','overlay','locale','webpack:production']

gulp.task 'clean', (cb)->
  (require 'del') ['./dist'],cb




