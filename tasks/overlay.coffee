gulp = require 'gulp'
gutil = require 'gulp-util'

path = './overlay/**/*'

gulp.task 'overlay', ->
  gulp.src path
    .pipe gulp.dest 'dist/' + options.target
    .on 'error',gutil.log
    
gulp.task 'overlay:watch',['overlay'],->
  gulp.watch path,['overlay']