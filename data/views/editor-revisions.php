<div class="revisions panel">
	{{modelHeader title}}
	
	<div class="panel-body">
		<ul class="revisions-list">
			{{#each revisions}}
				{{> revision}}
			{{/each}}
		</ul>
	</div>
</div>
<template id="revision">
	<li class="revisons-listItem" data-revison-file="{{fileName}}">
		<p>{{title}}</p>
	</li>
</template>