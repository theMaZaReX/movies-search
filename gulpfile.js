const { notify } = require('browser-sync');
const { src, dest, parallel, series, watch } = require('gulp');

const buildFolder = 'build',
    sourceFolder = 'src';

const sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss     = require('gulp-clean-css'),
    rename       = require('gulp-rename'),
    sourceMaps   = require('gulp-sourcemaps'),
    browserSync  = require('browser-sync').create(),
    imagemin     = require('gulp-imagemin'),
    newer        = require('gulp-newer'),
    ttf2woff     = require('gulp-ttf2woff'),
    ttf2woff2    = require('gulp-ttf2woff2'),
    fs           = require('fs'),
    del          = require('del'),
    terser       = require("gulp-terser"),
    concat       = require('gulp-concat');


const path = {
    source:{
        html: './*.html',
        php: sourceFolder + '/php/**/*.php',
        scss: sourceFolder + '/scss/style.scss',
        js: [sourceFolder + '/js/**/*.js', 'node_modules/bootstrap/dist/js/bootstrap.js'],
        jquery: 'node_modules/jquery/dist/jquery.min.js',
        img: sourceFolder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
        videos: sourceFolder + '/videos/**/*.{mp4, avi, ogg, mkv}',
        fonts: sourceFolder + '/fonts/**/*.ttf'
    },
    build:{
        html: buildFolder + '/',
        php: buildFolder + '/' + sourceFolder + '/php/',
        styles: buildFolder + '/' + sourceFolder + '/css/',
        js: buildFolder + '/' + sourceFolder + '/js/',
        img: buildFolder + '/' + sourceFolder + '/img/',
        videos: buildFolder + '/' + sourceFolder + '/videos/',
        fonts: buildFolder + '/' + sourceFolder + '/fonts/'
    },
    whatch:{
        html: './*.html',
        php: './src/php/**/*.php',
        styles: sourceFolder + '/scss/**/*.scss',
        js: sourceFolder + '/js/**/*.js',
        fonts: sourceFolder + '/fonts/**/*.ttf'
    }
}

function browser_sync(){
    browserSync.init({
        proxy: 'http://movie-search.ru/',
        online: true
    })

}


function html(){
    return src(path.source.html)
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream());
}

function php(){
    return src(path.source.php)
        .pipe(dest(path.build.php))
        .pipe(browserSync.stream());
}

function styles(){
    return src(path.source.scss)
        .pipe(sourceMaps.init({loadMaps: true}))
        .pipe(sass({
            errLogToConsole: true
        })).on('error', console.error.bind(console))
        .pipe(autoprefixer())
        .pipe(cleanCss())
        .pipe(rename({
            suffix:'.min'
        }))
        .pipe(sourceMaps.write('map'))
        .pipe(dest(path.build.styles))
        .pipe(browserSync.stream({match: '**/*.css'}));
}

function stylesbuild(){
    return src(path.source.scss)
        .pipe(sass({
            sourceMap: 'scss',
            errLogToConsole: true
        })).on('error', console.error.bind(console))
        .pipe(autoprefixer())
        .pipe(rename({
            suffix:'.min'
        }))
        .pipe(cleanCss( {level: {1: {specialComments: 0}}}))
        .pipe(dest(path.build.styles))
        .pipe(browserSync.stream());
}

function scripts(){


    return src([path.source.jquery, sourceFolder + '/js/**/_*.js', sourceFolder + '/js/**/main.js', sourceFolder + '/js/**/*.js'], {
          allowEmpty:true
    })
        .pipe(sourceMaps.init({largeFile: true}))
        .pipe(concat('scripts.min.js'))
        .pipe(terser())
        .pipe(sourceMaps.write('map'))
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream());
}


function scriptsbuild(){
    return src([path.source.jquery, path.source.js], {
        allowEmpty:true
    })
        .pipe(concat('scripts.min.js'))
        .pipe(terser({
            output:{
                comments:false
            }
        }))
        .pipe(dest(path.build.js))
}

function images(){
    return src(path.source.img)
        .pipe(newer(path.build.img))
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(dest(path.build.img))
}

function videos(){
    return src(path.source.videos)
        .pipe(newer(path.build.videos))
        .pipe(dest(path.build.videos))
}


function startWatch(){
    browser_sync();
    watch(path.whatch.styles, styles);
    watch([path.whatch.js, '!'+buildFolder+sourceFolder+'/js/scripts.min.js'], scripts);
    watch(path.whatch.html, html);
    watch(path.whatch.php, php);
    watch(path.source.img, images);
    watch(path.source.videos, videos);
}

function cleanbuild(){
    return del(buildFolder + '/**/*', {force: true});
}


exports.startWatch = startWatch;
exports.browser_sync = browser_sync;
exports.html = html;
exports.php = php;
exports.styles = styles;
exports.stylesbuild = stylesbuild;
exports.scripts = scripts;
exports.scriptsbuild = scriptsbuild;
exports.images = images;
exports.cleanbuild = cleanbuild;
exports.default =  series(cleanbuild, parallel(scripts, styles, images, html, php, videos), startWatch);
exports.build = series(cleanbuild, parallel(scriptsbuild, stylesbuild, images, html, php, videos));
