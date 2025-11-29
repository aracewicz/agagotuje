<script lang="ts">
	const props: {readonly urlOfSubmission: string} = $props();
	function onSubmit(e: Event) {
		// The form will be posted, placeholder for extra logic if needed
	}
</script>

<form
	class="login-form"
	action={props.urlOfSubmission}
	method="POST"
	onsubmit={onSubmit}
>
	<label class="visually-hidden" for="email">Adres e-mail</label>
	<input
		id="email"
		name="email"
		type="email"
		placeholder="Adres e-mail"
		required
	/>
	<button type="submit">Kontynuuj</button>
	<style>
		.login-form {
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			align-items: center;
		}
		.login-form input {
			width: 100%;
			max-width: 640px;
			font-size: 1.15rem;
			padding: 0.65rem;
			border: 2px solid rgba(0, 0, 0, 0.18);
			border-radius: 2px;
		}
		.login-form button {
			background: #cfe6ce;
			border: 1px solid rgba(0, 0, 0, 0.12);
			padding: 0.75rem 1.25rem;
			font-size: 1.15rem;
			color: #0b3b1f;
			cursor: pointer;
			border-radius: 3px;
		}
		.visually-hidden {
			position: absolute !important;
			height: 1px;
			width: 1px;
			overflow: hidden;
			clip: rect(1px, 1px, 1px, 1px);
			white-space: nowrap;
		}
	</style>
</form>
