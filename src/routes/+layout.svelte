<script lang="ts">
	import type {Snippet} from "svelte";
	import ContainerOfMainContent from "../lib/client/core/container-of-main-content/ContainerOfMainContent.svelte";
	import NavigationBar from "../lib/client/core/navigation-bar/NavigationBar.svelte";
	import Header from "../lib/client/core/header/Header.svelte";
	const props: {readonly children: Snippet<[]>} = $props();
</script>

<NavigationBar user={props.data?.user ?? null} />
<Header />
<ContainerOfMainContent children={props.children} />

<style>
	:global(body) {
		font-family:
			"Poppins",
			system-ui,
			-apple-system,
			"Segoe UI",
			Roboto,
			"Helvetica Neue",
			Arial,
			sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		margin: 0;
	}
	:global(:root) {
		--font-heading: "Playfair Display", serif;
		--font-ui:
			"Montserrat", system-ui, -apple-system, "Segoe UI", Roboto,
			"Helvetica Neue", Arial, sans-serif;
		--font-body:
			"Poppins", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
			Arial, sans-serif;
		--add-recipe-offset: -48vh; /* offset to move Add Recipe page higher */
		--add-recipe-offset-mobile: -28vh;
		--register-offset: -48vh; /* offset for registration / auth pages */
		--register-offset-mobile: -28vh;
	}
</style>
