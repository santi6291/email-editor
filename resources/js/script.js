$(document).ready(function(){
	App.setPageID();
	App.pageEvent[App.pageID]();
});

var App = {};
App.pageEvent = {};

App.pageEvent.index = function(){
	manager = new Manager();
}

App.pageEvent.editor = function(){
	editor = new Editor();
}


App.setPageID = function() {
	var App = this;
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

function objectToText(theObject){
	return "<pre>" + JSON.stringify(theObject, null, 4) + "</pre>";
}

String.prototype.capFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}








function prepTemplate (content){

	var template = $(content);
	template.find('.editMe').attr('contenteditable', 'true');
	return template;
	// $('.blast').find('.template').html(template);
};