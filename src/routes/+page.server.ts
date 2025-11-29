import type {PageServerLoad} from "./$types";
import {apiClient} from "../lib/server/instances/API-client/apiClient.ts";
import type {RecipeList} from "../lib/server/core/API-client/ApiClient.ts";
type RecipesPayload = {
	readonly recipes: RecipeList;
	readonly recipesError: string | null;
};
export async function load(): Promise<RecipesPayload> {
	const response = await apiClient.listRecipes();
	if (!response.success) {
		const message =
			response.error.message.length > 0 ?
				response.error.message
			:	"Nie udało się pobrać przepisów";
		console.error("Failed to fetch recipes", response.error);
		return {recipes: [], recipesError: message};
	}
	return {recipes: response.data, recipesError: null};
}
