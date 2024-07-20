import gulp from 'gulp';
import autoPrefixer from 'gulp-autoprefixer';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import browserSync from 'browser-sync';
import imagemin from 'gulp-imagemin';
import prettier from 'gulp-prettier';

import clean from 'gulp-clean';


import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import concat from 'gulp-concat';

function compilaSass(){
    return gulp.src('scss/*.scss')
    .pipe(sass({outputStyle:'compressed'}))
    .pipe(autoPrefixer({
        overrideBrowserlist: ['last 3 versions'],
        cascade:false
    }))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
}

gulp.task('sass',compilaSass);

function browser(){
    browserSync.init({
        server:{
            baseDir: './'
        }
    })
}


gulp.task('browser',browser);


function imageRender(){
    return gulp.src('img/*')
    .pipe(imagemin())
    .pipe(clean())
    .pipe(gulp.dest('img/'));
}

gulp.task('imageMin',imageRender);

function gulpJs(){
    return gulp.src('js/scripts/*.js')
    .pipe(concat('alljs.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

gulp.task('alljs',gulpJs);

function libJs(){
    return gulp.src('js/lib/*.js')
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

gulp.task('libJs',libJs);


function libCSS(){
    return gulp.src('css/lib/*.css')
    .pipe(concat('lib.css'))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
}

gulp.task('libcss',libCSS);


function formatPrettier(){
    return gulp.src('*.html')
    .pipe(prettier({singleQuote:true}))
    .pipe(gulp.dest('./'));
}

gulp.task('prettier',formatPrettier);

function watch(){
    gulp.watch('scss/*.scss',compilaSass);
    gulp.watch('*.html').on('change',browserSync.reload);
    gulp.watch('*.html').on('change',formatPrettier);
    gulp.watch('js/scripts/*.js',gulpJs);
    gulp.watch('js/lib/*.js',libJs);
    gulp.watch('css/lib/*.css',libCSS);
}

gulp.task('watch',watch);

gulp.task('default', gulp.parallel('browser','watch','sass','imageMin', 'libcss', 'libJs', 'alljs', 'prettier'));