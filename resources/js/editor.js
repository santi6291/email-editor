var Editor = function() {
	var Editor = this;
	
	Editor.path = {
		handler: '/app/handlers/editor.php',
		savedTemplates: '/data/templates/',
		viewsDir: '/data/views/',
		images: '/resources/images/'
	};
	
	Editor.template = {
		title: App.GET.template,
		id: App.GET.id,
	};
	
	Editor.spectrum = function (options) {
		var spectrum = this;
		spectrum.showAlpha = false;
		spectrum.showInitial = true;
		spectrum.showInput = true;
		spectrum.preferredFormat = "hex";
		spectrum.palette = (_.isArray(Editor.template.pallet))? Editor.template.pallet : [];
		spectrum.showPalette = true;
		spectrum.maxSelectionSize = 0;
		
		_.each(options, function (optionValue, optionKey) {
			spectrum[optionKey] = optionValue;
		});
	};
	

	Editor.init();
};

Editor.prototype.init = function() {
	var Editor = this;

	Editor.bindEvents();

	getComponents(function(){
		// list of template versions
		getTemplateData().done(function(){

			getCurrentHtml(function(){
				var templatePreview = [
					'template=' + editor.template.title,
					'id=' + Editor.template.id,
					'version='+  Editor.template.versions[0].fileName.replace('.html', '')
				];
				$('.templatePreview').attr('href', '/template/?' + templatePreview.join('&'));
				// new template start in modify mode
				if ( Editor.template.versions.length == 1 ) {
					Editor.sidebarMode.modify(Editor, 'layout');
				}
			});
		});
	});//get Views

	function getTemplateData() {
		var templateData = $.getJSON(Editor.path.handler, {
			action:'versions',
			templateID: Editor.template.id
		});

		templateData.done(function(versionsJson){
			Editor.template.versions = versionsJson.versions;
			Editor.template.settings = versionsJson.defaultSettings;
		});

		return templateData;
	}

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
			$('.editor').find('.editMe').attr('contenteditable', 'true');
			if (typeof callback == 'function') {
				callback();
			}
		});
	}

	function getComponents(callback){
		$.getJSON(Editor.path.handler, {
			action: 'getComponents'
		}, function(components) {
			Editor.components = components;
			if ( typeof callback == 'function' ) {
				callback();
			}
		});
	}
};

Editor.prototype.previewSettings = function(args) {
	// args.target, args.style:{styleType:styleValue}
	var Editor = this;
	var properTarget;
	switch(args.target){
		case 'paragraph':
			properTarget = 'p';
		break;

		case 'bold':
			properTarget = 'strong';
		break;

		case 'italic':
			properTarget = 'em';
		break;

		case 'strikethrough':
			properTarget = 'del';
		break;

		case 'subscript':
			properTarget = 'sub';
		break;

		case 'superscript':
			properTarget = 'sup';
		break;

		case 'anchor':
			properTarget = 'a';
		break;

		case 'heading1':
		case 'heading2':
		case 'heading3':
		case 'heading4':
		case 'heading5':
			var headingNumber = args.target.charAt(args.target.length-1);
			properTarget = 'h' + headingNumber;
		break;
		
		case 'templateContainer':
		case 'backgroundTable':
			properTarget = '#' + args.target;
		break;
		default:
			properTarget = args.target;
		break;
	}
	
	_.each(args.style, function (styleValue, styleType) {
		// check if element exist
		var styleSet = ( $('[data-style-target=' + properTarget + styleType + ']').size() > 0 );
		// select or create element
		var previewStyles = ( styleSet )? $('[data-style-target=' + properTarget + styleType + ']') : $('<style class="previewStyles" data-style-target="' + properTarget + styleType + '" />');
		previewStyles.data({
			'target': properTarget,
			'styleType': styleType,
			'styleValue': styleValue
		});
		// append styles to container
		previewStyles.html('.editor-template ' +properTarget + '{' + styleType + ':' + styleValue + ' !important}');
		// append to body
		$('body').append(previewStyles);
	});
};

Editor.prototype.updateDefaultSettings = function() {
	var Editor = this;
	$.post(Editor.path.handler, {
		action: 'updateSettings',
		colors: Editor.template.settings,
		templateID: editor.template.id
	}, function(response) {
		var message = (response.success)? response.message : objectToText(response.message);
		$('.modify .response').html(message);
	}, 'json');
};

Editor.prototype.bindEvents = function() {
	var Editor = this;
	// todo use object to bind events
	_.each(Editor.events, function(eventValue, eventKey){
		
		$(document).on(eventValue.eventType, eventValue.selector, function (e) {
			e.preventDefault();
			console.log(eventValue.action);
			eventValue.action(Editor, $(this));
		});
	});
};

Editor.prototype.sidebarMode = {
	defaults: function(editorRef){
		var Editor = editorRef;
		var colors = _.mapObject(Editor.template.settings, function (val) {
			return val.color;
		});
		
		$('.editor-modeView').handlebars({
			view: Editor.components['editor-defaults'].contents,
			data: {
				title: 'Set Defaults Options',
				settings: Editor.template.settings,
			}
		});

		spectrumSettings = new Editor.spectrum({
			hide: function (color) {
				var colorTarget = $(this).parents('[data-setting-target]').data('setting-target');
				var newColor = color.toHexString();
				var styleType = $(this).parents('[data-style]').data('style');
				var previewArgs = {
					target: colorTarget,
					style: {}
				};
				previewArgs.style[styleType] = newColor;
				Editor.template.settings[colorTarget][styleType] = newColor;
				Editor.previewSettings(previewArgs);
			}
		});

		$('.editor-modeView').find('[data-color]').spectrum(spectrumSettings);

		$('.innerColumn, .templateSidebar, .templateHeader table[data-added-component]').not('.noSidebar').addClass('editComponent');

		if( $('.editor-modeView').hasClass('hidden') ){
			$('.editor-modeView').removeClass('hidden');
		}
	},
	
	editComponent: function (editorRef, target) {
		var Editor = editorRef;
		target = $(target);
		var styles = {
			border: {
				color: target.css('border-color'),
				width: target.css('border-width').replace('px', ''),
				style: target.css('border-style')
			},
			valign: target.attr('valign'),
			width: target.width(),
			bgColor: target.css('background-color')
		};
		
		$('.editor-modeView').handlebars({
			view: Editor.components['editor-modify-component'].contents,
			data: {
				title: 'Modify component',
				styles: styles
			}
		});
		
		var spectrumSettings = new Editor.spectrum();

		$('.editor-modeView').find('[data-color]').spectrum(spectrumSettings);
	},

	revisions: function(editorRef){
		var Editor = editorRef;

		$('.editor-modeView').handlebars({
			view: Editor.components['editor-revisions'].contents,
			data:{
				title: 'Revisions History',
				id: Editor.template.id,
				revisions: Editor.template.versions
			}
		});
	},

	save: function(editorRef){
		var Editor = editorRef;
		
		$('.editor-modeView').handlebars({
			view: Editor.components['editor-save'].contents,
			data: {
				title: 'Save / Validate Template'
			}
		});

		if( $('.editor-modeView').hasClass('hidden') ){
			$('.editor-modeView').removeClass('hidden');
		}
	},

	modify: function(editorRef, componentsType){
		// componentsType: header, body, layout
		var Editor = editorRef;
		var target = $('.editor-modeView');
		var view = Editor.components['editor-modify'].contents;
		var requestedComponents = _.filter(Editor.components, function(componentValue, componentKey){
			var exp = new RegExp(componentsType, 'g');
			return exp.test(componentKey);
		});

		target.handlebars({
			view: view,
			data: {
				title: 'Modify Template',
				listType: componentsType,
				componentList: requestedComponents
			}
		});
		
		// todo get tables add editComponent class
		$('[data-added-component]').addClass('removeComponent');

		if( $('.tempFlag').size() === 0){
			$('.templateHeader, .templateContent, .templateBottom').append('{{tempFlag false}}');
			$('.templateHeader, .templateContent, .templateBottom').handlebars();
		}

		if( $('.editor-modeView').hasClass('hidden') ){
			$('.editor-modeView').removeClass('hidden');
		}
	},

	pallet: function (editorRef) {
		var Editor = editorRef;
		
		$('.editor-modeView').handlebars({
			view: Editor.components['editor-color-pallet'].contents,
			data: {
				title: 'Modify Template Color pallet'
			}
		});
	}
};

Editor.prototype.events = {
	// activate sidebar, get mode from data-editor-mode
	activateSidebar:{
		eventType: 'click.activateSidebar',
		selector: 'button[data-editor-mode]',
		action: function (editorRef, target) {
			var Editor = editorRef;
			var modeName = $(target).data('editor-mode');
			
			// prevent user from editing template
			$('.editMe').removeAttr('contenteditable');
			
			$('.editor-modeView').removeClass('hidden');
			
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
		}
	},
	
	// close sidebar and clean up
	closeSiderbar: {
		eventType: 'click.closeSiderbar',
		selector: '.modelView-modelClose',
		action: function (editorRef, target) {
			var Editor = editorRef;
			// destroy color picker
			$('[data-color]').spectrum('destroy');
			// hide sidebar
			$('.editor-modeView').addClass('hidden').html('');
			// remove modification classes from components
			$('.removeComponent, .editComponent, .closeComponent').removeClass('removeComponent editComponent closeComponent');
			// remove temp flag marker
			$('.tempFlag').remove();
			// make content editable
			$('.editMe').attr('contenteditable', 'true');
			// remove preview styles
			$('.previewStyles').remove();
		}
	},
	
	settingChanged:{
		eventType: 'change.settingChanged, keyup.settingChanged',
		selector: '[data-style]:not([data-style=color]) input',
		action: function (editorRef, target) {
			var Editor = editorRef;
			var styleType = $(target).parents('[data-style]').data('style');
			var styleValue = $(target).val();
			var previewArgs = {
				target: $(target).parents('[data-setting-target]').data('setting-target'),
				style: {}
			};
			switch(styleType){
				case 'line-height':
					styleValue += '%';
				break;
				default:
					styleValue += 'px';
				break;
			}
			previewArgs.style[styleType] = styleValue;
			Editor.previewSettings(previewArgs);
		}
	},

	// add requested text format to highlighted text
	formatTextClick: {
		eventType: 'click.formatText',
		selector: 'button[data-editor-format]',
		action: function(editorRef){
			var Editor = editorRef;	
			var textFormat = $(target).data('editor-format');
			Editor.formatText({
				formatType: textFormat,
				returnSelection: false
			});
		}
	},
	
	formatTextSelect: {
		eventType: 'change.formatText',
		selector: 'select[data-editor-format]',
		action: function (editorRef, target) {
			var Editor = editorRef;
			var textFormat = $(target).val();
			
			$(target).attr('data-editor-format', textFormat);
			
			Editor.formatText({
				formatType: textFormat,
				returnSelection: false
			});
		}
	},

	// get format of clicked text
	getFormat:{
		eventType: 'mouseup',
		selector: '.editor-template',
		action: function (editorRef, target) {
			var Editor = editorRef;
			var selectedText = Editor.formatText({
				returnSelection: true
			});
			var parentNode = $(selectedText.anchorNode.parentNode).prop('nodeName').toLowerCase();
			Editor.hintFormat(parentNode);
		}
	},

	// open tool tip for a, img actions
	tooltipFormat: {
		eventType: 'click.tooltipFormat',
		selector: 'button[data-editor-insert]',
		action: function (editorRef, target) {
			var Editor = editorRef;	
			var insetType = $(target).data('editor-insert');
			console.log(insetType);
		}
	},

	// render components to modify template
	showComponents: {
		eventType: 'click.showComponents',
		selector: '.addComponent',
		action: function (editorRef, target) {
			var Editor = editorRef;
			var activeSections = $('.activeSection');
			var componentType = ( $(target).parent().hasClass('templateHeader') )? 'header' : 'body';

			activeSections.removeClass('activeSection');
			activeSections.addClass('addComponent');

			$(target).removeClass('addComponent');
			$(target).addClass('activeSection');

			Editor.sidebarMode.modify(Editor, componentType);
		}
	}, 

	// return to layout view
	hideComponents:{
		eventType: 'click.hideComponents',
		selector: '.activeSection',
		action: function (editorRef, target) {
			var Editor = editorRef;

			$(target).removeClass('activeSection');
			$(target).addClass('addComponent');

			Editor.sidebarMode.modify(Editor, 'layout');
		}
	},

	// modify template width
	widthSelect: {
		eventType: 'change.widthSelect',
		selector: '.templateWidth',
		action: function (editorRef, target) {
			var Editor = editorRef;
			var newWidth = $(target).val();
			Editor.resizeTemplate(newWidth);
		}
	},

	// change sidebars
	layoutChange: {
		eventType: 'click.layoutChange',
		selector: '[data-component]',
		action: function (editorRef, target) {
			var Editor = editorRef;
			var componentName = $(target).data('component');
			Editor.changeLayout(componentName);
		}
	}, 
	
	// save temaplte code
	saveTemplate: {
		eventType: 'click.saveTemplate', 
		selector: '[data-save]',
		action: function (editorRef, target) {
			var Editor = editorRef;
			var saveAction = $(target).data('save');
			Editor[saveAction]();
		}
	},

	// change to selected revision 
	revisionChange:{
		eventType:  'click.revisionChange', 
		selector: '[data-revison-file]',
		action: function (editorRef, target) {
			var Editor = editorRef;

			var revisonFile = $(target).data('revison-file');
			var filePath = Editor.path.savedTemplates + Editor.template.id +  '/' + revisonFile;

			$.get( filePath, function(fragment) {
				$('.editor').find('.editor-template').html(fragment);
				$('.editMe').attr('contenteditable', true);
			});
		}
	},

	// remove component from template
	removeComponent: {
		eventType: 'click.removeComponent',
		selector: '.removeComponent',
		action: function (editorRef, target) {
			var Editor = editorRef;
			$(target).remove();
		}
	},

	// change component settings
	editComponent: {
		eventType: 'click.editComponent',
		selector: '.editComponent',
		action: function (editorRef, target) {
			var Editor = editorRef;
			$('[data-color]').spectrum('destroy');
			
			$('.closeComponent').removeClass('closeComponent').addClass('editComponent');
			$(target).removeClass('editComponent').addClass('closeComponent');
			
			Editor.sidebarMode.editComponent(Editor, $(target));
		}
	},
	
	// returnt from component settings to default settings
	closeComponent: {
		eventType: 'click.closeComponent',
		selector: '.closeComponent',
		action: function (editorRef, target) {
			var Editor = editorRef;
			$('[data-color]').spectrum('destroy');
			$('.closeComponent').removeClass('closeComponent').addClass('editComponent');			
			Editor.sidebarMode.defaults(Editor);
		}
	}, 

	// update tempalte default settings
	updateSettings: {
		eventType: 'click.applySettings',
		selector: '[data-defaults]',
		action: function (editorRef, target) {
			var Editor = editorRef;
			Editor.updateDefaultSettings();
			
			if( $(target).data('defaults') == 'apply' ){
				Editor.applySettings();
			}
		}
	}
};

Editor.prototype.applySettings = function() {
	$('.previewStyles').each(function() {
		var target = $(this).data('target');
		var styleType = $(this).data('styleType');
		var styleValue = $(this).data('styleValue');

		$('.editor-template').find(target).css(styleType, styleValue);
	});
};

Editor.prototype.hintFormat = function(nodeName) {
	$('select[hintFormat]').find('option').attr('selected', false);
	$('button[data-editor-format]').removeClass('active');
	
	switch(nodeName){
		case 'p':
		case 'h1':
		case 'h2':
		case 'h3':
		case 'h4':
		case 'h5':
			$('select[data-editor-format]').find('option[value=' + nodeName + ']').attr('selected', true);
		break;
		
		default:
			$('button[data-editor-format=' + nodeName + ']').addClass('active');
		break;
	}
};

Editor.prototype.formatText = function(args){
	var Editor = this;
	var formatType = args.formatType;
	var returnSelection = args.returnSelection;
	var sel;
	var range;
	var styles = {
		'h1' : [
			'display:block',
			'font-family:Arial',
			'font-weight:bold',
			'margin-top:0',
			'margin-right:0',
			'margin-bottom:10px',
			'margin-left:0',
			'text-align:left',

			'color:' + Editor.template.settings.heading1.color,
			'font-size:' + Editor.template.settings.heading1['font-size'] + 'px',
			'line-height:' + Editor.template.settings.heading1['line-height'] + '%'
		],
		'h2': [
			'display:block',
			'font-family:Arial',
			'font-weight:bold',
			'margin-top:0',
			'margin-right:0',
			'margin-bottom:0px',
			'margin-left:0',
			'text-align:center',
			'text-transform:uppercase',

			'color:' + Editor.template.settings.heading2.color,
			'font-size:' + Editor.template.settings.heading2['font-size'] + 'px',
			'line-height:' + Editor.template.settings.heading2['line-height'] + '%'
		],
		
		'h3':[
			'display:block',
			'font-family:Arial',
			'font-weight:bold',
			'margin-top:0',
			'margin-right:0',
			'margin-bottom:10px',
			'margin-left:0',
			'text-align:left',
			'text-transform: uppercase',

			'color:' + Editor.template.settings.heading3.color,
			'font-size:' + Editor.template.settings.heading3['font-size'] + 'px',
			'line-height:' + Editor.template.settings.heading3['line-height'] + '%'
		],

		'h4':[
			'display:block',
			'font-family:Arial',
			'font-weight:bold',
			'margin-top:0',
			'margin-right:0',
			'margin-bottom:10px',
			'margin-left:0',
			'text-align:left',
			'text-transform: uppercase',

			'color:' + Editor.template.settings.heading4.color,
			'font-size:' + Editor.template.settings.heading4['font-size'] + 'px',
			'line-height:' + Editor.template.settings.heading4['line-height'] + '%'
		],

		'h5':[
			'display:block',
			'font-family:Arial',
			'font-weight:bold',
			'margin-top:0',
			'margin-right:0',
			'margin-bottom:0px',
			'margin-left:0',
			'text-align:left',

			'color:' + Editor.template.settings.heading5.color,
			'font-size:' + Editor.template.settings.heading5['font-size'] + 'px',
			'line-height:' + Editor.template.settings.heading5['line-height'] + '%',
		],
		
		'a': [
			'text-decoration: none;',
			'color:' + Editor.template.settings.anchor.color,
			'line-height:' + Editor.template.settings.anchor['line-height'] + '%',
		],
		
		'p': [
			'font-family: Arial',
			'text-align: left',

			'color:' + Editor.template.settings.paragraph.color,
			'font-size:' + Editor.template.settings.paragraph['font-size'] + 'px',
			'line-height:' + Editor.template.settings.paragraph['line-height'] + '%',
		]
	};

	return getSelected(formatType);

	function getSelected (formatType){
		//node type
		formatType = formatType;
		
		if ( window.getSelection) {
			// get selection
			sel = window.getSelection();

			if (sel.rangeCount) {
				range = sel.getRangeAt(0);
				
				if( returnSelection ) {
					return sel;
				}
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
		console.log(styles);
		var formatStyles = (typeof styles[formatType] !== 'undefined')? styles[formatType].join(';') : '';
		//create format node with selection text 
		var replacementText = $('<' + formatType + ' style="' + formatStyles + '"/>').append(range.toString())[0];
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
};

Editor.prototype.save = function() {
	var Editor = this;
	
	Editor.validate(function(validFragment, fullFragment){
		if( !validFragment ){
			return false;
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

			$('.responseCode').find('textarea').val(fullFragment);
			$('.feedback').html('<p>Changes saved.</p>');
			$('.responseCode, .feedback').removeClass('hidden');
		}, 'json');
	});
};

Editor.prototype.validate = function(callback) {
	var Editor = this;
	var fullFragmentString = fullFragment();
	$('.feedback').removeClass('hidden').html('<p>Validating code.</p>');
	
	$.post(Editor.path.handler, {
		action: 'validate',
		fragment: fullFragmentString,
	}, function(response) {
		var validFragment = validatorResponse(response.message);
		
		if( (validFragment) && (typeof callback == 'function') ){
			callback(validFragment, fullFragmentString);
		}
	}, 'json');

	function validatorResponse (response) {
		var jsonResponse = $.parseJSON(response);
		var messages = [];
		var exemptions = [
			'70', //self-close tag not close (br, img, etc).
			'108',
			'127' //alt tag
		];

		_.each(jsonResponse.messages, function(message, index){
			if( ($.inArray(message.messageid, exemptions) == -1) && (typeof message.messageid != 'undefined') ){
				messages.push(message);
			}
		});

		if( messages.length === 0 ){
			$('.feedback').html('<p>Code is valid.</p>');
			return true;
		} else {

			$('.editor-modeView').handlebars({
				'view': Editor.components['editor-save'].contents,
				data: {
					'title': 'save / validate template',
					'errors': messages
				}
			});
			$('.errorExplan').find('.helpwanted').remove();
			$('.feedback').removeClass('hidden');
			return false;
		}
	}

	function fullFragment() {
		var fragment = Editor.cleanFragment();
		var fullFragmentArr = [
			Editor.components['template-head'].contents,
			fragment.html(),
			Editor.components['template-footer'].contents
		];
		return fullFragmentArr.join('\n');
	}
};

Editor.prototype.cleanFragment = function() {
	var fragment =  $('.editor-template');
	fragment.find('[contenteditable]').removeAttr('contenteditable');
	return fragment;
};

// CHANGE TEMPLATE LAYOUT 
Editor.prototype.changeLayout = function(componentName) {
	var Editor = this;
	var component = Editor.components[componentName];
	
	// modify layout depending on component type
	switch(componentName){
		case 'template-layout-sidebar-left':
			var filledSideLeft = $('.templateSidebar').eq(0);
			var emptySideRight = $('.templateSidebar').eq(1);
			
			filledSideLeft.html(component.contents);
			filledSideLeft.removeClass('noSidebar');
			
			emptySideRight.html('');
			emptySideRight.addClass('noSidebar');
			Editor.resizeTemplate(Editor.template.width);
		break;

		case 'template-layout-sidebar-right':
			var filledSideRight = $('.templateSidebar').eq(1);
			var emptySideLeft = $('.templateSidebar').eq(0);
			
			filledSideRight.html(component.contents);
			filledSideRight.removeClass('noSidebar');
			
			emptySideLeft.html('');
			emptySideLeft.addClass('noSidebar');
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
			var headerContent = $(component.contents);
			var headerSection = $('.templateHeader');

			// add edit component class
			headerContent.addClass('removeComponent');
			headerContent.attr('data-added-component', 'true');

			// remove temp tables
			headerSection.find('.tempFlag').remove();
			
			headerSection.append(headerContent, '{{tempFlag true}}');
			headerSection.removeClass('noheader');
			headerSection.handlebars();
			
			Editor.resizeTemplate(Editor.template.width);
		break;
		
		case 'template-body-content-cols-1':
		case 'template-body-content-cols-2':
		case 'template-body-content-cols-3':
		case 'template-body-content-cols-4':
			var bodyContent = $(component.contents);
			var activeComponent = $('.activeSection').parent();
			activeComponent.removeClass('noBottom noContent');

			// add edit component class
			bodyContent.addClass('removeComponent');
			bodyContent.attr('data-added-component', 'true');
			
			$('.activeSection').before(bodyContent);

			Editor.resizeTemplate(Editor.template.width);
		break;
	}
	
	$('.editMe').attr('contenteditable', 'true');
};

Editor.prototype.resizeTemplate = function(newWidth) {
	var Editor = this;

	var sidebarCount =  ($('.templateSidebar').size() - $('.noSidebar').size());
	// if 2 sidebars precent make percentage 25%
	var sidebarPercentage = (sidebarCount == 2)? 25 : ( (100 * Editor.template.sidebarWidth) / Editor.template.width );
	// get siderbar width percentage
	var sidebarWidth = Math.round( (newWidth * sidebarPercentage)/ 100 );
	// leave at full or subtract siderbar width
	var contentWidth = (newWidth - (sidebarWidth * sidebarCount));
	
	$('[template-width]').attr('width', newWidth);
	$('[sidebar-width]').attr('width', sidebarWidth);
	$('[content-width]').attr('width', contentWidth);

	Editor.template.width = newWidth;
	Editor.template.sidebarWidth = sidebarWidth;

	$('.templateContent').find('[component-columns]').each(function(inex, element){
		var colCount = $(element).attr('component-columns');
		var colWidth = Math.round( (contentWidth/colCount) - 20 );
		var innerCols = $(element).find('.innerColumn');
		
		$(element).attr('width', contentWidth);
		innerCols.attr('width', colWidth);
	});

	$('.templateBottom').find('[component-columns]').each(function(index, element) {
		var colCount = $(element).attr('component-columns');
		var colWidth = Math.round( (newWidth/colCount) - 20 );
		var innerCols = $(element).find('.innerColumn');
		
		$(element).attr('width', newWidth);
		innerCols.attr('width', colWidth);
		
		innerCols.find('img').attr('src', 'http://placehold.it/' + colWidth + 'x' + colWidth);
	});

	$('.templateHeader').find('[data-added-component]').attr('width', newWidth);
};