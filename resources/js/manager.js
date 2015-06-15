var Manager = function(){
	var Manager = this;
	Manager.handler = '/app/handlers/manager.php';
	Manager.list;
	Manager.init();
};

// Initiate template manager
Manager.prototype.init = function() {
	var Manager = this;

	$.getJSON(Manager.handler,{
		action: 'list'
	}, function(templateList){
		Manager.list = templateList;
		Manager.renderList();
		Manager.events();
	});
};

Manager.prototype.events = function() {
	var Manager = this;
	// INSTALL / UNINSTALL TABLE
	$('[data-manager ~= installer]').on('click', function(e){
		e.preventDefault();
		var target = $(this);
		$.post(Manager.handler, {
			//function type install : uninstall
			action: target.val().toLowerCase()
		}, function (response){
			
			if ( response.success === true ) {
				$('.listItem').remove();
				Manager.list = {};
			}

			target.parent('.manager-installer').find('.feedback').html(response.message);
		}, 'json')//post end
	});

	// CREATE NEW TEMPALTE
	$('[data-manager ~= create]').on('submit', function(e){
		e.preventDefault();
		var target = $(this);

		if ( target.find('.title').val() === '' ) {
			target.find('.feedback').html('Template Title is Blank');
			return false;
		}

		$.post(Manager.handler, {
			action: 'new',
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
				var errMsg = objectToText(response.message);
				// append response
				target.find('.feedback').html(errMsg);
			}
		}, 'json');
		// post end
	});

	//UPDATE EXISTING TEMPLATE NAME
	$(document).on('click', '[data-manager ~= update]', function(e){
		e.preventDefault();
		var target = $(this);

		// template node
		var template = $(this).parent('li');
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
		
		$.post(Manager.handler, {
			action: 'update',
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
	});

	// CLONE EXISTING TEMPLATE
	$(document).on('click', '[data-manager ~= clone]', function(e){
		e.preventDefault();
		
		var target = $(this);
		// prompt for cloned template name
		var newTemplate  = window.prompt('Insert Template Name.');
		// return if prompt is empty or canceled
		if ( newTemplate === '' || newTemplate === null ) {
			
			if ( newTemplate === null ) {
				window.alert('No Title Provided for New Template.');
			}
			return false;
		}

		$.post(Manager.handler, {
			action: 'clone',
			//template to be cloned ID
			cloneID: target.parent('li').data('template').ID,
			// new template name
			newTempName: newTemplate
		}, function(response){
			console.log(response)
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
				var errMsg = objectToText(response.message);
				alert(errMsg);
			}
		}, 'json');
		//post end
	});


	// MOVE TEMPALTE TO TRASH / DELETE TEMPLATE
	$(document).on('click', '[data-manager ~= trash], [data-manager ~= delete]', function(e){
		e.preventDefault();

		var target = $(this);
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
		
		$.post(Manager.handler, {
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
					Manager.renderTemplate(templateID);
				} else {
					delete Manager.list[templateID];
				}
			} else {
				window.alert('error deleting template');
			}
		}, 'json');// post
	});
};

Manager.prototype.renderTemplate = function(id) {
	var Manager = this;
	templateInfo = Manager.list[id];
	
	// template container
	var listItem = $('<li/>').addClass('listItem').data('template', { 'ID': id });
	
	// link to editor with GET to template
	var templateNode = $('<a/>').html(templateInfo.title).addClass('template-title').attr('href', '/editor/?id=' + id + '&template=' + encodeURI(templateInfo.title)).appendTo(listItem);
	
	// update tempalte node
	var updateNode = $('<p/>').html('Rename').addClass('template-control').appendTo(listItem).attr('data-manager', 'update');

	// clone node
	var cloneNode = $('<p/>').html('Copy').addClass('template-control').appendTo(listItem).attr('data-manager', 'clone');
	
	// delete Node with TemplateID
	var trashNode = $('<p/>').appendTo(listItem);
	
	if ( templateInfo.active === true ) {
		trashNode.html('Move to <br/> Trash').addClass('template-control').attr('data-manager', 'trash');
	} else {
		trashNode.html('Delete <br/> Permenetly').addClass('template-control').attr('data-manager', 'delete');
	}
	
	// preview latest version of template
	var previewNode = $('<a/>').html('preview').addClass('template-control').attr({
		'href': window.location.origin + '/template?template=' + templateInfo.title + '&id=' + id + '&version=' + templateInfo.version,
		'target': '_blank',
	}).appendTo(listItem);

	// append to document
	if ( templateInfo.active === true ) {
		$('[data-manager ~= active-list]').find('ul').append(listItem);
	} else {
		$('[data-manager ~= trash-list]').find('ul').append(listItem);
	}
};

Manager.prototype.renderList = function() {
	var Manager = this;
	// loop through existing templates
	_.each(Manager.list, function (listValue, ListIndex){
		Manager.renderTemplate(listValue.ID);
	});//each templateList
};