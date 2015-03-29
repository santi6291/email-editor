$(document).ready(function(){
	setPageID();
	pageEvent[pageID]();
});

var pageEvent = pageEvent || {};

/////////////////
// INDEX EVENT //
/////////////////
pageEvent.index = function(){

	Manager.init('/app/handlers/manager/templateList.php');

	// INSTALL / UNINSTALL TABLE
	
	$('[data-hook~=installer]').on('click', function (e){
		e.preventDefault();

		var installerNode = $(this);

		$.post('/app/handlers/manager/installer.php', {
			//function type install : uninstall
			action: $(this).val().toLowerCase()
		}, function (response){

			if ( response.success === true ) {
				$('.listItem').remove();
			}

			installerNode.parent('.install-table').find('.feedback').html(response.message);
		}, 'json');
		//post end
	});
	// on: submit
	
	Manager.event = {
		// CREATE NEW TEMPALTE
		create: function(target){
			
			if ( target.find('.title').val() === '' ) {
				target.find('.feedback').html('Template Title is Blank');
				return false;
			}

			$.post('/app/handlers/manager/newTemplate.php', {
				// template title
				templateName : target.find('.title').val()
			}, function(response){
				if ( response.success === true) {
					// add to template list
					Manager.list[response.ID] = {
						ID: response.ID,
						title: response.title,
						version:response.version,
						active: response.active
					};
					//render template
					Manager.renderTemplate(response.ID);
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

			$.post('/app/handlers/manager/cloneTemplete.php', {
				//template to be cloned ID
				cloneID: target.parent('li').data('template').ID,
				// new template name
				newTempName: newTemplate
			}, function(response){

				if ( response.success === true ) {
					// add to template list
					Manager.list[response.ID] = {
						ID: response.ID,
						title: response.title,
						version:response.version.toString(),
						active: response.active
					};
					// render template
					Manager.renderTemplate(response.ID);
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
			// Manager.list instance
			var templateInfo = Manager.list[templateID];

			// prompt for new title
			var newTitle  = window.prompt('Rename Template:', templateInfo.title);
			
			// return if prompt is empty or canceled
			if ( newTitle === '' || newTitle === null ) {
				
				if ( newTitle === null ) {
					window.alert('No Title Provided.');
				}
				return false;
			}
			
			$.post('/app/handlers/manager/updateTemplate.php', {
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
			// Manager.list instance
			var templateInfo = Manager.list[templateID];
			
			// alter message if template is active or inactive
			var confirmMsg = ( templateInfo.active === true )? 'Press OK Move ' + templateInfo.title + ' Template to Trash' : 'Press OK to Permenetly Delete  ' + templateInfo.title;
			var delNodeConfirm = window.confirm(confirmMsg);

			// return if confirmation canceled 
			if ( delNodeConfirm === false ) {
				return;
			}
			
			$.post('/app/handlers/manager/delTemplate.php', {
				// temple id
				templateID: templateID,
				// template status
				isActive: Boolean(templateInfo.active)
			}, function(response){

				if ( response.success === true ) {
					
					template.remove();
					
					if ( templateInfo.active === true ) {
						
						templateInfo.active = false;
						Manager.renderTemplate(templateID);
					}
				} else {
					window.alert('error deleting template');
				}
			}, 'json');// post
		},

		// DELETE TEMPLTE DIRECTORY AND FROM DB
		destroy: function(target) {
			Manager.event.trash(target);
		}
	};
};

///////////////////
// EDITOR EVENTS //
///////////////////
pageEvent.editor = function() {
	Editor.init();
};