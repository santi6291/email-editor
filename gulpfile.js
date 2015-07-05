var gulp = require('gulp');

gulp.task('watch', function(){
	gulp.watch('./**', function(event){
		var filePath = event.path.replace('/Users/santiago/Sites/_projects/email-editor/', '')
		var fileDir = filePath.replace(/[^\/]*$/, '');
		
		console.log('File ' + filePath + ' was ' + event.type);

		gulp.src(event.path)
		.pipe(gulp.dest('/Applications/AMPPS/www/email-editor/' + fileDir));
	})
})

gulp.task('default', ['watch']);