"use strict";

var gulp = require('gulp');
var crx = require('gulp-crx-pack');
var zip = require('gulp-zip');
var manifest = require('./public/dist/manifest.json');
var fs = require('fs');
var packageInfo = require('./package.json');

gulp.task('crx', function () {
    return gulp.src('./public/dist')
        .pipe(crx({
            privateKey: fs.readFileSync('./public/key.pem', 'utf8'),
            filename: 'ibb-tools.crx'
        }))
        .pipe(gulp.dest('./public'));
});

gulp.task('zip', function () {
    return gulp.src('public/dist/**/*')
        .pipe(zip(`ibb-tools-${packageInfo.version}.zip`))
        .pipe(gulp.dest('public/'));
});

gulp.task('default', ['crx', 'zip']);