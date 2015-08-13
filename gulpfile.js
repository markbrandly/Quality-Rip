var gulp = require('gulp')
var sass = require('gulp-sass')
var minifyCss = require('gulp-minify-css')
var autoprefixer = require('gulp-autoprefixer')
var uglify = require('gulp-uglify')
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat')
var ngannotate = require('gulp-ng-annotate')
var order = require("gulp-order");


var paths = {
  css : 'dev/css',
  js  : 'dev/js'
}

gulp.task('sass', function(){
  gulp.src([paths.css+'/main.scss',paths.css+'/normalize.css'])
    .pipe(concat('main.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCss({compatibility:'ie8'}))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/css'))
  console.log('sassed!')
})

gulp.task('index',function(){
  gulp.src('./dev/index.html')
    .pipe(minifyHTML({conditionals:true}))
    .pipe(gulp.dest('./dist'))
})

gulp.task('js',function(){
  // gulp.src(paths.js+'/main.js')
  //   .pipe(ngannotate({}))
  //   .pipe(uglify())
    gulp.src(paths.js+'/*.js')
    .pipe(order([
        'angular.1.4.3.min.js',
        'angular-animate.min.js',
        'ZeroClipboard.js',
        'main.js'
      ]))
    .pipe(concat('main.js'))

    .pipe(ngannotate({}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    console.log('js\'d!')
})

gulp.watch(paths.css+'/main.scss', ['sass'])
gulp.watch(paths.js+'/*.js', ['js'])
gulp.watch('./dev/index.html',['index'])