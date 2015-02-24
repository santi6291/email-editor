var Manager = Manager || {};

Manager.list = {};

/**
 * [default event selectors]
 * @type {key: css selector}
 */
Manager.selectors = {
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
Manager.init = function(JSONlocation) {

	$.when($.getJSON(JSONlocation)).then(function(templateList){
		
		Manager.list = templateList;

		Manager.listTemplates();
		
		// bind Events 
		$(document).on('submit', Manager.selectors.create, function(e){
			e.preventDefault();

			Manager.event.create($(this), Manager);
		});

		$(document).on('click', Manager.selectors.clone, function(e){
			e.preventDefault();

			Manager.event.clone($(this), Manager);
		});

		$(document).on('click', Manager.selectors.destroy, function(e){
			e.preventDefault();

			Manager.event.destroy($(this), Manager);
		});

		$(document).on('click', Manager.selectors.trash, function(e){
			e.preventDefault();

			Manager.event.trash($(this), Manager);
		});

		$(document).on('click', Manager.selectors.update, function(e){
			e.preventDefault();

			Manager.event.update($(this), Manager);
		});
	});
};

Manager.event = {
	create:		function(target, object){},
	clone:		function(target, object){},
	destroy:	function(target, object){},
	trash:		function(target, object){},
	update:		function(target, object){},
};

/**
 * [ADD TEMPLETE ITEMT TO LIST]
 * @param {[string]} title    [Manager Title]
 * @param {[integer]} id      [Manager ID]
 * @param {[integer]} version [Manager Verison]
 * @param {[boolean]} activeTemp [deleted or active template]
 */
Manager.renderTemplate = function (id) {
	templateItem = Manager.list[id];
	
	// template container
	var listItem = $('<li/>').addClass('listItem').data('template', { 'ID': id });
	
	// link to editor with GET to template
	var templateNode = $('<a/>').html(templateItem.title).addClass('template-title').attr('href', '/editor.php/?template=' + id).appendTo(listItem);
	
	// update tempalte node
	var updateNode = $('<p/>').html('Update').addClass('template-control').appendTo(listItem).attr('data-manager', 'update');

	// clone node
	var cloneNode = $('<p/>').html('Copy').addClass('template-control').appendTo(listItem).attr('data-manager', 'clone');
	
	// delete Node with TemplateID
	var trashNode = $('<p/>').appendTo(listItem);
	
	if ( templateItem.active === true ) {
		trashNode.html('Move to <br/> Trash').addClass('template-control').attr('data-manager', 'trash');
	} else {
		trashNode.html('Delete <br/> Permenetly').addClass('template-control').attr('data-manager', 'delete');
	}
	
	// preview latest version of template
	var previewNode = $('<a/>').html('preview').addClass('template-control').attr({
		'href': window.location.origin + '/template.php?template=' + Manager.list[id].title + '&ID=' + id + '&version=' + Manager.list[id].version,
		'target': '_blank',
	}).appendTo(listItem);

	// append to document
	if ( templateItem.active === true ) {
		$(Manager.selectors.activeList).find('ul').append(listItem);
	} else {
		
		$(Manager.selectors.trashList).find('ul').append(listItem);
	}
};

Manager.listTemplates = function() {
	// loop through existing templates
	_.each(Manager.list, function (listValue, ListIndex){

		Manager.renderTemplate(listValue.ID);
	});//each templateList
};