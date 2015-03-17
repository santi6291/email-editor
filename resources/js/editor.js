/**
 * [Edit HTML blast]
 * @type {[object]}
 */
var Editor = Editor || {};

Editor = {
	components: {},
	selectors: {},
	template: {}
};

Editor.views = {};

Editor.init = function(){

	Editor.template.title = decodeURI(GET.template);
	Editor.template.id = GET.id;
	
	$.getJSON('/app/handlers/editor/listVer.php', {

		templateID: Editor.template.id
	}, function(versionsJson) {

		Editor.template.versions = versionsJson;


		$.get('/app/data/templates/stored/' + Editor.template.id + '/' + Editor.template.versions[0].fileName, function(latestVer) {

			console.log(latestVer);
		});
		
		_.each(Editor.template.versions, function(ver, index){
			Editor.render.versions(ver.fileName, ver.title, true);
		});
	});
	
	$.getJSON('/app/handlers/editor/components.php', function(componentsJson){
		Editor.components = componentsJson;
		
		_.each(Editor.components, function(component, index){
			Editor.render.component(index);
		});

		$(document).on('click', '[data-hook ~= componentToggle]', function(e){
			e.preventDefault();
			Editor.event.toggleComponents($(this));
		});
	});
};

Editor.render = {
	versions: function( filename, title, append ){
		var fileLoc = ( filename.indexOf('.html') == -1 )? filename + '.html': filename;

		var href = '/app/data/templates/stored/' + Editor.template.id + '/' + fileLoc;
		var aNode = $('<a/>').attr({
			'href': href,
			'data-editor': 'version'
		}).append(title);

		if ( append === true ) {

			$('[data-editor ~= version-list]').append(aNode);
		} else {

			$('[data-editor ~= version-list]').prepend(aNode);
		}
	},

	component: function (componentName){
		var componentType;
		var componentInfo = Editor.components[componentName];

		var componentDiv = $('<div/>').addClass('component');
		var componentThumb = $('<div/>').addClass('component-thumb').appendTo(componentDiv);
		var componentImg = $('<img/>').attr('src', '/data/templates/parts/components/thumbs/' + componentInfo.title + '.png').addClass('component-img').appendTo(componentThumb);

		
		if ( componentName.indexOf('header') > -1 ) {
			
			componentType = '.header-components';
		} else if ( componentName.indexOf('sidebar') > -1 ) {

			componentType = '.siderbar-components';
		} else {
			componentType = '.body-components';
		}

		$('[data-editor ~= components-list]').find(componentType).append(componentDiv);
	}
};


/**
 * [functions to bind]
 * @type {Object}
 */
Editor.event = {
	formatText: function (formatType){
		var sel, range;
	},

	toggleComponents: function (target){
		$(target).next('[data-hook ~= component-list]').stop().slideToggle();
	}
};