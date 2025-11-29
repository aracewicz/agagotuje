import type {PageServerLoad, Actions} from "./$types.ts";
import {fail, redirect} from "@sveltejs/kit";
export async function load(event) {
	const {apiClient: apiClient} = await import(
		"../../lib/server/instances/API-client/apiClient.ts"
	);
	const token = event.cookies.get("auth_token");
	let user = null;
	let error = null;
	if (token) {
		const userResponse = await apiClient.getUser(0); // TODO: replace 0 with actual user id from token if available
		if (userResponse.success) {
			user = userResponse.data;
		} else {
			error = userResponse.error.message;
		}
	}
	return {user, error};
}
export const actions = {
	create: async (event): Promise<void> => {
		const {apiClient: apiClient} = await import(
			"../../lib/server/instances/API-client/apiClient.ts"
		);
		const form = await event.request.formData();
		const email = form.get("email");
		const username = form.get("username");
		const password = form.get("password");
		if (
			email === null
			|| username === null
			|| password === null
			|| typeof email !== "string"
			|| typeof username !== "string"
			|| typeof password !== "string"
		) {
			return fail(400, {error: "Wszystkie pola są wymagane"});
		} else {
			const result = await apiClient.createUser({email, username, password});
			if (result.success) {
				redirect(303, "/profil");
			} else {
				return fail(500, {error: result.error.message});
			}
		}
	},
};
