<script lang="ts">
	// Main page hero - big title and subtitle
</script>

<section class="hero">
	<div class="hero-content">
		<h1 class="hero-title">Aga gotuje</h1>
		<p class="hero-subtitle">Tylko najlepsze przepisy</p>
	</div>
</section>

<style>
	.hero {
		/* Use CSS variable to control vertical offset (higher = smaller offset value). */
		--hero-top-offset: clamp(1.25rem, 6vw, 3.5rem);
		min-height: 70vh; /* visible hero height */
		display: flex;
		align-items: flex-start; /* align to top to make the content sit higher */
		justify-content: center;
		padding: calc(var(--hero-top-offset) + 0.75rem) 1.5rem 3rem; /* top / sides / bottom */
		box-sizing: border-box;
		text-align: center;
		background: var(--hero-bg, transparent);
	}
	.hero-content {
		max-width: 1000px;
		width: 100%;
		transform: translateY(-0.5rem); /* nudge the block slightly upwards */
	}
	.hero-title {
		font-family: var(--font-heading, "Playfair Display", serif);
		font-size: clamp(2.25rem, 7.5vw, 5rem);
		font-weight: 700;
		margin: 0;
		color: var(--heading-color, #1f2937); /* default dark */
		letter-spacing: 0.5px;
		line-height: 1.05;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
	}
	.hero-subtitle {
		font-family: var(--font-body, "Poppins", sans-serif);
		font-size: clamp(1rem, 3vw, 1.5rem);
		margin-top: 0.75rem;
		color: var(--muted-color, #6b7280);
		font-weight: 300;
	}
	/* Make sure it looks fine on small devices */
	/* Small screens: keep the content centered vertically for smaller displays */
	@media (max-width: 480px) {
		.hero {
			min-height: 60vh;
			align-items: center; /* center for small devices */
			padding: 2rem 1rem;
		}
		.hero-content {
			transform: none; /* no upward nudge on small screens */
		}
	}
</style>
