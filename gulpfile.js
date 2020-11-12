const {src, dest, parallel, series, watch} = require('gulp')
sass = require('gulp-sass')
autoprefixer = require('gulp-autoprefixer')
sourcemaps = require('gulp-sourcemaps')
imagemin = require('gulp-imagemin')
del = require('del')

browserSync = require('browser-sync').create()


function html() {
    return src('app/*.html')
    .pipe(dest('build'))
    .pipe(browserSync.stream())
}

function styles() {
    return src('app/sass/**/*.+(sass|scss)')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(dest('build/css'))
    .pipe(browserSync.stream())
}

function scripts() {
    return src('app/js/**/*.js')
    .pipe(dest('build/js'))
    .pipe(browserSync.stream())
}

function images() {
    return src('app/img/**/*')
    .pipe(imagemin())
    .pipe(dest('build/img'))
}

function clean() {
    return del('build/*')
}

function watchFiles() {
    browserSync.init({
        server: 'build', notify: false
    })
    watch('app/*.html', html)
    watch('app/sass/**/*.+(sass|scss)', styles)
    watch('app/js/**/*.js', scripts)
    watch('app/img/**/*', images)
}

exports.build = series(clean, parallel(styles, html, images, scripts))
exports.default = series(clean, parallel(styles, html, images, scripts, watchFiles))