<div class="modify">
	
	{{modelHeader title}}

	<div class="layout-content">
		<h3>{{listType}}</h3>
		
		<div class="modify-componentsList">
			{{#each componentList}}
				{{> component thumb=thumb id=id title=title}}
			{{/each}}
		</div>
	</div>
</div>

<template id="component">
	<div class="component">
		<div class="component-thumb">
			<img src="{{thumb}}" data-component="{{id}}"/>
		</div>
		<div class="component-title">
			{{title}}
		</div>
	</div>
</template>