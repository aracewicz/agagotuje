<script lang="ts">
	import type {Snippet} from "svelte";
	const props: {readonly children: Snippet<[]>} = $props();
</script>

<main>
	{@render props.children()}
</main>

<style>
	/* Ensure content isn't hidden under the fixed header */
	main {
		padding-top: var(--header-height, 64px);
	}
</style>
