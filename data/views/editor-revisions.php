<div class="revisions">
	{{modelHeader title}}
	
	<ul class="revisions-list">
		{{#each revisions}}
			{{> revision id=id fileName=fileName title=title}}
		{{/each}}
	</ul>
</div>

<template id="revision">
	<li class="revisons-listItem" data-revison-file="{{fileName}}">
		{{title}}
	</li>
</template>