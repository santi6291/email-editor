var textFormat = {
	formatType: undefined,
	sel: undefined,
	range: undefined,

	getSelected:function(formatType){
		this.formatType = formatType;//node type
		
		if ( window.getSelection) {
			this.sel = window.getSelection();// get selection

			if (this.sel.rangeCount) {
				this.range = this.sel.getRangeAt(0);
				
				if ( $(this.sel.focusNode).parents(this.formatType).size() > 0 ) {//remove format node
					
					this.removeFormat();
				} else {//add format node
					
					this.addFormat();
				}
			}
		}
	},

	addFormat: function(){

		var replacementText = $('<' + this.formatType + '/>').append(this.range.toString())[0];//create format node with selection text 

		this.range.deleteContents();//remove text from DOM
		this.range.insertNode(replacementText);//append format node to removed text position
		
		if ( this.formatType == 'a' ) {
			aNode = $(replacementText);
			aNode.attr({
				href: '',
				target: '_blank',
				'class': 'green'
			})
			// call tooltip
		}
	},

	removeFormat: function(){

		var replacementText = this.range.toString();
			
		var removeNode = $(this.sel.focusNode).parents(this.formatType); // node to remove
		var parentNode = removeNode.parent();// removeNode Parent node
		/**
		 * get parentNode string with tag
		 * Find format text tag in parentNode
		 * replace with format text content
		 */
		var newContent = parentNode[0].outerHTML.replace(removeNode[0].outerHTML, removeNode[0].innerHTML);
		parentNode.html(newContent);
	}
};