<header>
	<div class="container">
		<div class="navbar-left">
			<ul class="nav navbar-nav">
				<li>
					<a href="/">Back</a>
				</li>
			</ul>
		</div><!-- /navbar-left -->

		<div class="navbar-header">
			<h2 class="navbar-brand"><?php echo $_GET['template']?></h2>
		</div><!-- /navbar-header -->

		<div class="navbar-right">
			<ul class="nav navbar-nav">
				<li>
					<a href="/">Preview</a>
				</li>
			</ul>
		</div><!-- /navbar-right -->
	</div> <!-- /container -->
</header>

<div class="editor">
	
	<div class="editor-wrapper">
		
		<div class="editor-tools">
			<div class="editor-modeView hidden"></div>
			
			<div class="editor-toolsBtn list-group">
				<button class="list-group-item" data-editor-mode="revisions">Revisions History</button>
				<button class="list-group-item" data-editor-mode="modify">Modify Template</button>
				<button class="list-group-item" data-editor-mode="defaults">Set Defaults Options</button>
				<button class="list-group-item" data-editor-mode="pallet">Set Color Pallet</button>
				<button class="list-group-item" data-editor-mode="save">Save/Validate Template</button>
			</div>
		</div><!-- /editor-tools -->
		
		<div class="editor-content">
			<div class="editor-toolbar">
				
				<div class="editor-toolbarBtn">
					<button class="Link" data-editor-insert"a" />
					<button class="image" data-editor-insert="img"/>
				</div>
				
				<div class="editor-toolbarBtn">
					<select class="textFormat" data-editor-format='p' />
						<option value="p">Normal</option>
						<option value="h1">Heading 1</option>
						<option value="h2">Heading 2</option>
						<option value="h3">Heading 3</option>
						<option value="h4">Heading 4</option>
						<option value="h5">Heading 5</option>
					</select>
					<button class="Bold" data-editor-format="strong" />
					<button class="Italic" data-editor-format="em" />
					<button class="Strikethrough" data-editor-format="del" />
					<button class="Underline" data-editor-format="u" />
					<button class="Subscript" data-editor-format="sub" />
					<button class="Superscript" data-editor-format="sup" />
				</div>
				<br>
			</div>

			<div class="editor-template"></div>
		</div><!-- /editor-content -->
	</div><!-- /editor-wrapper -->
</div><!-- /editor -->