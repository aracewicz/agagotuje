import type {Actions} from "@sveltejs/kit";
import {fail, redirect} from "@sveltejs/kit";
const {apiClient: apiClient} = await import(
	"../../lib/server/instances/API-client/apiClient.ts"
);
export const actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const name = form.get("name");
		const email = form.get("email");
		const password = form.get("password");
		if (!name || typeof name !== "string" || name.trim().length === 0) {
			return fail(400, {error: "Name is required"});
		}
		if (!email || typeof email !== "string" || email.trim().length === 0) {
			return fail(400, {error: "E-mail is required"});
		}
		if (!password || typeof password !== "string" || password.length < 6) {
			return fail(400, {error: "Password must be at least 6 characters"});
		}
		const result = await apiClient.registerUser({
			email,
			username: name,
			password,
		});
		if (!result.success) {
			return fail(500, {error: result.error.message});
		}
		throw redirect(303, "/logowanie");
	},
} as const satisfies Actions;
