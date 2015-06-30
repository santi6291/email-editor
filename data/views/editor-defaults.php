<div class="modify">
	
	{{modelHeader title}}

	<div class="layout-widthContainer">
		<strong>Change Width</strong>
		
		<select class="templateWidth">
			{{templateSizes}}
		</select>
	</div>
	
	<div class="response"></div>

	<div class="layout-defaultSettings">
		{{#each settings}}
			{{> settingItem textType=@key settings=this}}
		{{/each}}
	</div>

	<div class="layout-action">
		<button data-defaults="save">
			Save
		</button>
		<button data-defaults="apply">
			Apply and Save
		</button>
	</div>
</div>
<template id="settingItem">
	<div class="tagType" data-setting-target="{{textType}}">
		
		<h4>{{textType}}</h4>
		
		{{#if font-size}}
		<div class="styleType" data-style="font-size">
			<p>
				Font Size <small>in pixels</small>
			</p>
			<input type="number" value="{{font-size}}"/>
		</div>
		{{/if}}
		
		{{#if line-height}}
		<div class="styleType" data-style="line-height">
			<p>
				Line Height <small>in percentage</small>
			</p>
			<input type="number" step="5"  value="{{line-height}}"/>
		</div>
		{{/if}}

		{{#if color}}
			<div class="styleType" data-style="color">
				<p>
					Font Color
				</p>
				<input type="text" data-color="{{color}}" />
			</div>
		{{/if}}
		
		{{#if background-color}}
		<div class="styleType" data-style="background-color">
			<p>
				Background Color
			</p>
			<input type="text" data-color="{{background-color}}" />
		</div>
		{{/if}}
	</div>
</template>