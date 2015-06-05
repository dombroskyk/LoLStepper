var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var exec = require('child_process').exec;

gulp.task('sass', function () {
    gulp.src('./assets/sass/main.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./assets/sass/**/*.scss', ['sass']);
});

gulp.task('jshint', function () {
    return gulp.src(['app.js', 'routes/**/*.js', 'scripts/**/*.js', 'assets/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('mongod', function(){
	exec('mongod --config ./cache_db/mongodb.conf', function( err, stdout, stderr){
		console.log(stdout);
		console.log(stderr);
		if(err !== null){
			console.log( 'exec error: ' + err);
		}
	});
});
