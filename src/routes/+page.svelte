<script lang="ts">
	import MainPage from "../lib/client/core/main-page/MainPage.svelte";
	const props: {readonly data: PageData} = $props();
</script>

<MainPage recipes={props.data.recipes} recipesError={props.data.recipesError} />
