App.helpers = {
	setPageID: function(){
		var pagePath = location.pathname;
		var pageIDarray;

		if ( pagePath == '/' ) {
			
			App.pageID = 'index';
		} else {
			
			// remove forward slash at start and end
			pagePath = pagePath.substr(1, pagePath.length-2);
			// split path to array
			pageIDarray = pagePath.split('/');
			// get current page
			App.pageID = pageIDarray.pop();
			// remove file extension
			App.pageID = App.pageID.replace(/\.[^.]*$/, '');
			// join path without pageID
			App.pageParent = pageIDarray.join('/');
		}

		if ( window.location.search !== '' ){
			App.GET = {};
			var querys = window.location.search.replace('?', '');
			querys = querys.split('&');
			
			for( var i = 0; i < querys.length; i++ ){
				var query = querys[i].split('=');
				
				App.GET[query[0]] = decodeURI(query[1]);
			}
		}
	},

	objectToText: function(theObject){
		return "<pre>" + JSON.stringify(theObject, null, 4) + "</pre>";
	},
	
	getViews: function(){
		tracker = 0
		args = arguments;
		
		_.each(App.views, function(viewObj, key){
			
			$.get('/data/views/' + viewObj.fileName, function(viewDOM) {
				
				viewObj.contents = viewDOM;
				tracker += 1;

				if( tracker == _.size(App.views) ){
					args[args.length-1]();
				}
			
			});
		});
	}
};

// RENDER TEMPLARE VERSIONS
/*function renderVer ( filename, title, append ) {
	var fileLoc = ( filename.indexOf('.php') == -1 )? filename + '.php': filename;
	var aNode = $('<a/>').attr('href', 'blast/revisions/' + fileLoc).append(title);
	
	if ( append === true ) {
		$('.version').append(aNode);
	} else {
		$('.version').prepend(aNode);
	}
}*/

// 
function prepTemplate (content){

	var template = $(content);
	template.find('.editMe').attr('contenteditable', 'true');
	return template;
	// $('.blast').find('.template').html(template);
};