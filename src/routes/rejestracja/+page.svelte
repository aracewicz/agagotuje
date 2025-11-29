<script lang="ts">
	import RegisterPage from "../../lib/client/core/authentication/RegisterPage.svelte";
	type Props = {readonly form?: {readonly error?: string}};
	const props: Props = $props();
	const {form} = props;
	const errorMessage = form?.error;
</script>

<RegisterPage {errorMessage} />
