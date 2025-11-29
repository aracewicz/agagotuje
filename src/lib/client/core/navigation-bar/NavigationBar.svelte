<script lang="ts">
	import {resolve} from "$app/paths";
	import TableOfContents from "./table-of-contents/TableOfContents.svelte";
	/* logo removed (was urlOfIcon) */
	/**
	 * Top navigation bar fixed to the top of the screen.
	 * Uses CSS variable --header-height which ContainerOfMainContent will respect.
	 */
</script>

<header class="topbar" aria-label="Top navigation">
	<div class="topbar__inner">
		<div class="topbar__left">
			<TableOfContents />
		</div>
		<div class="topbar__center">
			<a
				href={resolve("/dodawanie-przepisu")}
				class="topbar__center-link">Dodaj przepis!</a
			>
		</div>
		<div class="topbar__right">
			<a
				href={resolve("/rejestracja")}
				class="topbar__link">Rejestracja</a
			>
			<a
				href={resolve("/logowanie")}
				class="topbar__link">Logowanie</a
			>
		</div>
	</div>
</header>

<style>
	:global(:root) {
		--header-height: 64px; /* used by the content to avoid overlap */
	}
	.topbar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: var(--header-height);
		background: #97d58f; /* soft green - adjust to match design */
		display: flex;
		align-items: center;
		box-shadow: 0 2px 0 rgba(0, 0, 0, 0.06);
		z-index: 100;
		font-family: var(--font-ui, "Montserrat", system-ui, sans-serif);
	}
	.topbar__inner {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
	}
	.topbar__left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	/* logo removed */
	.topbar__right {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-self: end;
	}
	.topbar__center {
		justify-self: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.topbar__center-link {
		font-weight: 700;
		font-size: 1.25rem;
		text-decoration: none;
		color: #0a0a0a;
		padding: 0.25rem 0.5rem;
	}
	.topbar__center-link,
	.topbar__link {
		font-family: var(--font-ui, "Montserrat", system-ui, sans-serif);
	}
	.topbar__center-link:hover,
	.topbar__center-link:focus {
		text-decoration: underline;
	}
	/* CTA removed - Rejestracja now uses .topbar__link for consistent styling */
	.topbar__link {
		color: #0a0a0a;
		text-decoration: none;
		padding: 0.5rem 0.75rem;
		font-weight: 600;
		font-size: 1.125rem; /* larger text for emphasis */
		line-height: 1;
	}
	.topbar__link:hover,
	.topbar__link:focus {
		text-decoration: underline;
	}
	/* Make sure content below doesn't get hidden underneath the header */
	@media (max-width: 640px) {
		:global(:root) {
			--header-height: 56px;
		}
		.topbar__link {
			font-size: 1rem;
			padding: 0.4rem 0.5rem;
		}
	}
</style>
