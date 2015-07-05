<header>
	<div class="container">
		<div class="navbar-header">
			<h2 class="navbar-brand">Templates</h2>
		</div>

		<div class="navbar-right">
			<button data-manager="create">New Template</button>
		</div>
	</div>
</header>
<div class="manager">
	<div class="manager-installer">
		<h3>Install / Uninstall table</h3>

		<input type="button" value="Install" data-manager="installer"/>
		<input type="button" value="Uninstall" data-manager="installer"/>
		
		<div class="feedback"></div>
	</div>

	<nav class="templatesNavigations">
		<ul>
			<li data-manager="list-active" class="active">
				<a href="#">Active</a>
			</li>
			<li data-manager="list-trash">
				<a href="#">Trash</a>
			</li>
		</ul>
	</nav>
	
	<div class="manager-templates"></div>
</div>