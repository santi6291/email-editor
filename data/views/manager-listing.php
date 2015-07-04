<ul data-manager-list-type="{{listType}}" class="listContainer">
	{{#each templates}}
		{{> templateItem this}}
	{{/each}}
</ul>
<template id="templateItem">
	<li data-template-id="{{ID}}">
		<div class="itemContainer">
			<div class="template-title">
				<h4>
					<a href="/editor/?template={{title}}&id={{ID}}" class="template-title-link">
						{{title}}
					</a>
				</h4>
			</div>
			
			<nav class="template-controls">

				<button data-manager="update">Rename</button>
				<button data-manager="clone">Copy</button>
				{{#if active}}
				<button data-manager="trash">Move to Trash</button>
				{{else}}
				<button data-manager="delete">delete</button>
				{{/if}}
				<button data-manager="preview">preview</button>
			</nav>
		</div>
	</li>
</template>