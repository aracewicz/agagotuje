<script lang="ts">
	type Props = {readonly title?: string; readonly subtitle?: string};

	const props: Props = $props();
	const {title = "Rejestracja", subtitle = "Podaj imię i adres e-mail"} = props;

	function goBack() {
		history.back();
	}
</script>

<main class="register-page">
	<div class="register-inner">
		<button class="register-back" onclick={() => goBack()} aria-label="Powrót"
			>← powrót</button
		>
		<h1 class="register-title">{title}</h1>
		<p class="register-subtitle">{subtitle}</p>
		<form method="POST" class="register-form">
			<input name="name" type="text" placeholder="Imię" required />
			<input name="email" type="email" placeholder="Adres e-mail" required />
			<button type="submit">Zarejestruj się</button>
		</form>
	</div>
</main>

<style>
	:global(body) {
		background: #e5e5e5;
	}
	.register-page {
		min-height: calc(100vh - var(--header-height, 64px));
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem 1rem;
	}
	.register-inner {
		width: 100%;
		max-width: 720px;
		text-align: center;
		padding: 2.5rem 1.25rem 6rem;
		margin-top: var(--register-offset, -48vh);
	}
	.register-back {
		position: absolute;
		top: calc(var(--header-height, 64px) + 0.75rem);
		left: 1rem;
		border: none;
		background: transparent;
		font-size: 1.75rem;
		cursor: pointer;
	}
	.register-title {
		font-size: clamp(2.5rem, 6vw, 4.25rem);
		margin: 0 auto 1.5rem;
		font-family: var(--font-body, "Poppins", system-ui, sans-serif);
		font-weight: 600;
		color: #111;
	}
	.register-subtitle {
		color: #555;
		margin-bottom: 1rem;
	}
	.register-form {
		display: grid;
		gap: 1rem;
		justify-items: center;
	}
	.register-form input {
		width: 100%;
		max-width: 480px;
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}
	.register-form button {
		background: #cfe6ce;
		border: 1px solid rgba(0, 0, 0, 0.12);
		padding: 0.75rem 1.25rem;
		font-weight: 600;
		cursor: pointer;
		border-radius: 4px;
	}
	:global(.hero) {
		min-height: 34vh;
	}
	@media (max-width: 640px) {
		.register-title {
			font-size: 2rem;
		}
		.register-inner {
			margin-top: var(--register-offset-mobile, -28vh);
		}
	}
</style>
