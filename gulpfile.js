var gulp = require ('gulp');
var gutil = require('gulp-util');
var jade = require('gulp-jade');
var webpack = require('gulp-webpack');
var yaml = require('gulp-yaml');
var i18n = require('./gulp-chrome-i18n');

gulp.task('default',[
  'webpack',
  'manifest',
  'i18n',
  'watch-assets'
]);

gulp.task('watch-assets', function () {
  gulp.watch("options.html",['options-html']);
  gulp.watch("manifest.yml",['manifest']);
  gulp.watch("i18n/locale.yml",['i18n']);
});

gulp.task('options-html',function () {
  return gulp.src('./options.html')
    .pipe(gulp.dest('build/'));
});

gulp.task('webpack',function () {
  return gulp.src('options/entry.coffee')
    .pipe(webpack(require('./webpack.config')))
    .pipe(gulp.dest('build/bundles/'));
});

gulp.task('manifest',function () {
  return gulp.src('./manifest.yml')
    .pipe(yaml({space:2}))
    .pipe(gulp.dest('build/'));
});

gulp.task('i18n',function() {
  gulp.src('i18n/locale.yml')
    .pipe(yaml())
    .pipe(i18n())
    .pipe(gulp.dest('build/_locales'));
});
