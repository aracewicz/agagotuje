<script lang="ts">
	import {onMount} from "svelte";
	import {enhance} from "$app/forms";
	const props: {
		readonly data: {
			categories: readonly {readonly id: number; readonly name: string}[];
			error: string | null;
		};
	} = $props();
</script>

<main>
	<h1>Kategorie</h1>
	{#if props.data.error}
		<p class="error">{props.data.error}</p>
	{/if}
	<ul>
		{#each props.data.categories as category}
			<li>
				{category.name}
				<form
					method="POST"
					action="?/delete"
					use:enhance
					style="display:inline"
				>
					<input type="hidden" name="id" value={category.id} />
					<button type="submit">Usuń</button>
				</form>
			</li>
		{/each}
	</ul>
	<h2>Dodaj kategorię</h2>
	<form method="POST" action="?/create" use:enhance>
		<input type="text" name="name" placeholder="Nazwa kategorii" required />
		<button type="submit">Dodaj</button>
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
		display: inline;
		margin-left: 1rem;
	}
</style>
