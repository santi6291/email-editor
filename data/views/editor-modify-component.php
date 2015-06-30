<div class="modify">
	
	{{modelHeader title}}

	<div class="layout-editComponent">
		
		<div class="styleType" data-style="valign">
			<p>
				Verticle Align
			</p>
			
			<select>
				{{valign styles.border.valign}}	
			</select>
		</div>

		<div class="styleType" data-style="width">
			<p>
				Width <small>in pixels</small>
			</p>

			<input type="text" value="{{styles.width}}" />
		</div>

		<div class="styleType" data-style="bgColor">
			<p>
				Background Color
			</p>

			<input type="text" data-color="{{styles.bgColor}}" />
		</div>
	</div>
</div>