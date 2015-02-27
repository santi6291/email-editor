/**
 * [Handle template data CREATE/ DELETE / UPDATE / CLONE / RENDER]
 * @type {[object]}
 */
var Manager = Manager || {};

/**
 * [list of all templates]
 * @type {Object}
 */
Manager.list = {};

/**
 * [functions to bind]
 * @type {Object}
 */
Manager.event = {};

/**
 * [default event selectors]
 * @type {Object}
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
		
		_.each(Manager.selectors, function(selector, key){
			if ( selector.indexOf('-list') == -1 ) {
				eventType = ( $(selector).prop("tagName") == 'FORM')? 'submit' : 'click';

				$(document).on(eventType, selector, function(e){
					e.preventDefault();

					Manager.event[key]($(this), Manager);
				});
			}
		});
	});
};

/**
 * [ADD TEMPLETE ITEMT TO LIST]
 * @param {[string]} title    [Manager Title]
 * @param {[integer]} id      [Manager ID]
 * @param {[integer]} version [Manager Verison]
 * @param {[boolean]} activeTemp [deleted or active template]
 */
Manager.renderTemplate = function (id) {
	templateInfo = Manager.list[id];
	
	// template container
	var listItem = $('<li/>').addClass('listItem').data('template', { 'ID': id });
	
	// link to editor with GET to template
	var templateNode = $('<a/>').html(templateInfo.title).addClass('template-title').attr('href', '/editor/?id=' + id + '&template=' + templateInfo.title).appendTo(listItem);
	
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
		$(Manager.selectors.activeList).find('ul').append(listItem);
	} else {
		
		$(Manager.selectors.trashList).find('ul').append(listItem);
	}
};

/**
 * [Render exiting templates]
 */
Manager.listTemplates = function() {
	// loop through existing templates
	_.each(Manager.list, function (listValue, ListIndex){

		Manager.renderTemplate(listValue.ID);
	});//each templateList
};