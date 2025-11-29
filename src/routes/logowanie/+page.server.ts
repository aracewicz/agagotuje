import type {Actions} from "@sveltejs/kit";
const {apiClient: apiClient} = await import(
	"../../lib/server/instances/API-client/apiClient.ts"
);
import {redirect, fail} from "@sveltejs/kit";
export const actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const email = form.get("email");
		const password = form.get("password");
		if (!email || typeof email !== "string" || email.trim().length === 0) {
			return {error: "E-mail is required"};
		}
		if (!password || typeof password !== "string" || password.length < 6) {
			return {error: "Password must be at least 6 characters"};
		}
		const result = await apiClient.login({email, password});
		if (!result.success) {
			return fail(401, {
				error: result.error.message || "Nieprawidłowe dane logowania",
			});
		}
		// Set cookie with token
		const token = result.data.access_token;
		event.cookies.set("auth_token", token, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: process.env["NODE_ENV"] === "production",
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});
		throw redirect(303, "/");
	},
} as const satisfies Actions;
