/**
 * [list of all templates]
 * @type {Object}
 */
App.manager = {
	list: {},
	events: {},
	selectors: {},
	render: {},
}
App.manager.selectors = {
	create:		'[data-manager ~= create]',
	clone:		'[data-manager ~= clone]',
	destroy:	'[data-manager ~= delete]',
	trash:		'[data-manager ~= trash]',
	update:		'[data-manager ~= update]',
	activeList: '[data-manager ~= active-list]',
	trashList:	'[data-manager ~= trash-list]',
};

/**
 * [Over write selectors, bind events]
 * @param  {[type]} selectors [description]
 * @return {[type]}           [description]
 */
App.manager.init = function() {
	
	$.getJSON(App.handlers.manager.templateList, function(templateList){
		App.manager.list = templateList;

		App.manager.render.list();
		
		_.each(App.manager.selectors, function(selector, key){
			if ( selector.indexOf('-list') == -1 ) {
				eventType = ( $(selector).prop('tagName') == 'FORM')? 'submit' : 'click';
				
				$(document).on(eventType, selector, function(e){
					e.preventDefault();
					App.manager.events[key]($(this), App.manager);
				});
			}
		});
	});
};

App.manager.render = {
	template: function (id) {
		templateInfo = App.manager.list[id];
		
		// template container
		var listItem = $('<li/>').addClass('listItem').data('template', { 'ID': id });
		
		// link to editor with GET to template
		var templateNode = $('<a/>').html(templateInfo.title).addClass('template-title').attr('href', '/editor/?id=' + id + '&template=' + encodeURI(templateInfo.title)).appendTo(listItem);
		
		// update tempalte node
		var updateNode = $('<p/>').html('Rename').addClass('template-control').appendTo(listItem).attr('data-manager', 'update');

		// clone node
		var cloneNode = $('<p/>').html('Copy').addClass('template-control').appendTo(listItem).attr('data-manager', 'clone');
		
		// delete Node with TemplateID
		var trashNode = $('<p/>').appendTo(listItem);
		
		if ( templateInfo.active === true ) {
			trashNode.html('Move to <br/> Trash').addClass('template-control').attr('data-manager', 'trash');
		} else {
			trashNode.html('Delete <br/> Permenetly').addClass('template-control').attr('data-manager', 'delete');
		}
		
		// preview latest version of template
		var previewNode = $('<a/>').html('preview').addClass('template-control').attr({
			'href': window.location.origin + '/template?template=' + templateInfo.title + '&id=' + id + '&version=' + templateInfo.version,
			'target': '_blank',
		}).appendTo(listItem);

		// append to document
		if ( templateInfo.active === true ) {
			$(App.manager.selectors.activeList).find('ul').append(listItem);
		} else {
			
			$(App.manager.selectors.trashList).find('ul').append(listItem);
		}
	},

	list: function() {
		// loop through existing templates
		_.each(App.manager.list, function (listValue, ListIndex){
			App.manager.render.template(listValue.ID);
		});//each templateList
	}
};