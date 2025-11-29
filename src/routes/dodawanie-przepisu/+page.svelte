<script lang="ts">
	import AddRecipeForm from "../../lib/client/core/recipes/AddRecipeForm.svelte";
	import type {ActionData} from "./$types.js";
	const props: {readonly form: ActionData | null} = $props();
	function goBack() {
		history.back();
	}
</script>

<main class="add-recipe">
	<div class="add-recipe-inner">
		<button class="add-back" onclick={goBack} aria-label="Powrót"
			>← powrót</button
		>
		<h1 class="add-title">Dodaj przepis</h1>
		{#if props.form?.errors?.global}
			<p
				class="form-banner form-banner--error"
				role="alert"
				aria-live="assertive"
			>
				{props.form.errors.global}
			</p>
		{/if}
		{#if props.form?.success}
			<p
				class="form-banner form-banner--success"
				role="status"
				aria-live="polite"
			>
				{props.form.message}
			</p>
		{/if}
		<AddRecipeForm form={props.form} />
	</div>
</main>

<style>
	:global(body) {
		background: #e5e5e5;
	}
	.add-recipe {
		min-height: calc(100vh - var(--header-height, 64px));
		padding: 2rem 1rem 4rem;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
	.add-recipe-inner {
		width: 100%;
		max-width: 1040px;
		text-align: center;
		padding: 2rem 1.25rem 6rem;
		margin-top: var(--add-recipe-offset, -34vh);
	}
	/* Back button styling to match the registration/login style */
	.add-back {
		background: transparent;
		border: none;
		color: #111;
		font-size: 1.75rem;
		display: inline-block;
		margin-bottom: 2rem;
		cursor: pointer;
		padding: 0.75rem 1rem;
		border-radius: 6px;
		position: absolute;
		top: calc(var(--header-height, 64px) + 0.75rem);
		left: 1rem;
		z-index: 120;
	}
	/* Reduce hero size for this route so the form appears higher */
	:global(.hero) {
		min-height: 34vh; /* smaller than default 70vh to bring content higher */
	}
	.add-title {
		font-family: var(--font-heading, "Playfair Display", serif);
		font-size: clamp(3rem, 7vw, 6rem);
		margin: 0 0 1.5rem;
		color: #111;
	}
	/* removed unused .recipe-form selector */
	.form-banner {
		margin-bottom: 1rem;
		padding: 0.9rem 1.1rem;
		border-radius: 0.75rem;
		font-weight: 600;
	}
	.form-banner--error {
		background: #fee2e2;
		border: 1px solid rgba(185, 28, 28, 0.3);
		color: #7f1d1d;
	}
	.form-banner--success {
		background: #dcfce7;
		border: 1px solid rgba(22, 163, 74, 0.25);
		color: #065f46;
	}
	/* Inputs and textarea: large, noticeable borders */
	/* Only keep styles relevant to this page layout, not the form itself */
	.add-title {
		font-family: var(--font-heading, "Playfair Display", serif);
		font-size: clamp(3rem, 7vw, 6rem);
		margin: 0 0 1.5rem;
		color: #111;
	}
	@media (max-width: 860px) {
		.add-title {
			font-size: clamp(2.45rem, 8vw, 4rem);
		}
	}
	@media (max-width: 480px) {
		.add-title {
			font-size: 2.25rem;
		}
		.add-recipe-inner {
			margin-top: var(--add-recipe-offset-mobile, -18vh);
		}
	}
</style>
