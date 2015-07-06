<div class="modifyComponent panel">
	
	{{modelHeader title}}

	<div class="layout-editComponent panel-body">
		
		<div class="styleType" data-style="valign">
			<h4>
				Verticle Align
			</h4>
			
			<select>
				{{valign styles.border.valign}}	
			</select>
		</div>

		<div class="styleType" data-style="width">
			<h4>
				Width <small>in pixels</small>
			</h4>

			<input type="number" value="{{styles.width}}" />
		</div>

		<div class="styleType" data-style="bgColor">
			<h4>
				Background Color
			</h4>

			<input type="text" data-color="{{styles.bgColor}}" />
		</div>
	</div>
</div>