// args.view, args.data
$.fn.handlebars = function(args){
	$(this).each(function () {
		// assing itself for compiling
		var properView = $(this).html();
		// stays undefiend of args.data not defined
		var viewData;
		// compiled data
		var compiled;

		// assign args if defined
		if (typeof args !== 'undefined') {
			// if args.view passed make it data for compiling
			properView = ( typeof args.view === 'undefined' )? properView : args.view;
			// set data to parse
			viewData = args.data;
		};
		// register view partials
		registerPartial(properView);
		// compiled view
		compiled = Handlebars.compile(properView);

		// bind data if set
		if( (typeof viewData !== 'undefined') ){
			compiled = compiled(viewData)
		}
		// append to target
		$(this).html(compiled);	
	});
	return $(this);
}