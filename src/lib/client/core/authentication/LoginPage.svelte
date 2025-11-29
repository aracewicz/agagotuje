<script lang="ts">
	import {resolve} from "$app/paths";
	import LoginForm from "./LoginForm.svelte";
	type Props = {readonly heading?: string};
	const props: Props = $props();
	const {heading = "Logowanie:"} = props;
	const submissionUrl = resolve("/logowanie");
	function goBack() {
		history.back();
	}
</script>

<main class="login-page">
	<div class="login-inner">
		<button class="login-back" onclick={() => goBack()} aria-label="Powrót"
			>← powrót</button
		>
		<h2 class="login-heading">{heading}</h2>
		<div class="login-form-wrap">
			<LoginForm urlOfSubmission={submissionUrl} />
		</div>
	</div>
</main>

<style>
	:global(body) {
		background: #e5e5e5;
	}
	.login-page {
		min-height: calc(100vh - var(--header-height, 64px));
		background: transparent;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem 1rem;
	}
	.login-inner {
		width: 100%;
		max-width: 1040px;
		text-align: center;
		padding: 2.5rem 1.25rem 6rem;
		margin-top: var(--login-offset, -44vh);
	}
	.login-back {
		background: transparent;
		border: none;
		color: #111;
		font-size: 1.75rem;
		display: inline-block;
		margin-bottom: 2rem;
		cursor: pointer;
		padding: 0.75rem 1rem;
		border-radius: 6px;
		position: absolute;
		top: calc(var(--header-height, 64px) + 0.5rem);
		left: 1rem;
		z-index: 120;
	}
	.login-heading {
		font-size: clamp(2.5rem, 6vw, 4.25rem);
		margin: 0 auto 1.5rem;
		font-family: var(--font-body, "Poppins", system-ui, sans-serif);
		font-weight: 600;
		color: #111;
	}
	.login-form-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 1.5rem;
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.login-heading {
			font-size: 2rem;
		}
		.login-inner {
			margin-top: var(--login-offset-mobile, -18vh);
		}
	}
</style>
