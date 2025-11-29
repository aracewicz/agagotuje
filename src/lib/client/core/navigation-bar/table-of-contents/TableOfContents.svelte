<script lang="ts">
	import {resolve} from "$app/paths";
	import {fade, slide} from "svelte/transition";
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
		<label>
			<input type="checkbox" class="toc-checkbox" />
			<img class="toc-icon" src={urlOfIcon} alt="Spis treści" />
			<span class="visually-hidden">Spis treści</span>
		</label>
	</div>
	<nav class="toc-panel">
		<div class="toc-panel__body">
			<header class="toc-panel__header">Spis Treści</header>
			<ul>
				{#each entries as entry, index (index)}
					<li>
						<a href={resolve(`/kategorie/${entry.slug}`)}>{entry.text}</a>
					</li>
				{/each}
			</ul>
		</div>
	</nav>
</div>

<style lang="scss">
	.table-of-contents {
		position: relative;
		display: inline-block;

		/* Hide nav by default, show when checkbox is checked */
		&:has(.toc-checkbox:checked) .toc-panel {
			display: block;
		}
	}

	.table-of-contents__icon {
		width: 3.5rem;
		height: 3.5rem;
		position: relative;

		label {
			cursor: pointer;
			width: 100%;
			height: 100%;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			position: relative;

			.toc-checkbox {
				position: absolute;
				width: 100%;
				height: 100%;
				opacity: 0;
				margin: 0;
				padding: 0;
				cursor: pointer;
			}

			.toc-icon {
				width: 90%;
				height: 90%;
				object-fit: contain;
				pointer-events: none; /* click passes through to checkbox */
			}
		}
	}

	.toc-panel {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		min-width: 14rem;
		max-width: 22rem;
		background: #eaf4e8;
		border-radius: 6px;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(0, 0, 0, 0.06);
		padding: 1rem 0.75rem 1.25rem;
		z-index: 40;
		display: none; /* hidden by default */

		.toc-panel__header {
			font-weight: 600;
			text-align: center;
			color: #0f5132;
			margin-bottom: 0.5rem;
		}

		ul {
			list-style: none;
			margin: 0;
			padding: 0;
			display: grid;
			gap: 0.75rem;
		}

		li a {
			display: block;
			text-align: center;
			text-decoration: none;
			color: #7a2b2b;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.8px;
			font-size: 1.1rem;
		}
	}

	/* Mobile responsiveness */
	@media (max-width: 480px) {
		.table-of-contents__icon {
			width: 2.25rem;
			height: 2.25rem;

			.toc-icon {
				width: 86%;
				height: 86%;
			}
		}
	}

	.visually-hidden {
		position: absolute !important;
		height: 1px;
		width: 1px;
		overflow: hidden;
		clip: rect(1px, 1px, 1px, 1px);
		white-space: nowrap;
	}
</style>
