<div class="modify panel">
	
	{{modelHeader title}}

	<div class="panel-body">
		<div class="layout-content">
			<h3>{{listType}}</h3>

			<div class="modify-componentsList">
				{{#each componentList}}
					{{> component this}}
				{{/each}}
			</div>
		</div><!-- /layout-content -->
	</div><!-- /panel-body -->
	<!-- /modify -->
</div>

<template id="component">
	<div class="component panel">
		
		<div class="component-title panel-heading">
			<h4>{{title}}</h4>
		</div>

		<div class="component-thumb panel-body">
			<div class="thumb-container">
				<img src="{{thumb}}" data-component="{{id}}"/>
			</div>
		</div>
	</div><!-- /component -->
</template>