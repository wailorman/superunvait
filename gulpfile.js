"use strict";

var gulp = require('gulp');
var crx = require('gulp-crx-pack');
var zip = require('gulp-zip');
var manifest = require('./dist/crx/manifest.json');
var fs = require('fs');
var packageInfo = require('./package.json');

const crxZipName = `ibb-tools-${packageInfo.version}.zip`;

gulp.task('crx', function () {
    return gulp.src('dist/crx')
        .pipe(crx({
            privateKey: fs.readFileSync('./public/key.pem', 'utf8'),
            filename: 'ibb-tools.crx'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('zip', function () {
    return gulp.src('dist/crx/**/*')
        .pipe(zip(crxZipName))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['crx', 'zip']);