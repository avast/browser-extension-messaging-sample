'use strict';

var gulp = require('gulp');
var debug = require('gulp-debug');

var path = require('path');
var fs = require('fs');
var rmrf = require('rimraf');

var Crx = require('crx');
var xpi = require('firefox-xpi');
var safariextz = require('safariextz');

gulp.task('build_chrome', function (done) {
    rmrf('build/chrome', function () {
        gulp.src(['chrome/**', 'shared/**'])
            .pipe(debug())
            .pipe(gulp.dest('build/chrome'))
            .on('end', done);
    });
});

gulp.task('chrome', ['build_chrome'], function () {
    try {
        var crx = new Crx({ privateKey: fs.readFileSync('keys/chrome.pem') });
    }
    catch (ex) {
        console.log('keys/chrome.pem not found, stopping');
        return;
    }

    return crx.load('build/chrome')
        .then(function () {
            return crx.pack();
        })
        .then(function (crxBuffer) {
            fs.writeFile('build/messages.crx', crxBuffer);
        });
});


gulp.task('build_firefox', function (done) {
    rmrf('build/firefox', function () {
        gulp.src(['firefox/**', 'shared/**'])
            .pipe(debug())
            .pipe(gulp.dest(function (f) { return f.path.match(/[/\\\\]shared([/\\\\]|$)/) ? 'build/firefox/data' : 'build/firefox'; }))
            .on('end', done);
    });
});

gulp.task('firefox', ['build_firefox'], function () {
    return xpi(path.join(__dirname, 'build/messages.xpi'), path.join(__dirname, 'build/firefox'));
});


gulp.task('build_safari', function (done) {
    rmrf('build/safari', function () {
        gulp.src(['safari/**', 'shared/**'])
            .pipe(debug())
            .pipe(gulp.dest('build/safari'))
            .on('end', done);
    });
});

gulp.task('safari', ['build_safari'], function () {
    try {
        fs.accessSync(path.join(__dirname, 'keys/safari.pem'));
    }
    catch (ex) {
        console.log('keys/safari.pem not found, stopping');
        return;
    }

    return safariextz(path.join(__dirname, 'build/messages.safariextz'), path.join(__dirname, 'build/safari'), {
        privateKey:   path.join(__dirname, 'keys/safari.pem'),
        extensionCer: path.join(__dirname, 'keys/dev.pem'),
        appleDevCer:  path.join(__dirname, 'keys/apple-dev.pem'),
        appleRootCer: path.join(__dirname, 'keys/apple-root.pem')
    });
});

gulp.task('default', ['chrome', 'firefox', 'safari']);

