<script lang="ts">
	import {enhance} from "$app/forms";
	const props: {
		readonly data: {
			ratings: readonly {
				readonly id: number;
				readonly value: number;
				readonly user_id: number;
			}[];
			error: string | null;
		};
	} = $props();
	// ...existing code...
</script>

<main>
	<h1>Oceny przepisu</h1>
	{#if props.data.error}
		<p class="error">{props.data.error}</p>
	{/if}
	<ul>
		{#each props.data.ratings as rating}
			<li>Użytkownik {rating.user_id}: {rating.value}</li>
		{/each}
	</ul>
	<h2>Dodaj ocenę</h2>
	<form method="POST" action="?/create" use:enhance>
		<input
			type="number"
			name="value"
			min="1"
			max="5"
			required
			placeholder="Ocena (1-5)"
		/>
		<input
			type="hidden"
			name="recipe_id"
			value={new URLSearchParams(window.location.search).get("id")}
		/>
		<button type="submit">Oceń</button>
	</form>
</main>

<style>
	.error {
		color: #b91c1c;
		background: #fee2e2;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		margin-bottom: 1rem;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		margin-bottom: 0.75rem;
	}
	form {
		margin-top: 1rem;
	}
</style>
