import {fail} from "@sveltejs/kit";
const {apiClient: apiClient} = await import(
	"../../lib/server/instances/API-client/apiClient.ts"
);
export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const title = formData.get("title");
		const instructions = formData.get("instructions");
		const timeValue = formData.get("time");
		const ingredients = formData.get("ingredients");
		if (
			typeof title !== "string"
			|| typeof instructions !== "string"
			|| typeof ingredients !== "string"
			|| (typeof timeValue !== "string" && typeof timeValue !== "number")
		) {
			return fail(400, {errors: {global: "Nieprawidłowe dane formularza."}});
		} else {
			const token = event.cookies.get("auth_token");
			if (token === undefined) {
				return fail(401, {});
			} else {
				const time = Number(timeValue);
				if (Number.isNaN(time) || time <= 0) {
					return fail(400, {errors: {time: "Nieprawidłowy czas."}});
				}
				const response = await apiClient.createRecipe(
					{
						title: title,
						description: instructions,
						ingredients: ingredients,
						time: time,
					},
					token,
				);
				console.dir(response, {depth: null});
				if (response.success) {
					return {
						success: true,
						recipeId: response.data.id,
						message: "Przepis został dodany!",
					};
				} else {
					return fail(response.status, {});
				}
			}
		}
	},
};
