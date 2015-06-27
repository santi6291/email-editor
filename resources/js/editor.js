var Editor = function() {
	var Editor = this;
	
	Editor.path = {
		handler: '/app/handlers/editor.php',
		savedTemplates: '/data/templates/',
		viewsDir: '/data/views/',
		images: '/resources/images/'
	}
	
	Editor.template = {
		title: App.GET.template,
		id: App.GET.id,
	};
	
	Editor.components = {
		'template-body-content-cols-1': {
			id: 'template-body-content-cols-1',
			title: 'Single Column',
			fileName: 'template-body-content-cols-1.html',
			thumb: Editor.path.images + 'template-body-content-cols-1.png'
		},
		'template-body-content-cols-2': {
			id: 'template-body-content-cols-2',
			title: '2 Columns',
			fileName: 'template-body-content-cols-2.html',
			thumb: Editor.path.images + 'template-body-content-cols-2.png'
		},
		'template-body-content-cols-3': {
			id: 'template-body-content-cols-3',
			title: '3 Columns',
			fileName: 'template-body-content-cols-3.html',
			thumb: Editor.path.images + 'template-body-content-cols-3.png'
		},
		'template-body-content-cols-4': {
			id: 'template-body-content-cols-4',
			title: '4 Columns',
			fileName: 'template-body-content-cols-4.html',
			thumb: Editor.path.images + 'template-body-content-cols-4.png'
		},
		'template-header-cols-1': {
			id: 'template-header-cols-1',
			title: 'Image Only',
			fileName: 'template-header-cols-1.html',
			thumb: Editor.path.images + 'template-header-cols-1.png'
		},
		'template-header-cols-2-left': {
			id: 'template-header-cols-2-left',
			title: 'Left image w/ text ',
			fileName: 'template-header-cols-2-left.html',
			thumb: Editor.path.images + 'template-header-cols-2-left.png'
		},
		'template-header-cols-2-right': {
			id: 'template-header-cols-2-right',
			title: 'Right Image w/ text',
			fileName: 'template-header-cols-2-right.html',
			thumb: Editor.path.images + 'template-header-cols-2-right.png'
		},
		'template-header-cols-3': {
			id: 'template-header-cols-3',
			title: 'Cented Image w/ text',
			fileName: 'template-header-cols-3.html',
			thumb: Editor.path.images + 'template-header-cols-3.png'
		},
		'template-layout-sidebar-left': {
			id: 'template-layout-sidebar-left',
			title: 'Left sidebar, content right',
			fileName:'template-body-sidebar.html',
			thumb: Editor.path.images + 'template-layout-sidebar-left.png'
		},
		'template-layout-sidebar-right': {
			id: 'template-layout-sidebar-right',
			title: 'Left content, right sidebar',
			fileName:'template-body-sidebar.html',
			thumb: Editor.path.images + 'template-layout-sidebar-right.png'
		},
		'template-layout-cols-3': {
			id: 'template-layout-cols-3',
			title :'Center content, two sidebars',
			fileName:'template-body-sidebar.html',
			thumb : Editor.path.images + 'template-layout-cols-3.png'
		},
		'template-layout-single':{
			id: 'template-layout-single',
			title :'Single column',
			thumb : Editor.path.images + 'template-layout-single.png'
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
	
	Editor.bindEvents();

	getViews(function(){
		// list of template versions
		getTemplateData().done(function(){

			getCurrentHtml(function(){
				// new template start in modify mode
				if ( Editor.template.versions.length == 1 ) {
					Editor.sidebarMode.modify(Editor, 'layout');
				};
			});
		});
	});//get Views

	function getTemplateData() {
		var templateVersions = $.getJSON(Editor.path.handler, {
			action:'versions',
			templateID: Editor.template.id
		});

		templateVersions.done(function(versionsJson){
			Editor.template.versions = versionsJson.versions;
			Editor.template.colors = versionsJson.defaultColors
		});

		return templateVersions;
	};

	// GET LATEST VERSION HTML
	function getCurrentHtml(callback) {
		var templateID = Editor.template.id;
		var fileName = Editor.template.versions[0].fileName;
		var filePath = Editor.path.savedTemplates + templateID + '/' + fileName;

		$.get(filePath, function(latestVer) {
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

	function getViews(callback){
		var tracker = 0;
		_.each(Editor.components, function(viewObj, key){

			if( typeof viewObj.contents == 'undefined' && typeof viewObj.fileName != 'undefined' ){

				var repeatedFiles = _.filter(Editor.components, function(component){
					return (component.fileName == viewObj.fileName) && (typeof component.contents == 'undefined');
				});

				_.each(repeatedFiles, function(value, index){
					value.contents = null
				})

				$.get(Editor.path.viewsDir + viewObj.fileName, function(viewDOM) {

					_.each(repeatedFiles, function(value, index){
						value.contents = viewDOM
					})

					tracker += repeatedFiles.length;
					if( (tracker == _.size(Editor.components)) && (typeof callback == 'function') ){
						callback();
					}

				});
			} else if( typeof viewObj.fileName != 'undefined' ){
				tracker++;
			}
		});
	}
};

Editor.prototype.setColor = function(colorTarget) {
	var Editor = this;
	var target;
	var newColor = Editor.template.colors[colorTarget];
	
	switch(colorTarget){
		case 'paragraph':
			target = $('p');
		break;

		case 'bold':
			target = $('strong');
		break;

		case 'italic':
			target = $('em');
		break;

		case 'strikethrough':
			target = $('del');
		break;

		case 'subscript':
			target = $('sub');
		break;

		case 'superscript':
			target = $('sup');
		break;

		case 'heading1':
		case 'heading2':
		case 'heading3':
		case 'heading4':
		case 'heading5':
			var headingNumber = colorTarget.charAt(colorTarget.length-1);
			target = $('h' + headingNumber);
		break;
	}

	$('.editor-template').find(target).css('color', newColor);
	Editor.updateDefaultColors();
};

Editor.prototype.updateDefaultColors = function() {
	var Editor = this;
	$.post(Editor.path.handler, {
		action: 'updateDefaultColors',
		colors: Editor.template.colors,
		templateID: editor.template.id
	}, function(response) {
		var message = (response.success)? response.message : objectToText(response.message);
		$('.modify .response').html(message);
	}, 'json');
};

Editor.prototype.bindEvents = function() {
	var Editor = this;
	
	_.each(Editor.events, function(eventValue, eventKey){
		eventValue(Editor);
	})
};

Editor.prototype.sidebarMode = {
	defaults: function(EditorRef){
		var Editor = EditorRef;
		var template = $.handlebars(Editor.components['editor-defaults'].contents, {
			title: 'Set Defaults Template Options',
			colors: Editor.template.colors,
		});
		
		template.find('[data-color]').spectrum({
			showAlpha: false,
			showInitial: true,
			showInput: true,
			preferredFormat: "hex",
			palette: (_.isArray(Editor.template.pallet))? Editor.template.pallet : ['white'],
			showPalette: true,
			maxSelectionSize: 0,
			hide: function (color) {
				var colorTarget = $(this).data('color-target');
				var newColor = color.toHexString();
				
				$(this).attr('data-color', newColor);
				Editor.template.colors[colorTarget] = newColor;
				Editor.setColor(colorTarget)
			}
		});

		$('.innerColumn, .templateSidebar, .templateHeader table[data-added-component]').not('.noSidebar').addClass('editComponent');
		$('.editor-modeView').html(template)

		if( $('.editor-modeView').hasClass('displayNone') ){
			$('.editor-modeView').removeClass('displayNone');
		}
	},

	revisions: function(EditorRef){
		var Editor = EditorRef;
		var template = $.handlebars(Editor.components['editor-revisions'].contents, {
			title: 'Revisions History',
			id: Editor.template.id,
			revisions: Editor.template.versions
		});
		$('.editor-modeView').html(template)
	},

	save: function(EditorRef){
		var Editor = EditorRef;
		var template = $.handlebars(Editor.components['editor-save'].contents, {
			title: 'Save / Validate Template'
		});
		$('.editor-modeView').html(template)

		if( $('.editor-modeView').hasClass('displayNone') ){
			$('.editor-modeView').removeClass('displayNone');
		}
	},

	modify: function(EditorRef, componentsType){
		// componentsType: header, body, layout
		var Editor = EditorRef;
		var target = $('.editor-modeView');
		var view = Editor.components['editor-modify'].contents;
		var requestedComponents = _.filter(Editor.components, function(componentValue, componentKey){
			var exp = new RegExp(componentsType, 'g');
			return exp.test(componentKey);
		})
		var template = $.handlebars(view, {
			title: 'Modify Template',
			listType: componentsType,
			componentList: requestedComponents
		});
		target.html(template)
		
		// todo get tables add editComponent class
		$('[data-added-component]').addClass('removeComponent')

		if( $('.tempFlag').size() == 0){
			$('.templateHeader, .templateContent, .templateBottom').append('{{tempFlag false}}')
			$('.templateHeader, .templateContent, .templateBottom').handlebars();	
		}

		if( $('.editor-modeView').hasClass('displayNone') ){
			$('.editor-modeView').removeClass('displayNone');
		}
	}
}

Editor.prototype.events = {
	
	activateSidebar: function(editorRef){
		var Editor = editorRef;
		$('button[data-editor-mode]').on('click.activateSidebar', function(e){
			e.preventDefault();
			var modeName = $(this).data('editor-mode');
			
			// prevent user from editing template
			$('.editMe').removeAttr('contenteditable')
			
			$('.editor-modeView').removeClass('displayNone');
			
			if ( typeof Editor.sidebarMode[modeName] == 'function' ) {
				switch(modeName){
					case 'modify':
					Editor.sidebarMode[modeName](Editor, 'layout');
					break;

					default:
					Editor.sidebarMode[modeName](Editor);
					break;
				}
				
			}
		});
	},

	closeSiderbar: function(Editor) {
		$(document).on('click.closeSiderbar', '.modelView-modelClose', function(e){
			e.preventDefault();
			// destroy color picker
			$('[data-color]').spectrum('destroy');

			$('.editor-modeView').addClass('displayNone').html('');
			$('.removeComponent, .editComponent').removeClass('removeComponent editComponent');
			$('.tempFlag').remove();
			$('.editMe').attr('contenteditable', 'true');
		});
	},
	
	formatText: function(editorRef){
		var Editor = editorRef;
		$('button[data-editor-format]').on('click.formatText', function(e){
			e.preventDefault();
			var textFormat = $(this).data('editor-format');
			Editor.formatText(textFormat)
		});
	},

	tooltipFormat: function(editorRef){
		var Editor = editorRef;
		$('button[data-editor-insert]').on('click.tooltipFormat', function(e){
			e.preventDefault()
			var insetType = $(this).data('editor-insert');
			console.log(insetType)
		});
	},

	showComponents: function(editorRef){
		var Editor = editorRef;
		$(document).on('click.showComponents', '.addComponent', function(e){
			e.preventDefault();
			var activeSections = $('.activeSection');
			var componentType = ( $(this).parent().hasClass('templateHeader') )? 'header' : 'body';

			activeSections.removeClass('activeSection');
			activeSections.addClass('addComponent');

			$(this).removeClass('addComponent');
			$(this).addClass('activeSection')

			Editor.sidebarMode.modify(Editor, componentType);
		});
	},

	hideComponents: function(editorRef){
		var Editor = editorRef;
		$(document).on('click.hideComponents', '.activeSection', function(e){
			e.preventDefault();
			$(this).removeClass('activeSection')
			$(this).addClass('addComponent');

			Editor.sidebarMode.modify(Editor, 'layout');
		})	
	},

	widthSelect: function(editorRef){
		var Editor = editorRef;
		$(document).on('change.widthSelect', '.templateWidth', function(e){
			e.preventDefault();
			var newWidth = $(this).val()
			Editor.resizeTemplate(newWidth);
		});
	},
	layoutChange: function(editorRef){
		var Editor = editorRef;
		$(document).on('click.layoutChange', '[data-component]', function(){
			var componentName = $(this).data('component');
			Editor.changeLayout(componentName)
		})
	},
	
	saveTemplate: function(editorRef){
		var Editor = editorRef;
		$(document).on('click.saveTemplate', '[data-save]', function(){
			var saveAction = $(this).data('save');
			Editor[saveAction]();
		});
	},

	revisionChange: function(editorRef){
		var Editor = editorRef;
		$(document).on('click.revisionChange', '[data-revison-file]', function(){
			var revisonFile = $(this).data('revison-file');
			var filePath = Editor.path.savedTemplates + Editor.template.id +  '/' + revisonFile;

			$.get( filePath, function(fragment) {
				$('.editor').find('.editor-template').html(fragment);
				$('.editMe').attr('contenteditable', true);
			});
		});
	},
	removeComponent: function (editorRef) {
		var Editor = editorRef;
		$(document).on('click.removeComponent', '.removeComponent', function (e) {
			e.preventDefault();
			$(this).remove();
		})
	}
}

Editor.prototype.formatText = function(formatType){
	var Editor = this;
	var formatType;
	var sel;
	var range;
	
	getSelected(formatType)

	function getSelected (formatType){
		//node type
		formatType = formatType;
		
		if ( window.getSelection) {
			// get selection
			sel = window.getSelection();

			if (sel.rangeCount) {
				range = sel.getRangeAt(0);
				
				if ( $(sel.focusNode).parents(formatType).size() > 0 ) {
					//remove format node	
					removeFormat();
				} else {
					//add format node
					addFormat();
				}
			}
		}
	}
	
	function addFormat (){
		//create format node with selection text 
		var replacementText = $('<' + formatType + '/>').append(range.toString())[0];
		//remove text from DOM
		range.deleteContents();
		//append format node to removed text position
		range.insertNode(replacementText);
	}

	function removeFormat() {

		var replacementText = range.toString();
		// Wrapping node to remove
		var removeNode = $(sel.focusNode).parents(formatType); 
		// removeNode Parent node
		var parentNode = removeNode.parent();
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
	
	Editor.validate(function(validFragment, fullFragment){
		if( !validFragment ){
			return false
		}

		var fragmentData = Editor.cleanFragment();

		$.post(Editor.path.handler, { 
			action: 'save',
			templateID: Editor.template.id,
			fragment: fragmentData.html()
		}, function(response){
			Editor.template.versions.push({
				fileName: response.fileName,
				title: response.title
			}, 'json');

			$('.responseCode').find('textarea').val(fullFragment)	
		}, 'json');
	})
}

Editor.prototype.validate = function(callback) {
	var Editor = this;
	var fullFragment = fullFragment();
	
	$.post(Editor.path.handler, {
		action: 'validate',
		fragment: fullFragment,
	}, function(response) {
		var validFragment = validatorResponse(response.message);
		
		if( (validFragment) && (typeof callback == 'function') ){
			callback(validFragment, fullFragment);
		}
	}, 'json');

	function validatorResponse (response) {
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
	}

	function fullFragment() {
		var fragment = Editor.cleanFragment();
		var fullFragment = [
			Editor.components['template-head'].contents,
			fragment.html(),
			Editor.components['template-footer'].contents
		];
		return fullFragment.join('\n');
	}
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
	
	// modify layout depending on component type
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
			content.addClass('removeComponent');
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
			activeComponent.removeClass('noBottom noContent')

			// add edit component class
			content.addClass('removeComponent');
			content.attr('data-added-component', 'true')
			
			$('.activeSection').before(content)

			Editor.resizeTemplate(Editor.template.width);
		break;
	}
	$('.editMe').attr('contenteditable', 'true')
};

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