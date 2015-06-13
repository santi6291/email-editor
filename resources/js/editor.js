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
			
			App.editor.template.width = template.find('#templateContainer').attr('width');
			$('.widthSelect').find('[value~=' + App.editor.template.width + ']').attr('selected', 'true');
			
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

			template.find('.templateContent, .templateBottom').droppable({
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

		$('.widthSelect').on('change', function(e){
			App.editor.events.widthChange($(this));
		})
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
		
		var componentType, activeClass;
		
		if ( componentName.indexOf('header') > -1 ) {
			
			componentType = '.header-components';
		} else if ( componentName.indexOf('sidebar') > -1 ) {

			componentType = '.siderbar-components';
		} else {
			
			componentType = '.body-components';
		}

		componentDom.find('img').attr({
			'src': '/resources/images/' + componentName + '.png',
			'data-component': componentName
		}).draggable({
			addClasses: false,
			revert: true,
			start: App.editor.events.dragStart, 
			stop: App.editor.events.dragStop
		});
		

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
		
		$(this).height( $(this).height()+100 );
		
		$(this)
		.removeClass('noheader')
		.removeClass('noContent')
		.removeClass('noSidebar')
		.removeClass('noBottom')

		if( componentName.indexOf('body-content') > -1 ){

			componentContent.attr('width', $(this).width())

			$(this).append(componentContent);
		} else if( componentName.indexOf('sidebar') > -1 ){
			
			$(document).find('.templateContent').attr('width', (App.editor.template.size - 200))

			$(this).html($(componentContent));
		} else {
			$(this).html($(componentContent));
		}

		App.editor.events.resize();
	},

	dragStart: function (){
		var sidebarWidth = ( Math.round( App.editor.template.width / 30 ) * 10 );
		var contentSize = ( App.editor.template.width - (sidebarWidth * 2) );

		$('.templateContent').attr('width', contentSize );
		$('.templateContent').find('.templateBody').attr('width', contentSize );
	},

	dragStop: function() {
		var sidebarWidth = ( Math.round( App.editor.template.width / 30 ) * 10 );
		var contentSize = ( $('[sidebar-width]').children().size() > 0 )? (App.editor.template.width - sidebarWidth) : App.editor.template.width;
		
		$('.templateContent').attr('width', contentSize );
		$('.templateContent').find('.templateBody').attr('width', contentSize );
	},
	
	resize: function (){
		var sidebarWidth = ( Math.round( App.editor.template.width / 30 ) * 10 );
		
		for (var i = 2; i <= 4; i++) {
				var componentCols = $('[component-columns-' + i + ']').find('[column-width]')
				$('[component-columns-' + i + ']').attr('width', App.editor.template.width)	
				
				componentCols.each(function(index, el) {
					var colCount = componentCols.size();
					var newWidth = Math.floor( App.editor.template.width / 2 );
					$(el).attr('width', newWidth);
				});
			};
			return
		// no sidebar present
		if( $('[sidebar-width]').children().size() == 0 && $('[sidebar-width]').width() < 200 ){
			for (var i = 2; i <= 4; i++) {
				var componentCols = $('[component-columns-' + i + ']').find('[column-width]')
				$('[component-columns-' + i + ']').attr('width', App.editor.template.width)	
				
				componentCols.each(function(index, el) {
					var colCount = componentCols.size();
					var newWidth = Math.floor( App.editor.template.width / 2 );
					$(el).attr('width', newWidth);
				});
			};
		} else {

			// $('[sidebar-width]').attr('width', sidebarWidth);
			// console.log($('[component-columns-2]'))
			// $('[component-columns-2]').attr('width', 400)
			// contentWidth = ()

			/*
			$('[content-width]')*/
		}
	},
	
	widthChange: function(target){
		App.editor.template.width = $(target).find(':selected').val();
		
		$('[template-width]').attr('width', App.editor.template.width);
		App.editor.events.resize();
	}
	
};