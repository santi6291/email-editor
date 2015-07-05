<div class="save panel">
	{{modelHeader title}}

	<div class="panel-body">
		<div class="options">
			<button data-save="save">Save</button>
			<button data-save="validate">Validate
			</button>
		</div>
		
		
		<div class="feedback hidden {{#unless errors}}well{{/unless}}">
			{{#each errors}}
				{{> validatorMessage this}}
			{{/each}}
		</div>

		<div class="responseCode hidden">
			<textarea></textarea>
		</div>	
	</div>
</div>
<template id="validatorMessage">
	<div class="error list-group">
		<div class="errorID list-group-item">
			<strong>Message ID:</strong> {{{messageid}}}
		</div>

		<div class="errorType list-group-item">
			<strong>Error Type:</strong> {{{type}}}
		</div>

		<div class="errorMsg list-group-item">
			<strong>Message :</strong> {{{message}}}
		</div>

		<div class="errorExplan list-group-item">
			<strong>Explanation :</strong> {{{explanation}}}
		</div>
	</div>
</template>