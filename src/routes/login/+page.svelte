<script lang="ts">
	import {resolve} from "$app/paths";
	import LoginForm from "../../lib/client/core/authentication/LoginForm.svelte";
</script>

<LoginForm urlOfSubmission={resolve("/login")} />
