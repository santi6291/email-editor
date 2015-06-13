var App = App || {};

App.helpers   = App.helpers || {};
App.pageEvent = App.pageEvent || {};
App.editor    = App.editor || {};
App.views     = App.views || {};
App.handlers  = App.handlers || {};

App.init = function(){
	
	App.helpers.getViews(function(){
		App.helpers.setPageID();
		App.pageEvent[App.pageID]();
	});
};

App.views = {
	'editor-component': {
		fileName: 'editor-component.html',
	},
	'template-body-content-cols-1': {
		fileName: 'template-body-content-cols-1.html'
	},
	'template-body-content-cols-2': {
		fileName: 'template-body-content-cols-2.html'
	},
	'template-body-content-cols-3': {
		fileName: 'template-body-content-cols-3.html'
	},
	'template-body-content-cols-4': {
		fileName: 'template-body-content-cols-4.html'
	},
	'template-body-sidebar': {
		fileName:'template-body-sidebar.html'
	},
	'template-header-cols-1': {
		fileName: 'template-header-cols-1.html'
	},
	'template-header-cols-2-left': {
		fileName: 'template-header-cols-2-left.html'
	},
	'template-header-cols-2-right': {
		fileName: 'template-header-cols-2-right.html'
	},
	'template-header-cols-3': {
		fileName: 'template-header-cols-3.html'
	},

};

App.handlers = {
	editor:{
		list: '/app/handlers/editor/listVer.php',
		stored:'/data/templates/'
	}
};