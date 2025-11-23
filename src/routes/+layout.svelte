<script lang="ts">
	import type {Snippet} from "svelte";
	import ContainerOfMainContent from "../lib/client/core/container-of-main-content/ContainerOfMainContent.svelte";
	const props: {readonly children: Snippet<[]>} = $props();
</script>

<ContainerOfMainContent children={props.children} />
