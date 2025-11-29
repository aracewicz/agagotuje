<script lang="ts">
	import type {ActionData} from "../../../../routes/dodawanie-przepisu/$types.ts";
	const props: {readonly form: ActionData | null} = $props();
</script>

<form class="recipe-form" method="POST">
	<input
		type="text"
		name="title"
		placeholder="Nazwa przepisu"
		aria-label="Nazwa przepisu"
		required
		value={props.form?.values?.title ?? ""}
	/>
	{#if props.form?.errors?.title}
		<p class="field-error">{props.form.errors.title}</p>
	{/if}
	<input
		type="number"
		name="time"
		placeholder="Czas przygotowania"
		aria-label="Czas przygotowania"
		min="1"
		inputmode="numeric"
		required
		value={props.form?.values?.time ?? ""}
	/>
	{#if props.form?.errors?.time}
		<p class="field-error">{props.form.errors.time}</p>
	{/if}
	<input
		type="text"
		name="ingredients"
		placeholder="Składniki"
		aria-label="Składniki"
		required
		value={props.form?.values?.ingredients ?? ""}
	/>
	{#if props.form?.errors?.ingredients}
		<p class="field-error">{props.form.errors.ingredients}</p>
	{/if}
	<textarea
		name="instructions"
		placeholder="Przepis"
		aria-label="Przepis"
		required>{props.form?.values?.instructions ?? ""}</textarea
	>
	{#if props.form?.errors?.instructions}
		<p class="field-error">{props.form.errors.instructions}</p>
	{/if}
	<!-- <input type="file" name="photo" aria-label="Załącz zdjęcie" /> -->
	<div class="actions">
		<button class="btn-cta" type="submit">Kontynuuj</button>
	</div>
</form>

<style>
	.recipe-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-top: 1.25rem;
		align-items: stretch;
	}
	.recipe-form input[type="text"],
	.recipe-form input[type="number"],
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
	@media (max-width: 860px) {
		.recipe-form input[type="text"],
		.recipe-form input[type="number"],
		.recipe-form textarea {
			width: 90%;
		}
		.field-error {
			width: 90%;
		}
	}
	@media (max-width: 480px) {
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
	}
</style>
