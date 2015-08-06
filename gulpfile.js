var gulp = require('gulp')
var sass = require('gulp-sass')
var minifyCss = require('gulp-minify-css')
var autoprefixer = require('gulp-autoprefixer')
var uglify = require('gulp-uglify')
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat')
var ngannotate = require('gulp-ng-annotate')


var paths = {
  css : './dev/css'
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
  gulp.src('./dev/js/main.js')
    .pipe(ngannotate({}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
})

gulp.watch(paths.css+'/main.scss', ['sass'])
gulp.watch('./dev/js/main.js', ['js'])
gulp.watch('./dev/index.html',['index'])