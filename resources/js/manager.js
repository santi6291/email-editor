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
		tempalteList();
	});

	function getComponents(callback){
		$.getJSON(Manager.path.handler, {
			action: 'getComponents'
		}, function(components) {
			Manager.components = components;
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
			Manager.bindEvents();
		});
	}
};
Manager.prototype.bindEvents = function() {
	var Manager = this;
	// loop through events
	_.each(Manager.events, function (eventValue, eventKey) {
		$(document).on(eventValue.eventType, eventValue.selector, function(e){
			e.preventDefault();
			eventValue.action(Manager, $(this));
		});
	});
};

Manager.prototype.events = {
	// INSTALL / UNINSTALL TABLE
	'installer': {
		eventType: 'click.installer',
		selector: '[data-manager=installer]',
		action: function(managerRef, target){
			// var Manager = managerRef;
			// $.post(Manager.path.handler, {
			// 	//function type install : uninstall
			// 	action: target.val().toLowerCase()
			// }, function (response){
				
			// 	if ( response.success === true ) {
			// 		$('.listItem').remove();
			// 		Manager.list = {};
			// 	}

			// 	target.parent('.manager-installer').find('.feedback').html(response.message);
			// }, 'json');//post end
		},
	},

	// CREATE NEW TEMPALTE
	'create': {
		eventType: 'click.create',
		selector: '[data-manager=create]',
		action: function(managerRef, target){
			var Manager = managerRef;
			
			modalHelper({
				modal: Manager.components['bootstrap-modal'].contents,
				view: Manager.components['manager-template-action'].contents,
				data:{
					action: 'Create Template'
				},
				title: 'Create New Template',
				shown: function(event, modal){
					
					$(modal).find('.templateAction').on('click.createTemplate', function(){
						
						if( $(modal).find('.templateName').val() === '' ){
							
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
									$(modal).find('.response').html('');
									
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
									}, 500);
									
								} else {
									$(modal).find('.form-group').addClass('has-error');
									// parse response
									var errMsg = objectToText(response.message);
									
									// append response
									$(modal).find('.response').html(errMsg);
								}
							}, 'json');// post end
						}
					});
				}
			});
		},
	},

	'update': {
		eventType: 'click.update',
		selector: '[data-manager=update]',
		action: function(managerRef, target){
			var Manager = managerRef;

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
							$(modal).find('.response').html('No Title Provided.');
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
									$(modal).find('.response').html('');

									// replace title
									template.find('.template-title-link').html(newTitle);

									setTimeout(function(){
										$(modal).modal('hide');	
									}, 500);
								} else {
									$(modal).find('.form-group').addClass('has-error');
									$(modal).find('.response').html(response.message);
								}
							}, 'json');//post end
						}// else
					}); //click.updateTemplate
				} //shown
			});// modelHelper
		}
	},
	
	'clone': {
		eventType: 'click.clone',
		selector: '[data-manager=clone]',
		action: function(managerRef, target){
			var Manager = managerRef;
			
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
							$(modal).find('.response').html('No Title Provided for New Template.');
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
									$(modal).find('.response').html('');

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
									$(modal).find('.response').html(errMsg);
								}
							}, 'json');//post end
						}// else
					}); //click.cloneTemplate
				} //shown
			});// modelHelper
		}
	},

	'trash_delete': {
		eventType: 'click.trashDelete',
		selector: '[data-manager=trash], [data-manager=delete]',
		action: function(managerRef, target){
			var Manager = managerRef;
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
								$(modal).find('.response').html('');

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
								$(modal).find('.response').html(errMsg);
							}
						}, 'json');// post
					});
				}
			});
		}
	}, 

	'preview': {
		eventType: 'click.preview',
		selector: '[data-manager=preview]',
		action:function(managerRef, target){
			var Manager = managerRef;
			var template = target.parents('[data-template-id]');
			// template id
			var templateID = template.data('template-id');
			// Manager.list instance
			var templateInfo = Manager.list[templateID];
			var previewUrl = [
				'template=' + templateInfo.title,
				'id=' + templateInfo.ID,
				'version=' + templateInfo.version
			];
			window.open('/template/?' + previewUrl.join('&'), '_blank');
		}
	},

	'list-trash_list-active': {
		eventType: 'click.preview',
		selector: '[data-manager=list-trash], [data-manager=list-active]',
		action: function(managerRef, target){
			var Manager = managerRef;
			var listType = target.data('manager');

			// find active tab, remove class active if clicked tab is not active tab
			$('.templatesNavigations').find('.active').not($(target)).removeClass('active');

			$(target).addClass('active');
				
			// render if not active list
			if( $('[data-manager-list-type=' + listType + ']').size() === 0 ){
				Manager.renderList(listType);
			}
		}
	}
};

Manager.prototype.renderList = function(listType) {
	var Manager = this;
	var getActive = /active/.test(listType);

	var filterTemplates = _.filter(Manager.list, function(listItem) {
		console.log(Manager.list, listItem);
		return listItem.active == getActive;
	});
	
	filterTemplates.reverse();
	
	$('.manager-templates').handlebars({
		data:{
			templates: filterTemplates,
			listType: listType
		},
		view: Manager.components['manager-listing'].contents
	});
};