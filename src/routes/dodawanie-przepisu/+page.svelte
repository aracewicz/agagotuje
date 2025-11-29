<script lang="ts">
	import {enhance} from "$app/forms";
	const props: {readonly form: ActionData | null} = $props();
	const form = props.form;
	function goBack() {
		history.back();
	}
</script>

<main class="add-recipe">
	<div class="add-recipe-inner">
		<button class="add-back" onclick={() => goBack()} aria-label="Powrót"
			>← powrót</button
		>
		<h1 class="add-title">Dodaj przepis</h1>
		{#if form?.errors?.global}
			<p
				class="form-banner form-banner--error"
				role="alert"
				aria-live="assertive"
			>
				{form.errors.global}
			</p>
		{/if}
		{#if form?.success}
			<p
				class="form-banner form-banner--success"
				role="status"
				aria-live="polite"
			>
				{form.message}
			</p>
		{/if}
		<form class="recipe-form" method="POST" use:enhance>
			<input
				type="text"
				name="title"
				placeholder="Nazwa przepisu"
				aria-label="Nazwa przepisu"
				required
				value={form?.values?.title ?? ""}
			/>
			{#if form?.errors?.title}
				<p class="field-error">{form.errors.title}</p>
			{/if}
			<input
				type="number"
				name="time"
				placeholder="Czas przygotowania"
				aria-label="Czas przygotowania"
				min="1"
				inputmode="numeric"
				required
				value={form?.values?.time ?? ""}
			/>
			{#if form?.errors?.time}
				<p class="field-error">{form.errors.time}</p>
			{/if}
			<input
				type="text"
				name="ingredients"
				placeholder="Składniki"
				aria-label="Składniki"
				required
				value={form?.values?.ingredients ?? ""}
			/>
			{#if form?.errors?.ingredients}
				<p class="field-error">{form.errors.ingredients}</p>
			{/if}
			<textarea
				name="instructions"
				placeholder="Przepis"
				aria-label="Przepis"
				required>{form?.values?.instructions ?? ""}</textarea
			>
			{#if form?.errors?.instructions}
				<p class="field-error">{form.errors.instructions}</p>
			{/if}
			<!-- <input type="file" name="photo" aria-label="Załącz zdjęcie" /> -->
			<div class="actions">
				<button class="btn-cta" type="submit">Kontynuuj</button>
			</div>
		</form>
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
	.recipe-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-top: 1.25rem;
		align-items: stretch;
	}
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
	.recipe-form input[type="text"],
	.recipe-form input[type="number"],
	.recipe-form input[type="file"],
	.recipe-form textarea {
		font-family: var(--font-body, "Poppins", sans-serif);
		font-size: 1.25rem;
		padding: 0.75rem 1rem;
		border: 3px solid #bdbdbd;
		background: #fff;
		color: #222;
		border-radius: 2px;
		width: 70%;
		margin-left: auto;
		margin-right: auto;
		box-sizing: border-box;
	}
	.recipe-form input::placeholder,
	.recipe-form textarea::placeholder {
		color: #9a9a9a;
	}
	.recipe-form textarea {
		min-height: 180px;
		resize: vertical;
	}
	.field-error {
		margin: -1rem auto 0;
		width: 70%;
		text-align: left;
		color: #b91c1c;
		font-size: 0.95rem;
	}
	.actions {
		display: flex;
		justify-content: center;
	}
	.btn-cta {
		background: #d9f0d6;
		border: 2px solid #97d58f;
		color: #111;
		font-size: 1.25rem;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
	}
	.btn-cta:hover,
	.btn-cta:focus {
		background: #c0e6be;
	}
	/* responsive tweaks */
	@media (max-width: 860px) {
		.recipe-form input[type="text"],
		.recipe-form input[type="number"],
		.recipe-form textarea {
			width: 90%;
		}
		.field-error {
			width: 90%;
		}
		.add-title {
			font-size: clamp(2.45rem, 8vw, 4rem);
		}
	}
	@media (max-width: 480px) {
		.add-title {
			font-size: 2.25rem;
		}
		.recipe-form input[type="text"],
		.recipe-form input[type="number"],
		.recipe-form textarea {
			width: 100%;
		}
		.recipe-form input[type="text"],
		.recipe-form input[type="number"],
		.recipe-form textarea {
			font-size: 1rem;
		}
		.field-error {
			width: 100%;
		}
		.add-recipe-inner {
			margin-top: var(--add-recipe-offset-mobile, -18vh);
		}
	}
</style>
