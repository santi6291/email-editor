Handlebars.registerHelper('templateSizes', function(){
	var options = '';
	for (var i = 600; i<=800; i+=50) {

		var selected = ( $('#templateContainer').attr('width') == i )? 'selected="true"' : '';
		options += '<option value="' + i + '"' + selected + '>' + i + '</option>'
	};
	return new Handlebars.SafeString(options);
});

Handlebars.registerHelper('modelHeader', function(title){
	var header ='<header>'+
					'<h3>' + title + '</h3>'+
					'<div class="modelView-modelExit">'+
						'<i class="fa fa-times modelView-modelClose"></i>'+
					'</div>'+
				'</header>';
	return new Handlebars.SafeString(header);
});

Handlebars.registerHelper('tempFlag', function(active){
	var activeClass = (active)? 'activeSection' : 'addComponent';
	var tempFlag = '<table class="tempFlag ' + activeClass + '"></table>';
	return new Handlebars.SafeString(tempFlag);
});

Handlebars.registerHelper('valign', function (selected) {
	var aligments = ['top', 'middle', 'bottom', 'baseline'];
	var options = '';
	_.each(aligments, function (aligment) {
		var selected = (selected == aligment)?'selected="selected"': '';
		options += '<option value="' + aligment + '" ' + selected + '>'  + aligment + '</option>';
	})
	return new Handlebars.SafeString(options);
})