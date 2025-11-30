<script lang="ts">
	import {resolve} from "$app/paths";
	import urlOfIcon from "./icon/icon-of-table-of-contents.svg";
	type Entry = {readonly slug: string; readonly text: string};
	const entries = [
		{slug: "wypieki-i-desery", text: "Wypieki i desery"},
		{slug: "dania-z-maki", text: "Dania z mąki"},
		{slug: "dania-glowne", text: "Dania główne"},
		{slug: "dodatki", text: "Dodatki"},
		{slug: "napoje", text: "Napoje"},
	] as const satisfies readonly Entry[];
</script>

<div class="table-of-contents">
	<div class="table-of-contents__icon">
		<img src={urlOfIcon} alt="" />
		<label>
			<input type="checkbox" />
			<span>Spis treści</span>
		</label>
	</div>
	<nav>
		<ul>
			{#each entries as entry, index (index)}<li>
					<a href={resolve(`/kategorie/${entry.slug}`)}>{entry.text}</a>
				</li>{/each}
		</ul>
	</nav>
</div>

<style lang="scss">
	.table-of-contents {
		&:has(
			> .table-of-contents__icon > label > input[type="checkbox"]:not(:checked)
		) {
			> nav {
				display: none;
			}
		}
		&:has(> .table-of-contents__icon > label > input[type="checkbox"]:checked) {
			> nav {
				display: block;
			}
		}
	}
	.table-of-contents__icon {
		width: 4.625rem;
		height: 4.625rem;
		position: relative;
		& > * {
			position: absolute;
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
		& > label {
			& > input[type="checkbox"] {
				position: absolute;
				width: 100%;
				height: 100%;
				object-fit: contain;
				padding-block: 0;
				padding-inline: 0;
				margin: 0;
				appearance: none;
			}
			& > span {
				display: none;
			}
		}
	}
</style>
