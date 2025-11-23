<script lang="ts">
	import type {Snippet} from "svelte";
	import ContainerOfMainContent from "../lib/client/core/container-of-main-content/ContainerOfMainContent.svelte";
	import NavigationBar from "../lib/client/core/navigation-bar/NavigationBar.svelte";
	const props: {readonly children: Snippet<[]>} = $props();
</script>

<NavigationBar />
<ContainerOfMainContent children={props.children} />
