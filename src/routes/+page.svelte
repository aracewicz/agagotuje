<script lang="ts">
	import MainPage from "../lib/client/core/main-page/MainPage.svelte";
	import type {PageData} from "./$types";
	const props: {readonly data: PageData} = $props();
</script>

<MainPage recipes={props.data.recipes} recipesError={props.data.recipesError} />
