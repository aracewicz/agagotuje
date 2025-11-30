<script lang="ts">
	import {resolve} from "$app/paths";
	import TableOfContents from "./table-of-contents/TableOfContents.svelte";
</script>

<nav>
	<TableOfContents /><a href={resolve("/dodawanie-przepisu")}>Dodaj przepis</a>
</nav>
