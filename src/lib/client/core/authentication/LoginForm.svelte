<script lang="ts">
	const props: {readonly urlOfSubmission: string} = $props();
</script>

<form action={props.urlOfSubmission} method="POST">
	<input type="email" placeholder="Adres E-mail" />
	<button type="submit">Kontynuuj</button>
</form>
