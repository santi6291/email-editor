<div class="save">
	{{modelHeader title}}

	<div class="options">
		<button data-save="save">
			Save
		</button>
		<button data-save="validate">
			Validate
		</button>
	</div>
	<div class="feedback">
		{{#if errors}}
			{{#each errors}}
				{{> validatorMessage messageid=messageid type=type message=message explanation=explanation}}
			{{/each}}
		{{/if}}
	</div>
	<div class="responseCode">
		<textarea></textarea>
	</div>
</div>

<template id="validatorMessage">
	<div class="error">
		<div class="errorID">
			<strong>Message ID:</strong> {{{messageid}}}
		</div>

		<div class="errorType">
			<strong>Error Type:</strong> {{{type}}}
		</div>

		<div class="errorMsg">
			<strong>Message :</strong> {{{message}}}
		</div>

		<div class="errorExplan">
			<strong>Explanation :</strong> {{{explanation}}}
		</div>
	</div>
</template>