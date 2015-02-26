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

htmlPath = [
  './src/opts/options.html'
]

gulp.task 'watch',['watch:assets', 'webpack:watch']

gulp.task 'watch:assets',['manifest','html', 'i18n'] ,->
  gulp.watch manifestPath,['manifest']
  gulp.watch htmlPath,['html']
  gulp.watch './locale.yml',['i18n']

gulp.task 'build',['manifest','html','i18n','webpack:production']

gulp.task 'clean', (cb)->
  (require 'del') [dist],cb

gulp.task 'manifest', ->
  gulp.src manifestPath
    .pipe plugins.yaml space:2
    .pipe gulp.dest dist

gulp.task 'html', ->
  gulp.src htmlPath
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
  conf.resolve.alias = {
    jquery:'jquery/dist/jquery.min.js'
    'toastr/toastr.js':'toastr/toastr.min.js'
    'toastr/toastr.css':'toastr/toastr.min.css'
    handlebars:'handlebars/handlebars.min.js'
    ember$:'ember/ember.min.js'
    'ember-data':'ember-data/ember-data.min.js'
    'FileSaver.js/FileSaver.js':'FileSaver.js/FileSaver.min.js'
  }
  gulp.src 'src/opts/index.coffee'
    .pipe plugins.webpack(conf)
    .pipe gulp.dest dist + '/bundles'
