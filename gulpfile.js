var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');

var dev = "dev/";
var prod = "dist/";

function exceptionLog (error) {
  console.log(error.toString());
}

//JS
gulp.task('js', function() {
    gulp.src(dev+"js/*")
        .pipe(uglify({ mangle: false })) //make sure mangle is turned off, or it'll mess with AngularJS's dependency injection
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(prod+'js'));
});

//HTML
gulp.task('html', function() {
    gulp.src(dev+"**/*.html")
    .pipe(gulp.dest(prod));
});

//SASS 
// CSS via Sass and Autoprefixer
gulp.task('css', function() {
    return gulp.src(dev + 'sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('sass/maps'))
    .pipe(gulp.dest(prod+'css'))
    .on('error', exceptionLog);
});

//Images 
gulp.task('images', function() {
    gulp.src(dev + "img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest(prod+'img/'))
});


//TODO: add image minification task 


gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        startPath: "/dist/index.html"
    });
    gulp.watch([dev + '**/*.js'], ['js']);
    gulp.watch([dev + '**/*.html'], ['html']);
    gulp.watch([dev + '/img/**/*'], ['images']);
    gulp.watch([dev + '**/*.scss'], ['css'])
    gulp.watch(dev + '**/*').on('change', browserSync.reload);
});

gulp.task('default', ['watch', 'js', 'html', 'css', 'images']);
