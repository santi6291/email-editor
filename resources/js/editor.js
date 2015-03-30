App.editor = {
	components: {},
	selectors: {},
	template: {}
};

App.editor.views = {};

App.editor.init = function(){

	App.editor.template.title = App.GET.template;
	App.editor.template.id = App.GET.id;

	// render components
	App.editor.render.components();
	
	// list of template versions
	$.getJSON(App.handlers.editor.list, {

		templateID: App.editor.template.id
	}, function(versionsJson) {

		// append versions to template object
		App.editor.template.versions = versionsJson;

		// get latest version html
		$.get(App.handlers.editor.stored + App.editor.template.id + '/' + App.editor.template.versions[0].fileName, function(latestVer) {
			template = $(latestVer);
			
			App.editor.template.size = template.find('#templateBody').attr('width');
			
			template.find('.templateHeader').droppable({
				addClasses: false,
				activeClass: 'canDrop activeHeader',
				accept: '[data-component*=header]',
				drop: App.editor.events.drop
			});
			
			template.find('.templateSidebar').droppable({
				addClasses: false,
				activeClass: 'canDrop activeSidebar',
				accept: '[data-component*=sidebar]',
				drop: App.editor.events.drop
			});

			template.find('.templateContent').droppable({
				addClasses: false,
				activeClass: 'canDrop activeContent',
				accept: '[data-component*=body-content]',
				drop: App.editor.events.drop
			});
			

			$('.editor').find('.edit').html(template)
		});
		
		// render all version on siderbar
		_.each(App.editor.template.versions, function(ver, index){
			App.editor.render.versions(ver.fileName, ver.title, true);
		});
	});

	$('[data-hook~=componentToggle]').on('click', function(){
		App.editor.events.toggleComponents($(this));
	})
};

App.editor.render = {
	template: function(content){
		var template = $(content);
		template.find('.editMe').attr('contenteditable', 'true');
		return template;
		// $('.blast').find('.template').html(template);
	},

	versions: function( filename, title, append ){
		var fileLoc = ( filename.indexOf('.html') == -1 )? filename + '.html': filename;

		var href = '/app/data/templates/stored/' + App.editor.template.id + '/' + fileLoc;
		var aNode = $('<a/>').attr({
			'href': href,
			'data-editor': 'version',
		}).append(title);

		if ( append === true ) {

			$('[data-editor ~= version-list]').append(aNode);
		} else {

			$('[data-editor ~= version-list]').prepend(aNode);
		}
	},
	
	components: function(){
		
		_.each(App.views, function(viewData, viewKey){
			
			if ( viewKey.indexOf('template') > -1 ) {
				
				App.editor.render.component(viewKey);
			};
		});
	},

	component: function (componentName){
		var componentDom = $(App.views['editor-component'].contents);
		
		componentDom.find('img').attr({
			'src': '/resources/images/' + componentName + '.png',
			'data-component': componentName
		}).draggable({
			addClasses: false,
			revert: true
		});
		
		if ( componentName.indexOf('header') > -1 ) {
			
			componentType = '.header-components';
		} else if ( componentName.indexOf('sidebar') > -1 ) {

			componentType = '.siderbar-components';
		} else {
			componentType = '.body-components';
		}

		$('[data-editor ~= components-list]').find(componentType).append(componentDom);

	}
};

/**
 * [functions to bind]
 * @type {Object}
 */
App.editor.events = {
	formatText: function (formatType){
		var sel, range;
	},

	toggleComponents: function (target){
		$(target).next('[data-hook ~= component-list]').stop().slideToggle();
	},

	drop: function (event, ui) {
		var componentName = $(ui.draggable).data('component');
		var componentContent = $(App.views[componentName].contents);
		
		$(this)
		.removeClass('noheader')
		.removeClass('noContent')
		.removeClass('noSidebar')
		.removeClass('noBottom')

		console.log(componentName)

		if( componentName.indexOf('body-content') > -1 ){

			componentContent.attr('width', $(this).width())

			$(this).append(componentContent);
		} else if( componentName.indexOf('sidebar') > -1 ){
			
			$(document).find('.templateContent').attr('width', (App.editor.template.size - 200))

			$(this).html($(componentContent));
		} else {
			$(this).html($(componentContent));
		}

		App.editor.events.resize(componentContent, $(this).width()+2);
	},
	
	resize: function (){
		
		columns = $(document).find('.innerColum');
		var parentWidth = columns.parents('td').first().attr('width');
		
		console.dirxml(parentWidth)

		var columnWidth = Math.floor(parentWidth / columns.size());

		columns.attr('width', columnWidth);

		return
		columSize = (Math.floor( containerWidth / $(content).find('.innerColum').size() ) - 20);
		$(content).find('.innerColum').each(function(index, el) {	

			// $(this).attr('width', App.template.)
		});
	}
};