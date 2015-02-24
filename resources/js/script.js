$(document).ready(function(){

	switch ( window.pageID ) {
		
		/***************************************
		 * INDEX EVENT
		 ***************************************/
		case 'index':
			
			Manager.init('/app/handlers/manager/templateList.php');


			// INSTALL / UNINSTALL TABLE
			$.hook('installer').on('click', function (e){
				e.preventDefault();

				var installerNode = $(this);

				$.post('/app/handlers/manager/installer.php', {
					action: $(this).val().toLowerCase()
				}, function (response){
					if ( response.success === true ) {
						$('.listItem').remove();
					}

					installerNode.parent('.install-table').find('.feedback').html(response.message);
					
				}, 'json');//post
			});// on: submit
			Manager.event = {
				
				create: function(target){

					$.post('/app/handlers/manager/newTemplate.php', {
						// template title
						templateName : target.find('.title').val()
					}, function(response){
						if ( response.success === true) {
							// go to editor view
							Manager.list[response.ID] = {
								ID: response.ID,
								title: response.title,
								version:response.version,
								active: response.active
							};

							Manager.renderTemplate(response.ID);
						} else {
							// parse response
							errMsg = objectToText(response.message);
							// append response
							target.find('.feedback').html(errMsg);
						}
					}, 'json');// post
				},
				
				clone: function(target) {
					var newTemplate  = window.prompt('Insert Template Name.');

					if ( newTemplate === '' ) {

						window.alert('No Title Provided for New Template.');
						return false;
					} else if(newTemplate === null ) {

						return false;
					}

					$.post('/app/handlers/manager/cloneTemplete.php', {

						cloneID: target.parent('li').data('template').ID,
						newTempName: newTemplate
					}, function(response){

						if ( response.success === true ) {
							Manager.list[response.ID] = {
								ID: response.ID,
								title: response.title,
								version:response.version.toString(),
								active: response.active
							};

							Manager.renderTemplate(response.ID);
						} else {
							errMsg = objectToText(response.message);
							alert(errMsg);
						}

						console.log(response);
					}, 'json');//post
				},

				update: function(target){
					console.log('update');
				},

				trash: function(target) {
					// todo

					/*Object {
						ID: 1, 
						title: "test", 
						version: "1424387289", 
						active: true
					}*/

					var template = target.parent('li');
					var templateID = template.data('template').ID;
					var templateInfo = Template.list[templateID];

					var confirmMsg = ( templateInfo.active === true )? 'Press OK Move Template to Trash' : 'Press OK to Permenetly Delete Template';
					var deleteNode = window.confirm(confirmMsg);

					if ( deleteNode === false ) {
						return;
					}

					Template.list[templateID].active = false;
					
					$.post('/app/handlers/manager/delTemplate.php', {

						templateID: templateID,
						isActive: templateInfo.active
					}, function(response){
						console.log(response)
						return
						if ( response === true ) {
							template.remove();
							
							if ( delNode.data('templates') == 'trash' ) {
								
								addTemp(templateInfo.tempTitle, templateInfo.tempID, templateInfo.tempVer, false);
							}
						} else {
							window.alert('error deleting template');
						}
					}, 'json');// post
				},

				destroy: function(target) {
					Template.event.trash(target);
				}
			};


			// SENT TO TRASH OR PERMENELTY DELETE TEMPLATE
			/*$(document).on('click', '[data-templates ~= trash], [data-templates ~= delete]', function(e){
				e.preventDefault();
				return
				var delNode = $(this);
				var template = delNode.parent('li');
				// object with template info tempTitle, tempID, tempVer
				var templateInfo = template.data('template');

				var confirmMsg = ( delNode.data('templates') == 'trash' )? 'Press OK Move Template to Trash' : 'Press OK to Permenetly Delete Template';
				var deleteNode = window.confirm(confirmMsg);

				if ( deleteNode === true ) {

					$.post('/app/handlers/manager/delTemplate.php', {

						templateID: templateInfo.tempID,
						action: $(this).data('templates')
					}, function(response){

						if ( response === true ) {
							template.remove();
							
							if ( delNode.data('templates') == 'trash' ) {
								
								
								
								addTemp(templateInfo.tempTitle, templateInfo.tempID, templateInfo.tempVer, false);
							}
						} else {
							window.alert('error deleting template');
						}
					}, 'json');// post
				}
			});// on: click*/
		break;

		/***************************************
		 * EDITOR EVENTS
		 ***************************************/
		case 'editor':

		break;

	}
});