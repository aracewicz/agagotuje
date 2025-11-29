<script lang="ts">
	import {enhance} from "$app/forms";
	const props: {
		readonly data: {
			user: {
				readonly id: number;
				readonly email: string;
				readonly username: string;
			} | null;
			error: string | null;
		};
	} = $props();
</script>

<main>
	<h1>Profil użytkownika</h1>
	{#if props.data.error}
		<p class="error">{props.data.error}</p>
	{/if}
	{#if props.data.user}
		<p>ID: {props.data.user.id}</p>
		<p>Email: {props.data.user.email}</p>
		<p>Nazwa użytkownika: {props.data.user.username}</p>
	{:else}
		<p>Brak danych użytkownika.</p>
	{/if}
	<h2>Stwórz nowego użytkownika</h2>
	<form method="POST" action="?/create" use:enhance>
		<input type="email" name="email" placeholder="Email" required />
		<input
			type="text"
			name="username"
			placeholder="Nazwa użytkownika"
			required
		/>
		<input type="password" name="password" placeholder="Hasło" required />
		<button type="submit">Stwórz</button>
	</form>
</main>

<style>
	.error {
		color: #b91c1c;
		background: #fee2e2;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		margin-bottom: 1rem;
	}
	form {
		margin-top: 1rem;
	}
</style>
