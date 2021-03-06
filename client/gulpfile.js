var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var order = require('gulp-order');
var paths = {
  sass: ['./scss/*.scss'],
  javascript: ['./project/**/*.js']
};

gulp.task('default', ['sass', 'watch', 'js']);

var javascriptFiles = [
  'js/someFile.js'
]

gulp.task('js', function() {
  gulp.src(['./project/**/*.js'])
  .pipe(order([

    'project/app.js',
    'project/auth/auth.service.js',
    'project/dashboard.service.js',
    'project/routes.js',
    'project/landing.js',
    'project/dashboard.js',
    'project/lecture.student.js',
    'project/lecture.teacher.js',
    ], { base: './' }))
        .pipe(concat('scripts.min.js'))
  .pipe(gulp.dest('./www/js')).on('error', gutil.log)
});

gulp.task('sass', function(){

  gulp.src('./scss/style.scss')
  .pipe(sass({
    outputStyle: 'compressed'
  })).on('error', sass.logError)
  .pipe(gulp.dest('./www/css/'));
});


gulp.task('watch', function() {
  gulp.watch('./scss/**/*.scss', ['sass']);
  gulp.watch(paths.javascript, ['js']);
});


gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
