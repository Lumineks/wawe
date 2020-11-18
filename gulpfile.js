const gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    fileinclude = require('gulp-file-include'),
    svgSprite = require('gulp-svg-sprite'),
    clean = require('gulp-clean'),
    ttfToWoff2 = require('gulp-ttf2woff2'),
    tinypng = require('gulp-tinypng-compress');

gulp.task('sass', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 8 versions']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/css'))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});
gulp.task('style', function () {
    return gulp.src([
            'node_modules/normalize.css/normalize.css',
            'node_modules/swiper/swiper-bundle.css',
        ])
        .pipe(concat('libs.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('app/css'))
        .pipe(gulp.dest('./build/css'))
});
gulp.task('script', function () {
    return gulp.src([
            'node_modules/swiper/swiper-bundle.js',
            'node_modules/smoothscroll-polyfill/dist/smoothscroll.js',
            'node_modules/mixitup/dist/mixitup.js',
            'node_modules/fslightbox/index.js',

        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/js'))
        .pipe(gulp.dest('./build/js'))
});

gulp.task('html', function () {
    return gulp.src(['app/*.html', '!app/parts/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(ttfToWoff2())
        .pipe(gulp.dest('./build/fonts'));
});

gulp.task('images', function () {
    return gulp.src('app/images/content/*')
        .pipe(gulp.dest('./build/images'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('svgSprite', function () {
    return gulp.src('app/images/sprite/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(gulp.dest('./build/images'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('js', function () {
    return gulp.src('app/js/main.js')
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "build/"
        }
    });
});

gulp.task('clean', function () {
    return gulp.src('./build', {
            read: false,
            allowEmpty: true
        })
        .pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('app/**/*.html', gulp.parallel('html'));
    gulp.watch('app/js/**/*.js', gulp.parallel('js'));
    gulp.watch('app/images/content/**/*', gulp.parallel('images'));
    gulp.watch('app/images/sprite/**/*', gulp.parallel('svgSprite'));
    gulp.watch('app/fonts/**/*', gulp.parallel('fonts'));
});

gulp.task('default', gulp.series('clean', gulp.parallel('images', 'svgSprite', 'html', 'fonts', 'style', 'script', 'js', 'sass', 'watch', 'browser-sync')));

gulp.task('finalJs', function () {
    return gulp.src('app/js/main.js')
        .pipe(uglify().on('error', notify.onError()))
        .pipe(gulp.dest('./build/js'))
});

gulp.task('finalSass', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 8 versions']
        }))
        .pipe(gulp.dest('./build/css'))
});

gulp.task('imagesCompress', function () {
    return gulp.src(['app/images/content/*.jpg', 'app/images/content/*.jpeg', 'app/images/content/*.png'])
        .pipe(tinypng({
            key: 'lw8R4jJrTQNTBBH0DQnL8Hg89FYWY9d4',
            sigFile: 'images/.tinypng-sigs',
            parallelMax: 50,
            log: true
        }))
        .pipe(gulp.dest('./build/images'));

});

gulp.task('finalBuild', gulp.series('clean', gulp.parallel('images', 'svgSprite', 'html', 'fonts', 'style', 'script', 'finalJs', 'finalSass', 'imagesCompress')));