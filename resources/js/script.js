$(document).ready(function(){
	App.init();
});

// INDEX EVENT
App.pageEvent.index = function(){

	App.manager.init();

	// INSTALL / UNINSTALL TABLE
	$('[data-hook~=installer]').on('click', function (e){
		e.preventDefault();
		var installerNode = $(this);

		$.post(App.handlers.manager.installer, {
			//function type install : uninstall
			action: $(this).val().toLowerCase()
		}, function (response){

			if ( response.success === true ) {
				$('.listItem').remove();
			}
			
			installerNode.parent('.manager-installer').find('.feedback').html(response.message);
		}, 'json');//post end
	});// on: submit
	
	App.manager.events = {
		// CREATE NEW TEMPALTE
		create: function(target){
			
			if ( target.find('.title').val() === '' ) {
				target.find('.feedback').html('Template Title is Blank');
				return false;
			}

			$.post(App.handlers.manager.create, {
				// template title
				templateName : target.find('.title').val()
			}, function(response){
				if ( response.success === true) {
					// add to template list
					App.manager.list[response.ID] = {
						ID: response.ID,
						title: response.title,
						version:response.version,
						active: response.active
					};
					//render template
					App.manager.render.template(response.ID);
				} else {
					// parse response
					errMsg = objectToText(response.message);
					// append response
					target.find('.feedback').html(errMsg);
				}
			}, 'json');
			// post end
		},
		
		// CLONE EXISTING TEMPLATE
		clone: function(target) {
			// prompt for cloned template name
			var newTemplate  = window.prompt('Insert Template Name.');
			// return if prompt is empty or canceled
			if ( newTemplate === '' || newTemplate === null ) {
				
				if ( newTemplate === null ) {
					window.alert('No Title Provided for New Template.');
				}
				return false;
			}

			$.post(App.handlers.manager.clone, {
				//template to be cloned ID
				cloneID: target.parent('li').data('template').ID,
				// new template name
				newTempName: newTemplate
			}, function(response){

				if ( response.success === true ) {
					// add to template list
					App.manager.list[response.ID] = {
						ID: response.ID,
						title: response.title,
						version:response.version.toString(),
						active: response.active
					};
					// render template
					App.manager.render.template(response.ID);
				} else {
					// parse error response
					errMsg = objectToText(response.message);
					alert(errMsg);
				}
			}, 'json');
			//post end
		},

		//UPDATE EXISTING TEMPLATE NAME
		update: function(target){
			// template node
			var template = target.parent('li');
			// tempalte id
			var templateID = template.data('template').ID;
			// App.manager.list instance
			var templateInfo = App.manager.list[templateID];

			// prompt for new title
			var newTitle  = window.prompt('Rename Template:', templateInfo.title);
			
			// return if prompt is empty or canceled
			if ( newTitle === '' || newTitle === null ) {
				
				if ( newTitle === null ) {
					window.alert('No Title Provided.');
				}
				return false;
			}
			
			$.post(App.handlers.manager.update, {
				// template id
				templateID: templateID,
				//new template name
				newName: newTitle
			}, function(response){

				if ( response.success === true ) {
					// replace title 
					template.find('.template-title').html(newTitle);
				} else {
					// alert of errors
					window.alert(response.message);
				}
			}, 'json');
			//post end
		},

		// MOVE TEMPALTE TO TRASH
		trash: function(target) {

			// template node
			var template = target.parent('li');
			// template id
			var templateID = template.data('template').ID;
			// App.manager.list instance
			var templateInfo = App.manager.list[templateID];
			
			// alter message if template is active or inactive
			var confirmMsg = ( templateInfo.active === true )? 'Press OK Move ' + templateInfo.title + ' Template to Trash' : 'Press OK to Permenetly Delete  ' + templateInfo.title;
			var delNodeConfirm = window.confirm(confirmMsg);

			// return if confirmation canceled 
			if ( delNodeConfirm === false ) {
				return;
			}
			
			$.post(App.handlers.manager.destroy, {
				// temple id
				templateID: templateID,
				// template status
				isActive: Boolean(templateInfo.active)
			}, function(response){

				if ( response.success === true ) {
					
					template.remove();
					
					if ( templateInfo.active === true ) {
						
						templateInfo.active = false;
						App.manager.render.template(templateID);
					}
				} else {
					window.alert('error deleting template');
				}
			}, 'json');// post
		},

		// DELETE TEMPLTE DIRECTORY AND FROM DB
		destroy: function(target) {
			App.manager.event.trash(target);
		}
	};
};

// EDITOR EVENTS
App.pageEvent.editor = function() {
	App.editor.init();
};