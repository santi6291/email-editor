var pathToDev = '/Users/santiago/web/email-editor/';
var pathToLocalServer = '/Applications/AMPPS/www/email-editor/';
var gulp = require('gulp');

gulp.task('watch', function(){
	gulp.watch('./**', function(event){
		// file path relative to application dir
		var filePath = event.path.replace(pathToDev, '');
		// file path removing file name
		var fileDir = filePath.replace(/[^\/]*$/, '');
				
		console.log('File ' + filePath + ' was ' + event.type);

		gulp.src(event.path)
		.pipe(gulp.dest( pathToLocalServer + fileDir));
	})
})

gulp.task('default', ['watch']);