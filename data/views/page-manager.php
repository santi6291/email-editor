<header>
	<h2>
		Templates
	</h2>
</header>
<div class="manager">
	<!-- <div class="manager-installer">
		<h3>Install / Uninstall table</h3>

		<input type="button" value="Install" data-manager="installer"/>
		<input type="button" value="Uninstall" data-manager="installer"/>
		
		<div class="feedback"></div>
	</div> -->

	<nav class="templatesNavigations">
		<ul>
			<li>
				<button data-manager="list-active">Active</button>
			</li>
			<li>
				<button data-manager="list-trash">Trash</button>
			</li>
			<li>
				<button data-manage="create">New Template</button>
			</li>
		</ul>
	</nav>
	

	<div class="manager-active" data-manager="active-list">
		<ul></ul>
	</div>

	<div class="manager-trash" data-manager="trash-list">
		<ul></ul>
	</div>
</div>