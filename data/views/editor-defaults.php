<div class="defaults panel">
	
	{{modelHeader title}}
	<div class="panel-body">
		
		<div class="layout-action">
			<div class="btn-group">
				<button class="btn btn-default" data-defaults="save">
					Save
				</button>
				<button class="btn btn-default" data-defaults="apply">
					Apply and Save
				</button>
			</div>
			<div class="response"></div>
		</div><!-- /layout-action -->

		<div class="layout-defaultSettings list-group">
			<div class="layout-widthContainer list-group-item">
				<h4>Change Width</h4>
				
				<div>
					<select class="templateWidth form-control">
						{{templateSizes}}
					</select>
				</div>
			</div><!-- /layout-widthContainer -->
			{{#each settings}}
				{{> settingItem this}}
			{{/each}}
		</div><!-- /layout-defaultSettings -->
	</div><!-- /panel-body -->
</div>
<template id="settingItem">
	<div class="tagType list-group-item" data-setting-target="{{@key}}">
		
		<h4>{{@key}}</h4>
		
		{{#if font-size}}
		<div class="styleType" data-style="font-size">
			<p>
				Font Size <small>in pixels</small>
			</p>
			<input class="form-control" type="number" value="{{font-size}}"/>
		</div>
		{{/if}}
		
		{{#if line-height}}
		<div class="styleType" data-style="line-height">
			<p>
				Line Height <small>in percentage</small>
			</p>
			<input class="form-control" type="number" step="5"  value="{{line-height}}"/>
		</div>
		{{/if}}

		{{#if color}}
			<div class="styleType" data-style="color">
				<p>
					Font Color
				</p>
				<input class="form-control" type="text" data-color="{{color}}" />
			</div>
		{{/if}}
		
		{{#if background-color}}
		<div class="styleType" data-style="background-color">
			<p>
				Background Color
			</p>
			<input class="form-control" type="text" data-color="{{background-color}}" />
		</div>
		{{/if}}
	</div><!--/ tagType -->
</template>