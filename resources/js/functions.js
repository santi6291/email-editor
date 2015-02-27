// SET PAGE ID 
(function setPageID (){
	var pagePath = location.pathname;
	var pageIDarray;

	if ( pagePath == '/' ) {
		
		window.pageID = 'index';
	} else {
		
		// remove forward slash at start and end
		pagePath = pagePath.substr(1, pagePath.length-2);
		// split path to array
		pageIDarray = pagePath.split('/');
		// get current page
		window.pageID = pageIDarray.pop();
		// remove file extension
		window.pageID = window.pageID.replace(/\.[^.]*$/, '');
		// join path without pageID
		window.pageParent = pageIDarray.join('/');
	}
})();

// RENDER TEMPLARE VERSIONS
function renderVer ( filename, title, append ) {
	var fileLoc = ( filename.indexOf('.php') == -1 )? filename + '.php': filename;
	var aNode = $('<a/>').attr('href', 'blast/revisions/' + fileLoc).append(title);
	
	if ( append === true ) {
		$('.version').append(aNode);
	} else {
		$('.version').prepend(aNode);
	}
}

// CONVERT OBJECT TO TEXT
function objectToText (theObject) {
	return "<pre>" + JSON.stringify(theObject, null, 4) + "</pre>";
}

// ADD LEFT PADDING TO STRING
String.prototype.lpad = function(padString, length) {
	var str = this;
	while (str.length < length)
		str = padString + str;
	return str;
};

// 
function prepTemplate (content){

	var template = $(content);
	template.find('.editMe').attr('contenteditable', 'true');
	return template;
	// $('.blast').find('.template').html(template);
}

function getUrlVars() {
	var vars = [];
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

	for( var i = 0; i < hashes.length; i++ ){
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}