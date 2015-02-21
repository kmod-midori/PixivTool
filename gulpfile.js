var gulp = require ('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var i18n = require('./gulp-chrome-i18n');

gulp.task('default', function() {
  gulp.src('locale_db/*.json')
    .pipe(i18n())
    .on('error',gutil.log)
    .pipe(gulp.dest('_locales/'));
});
