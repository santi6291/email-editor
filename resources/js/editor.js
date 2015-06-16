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
		'template-layout-single ':{
			id: 'template-layout-single',
			title :'Single column',
			thumb : Editor.images + 'template-layout-single.png'
		},
		'editor-modify': {
			id: 'editor-modify',
			fileName: 'editor-modify.php'
		},
		'editor-save': {
			id: 'editor-save',
			fileName: 'editor-save.php'
		},
		'editor-defaults': {
			id: 'editor-defaults',
			fileName: 'editor-defaults.php'
		},
		'template-head': {
			id: 'template-head',
			fileName: 'template-head.html'
		},
		'template-footer': {
			id: 'template-footer',
			fileName: 'template-footer.html'
		},
		'editor-revisions': {
			id: 'editor-revisions',
			fileName: 'editor-revisions.php'
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
	// prevent user from editing template
	$('.editMe').removeAttr('contenteditable')
	
	$('.editor-modeView').removeClass('displayNone');
	
	if ( typeof Editor[functionName] == 'function' ) {
		Editor[functionName]();
	}
};


Editor.prototype.modeDefaults = function() {
	var Editor = this;
	var template = $.handlebars(Editor.components['editor-defaults'].contents, {
		title: 'Defaults',
		id: Editor.template.id,
		revisions: Editor.template.versions
	});
	$('.editor-modeView').html(template)
};

Editor.prototype.modeRevisions = function() {
	var Editor = this;
	var template = $.handlebars(Editor.components['editor-revisions'].contents, {
		title: 'revisions',
		id: Editor.template.id,
		revisions: Editor.template.versions
	});
	$('.editor-modeView').html(template)
};

Editor.prototype.modeSave = function() {
	var Editor = this;
	var template = $.handlebars(Editor.components['editor-save'].contents, {
		title: 'save'
	});
	$('.editor-modeView').html(template)
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
	// todo get tables add editComponent class
	
	$('[data-added-component], .sidebarContent').addClass('editComponent')

	$('.templateHeader, .templateContent, .templateBottom').append('{{tempFlag false}}')
	$('.templateHeader, .templateContent, .templateBottom').handlebars();
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
	
	var templateArrays = {
		title: title,
		layoutMode: (title.toLowerCase() == 'layouts')? true: false,
		layoutsComponents: layoutsComponents,
		bodyComponents: bodyComponents,
		headerComponents: headerComponents
	}
	
	var template = $.handlebars(view, templateArrays);
	target.html(template)
};

Editor.prototype.events = function() {
	var Editor = this;
	// open sidebar
	$('button[data-editor-mode]').on('click', function(e){
		e.preventDefault();
		var editorMode = $(this).data('editor-mode');

		Editor.activateSidebar(editorMode)
	});

	// text format option
	$('button[data-editor-format]').on('click', function(e){
		e.preventDefault();
		var textFormat = $(this).data('editor-format');
		Editor.formatText(textFormat)
		console.log(textFormat)
	});

	// inert image/a tags
	$('button[data-editor-insert]').on('click', function(e){
		e.preventDefault()
		var insetType = $(this).data('editor-insert');
		console.log(insetType)
	});

	// sidebar show components according to tempalte section
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

		if( $(this).parents('.templateHeader').size() ){
			$('.modify-componentsList').removeClass('displayNone');
			$('[data-component-type=body]').remove()
		} else {
			$('.modify-componentsList').removeClass('displayNone');
			$('[data-component-type=header]').remove()
		}
	});

	// return to layout options
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

	// close sidebar
	$(document).on('click', '.modelView-modelClose', function(e){
		e.preventDefault();
		$('.editor-modeView').addClass('displayNone').html('');
		
		$('.editComponent').removeClass('editComponent');
		$('.tempFlag').remove();
		$('.editMe').attr('contenteditable', 'true')
	});

	// width select change
	$(document).on('change', '.templateWidth', function(e){
		e.preventDefault();
		var newWidth = $(this).val()
		Editor.resizeTemplate(newWidth);
	});

	// sidebar component selected
	$(document).on('click', '[data-component]', function(){
		var componentName = $(this).data('component');
		Editor.changeLayout(componentName)
	})
		
	// save template
	$(document).on('click', '[data-save]', function(){
		var saveAction = $(this).data('save');
		Editor[saveAction]();
	});

	// replace with selected revision
	$(document).on('click', '[data-revison-file]', function(){
		var revisonFile = $(this).data('revison-file');
		var filePath = Editor.savedTemplates + Editor.template.id +  '/' + revisonFile;
		
		$.get( filePath, function(fragment) {
			$('.editor').find('.editor-template').html(fragment);
			$('.editMe').attr('contenteditable', true);
		});
	});
};

Editor.prototype.formatText = function(formatType){
	var Editor = this;
	var formatType;
	var sel;
	var range;
	
	getSelected(formatType)

	function getSelected (formatType){
		formatType = formatType;//node type
		
		if ( window.getSelection) {
			sel = window.getSelection();// get selection

			if (sel.rangeCount) {
				range = sel.getRangeAt(0);
				
				if ( $(sel.focusNode).parents(formatType).size() > 0 ) {//remove format node
					
					removeFormat();
				} else {//add format node
					
					addFormat();
				}
			}
		}
	}
	
	function addFormat (){

		var replacementText = $('<' + formatType + '/>').append(range.toString())[0];//create format node with selection text 

		range.deleteContents();//remove text from DOM
		range.insertNode(replacementText);//append format node to removed text position
		
		if ( formatType == 'a' ) {
			aNode = $(replacementText);
			aNode.attr({
				href: '',
				target: '_blank',
				'class': 'green'
			})
			// call tooltip
		}
	}

	function removeFormat() {

		var replacementText = range.toString();
			
		var removeNode = $(sel.focusNode).parents(formatType); // node to remove
		var parentNode = removeNode.parent();// removeNode Parent node
		/**
		 * get parentNode string with tag
		 * Find format text tag in parentNode
		 * replace with format text content
		 */
		var newContent = parentNode[0].outerHTML.replace(removeNode[0].outerHTML, removeNode[0].innerHTML);
		parentNode.html(newContent);
	}
}

Editor.prototype.save = function() {
	var Editor = this;
	
	Editor.validate(function(validFragment){
		if( !validFragment ){
			return false
		}
		var fragmentData = Editor.cleanFragment();

		$.post(Editor.handler, { 
			action: 'save',
			templateID: Editor.template.id,
			fragment: fragmentData.html()
		}, function(response){
			Editor.template.versions.push({
				fileName: response.fileName,
				title: response.title
			});

			$('.responseCode').find('textarea').val(Editor.fullFragment())
			
		}, 'json');
	})
};

Editor.prototype.validate = function(callback) {
	var Editor = this;

	var fragment = Editor.cleanFragment();
	
	var fullFragment = Editor.fullFragment();
	
	$.post(Editor.handler, {
		action: 'validate',
		fragment: fullFragment,
	}, function(response) {
		var validFragment = Editor.validatorResponse(response.message);
		
		if( (validFragment) && (typeof callback == 'function') ){
			callback(validFragment);
		}
	}, 'json');
};

Editor.prototype.validatorResponse = function(response) {
	var Editor = this;
	var jsonResponse = $.parseJSON(response);
	var messages = [];
	var exemptions = [
		'70', //self-close tag not close (br, img, etc).
		'108',
		'127' //alt tag
	]

	_.each(jsonResponse.messages, function(message, index){
		if( ($.inArray(message.messageid, exemptions) == -1) && (typeof message.messageid != 'undefined') ){
			messages.push(message)
		}
	});

	if( messages.length == 0 ){
		$('.feedback').html('<p>Code is valid.</p>')
		return true
	} else {
		var responseView = $.handlebars(Editor.components['editor-save'].contents, {
			'title': 'save',
			'errors': messages
		});
		$('.editor-modeView').html(responseView)
		return false
	}
};

Editor.prototype.fullFragment = function() {
	var Editor = this;
	var fragment = Editor.cleanFragment();
	var fullFragment = [
		Editor.components['template-head'].contents,
		fragment.html(),
		Editor.components['template-footer'].contents
	];
	return fullFragment.join('\n');
};

Editor.prototype.cleanFragment = function() {
	var fragment =  $('.editor-template');
	fragment.find('[contenteditable]').removeAttr('contenteditable');
	return fragment
};

// CHANGE TEMPLATE LAYOUT 
Editor.prototype.changeLayout = function(componentName) {
	var Editor = this;
	var component = Editor.components[componentName];
	
	switch(componentName){
		case 'template-layout-sidebar-left':
			var filledSide = $('.templateSidebar').eq(0);
			var emptySide = $('.templateSidebar').eq(1);
			
			filledSide.html(component.contents);
			filledSide.removeClass('noSidebar');
			
			emptySide.html('');
			emptySide.addClass('noSidebar');
			Editor.resizeTemplate(Editor.template.width);
		break;

		case 'template-layout-sidebar-right':
			var filledSide = $('.templateSidebar').eq(1);
			var emptySide = $('.templateSidebar').eq(0);
			
			filledSide.html(component.contents);
			filledSide.removeClass('noSidebar')
			
			emptySide.html('');
			emptySide.addClass('noSidebar');
			Editor.resizeTemplate(Editor.template.width);
		break;
		
		case 'template-layout-cols-3':
			$('.templateSidebar').html(component.contents);
			$('.templateSidebar').removeClass('noSidebar');
			Editor.resizeTemplate(Editor.template.width);
		break;
		
		case 'template-layout-single':
			$('.templateSidebar').html('');
			$('.templateSidebar').addClass('noSidebar');

			Editor.resizeTemplate(Editor.template.width);
		break;

		case 'template-header-cols-1':
		case 'template-header-cols-2-left':
		case 'template-header-cols-2-right':
		case 'template-header-cols-3':
			// header content
			var content = $(component.contents);
			var headerSection = $('.templateHeader');

			// add edit component class
			content.addClass('editComponent');
			content.attr('data-added-component', 'true')

			// remove temp tables
			headerSection.find('.tempFlag').remove();
			
			headerSection.append(content, '{{tempFlag true}}');
			headerSection.removeClass('noheader');
			headerSection.handlebars();
			
			Editor.resizeTemplate(Editor.template.width);
		break;
		
		case 'template-body-content-cols-1':
		case 'template-body-content-cols-2':
		case 'template-body-content-cols-3':
		case 'template-body-content-cols-4':
			var content = $(component.contents);
			var activeComponent = $('.activeSection').parent();
			var removeClass = ( activeComponent.hasClass('templateBottom') )? 'noBottom' : 'noContent';
			// add edit component class
			content.addClass('editComponent');
			content.attr('data-added-component', 'true')

			activeComponent.find('.tempFlag').remove();
			
			activeComponent.append(content, '{{tempFlag true}}');
			activeComponent.removeClass(removeClass);
			activeComponent.handlebars();

			Editor.resizeTemplate(Editor.template.width);
		break;
	}

	$('.sidebarContent').addClass('editComponent')
	$('.editMe').attr('contenteditable', 'true')
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

	var sidebarCount =  ($('.templateSidebar').size() - $('.noSidebar').size());
	// if 2 sidebars precent make percentage 25%
	var sidebarPercentage = (sidebarCount == 2)? 25 : ( (100 * Editor.template.sidebarWidth) / Editor.template.width );
	// get siderbar width percentage
	var sidebarWidth = Math.round( (newWidth * sidebarPercentage)/ 100 )
	// leave at full or subtract siderbar width
	var contentWidth = (newWidth - (sidebarWidth * sidebarCount));
	
	$('[template-width]').attr('width', newWidth)
	$('[sidebar-width]').attr('width', sidebarWidth)
	$('[content-width]').attr('width', contentWidth)

	Editor.template.width = newWidth;
	Editor.template.sidebarWidth = sidebarWidth;

	$('.templateContent').find('[component-columns]').each(function(inex, element){
		var colCount = $(element).attr('component-columns');
		var colWidth = Math.round( (contentWidth/colCount) - 20 )
		var innerCols = $(element).find('.innerColumn');
		
		$(element).attr('width', contentWidth)
		innerCols.attr('width', colWidth)
	});

	$('.templateBottom').find('[component-columns]').each(function(index, element) {
		var colCount = $(element).attr('component-columns');
		var colWidth = Math.round( (newWidth/colCount) - 20 );
		var innerCols = $(element).find('.innerColumn');
		
		$(element).attr('width', newWidth);
		innerCols.attr('width', colWidth);
		
		innerCols.find('img').attr('src', 'http://placehold.it/' + colWidth + 'x' + colWidth);
	});
}