const { src, dest, parallel, series, watch } = require('gulp')
sass         = require('gulp-sass')
autoprefixer = require('gulp-autoprefixer')
sourcemaps   = require('gulp-sourcemaps')
concat       = require('gulp-concat')
imagemin     = require('gulp-imagemin')
remove       = require('del')

browserSync = require('browser-sync').create()


function files () {
    return src(['app/*.html', 'app/fonts/**/*', 'app/files/**/*'], {base: 'app'})
    .pipe(dest('build'))
    .pipe(browserSync.stream())
}

function styles () {
    return src('app/sass/**/*.+(sass|scss)')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(dest('build/css'))
    .pipe(browserSync.stream())
}

function scripts () {
    return src('app/js/**/*.js')
    .pipe(concat('scripts.js'))
    .pipe(dest('build/js'))
    .pipe(browserSync.stream())
}

function images () {
    return src('app/img/**/*')
    .pipe(imagemin())
    .pipe(dest('build/img'))
}

function clean () {
    return remove('build/*')
}

function watchFiles () {
    browserSync.init({
        server: 'build', notify: false
    })
    watch(['app/*.html', 'app/fonts/**/*', 'app/files/**/*'], files)
    watch('app/sass/**/*.+(sass|scss)', styles)
    watch('app/js/**/*.js', scripts)
    watch('app/img/**/*', images)
}

exports.build = series(clean, parallel(files, styles, scripts, images))
exports.default = series(clean, images, parallel(files, styles, scripts, watchFiles))