$.extend({
	handlebars: function(view, data) {
		registerPartial(view);
		var compiled = view;
		compiled = Handlebars.compile(compiled);
		compiled = compiled(data);
		compiled = $(compiled).not('template')
		
		return compiled;
	}
});

$.fn.handlebars = function(data){
	registerPartial(this)
	
	this.each(function(index, element){
		var compiled = Handlebars.compile($(element).html());
		$(element).html(compiled(data))
	})
	
}