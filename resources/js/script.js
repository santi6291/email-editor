$(document).ready(function(){
	App.setPageID();
	if( typeof App.pageEvent[App.pageID] == 'function' ){
		App.pageEvent[App.pageID]();
	}
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
		
		// remove extra foward slashes
		pagePath = pagePath.replace(/^\/|\/$/g, '');
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

function registerPartial (view){
	var partials = $(view).filter(function(){
		return /TEMPLATE/g.test( $(this).prop("tagName") );
	});
	
	partials.each(function(){
		var partialName = $(this).attr('id');
		var partialContent = $(this).html();
		// register partial
		Handlebars.registerPartial(partialName, partialContent);
	});
}
