<div class="modify">
	
	{{modelHeader title}}

	<div class="layout-content">
		
		{{#if layoutMode}}

			<div class="modify-componentsList">
				{{#each layoutsComponents}}
					{{> component thumb=thumb id=id title=title}}
				{{/each}}
			</div>

		{{else}}
			
			<div class="modify-componentsList">

				<div class="modify-tabsComponents">
					<ul class="tabs">
						<li class="tab" data-component-type="body">
							Body
						</li>
						<li class="tab" data-component-type="header">
							Header
						</li>
					</ul>
				</div>

				<div class="modify-componentsList displayNone" data-component-type="body">
					{{#each bodyComponents}}
						{{> component thumb=thumb id=id title=title}}
					{{/each}}
				</div>

				<div class="modify-componentsList displayNone" data-component-type="header">
					{{#each headerComponents}}
						{{> component thumb=thumb id=id title=title}}
					{{/each}}
				</div>
			</div>

		{{/if}}

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