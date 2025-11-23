<script lang="ts">
	import type {Snippet} from "svelte";
	const props: {readonly children: Snippet<[]>} = $props();
</script>

<main>
	{@render props.children()}
</main>
