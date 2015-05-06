var apidoc = require('apidoc');
var bower = require('bower');
var config = require('config');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var header = require('gulp-header');
var less = require('gulp-less');
var mainBowerFiles = require('main-bower-files');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');

var srcPathBase = './src';
var destPathBase = './public';
var apiList = function (apiData) {
  var list = {};
  apiData.forEach(function (el) {
    if (!list[el.group]) {
      list[el.group] = [];
    }
    list[el.group].push(el.title);
  });
  return list;
};

gulp.task('clear', function () {
  del.sync(destPathBase);
});

gulp.task('bower:install', function (callback) {
  bower.commands.install().on('end', function () {
    callback();
  }).on('error', function (err) {
    callback(err);
  });
});

gulp.task('bower', ['bower:install'], function () {
  var destPath = srcPathBase + '/static/lib';
  return gulp.src(mainBowerFiles(), { base: 'bower_components' })
    .pipe(gulp.dest(destPath));
});

gulp.task('build:js', function () {
  var destPath = destPathBase + '/js';
  return gulp.src(srcPathBase + '/js/**/*.js')
    .pipe(header('var SITE_URL = \'//' + config.get('site.url') + '/\';\n'))
    .pipe(uglify())
    .pipe(gulp.dest(destPath));
});

gulp.task('build:css', function () {
  var destPath = destPathBase + '/css';
  gulp.src(srcPathBase + '/less/**/*.less')
    .pipe(less())
    .pipe(minify())
    .pipe(gulp.dest(destPath));
});

gulp.task('build:static', ['bower'], function () {
  gulp.src(srcPathBase + '/static/**')
    .pipe(gulp.dest(destPathBase));
});

gulp.task('apidoc', function (callback) {
  var chunk = apidoc.createDoc({
    src: 'api/',
    parse: true,
    debug: false
  });
  if (chunk.data && chunk.project) {
    chunk.data = JSON.parse(chunk.data);
    chunk.project = JSON.parse(chunk.project);
    chunk.list = apiList(chunk.data);
    fs.writeFileSync('api/doc.json', JSON.stringify(chunk));
    callback();
  } else {
    callback(new Error('apiDoc execution terminated (set "debug: true" for details).'));
  }
});

gulp.task('build', ['build:js', 'build:css', 'build:static', 'apidoc']);
gulp.task('default', ['build']);