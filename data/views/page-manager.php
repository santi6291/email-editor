<div class="manager">
	
	<h2>
		Templates
	</h2>
	
	<div class="manager-installer">
		<h3>Install / Uninstall table</h3>

		<input type="button" value="Install" data-hook="installer"/>
		<input type="button" value="Uninstall" data-hook="installer"/>
		
		<div class="feedback"></div>
	</div>

	<form class="manager-new" data-manager="create">
		<fieldset>
			<h3>
				New Template
			</h3>
			<input type="text" name="title" class="title" required/>
			<br>
			<input type="submit" value="New">
			<br>
			<div class="feedback"></div>
		</fieldset>
	</form>	

	<div class="manager-active" data-manager="active-list">
		<h3>
			Active
		</h3>
		<ul></ul>
	</div>

	<div class="manager-trash" data-manager="trash-list">
		<h3>
			Trash
		</h3>
		<ul></ul>
	</div>
</div>