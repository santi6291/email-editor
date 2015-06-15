var Editor = function() {
	var Editor = this;
	
	Editor.handler = '/app/handlers/editor.php';
	Editor.savedTemplates = '/data/templates/';
	Editor.viewsDir = '/data/views/';
	Editor.images = '/resources/images/'
	
	Editor.template = {
		title: App.GET.template,
		id: App.GET.id,
	};
	
	Editor.components = {
		'template-body-content-cols-1': {
			id: 'template-body-content-cols-1',
			title: 'Single Column',
			fileName: 'template-body-content-cols-1.html',
			thumb: Editor.images + 'template-body-content-cols-1.png'
		},
		'template-body-content-cols-2': {
			id: 'template-body-content-cols-2',
			title: '2 Columns',
			fileName: 'template-body-content-cols-2.html',
			thumb: Editor.images + 'template-body-content-cols-2.png'
		},
		'template-body-content-cols-3': {
			id: 'template-body-content-cols-3',
			title: '3 Columns',
			fileName: 'template-body-content-cols-3.html',
			thumb: Editor.images + 'template-body-content-cols-3.png'
		},
		'template-body-content-cols-4': {
			id: 'template-body-content-cols-4',
			title: '4 Columns',
			fileName: 'template-body-content-cols-4.html',
			thumb: Editor.images + 'template-body-content-cols-4.png'
		},
		'template-header-cols-1': {
			id: 'template-header-cols-1',
			title: 'Image Only',
			fileName: 'template-header-cols-1.html',
			thumb: Editor.images + 'template-header-cols-1.png'
		},
		'template-header-cols-2-left': {
			id: 'template-header-cols-2-left',
			title: 'Left image w/ text ',
			fileName: 'template-header-cols-2-left.html',
			thumb: Editor.images + 'template-header-cols-2-left.png'
		},
		'template-header-cols-2-right': {
			id: 'template-header-cols-2-right',
			title: 'Right Image w/ text',
			fileName: 'template-header-cols-2-right.html',
			thumb: Editor.images + 'template-header-cols-2-right.png'
		},
		'template-header-cols-3': {
			id: 'template-header-cols-3',
			title: 'Cented Image w/ text',
			fileName: 'template-header-cols-3.html',
			thumb: Editor.images + 'template-header-cols-3.png'
		},
		'template-layout-sidebar-left': {
			id: 'template-layout-sidebar-left',
			title: 'Left sidebar, content right',
			fileName:'template-body-sidebar.html',
			thumb: Editor.images + 'template-layout-sidebar-left.png'
		},
		'template-layout-sidebar-right': {
			id: 'template-layout-sidebar-right',
			title: 'Left content, right sidebar',
			fileName:'template-body-sidebar.html',
			thumb: Editor.images + 'template-layout-sidebar-right.png'
		},
		'template-layout-cols-3': {
			id: 'template-layout-cols-3',
			title :'Center content, two sidebars',
			fileName:'template-body-sidebar.html',
			thumb : Editor.images + 'template-layout-cols-3.png'
		},
		'editor-modify': {
			id: 'editor-modify',
			fileName: 'editor-modify.php'
		}
	};

	Editor.init();
}

Editor.prototype.init = function() {
	var Editor = this;
	
	Editor.events();

	Editor.getViews(function(){
		// list of template versions
		Editor.getVersions().done(function(){

			Editor.getCurrentHtml(function(){
				// new template start in modify mode
				if ( Editor.template.versions.length == 1 ) {
					Editor.activateSidebar('modify');
				};
			});
		});
	});//get Views
};

Editor.prototype.activateSidebar = function(sidebarMode) {
	var Editor = this;
	var functionName = 'mode' + sidebarMode.capFirst();
	
	$('.editor-modeView').removeClass('displayNone');
	
	if ( typeof Editor[functionName] == 'function' ) {
		Editor[functionName]();
		$('template').remove();
	}
};

Editor.prototype.modeModify = function() {
	var Editor = this;
	var templateHeader = $('[data-template-header]');
	var templatesComponents = $('[component-columns]');
	Editor.renderModify({
		target: $('.editor-modeView'), 
		view: Editor.components['editor-modify'].contents,
		title: 'layouts'
	});
	$('.noheader, .noBottom, .noContent').addClass('addComponent')
	
	templateHeader.addClass('removeComponent');
	templatesComponents.addClass('removeComponent');
};

Editor.prototype.renderModify = function(args) {
	var Editor = this;
	var target = args.target
	var view = args.view
	var title = args.title;
	var bodyComponents = [];
	var headerComponents = [];
	var layoutsComponents = [];
	

	_.each(Editor.components, function(component, key){
		if ( /template-body/g.test(key) ) {
			
			bodyComponents.push(component);
		} else if ( /template-header/g.test(key) ){
			
			headerComponents.push(component);
		} else if ( /template-layout/g.test(key) ) {
			layoutsComponents.push(component);
		}
	});
	
	// add single colum layout
	layoutsComponents.push({
		id: 'template-layout-single',
		title :'Single column',
		thumb : Editor.images + 'template-layout-single.png'
	})
	
	var templateArrays = {
		title: title,
		layoutMode: (title.toLowerCase() == 'layouts')? true: false,
		layoutsComponents: layoutsComponents,
		bodyComponents: bodyComponents,
		headerComponents: headerComponents
	}
	
	Editor.registerPartials(view);

	template = Handlebars.compile(view);

	target.html(template(templateArrays))
};

Editor.prototype.registerPartials = function(view) {
	$(view).each(function(){
		// check if element has attribute type with value
		var isTempplate = /TEMPLATE/g.test( $(this).prop("tagName") );
		if( isTempplate ) {
			var partialName = $(this).attr('id');
			var partialContent = $(this).html();
			// register partial
			Handlebars.registerPartial(partialName, partialContent);
		}
	});
};

Editor.prototype.events = function() {
	var Editor = this;
	
	$('button[data-editor-mode]').on('click', function(e){
		e.preventDefault();
		var editorMode = $(this).data('editor-mode');

		Editor.activateSidebar(editorMode)
	});

	$('button[data-editor-format]').on('click', function(e){
		e.preventDefault();
		var textFormat = $(this).data('editor-format');
		console.log(textFormat)
	});

	$('button[data-editor-insert]').on('click', function(e){
		e.preventDefault()
		var insetType = $(this).data('editor-insert');
		console.log(insetType)
	});

	$(document).on('click', '.addComponent', function(e){
		e.preventDefault();
		var activeSections = $('.activeSection');
		
		activeSections.removeClass('activeSection');
		activeSections.addClass('addComponent');
		
		$(this).removeClass('addComponent');
		$(this).addClass('activeSection')


		Editor.renderModify({
			title: 'components',
			target: $('.editor-modeView'), 
			view: Editor.components['editor-modify'].contents,
		});

		if( $(this).hasClass('templateHeader') ){
			$('.modify-componentsList').removeClass('displayNone');
			$('[data-component-type=body]').remove()
		} else {
			$('.modify-componentsList').removeClass('displayNone');
			$('[data-component-type=header]').remove()
		}
	});

	$(document).on('click', '.activeSection', function(e){
		e.preventDefault();
		$(this).removeClass('activeSection')
		$(this).addClass('addComponent');

		Editor.renderModify({
			title: 'layouts',
			target: $('.editor-modeView'), 
			view: Editor.components['editor-modify'].contents,
		});
	})

	$(document).on('click', '.modelView-modelClose', function(e){
		e.preventDefault();
		$('.editor-modeView').addClass('displayNone').html('');
		$('.noheader, .noBottom, .noContent').removeClass('addComponent activeSection removeComponent')
	});

	$(document).on('change', '.templateWidth', function(e){
		e.preventDefault();
		var newWidth = $(this).val()
		Editor.resizeTemplate(newWidth);
	})
};

// GET LATEST VERSION HTML
Editor.prototype.getCurrentHtml = function(callback) {
	var Editor = this;
	var templateID = Editor.template.id;
	var fileName = Editor.template.versions[0].fileName;
	
	$.get(Editor.savedTemplates + templateID + '/' + fileName, function(latestVer) {
		var template = $(latestVer);

		Editor.template.width = template.find('#templateContainer').attr('width');
		Editor.template.sidebarWidth = template.find('[sidebar-width]').attr('width');
		
		$('.widthSelect').find('[value~=' + Editor.template.width + ']').attr('selected', 'true');
		$('.editor').find('.editor-template').html(template);
		
		if (typeof callback == 'function') {
			callback()
		};
	});
};

Editor.prototype.getVersions = function() {
	var Editor = this;
	
	var templateVersions = $.getJSON(Editor.handler, {
		action:'versions',
		templateID: Editor.template.id
	});
	
	templateVersions.done(function(versionsJson){
		
		Editor.template.versions = versionsJson;
		
		// render all version on siderbar
		_.each(Editor.template.versions, function(ver, index){
			Editor.renderVersions(ver.fileName, ver.title, true);
		});
	});

	return templateVersions;
};

Editor.prototype.getViews = function(callback){
	var Editor = this;
	var tracker = 0;

	_.each(Editor.components, function(viewObj, key){

		if( typeof viewObj.contents == 'undefined' ){

			var repeatedFiles = _.filter(Editor.components, function(component){
				return (component.fileName == viewObj.fileName) && (typeof component.contents == 'undefined');
			});

			_.each(repeatedFiles, function(value, index){
				value.contents = null
			})

			$.get(Editor.viewsDir + viewObj.fileName, function(viewDOM) {

				_.each(repeatedFiles, function(value, index){
					value.contents = viewDOM
				})
				
				tracker += repeatedFiles.length;

				if( (tracker == _.size(Editor.components)) && (typeof callback == 'function') ){

					callback();
				}

			});
		}
	});
}

Editor.prototype.resizeTemplate = function(newWidth) {
	var Editor = this;
	/**
	 * templateContainer, templateBody, templateContent: change full width
	 * sidebar-width: 200 when template is 600
	 */

	var sidebarCount =  ($('.templateSidebar').size() - $('.noSidebar').size());
	// if 2 sidebars precent make percentage 25%
	var sidebarPercentage = (sidebarCount == 2)? 25 : ( (100 * Editor.template.sidebarWidth) / Editor.template.width );
	// get siderbar width percentage
	var sidebarWidth = Math.round( (newWidth * sidebarPercentage)/ 100 )
	// leave at full or subtract siderbar width
	var contentWidth = (newWidth - (sidebarWidth * sidebarCount));

	console.group();
		console.log(sidebarCount)
		console.log(sidebarPercentage)
		console.log(sidebarWidth)
		console.log(contentWidth)
	console.groupEnd();
	
	$('[template-width]').attr('width', newWidth)
	$('[sidebar-width]').attr('width', sidebarWidth)
	$('[content-width]').attr('width', contentWidth)

	return;
	// 
	for ( var i = 2; i <= 4; i++ ) {
		var componentCols = $('[component-columns-' + i + ']').find('[column-width]')
		$('[component-columns-' + i + ']').attr('width', Editor.template.width)	

		componentCols.each(function(index, el) {
			var colCount = componentCols.size();
			var newWidth = Math.floor( Editor.template.width / 2 );
			$(el).attr('width', newWidth);
		});
	};
		return
	// no sidebar present
	if( $('[sidebar-width]').children().size() == 0 && $('[sidebar-width]').width() < 200 ){
		for (var i = 2; i <= 4; i++) {
			var componentCols = $('[component-columns-' + i + ']').find('[column-width]')
			$('[component-columns-' + i + ']').attr('width', Editor.template.width)	
			
			componentCols.each(function(index, el) {
				var colCount = componentCols.size();
				var newWidth = Math.floor( Editor.template.width / 2 );
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
}

Editor.prototype.renderTemplate = function(content){
	var Editor = this;
	var template = $(content);
	template.find('.editMe').attr('contenteditable', 'true');
	return template;
	// $('.blast').find('.template').html(template);
}

Editor.prototype.renderVersions = function(fileName, title, append){
	var Editor = this;
	var fileLoc = ( fileName.indexOf('.html') == -1 )? fileName + '.html': fileName;

	var href = '/app/data/templates/stored/' + Editor.template.id + '/' + fileLoc;
	var aNode = $('<a/>').attr({
		'href': href,
		'data-editor': 'version',
	}).append(title);

	if ( append === true ) {

		$('[data-editor ~= version-list]').append(aNode);
	} else {

		$('[data-editor ~= version-list]').prepend(aNode);
	}
}