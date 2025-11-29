import {fail, redirect} from "@sveltejs/kit";
export async function load(event) {
	const {apiClient: apiClient} = await import(
		"../../lib/server/instances/API-client/apiClient.ts"
	);
	const categoriesResponse = await apiClient.listCategories();
	if (!categoriesResponse.success) {
		return {categories: [], error: categoriesResponse.error.message};
	}
	return {categories: categoriesResponse.data, error: null};
}
export const actions = {
	create: async (event) => {
		const {apiClient: apiClient} = await import(
			"../../lib/server/instances/API-client/apiClient.ts"
		);
		const form = await event.request.formData();
		const name = form.get("name");
		if (!name || typeof name !== "string" || name.trim().length === 0) {
			return fail(400, {error: "Nazwa kategorii jest wymagana"});
		}
		const token = event.cookies.get("auth_token");
		if (!token) {
			return fail(401, {error: "Musisz być zalogowany, aby dodać kategorię"});
		}
		const result = await apiClient.createCategory({name}, token);
		if (!result.success) {
			return fail(500, {error: result.error.message});
		}
		throw redirect(303, "/kategorie");
	},
	delete: async (event) => {
		const {apiClient: apiClient} = await import(
			"../../lib/server/instances/API-client/apiClient.ts"
		);
		const form = await event.request.formData();
		const id = form.get("id");
		if (!id || typeof id !== "string") {
			return fail(400, {error: "ID kategorii jest wymagane"});
		}
		const token = cookies.get("auth_token");
		if (!token) {
			return fail(401, {error: "Musisz być zalogowany, aby usunąć kategorię"});
		}
		const result = await apiClient.deleteCategory(Number(id), token);
		if (!result.success) {
			return fail(500, {error: result.error.message});
		}
		throw redirect(303, "/kategorie");
	},
};
