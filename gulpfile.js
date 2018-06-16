var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

var dev = "dev/";
var prod = "dist/";

function exceptionLog (error) {
  console.log(error.toString());
}

//JS
gulp.task('js', function() {
    gulp.src(dev+"js/*")
        .pipe(uglify())
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

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        startPath: "/dist/index.html"
    });
    gulp.watch([dev + '**/*.js'], ['js']);
    gulp.watch([dev + '**/*.html'], ['html']);
    gulp.watch([dev + '**/*.scss'], ['css'])
    gulp.watch(dev + '**/*').on('change', browserSync.reload);
});

gulp.task('default', ['watch', 'js', 'html', 'css']);
