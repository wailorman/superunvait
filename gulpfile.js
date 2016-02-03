var gulp = require('gulp');
var crx = require('gulp-crx-pack');
var manifest = require('./public/dist/manifest.json');
var fs = require('fs');

gulp.task('crx', function () {
    return gulp.src('./public/dist')
        .pipe(crx({
            privateKey: fs.readFileSync('./public/key.pem', 'utf8'),
            filename: 'ibb-tools.crx'
        }))
        .pipe(gulp.dest('./public'));
});