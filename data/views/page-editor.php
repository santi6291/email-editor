<div class="backBtn">
	<a href="/">Back</a>
</div>
<div class="editor">
	
	<div class="editor-wrapper">
		
		<div class="editor-components" data-editor="components">
			<div class="components-title">
				<h3>
					Components
				</h3>
			</div>
			<nav data-editor="components-list">
				<div class="componentSection templateHears">
					<h4 data-hook="componentToggle">
						Headers
					</h4>
					<div class="header-components" data-hook="component-list"></div>
				</div>
				
				<div class="componentSection templateBody">
					<h4 data-hook="componentToggle">
						Body
					</h4>
					<div class="body-components" data-hook="component-list"></div>
				</div>

				<div class="componentSection templateSidebar">
					<h4 data-hook="componentToggle">
						Sidebar
					</h4>
					<div class="siderbar-components" data-hook="component-list"></div>
				</div>
			</nav>
		</div>

		<div class="editor-content">
			<div class="toolbar">
				<div class="templateWidth">
					<span class="widthTitle">
						Template Width	
					</span>
					<input type="number" class="widthInput" max="800" min="600" value="600"/>
					<button>color Picker</button>
				</div>
				<div class="insertBtn">
					<button class="Link" data-inser"a" />
					<button class="image" data-insert="img"/>
				</div>
				<div class="textFormatters">
					<button class="Bold" data-hook="formatText" data-format="strong" />
					<button class="Italic" data-hook="formatText" data-format="em" />
					<button class="Strikethrough" data-hook="formatText" data-format="del" />
					<button class="Underline" data-hook="formatText" data-format="u" />
					<button class="Subscript" data-hook="formatText" data-format="sub" />
					<button class="Superscript" data-hook="formatText" data-format="sup" />
				</div>
			</div>

			<div class="edit"></div>
		</div>

		<div class="editor-versions">
			<h3>
				Versions
			</h3>
			<nav data-editor="version-list"></nav>
		</div>
	</div>
</div>

<!-- <div class="wrapper-feedback">
	<h2>
		Feedback
	</h2>

	<button data-hook="validate">Validate</button>
	<button data-hook="save">Save</button>
	
	<div class="msg"></div>
	
	<div class="validCode">
		<textarea></textarea>
	</div>
</div> -->