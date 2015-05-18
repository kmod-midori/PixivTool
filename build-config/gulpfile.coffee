gulp = require 'gulp'
plugins = (require 'gulp-load-plugins')()
gutil = plugins.util
i18n = require './json2crx.js'
webpack = require 'webpack'

webpackConf = require './webpack.config.coffee'

dist = 'build'

manifestPath = [
  './manifest.yml'
]

overlayPath = [
  './overlay/**/*'
]

gulp.task 'default',['watch']

gulp.task 'watch',['watch:assets', 'webpack:watch']

gulp.task 'watch:assets',['manifest','overlay', 'i18n'] ,->
  gulp.watch manifestPath,['manifest']
  gulp.watch overlayPath,['overlay']
  gulp.watch './locale.yml',['i18n']

gulp.task 'build',['manifest','overlay','i18n','webpack:production']

gulp.task 'clean', (cb)->
  (require 'del') [dist],cb

gulp.task 'manifest', ->
  gulp.src manifestPath
    .pipe plugins.yaml space:2
    .pipe gulp.dest dist

gulp.task 'overlay', ->
  gulp.src overlayPath
    .pipe gulp.dest dist

gulp.task 'i18n', ->
  gulp.src './locale.yml'
    .pipe plugins.yaml()
    .pipe i18n()
    .pipe gulp.dest dist + '/_locales'

gulp.task 'webpack:watch', ->
  conf = Object.create webpackConf
  conf.watch = true
  gulp.src 'src/opts/index.coffee'
    .pipe plugins.webpack(conf)
    .pipe gulp.dest dist + '/bundles'

gulp.task 'webpack:production', ->
  conf = Object.create webpackConf
  conf.plugins.push new webpack.optimize.DedupePlugin()
  conf.plugins.push new webpack.optimize.UglifyJsPlugin()
  gulp.src 'src/opts/index.coffee'
    .pipe plugins.webpack(conf)
    .pipe gulp.dest dist + '/bundles'
