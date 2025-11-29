import type {Actions} from "@sveltejs/kit";
import {fail, redirect} from "@sveltejs/kit";
import {apiClient} from "../../lib/server/instances/API-client/apiClient.ts";
export const actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const name = form.get("name");
		const email = form.get("email");
		if (!name || typeof name !== "string" || name.trim().length === 0) {
			return fail(400, {error: "Name is required"});
		}
		if (!email || typeof email !== "string" || email.trim().length === 0) {
			return fail(400, {error: "E-mail is required"});
		}
		const password = Math.random().toString(36).slice(2, 10);
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
