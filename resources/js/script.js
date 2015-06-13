$(document).ready(function(){
	App.init();
});

// INDEX EVENT
App.pageEvent.index = function(){
	manager =  new Manager();
	// App.manager.init();
};

// EDITOR EVENTS
App.pageEvent.editor = function() {
	App.editor.init();
};