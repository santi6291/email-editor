function SaveCode () {
	var obj = this;
	
	obj.options = {
		styleguideLoc: undefined,
		save: false,
		output: 'json' //[soap12, json, earl, n3]
	};

	// Exemptions: http://validator.w3.org/docs/errors.html
	obj.exemptions = 
	[
		'70', //self-close tag not close (br, img, etc).
	];
	obj.fragment = undefined;// code to validate
	obj.styleguide = undefined; //styles for code
	obj.errMsgView = undefined; // error message view
	obj.errors = false; //error tracker
	
	obj.fullFragment = function (wStyles){
		
		
		var openHead = 	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n'+
						'<html xmlns="http://www.w3.org/1999/xhtml">\n'+
						'<head>\n'+
						'<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />\n'+
						'<meta content="*|MC:SUBJECT|*" /><title>*|MC:SUBJECT|*</title>\n';
		var closeHead = '</head>\n'+
						'<body>';
		var endDoc = 	'</body>\n'+
						'</html>';
		// append styleguide if requested
		var fullFragment = (wStyles)? openHead + obj.styleguide + closeHead + obj.fragment + endDoc : openHead + closeHead + obj.fragment + endDoc;
		return fullFragment;
	};

	obj.init = function(content, options, callback){
		// overwrite defaults if needed
		if (options != undefined) {
			obj.options.styleguideLoc = options.styleguideLoc || obj.options.styleguideLoc;
			obj.options.save          = options.save || obj.options.save;
			obj.options.output        = options.output || obj.options.output;
		};

		// remove elements that should not be validated
		var cleanContent = $(content);
		cleanContent.find('[contenteditable~=true]').removeAttr('contenteditable');
		
		obj.fragment = cleanContent[0].outerHTML;
		
		// get error message view
		$.when($.get('app/views/validMsg-view.html')).then(function(view){
			obj.errMsgView = $(view);
		});

		// get blast styles
		if ( obj.styleguide == undefined && obj.options.styleguideLoc != undefined ) {

			$.when($.get(obj.options.styleguideLoc)).then(function(styleguide){
				obj.styleguide = styleguide
			});
		};

		obj.validate();
		if (typeof options === "function") {
			callback = options;
		};
		if (typeof callback === "function") {
			callback(obj);
		}
		
	};
	
	obj.showCode = function(){

		$('.validCode').find('textarea').val(this.fullFragment(true));
	};
	
	obj.validate = function(){
		var postData = {
			fragment: obj.fullFragment(false),//prepare code without styles
			output: obj.options.output
		};

		$.when($.post('app/handlers/validator.php', postData)).then(function(response){
		
			var resJson = $.parseJSON(response);
			// clean messages Container 
			$('.feedback').find('.msg').html('');

			$.each(resJson.messages, function(index, messageObj){
				// error ID is not in exemptions arrray 
				if ( $.inArray(messageObj.messageid, obj.exemptions) == -1 ){
					
					// ID is defined
					if ( messageObj.messageid != undefined ) {
						var messagesNode = $(obj.errMsgView).clone();

						messagesNode.find('.errorID').append(messageObj.messageid);
						messagesNode.find('.errorType').append(messageObj.type);
						messagesNode.find('.errorMsg').append(messageObj.message);
						messagesNode.find('.errorExplan').append(messageObj.explanation);
						messagesNode.find('.helpwanted').html('<a href="http://validator.w3.org/docs/errors.html#ve-' + messageObj.messageid + '" target="_blank">More Details</a>');

						$('.feedback').find('.msg').append(messagesNode);
						obj.errors = true
					};//if messageid is define
				};//end if in exemptions array
			});//end each loop

			// apped valid code text
			if ( obj.errors == false ) {
				$('.feedback').find('.msg').html($('<p/>').append('Document is Valid'));

				// styles are define and save option true 
				if ( obj.options.styleguideLoc != undefined && obj.options.save ) {
					obj.showCode();
					obj.save();
				}
			}
		});
	};

	obj.save = function() {
		
		$.post('app/handlers/save.php', { content: obj.fragment }, function(response){
			
			var responseJson = $.parseJSON(response);
			
			if ( responseJson.success == true ) {

				renderVer(responseJson.fileName.toString(), responseJson.title, false);

				$('.feedback').find('.msg').append($('<p/>').html('Saved <br/>' + responseJson.title));
			} else {
				$('.feedback').find('.msg').append($('<p/>').html('Error Saving'));	
			};
		});
	}
}