import {fail, redirect} from "@sveltejs/kit";
import type {ApiClient} from "../../lib/server/core/API-client/ApiClient.ts";
type Rating = {readonly value: number};
type RatingsAndError = {ratings: readonly Rating[]; error: string | null};
async function getRatingsAndError(
	apiClient: ApiClient,
	recipeId: string | null,
): Promise<RatingsAndError> {
	if (!recipeId) {
		return {ratings: [], error: null};
	}
	const ratingsResponse = await apiClient.listRatingsForRecipe(
		Number(recipeId),
	);
	if (ratingsResponse.success) {
		return {ratings: ratingsResponse.data, error: null};
	} else {
		return {ratings: [], error: ratingsResponse.error.message};
	}
}
export async function load(
	event,
): Promise<{
	readonly ratings: readonly {readonly value: number}[];
	readonly error: string | null;
}> {
	const {apiClient: apiClient} = await import(
		"../../lib/server/instances/API-client/apiClient.ts"
	);
	const recipeId = event.url.searchParams.get("id");
	const {ratings, error} = await getRatingsAndError(apiClient, recipeId);
	return {ratings, error};
}
export const actions = {
	create: async (event) => {
		const {apiClient: apiClient} = await import(
			"../../lib/server/instances/API-client/apiClient.ts"
		);
		const form = await event.request.formData();
		const value = form.get("value");
		const recipe_id = form.get("recipe_id");
		const token = event.cookies.get("auth_token");
		if (!token) {
			return fail(401, {error: "Musisz być zalogowany, aby ocenić przepis"});
		}
		if (!value || !recipe_id) {
			return fail(400, {error: "Wartość oceny i ID przepisu są wymagane"});
		}
		const result = await apiClient.createRating(
			{value: Number(value), recipe_id: Number(recipe_id)},
			token,
		);
		if (!result.success) {
			return fail(500, {error: result.error.message});
		}
		throw redirect(303, `/przepis?id=${recipe_id}`);
	},
};
