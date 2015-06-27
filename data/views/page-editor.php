<div class="backBtn">
	<a href="/">Back</a>
	<h2><?=$_GET['template']?></h2>
</div>

<div class="editor">
	
	<div class="editor-wrapper">
		
		<div class="editor-tools">
			<div class="editor-modeView displayNone"></div>
			<div class="editor-toolsBtn">
				<button data-editor-mode="revisions">Revisions History</button>
				<button data-editor-mode="modify">Modify Template</button>
				<button data-editor-mode="defaults">Set Defaults Options</button>
				<button data-editor-mode="save">Save/Validate Template</button>
			</div>
		</div>
		
		<div class="editor-content">
			<div class="editor-toolbar">
				
				<div class="editor-toolbarBtn">
					<button class="Link" data-editor-insert"a" />
					<button class="image" data-editor-insert="img"/>
				</div>
				
				<div class="editor-toolbarBtn">
					<select name="fontType" class="textFormat">
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
		</div>
	</div>
</div>