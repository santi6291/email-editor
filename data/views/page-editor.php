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
				<h4 data-hook="componentToggle">
					Headers
				</h4>
				<div class="header-components" data-hook="component-list"></div>
				
				<h4 data-hook="componentToggle">
					Body
				</h4>
				<div class="body-components" data-hook="component-list"></div>

				<h4 data-hook="componentToggle">
					Sidebar
				</h4>
				<div class="siderbar-components" data-hook="component-list"></div>
			</nav>
		</div>

		<div class="editor-content">
			<div class="toolbar">
				<button class="Bold" data-hook="formatText" data-format="strong"></button>
				<button class="Italic" data-hook="formatText" data-format="em">Italic</button>
				<button class="Strikethrough" data-hook="formatText" data-format="del">Strikethrough</button>
				<button class="Underline" data-hook="formatText" data-format="u">Underline</button>
				<button class="Subscript" data-hook="formatText" data-format="sub">Subscript</button>
				<button class="Superscript" data-hook="formatText" data-format="sup">Superscript</button>
				<button class="small" data-hook="formatText" data-format="small">small</button>
				<button class="Link" data-hook="formatText" data-format="a">Link</button>

				<!-- <div class="group">
					<button data-hook="formatText" data-format="strong">Bold</button>
					<button data-hook="formatText" data-format="em">Italic</button>
					<button data-hook="formatText" data-format="del">Strikethrough</button>
					<button data-hook="formatText" data-format="u">Underline</button>
					<button data-hook="formatText" data-format="sub">Subscript</button>
					<button data-hook="formatText" data-format="sup">Superscript</button>
					<button data-hook="formatText" data-format="small">small</button>
					<button data-hook="formatText" data-format="a">Link</button>
				</div> -->
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