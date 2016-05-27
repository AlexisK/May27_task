
var gulp   = require('gulp');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var csso   = require('gulp-csso');
var less   = require('gulp-less');
var uglify = require('gulp-uglify');



gulp.task('build_css', function(done) {
    
    gulp.src('./resources/css/**/*')
    .pipe(less())
    .pipe(concat('compiled.css'))
    .pipe(csso())
    .pipe(gulp.dest('./build'));
    
    done();
});


gulp.task('build_js', function(done) {
    
    gulp.src(['./resources/js/wrap.js', './resources/js/storage.js', './resources/js/model/**/*','./resources/js/app.js'])
    .pipe(concat('compiled.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./build'));
    
    done();
});


gulp.task('build_html', function(done) {
    
    gulp.src('./resources/index.html').pipe(gulp.dest('./build'));
    
    done();

});



gulp.task('build', function() {
    
    runSequence('build_css','build_js','build_html');
    
});

gulp.task('observe', function() {
    
    gulp.watch('./resources/**/*',['build']);

});


