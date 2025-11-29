<script lang="ts">
	import NavigationBar from "../navigation-bar/NavigationBar.svelte";
	import Header from "../header/Header.svelte";
	import ContainerOfMainContent from "../container-of-main-content/ContainerOfMainContent.svelte";
	import type {Recipe} from "../../../server/core/API-client/ApiClient.ts";
	type Props = {
		readonly recipes: readonly Recipe[];
		readonly recipesError: string | null;
	};
	const props: Props = $props();
	const MAX_INGREDIENTS = 6;
	const MAX_STEPS = 3;
	function formatTime(minutes: number): string {
		if (!Number.isFinite(minutes) || minutes <= 0) {
			return "Czas nieznany";
		}
		if (minutes < 60) {
			return `${minutes} min`;
		}
		const hours = Math.floor(minutes / 60);
		const remaining = minutes % 60;
		if (remaining === 0) {
			return `${hours} h`;
		}
		return `${hours} h ${remaining} min`;
	}
</script>

<section class="recipes">
	<header class="recipes__header">
		<h2>Ostatnio dodane przepisy</h2>
		<p>Najświeższe przepisy pobrane bezpośrednio z API.</p>
	</header>
	{#if props.recipesError}
		<div class="banner banner--error" role="alert">
			<strong>Ups!</strong>
			<span>{props.recipesError}</span>
		</div>
	{/if}
	{#if props.recipes.length === 0}
		<p class="recipes__empty">
			Brak przepisów do wyświetlenia. Dodaj pierwszy lub spróbuj ponownie
			później.
		</p>
	{:else}
		<ul class="recipes-grid" aria-live="polite">
			{#each props.recipes as recipe (recipe.id)}
				<li class="recipe-card">
					<header class="recipe-card__header">
						<h3>{recipe.title}</h3>
						<span class="recipe-card__time"
							>{formatTime(recipe.time_minutes)}</span
						>
					</header>
					<p class="recipe-card__description">{recipe.description}</p>
					<div class="recipe-card__body">
						<section class="recipe-card__section">
							<h4>Składniki</h4>
							<ul>
								{#each recipe.ingredients.slice(0, MAX_INGREDIENTS) as ingredient, index (index)}
									<li>{ingredient}</li>
								{/each}
							</ul>
							{#if recipe.ingredients.length > MAX_INGREDIENTS}
								<p class="recipe-card__more">
									+ {recipe.ingredients.length - MAX_INGREDIENTS} kolejnych składników
								</p>
							{/if}
						</section>
						<section class="recipe-card__section">
							<h4>Kroki</h4>
							<ol>
								{#each recipe.steps.slice(0, MAX_STEPS) as step, index (index)}
									<li>{step}</li>
								{/each}
							</ol>
							{#if recipe.steps.length > MAX_STEPS}
								<p class="recipe-card__more">
									+ {recipe.steps.length - MAX_STEPS} kolejnych kroków
								</p>
							{/if}
						</section>
						<img src={recipe.image_url} alt="" />
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	:global(body) {
		margin: 0;
		background: #f7f7f2;
		font-family: var(--font-body, "Poppins", sans-serif);
	}
	.recipes {
		padding: clamp(1.5rem, 5vw, 3rem);
		max-width: 1200px;
		margin: 0 auto 4rem;
	}
	.recipes__header {
		margin-bottom: 1.5rem;
	}
	.recipes__header h2 {
		margin: 0;
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-family: var(--font-heading, "Playfair Display", serif);
	}
	.recipes__header p {
		margin: 0.5rem 0 0;
		color: #4b5563;
	}
	.recipes__empty {
		margin: 2rem 0;
		font-weight: 500;
		color: #6b7280;
	}
	.banner {
		border-radius: 0.75rem;
		padding: 1rem 1.25rem;
		margin-bottom: 1.5rem;
		font-weight: 500;
	}
	.banner--error {
		background: #fee2e2;
		color: #b91c1c;
		border: 1px solid rgba(185, 28, 28, 0.2);
	}
	.recipes-grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}
	.recipe-card {
		background: #fff;
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		border: 1px solid rgba(15, 23, 42, 0.04);
	}
	.recipe-card__header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}
	.recipe-card__header h3 {
		margin: 0;
		font-size: 1.35rem;
		font-family: var(--font-heading, "Playfair Display", serif);
	}
	.recipe-card__time {
		font-size: 0.95rem;
		font-weight: 600;
		color: #047857;
		background: rgba(16, 185, 129, 0.1);
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
	}
	.recipe-card__description {
		margin: 0;
		color: #374151;
		line-height: 1.5;
	}
	.recipe-card__body {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}
	.recipe-card__section h4 {
		margin: 0 0 0.5rem;
		font-size: 1rem;
		font-weight: 700;
	}
	.recipe-card__section ul,
	.recipe-card__section ol {
		margin: 0;
		padding-left: 1.25rem;
		color: #1f2937;
	}
	.recipe-card__section li {
		margin-bottom: 0.4rem;
	}
	.recipe-card__more {
		margin: 0.5rem 0 0;
		font-size: 0.85rem;
		color: #6b7280;
		font-style: italic;
	}
	@media (max-width: 640px) {
		.recipe-card {
			padding: 1.25rem;
		}
		.recipe-card__body {
			grid-template-columns: 1fr;
		}
	}
</style>
