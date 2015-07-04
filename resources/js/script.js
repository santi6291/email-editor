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

String.prototype.capFirst = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

function objectToText (theObject){
	return "<pre>" + JSON.stringify(theObject, null, 4) + "</pre>";
}

// args.view, args.title, args.callback
function modalHelper (args){

	$('body').append(args.modal);
	
	$('.modal').find('.modal-title').html(args.title);
	$('.modal').find('.modal-body').handlebars({
		view: args.view,
		data: args.data
	});

	// do something after modal done rendering
	$('.modal').off('show.bs.modal')
	$('.modal').on('show.bs.modal', function(e){
		if(typeof args.show === 'function'){
			args.show(e, $('.modal'))
		}
	});

	// do something after modal done rendering
	$('.modal').off('shown.bs.modal')
	$('.modal').on('shown.bs.modal', function(e){
		if(typeof args.shown === 'function'){
			args.shown(e, $('.modal'))
		}
	});

	// do something when model begins to hide
	$('.modal').off('hide.bs.modal')
	$('.modal').on('hide.bs.modal', function(e){
		if(typeof args.hide === 'function'){
			args.hide(e, $('.modal'))
		}
	});

	// do something when modal is hidden, also removes modal
	$('.modal').off('hidden.bs.modal')
	$('.modal').on('hidden.bs.modal', function(e){
		if(typeof args.hidden === 'function'){
			args.hidden(e, $('.modal'));
		}
		
		$('.modal').remove();
	});

	$('.modal').modal('show');
}	