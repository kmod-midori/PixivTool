gulp = require 'gulp'
webpack = require 'webpack'
gulpWebpack = require 'gulp-webpack'
gutil = require 'gulp-util'

webpackConf = require './config/webpack.config'

gulp.task 'webpack:watch', ->
  conf = Object.create webpackConf
  conf.watch = true

  conf.plugins.push new webpack.DefinePlugin {
    DEBUG: true
    NODE_ENV: 'development'
  }

  gulp.src 'src/opts/index.coffee'
    .pipe gulpWebpack(conf)
    .pipe gulp.dest 'dist/' + options.target

gulp.task 'webpack:production', ->
  conf = Object.create webpackConf
  # conf.plugins.push new webpack.optimize.UglifyJsPlugin()

  conf.plugins.push new webpack.DefinePlugin {
    DEBUG: false
    NODE_ENV: 'production'
  }

  gulp.src 'src/opts/index.coffee'
    .pipe gulpWebpack(conf)
    .pipe gulp.dest 'dist/' + options.target
