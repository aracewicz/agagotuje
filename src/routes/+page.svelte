<script lang="ts">
	import MainPage from "../lib/client/core/main-page/MainPage.svelte";
	const props = $props();
</script>

<MainPage recipes={props.data.recipes} recipesError={props.data.recipesError} />
