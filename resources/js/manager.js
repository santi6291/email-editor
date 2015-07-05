var Manager = function(){
	var Manager = this;
	Manager.path = {
		handler: '/app/handlers/manager.php'
	};
	Manager.init();
};

// Initiate template manager
Manager.prototype.init = function() {
	var Manager = this;

	getComponents(function(){
		tempalteList()
	})

	function getComponents(callback){
		$.getJSON(Manager.path.handler, {
			action: 'getComponents'
		}, function(components) {
			Manager.components = components
			if ( typeof callback == 'function' ) {
				callback();
			}
		});
	}

	function tempalteList(callback){
		$.getJSON(Manager.path.handler,{
			action: 'list'
		}, function(templateList){
			Manager.list = templateList;
			Manager.renderList('active-list');
			Manager.bindEvents()
		});
	}
};
Manager.prototype.bindEvents = function() {
	var Manager = this;
	// loop through events
	_.each(Manager.events, function (eventFunction, eventKey) {
		// seperate multiple selectors
		selectorArray = eventKey.split(' ');
		
		_.each(selectorArray, function(selectorValue, selectorIndex){
			$(document).on('click', '[data-manager ="' + selectorValue + '"]', function(e){
				e.preventDefault();
				eventFunction(Manager, $(this));
			})
		})
	})
};

Manager.prototype.events = {
	// INSTALL / UNINSTALL TABLE
	installer: function(managerRef, target){
		// return;
		var Manager = managerRef;
		var target = $(target);
		$.post(Manager.path.handler, {
			//function type install : uninstall
			action: target.val().toLowerCase()
		}, function (response){
			
			if ( response.success === true ) {
				$('.listItem').remove();
				Manager.list = {};
			}

			target.parent('.manager-installer').find('.feedback').html(response.message);
		}, 'json');//post end
	},

	// CREATE NEW TEMPALTE
	create: function(managerRef, target){
		var Manager = managerRef;
		var target = $(target);
		
		modalHelper({
			modal: Manager.components['bootstrap-modal'].contents,
			view: Manager.components['manager-template-action'].contents,
			data:{
				action: 'Create Template'
			},
			title: 'Create New Template',
			shown: function(event, modal){
				
				$(modal).find('.templateAction').on('click.createTemplate', function(){
					
					if( $(modal).find('.templateName').val() == '' ){
						
						$(modal).find('.form-group').addClass('has-error');
						$(modal).find('.response').html('No Template Name Provided');
					} else {

						$.post(Manager.path.handler, {
							action: 'new',
							// template title
							templateName : $(modal).find('.templateName').val()
						}, function(response){
							if ( response.success === true) {
								$(modal).find('.form-group').addClass('has-success').removeClass('has-error');
								$(modal).find('.response').html('')
								
								// add to template list
								Manager.list[response.ID] = {
									ID: response.ID,
									title: response.title,
									version:response.version,
									active: response.active
								};
								
								//render template
								Manager.renderList('active-list');
								
								setTimeout(function(){
									$(modal).modal('hide');	
								}, 500)
								
							} else {
								$(modal).find('.form-group').addClass('has-error');
								// parse response
								var errMsg = objectToText(response.message);
								
								// append response
								$(modal).find('.response').html(errMsg)
							}
						}, 'json');// post end
					}
				});
			}
		});
	},

	update: function(managerRef, target){
		var Manager = managerRef;
		var target = $(target);

		// template node
		var template = target.parents('[data-template-id]');
		// tempalte id
		var templateID = template.data('template-id');
		// Manager.list instance
		var templateInfo = Manager.list[templateID];
		
		modalHelper({
			modal: Manager.components['bootstrap-modal'].contents,
			view: Manager.components['manager-template-action'].contents,
			data:{
				action: 'Update template'
			},
			title: 'Update template',
			show: function(event, modal){
				$(modal).find('.templateName').val(templateInfo.title);
			},
			shown: function(event, modal){
				$(modal).find('.templateAction').on('click.updateTemplate', function(){
					var newTitle = $(modal).find('.templateName').val();

					// return if prompt is empty or canceled
					if ( newTitle === '' ) {

						$(modal).find('.form-group').addClass('has-error');
						$(modal).find('.response').html('No Title Provided.')
					} else {

						$.post(Manager.path.handler, {
							action: 'update',
							// template id
							templateID: templateID,
							//new template name
							newName: newTitle
						}, function(response){

							if ( response.success === true ) {
								$(modal).find('.form-group').addClass('has-success').removeClass('has-error');
								$(modal).find('.response').html('')

								// replace title
								template.find('.template-title-link').html(newTitle);

								setTimeout(function(){
									$(modal).modal('hide');	
								}, 500)
							} else {
								$(modal).find('.form-group').addClass('has-error');
								$(modal).find('.response').html(response.message)
							}
						}, 'json');//post end
					}// else
				}); //click.updateTemplate
			} //shown
		});// modelHelper
	},
	
	clone: function(managerRef, target){
		var Manager = managerRef;
		var target = $(target);
		
		modalHelper({
			modal: Manager.components['bootstrap-modal'].contents,
			view: Manager.components['manager-template-action'].contents,
			data:{
				action: 'Template Name'
			},
			title: 'Clone Template',
			shown: function(event, modal){
				$(modal).find('.templateAction').on('click.cloneTemplate', function(){
					var newTitle = $(modal).find('.templateName').val();

					// return if prompt is empty or canceled
					if ( newTitle === '' ) {

						$(modal).find('.form-group').addClass('has-error');
						$(modal).find('.response').html('No Title Provided for New Template.')
					} else {

						$.post(Manager.path.handler, {
							action: 'clone',
							//template to be cloned ID
							cloneID: target.parents('[data-template-id]').data('template-id'),
							// new template name
							newTempName: $(modal).find('.templateName').val()
						}, function(response){
							if ( response.success === true ) {
								$(modal).find('.form-group').addClass('has-success').removeClass('has-error');
								$(modal).find('.response').html('')

								// add to template list
								Manager.list[response.ID] = {
									ID: response.ID,
									title: response.title,
									version:response.version.toString(),
									active: response.active
								};
								//render template
								Manager.renderList('active-list');
								setTimeout(function(){
									$(modal).modal('hide');	
								}, 500);
							} else {
								$(modal).find('.form-group').addClass('has-error');
								// parse response
								var errMsg = objectToText(response.message);
								
								// append response
								$(modal).find('.response').html(errMsg)
							}
						}, 'json');//post end
					}// else
				}); //click.cloneTemplate
			} //shown
		});// modelHelper
	},

	'trash delete': function(managerRef, target){
		var Manager = managerRef
		var target = $(target);
		// template node
		var template = target.parents('[data-template-id]');
		// template id
		var templateID = template.data('template-id');
		// Manager.list instance
		var templateInfo = Manager.list[templateID];

		modalHelper({
			modal: Manager.components['bootstrap-modal'].contents,
			view: Manager.components['manager-template-delete'].contents,
			data:{
				action: (templateInfo.active)? 'Move To Trash' : 'Permenetly Delete',
				isActive: templateInfo.active
			},
			title: (templateInfo.active)? 'Move To Trash' : 'Permenetly Delete',
			shown: function(event, modal){
				$(modal).find('.templateAction').on('click.delete', function(){
					$.post(Manager.path.handler, {
						action: 'delete',
						// temple id
						templateID: templateID,
						// template status
						isActive: Boolean(templateInfo.active)
					}, function(response){

						if ( response.success === true ) {
							$(modal).find('.form-group').addClass('has-success').removeClass('has-error');
							$(modal).find('.response').html('')

							template.remove();
							
							if ( templateInfo.active === true ) {
								templateInfo.active = false;
							} else {
								delete Manager.list[templateID];
							}

							setTimeout(function(){
								$(modal).modal('hide');	
							}, 500);

						} else {
							// parse error response
							$(modal).find('.form-group').addClass('has-error');
							// parse response
							var errMsg = objectToText(response.message);
							
							// append response
							$(modal).find('.response').html(errMsg)
						}
					}, 'json');// post
				})
			}
		})
		
		return

		// alter message if template is active or inactive
		var confirmMsg = ( templateInfo.active === true )? 'Press OK Move ' + templateInfo.title + ' Template to Trash' : 'Press OK to Permenetly Delete  ' + templateInfo.title;
		var delNodeConfirm = window.confirm(confirmMsg);

		// return if confirmation canceled 
		if ( delNodeConfirm === false ) {
			return;
		}
		
		$.post(Manager.path.handler, {
			action: 'delete',
			// temple id
			templateID: templateID,
			// template status
			isActive: Boolean(templateInfo.active)
		}, function(response){

			if ( response.success === true ) {
				
				template.remove();
				
				if ( templateInfo.active === true ) {
					templateInfo.active = false;
				} else {
					delete Manager.list[templateID];
				}
			} else {
				window.alert('error deleting template');
			}
		}, 'json');// post
	},

	'preview': function(managerRef, target){
		var Manager = managerRef
		var target = $(target);
		var template = target.parents('[data-template-id]');
		// template id
		var templateID = template.data('template-id');
		// Manager.list instance
		var templateInfo = Manager.list[templateID];
		var previewUrl = [
			'template=' + templateInfo.title,
			'id=' + templateInfo.ID,
			'version=' + templateInfo.version
		]
		window.open('/template/?' + previewUrl.join('&'), '_blank')
	},

	'list-trash list-active': function(managerRef, target){
		var Manager = managerRef
		var listType = target.data('manager');

		// find active tab, remove class active if clicked tab is not active tab
		$('.templatesNavigations').find('.active').not($(target)).removeClass('active');

		$(target).addClass('active');
			
		// render if not active list
		if( $('[data-manager-list-type=' + listType + ']').size() == 0 ){
			Manager.renderList(listType);
		}
	}
}

Manager.prototype.renderList = function(listType) {
	var Manager = this;
	var getActive = /active/.test(listType);

	var filterTemplates = _.filter(Manager.list, function(listItem) {
		console.log(Manager.list, listItem);
		return listItem.active == getActive;
	});
	
	filterTemplates.reverse()
	
	$('.manager-templates').handlebars({
		data:{
			templates: filterTemplates,
			listType: listType
		},
		view: Manager.components['manager-listing'].contents
	})
};