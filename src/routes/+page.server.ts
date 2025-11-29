import type {RecipeList} from "../lib/server/core/API-client/ApiClient.ts";
type RecipesPayload =
	| {readonly recipes: RecipeList; readonly recipesError: null}
	| {readonly recipes: null; readonly recipesError: string};
export async function load(): Promise<RecipesPayload> {
	const {apiClient: apiClient} = await import(
		"../lib/server/instances/API-client/apiClient.ts"
	);
	const response = await apiClient.listRecipes();
	if (response.success) {
		return {recipes: response.data, recipesError: null};
	} else {
		return {
			recipes: null,
			recipesError: JSON.stringify(response.error, null, 2),
		};
	}
}
import {fail, redirect} from "@sveltejs/kit";
export const actions = {
	update: async (event) => {
		const {apiClient: apiClient} = await import(
			"../lib/server/instances/API-client/apiClient.ts"
		);
		const form = await event.request.formData();
		const id = form.get("id");
		const title = form.get("title");
		const description = form.get("description");
		if (!id || typeof id !== "string") {
			return fail(400, {error: "ID przepisu jest wymagane"});
		}
		const token = event.cookies.get("auth_token");
		if (!token) {
			return fail(401, {error: "Musisz być zalogowany, aby edytować przepis"});
		}
		const safeTitle = typeof title === "string" ? title : null;
		const safeDescription =
			typeof description === "string" ? description : null;
		const result = await apiClient.patchRecipe(
			Number(id),
			{title: safeTitle, description: safeDescription},
			token,
		);
		if (result.success) {
			throw redirect(303, "/");
		} else {
			return fail(500, {error: result.error.message});
		}
	},
	delete: async (event) => {
		const {apiClient: apiClient} = await import(
			"../lib/server/instances/API-client/apiClient.ts"
		);
		const form = await event.request.formData();
		const id = form.get("id");
		if (!id || typeof id !== "string") {
			return fail(400, {error: "ID przepisu jest wymagane"});
		}
		const token = event.cookies.get("auth_token");
		if (!token) {
			return fail(401, {error: "Musisz być zalogowany, aby usunąć przepis"});
		}
		const result = await apiClient.deleteRecipe(Number(id), token);
		if (!result.success) {
			return fail(500, {error: result.error.message});
		}
		throw redirect(303, "/");
	},
};
