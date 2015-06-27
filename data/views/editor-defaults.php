<div class="modify">
	
	{{modelHeader title}}

	<div class="layout-widthContainer">
		<strong>Change Width</strong>
		
		<select class="templateWidth">
			{{templateSizes}}
		</select>
		
		<div class="response"></div>
		
		<div class="defaultColors">
			{{#each colors}}
				{{> colorItem textType=@key color=this}}
			{{/each}}
		</div>
	</div>
</div>
<template id="colorItem">
	<div class="colorType">
		<p>{{textType}}</p>
		<input type="text" data-color="{{color}}" data-color-target="{{textType}}" />
	</div>
</template>