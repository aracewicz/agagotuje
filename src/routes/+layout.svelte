<script lang="ts">
	import type {Snippet} from "svelte";
	import ContainerOfMainContent from "../lib/client/core/container-of-main-content/ContainerOfMainContent.svelte";
	import NavigationBar from "../lib/client/core/navigation-bar/NavigationBar.svelte";
	import Header from "../lib/client/core/header/Header.svelte";
	const props: {readonly children: Snippet<[]>} = $props();
</script>

<NavigationBar />
<Header />
<ContainerOfMainContent children={props.children} />
