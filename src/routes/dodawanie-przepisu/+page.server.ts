import {fail} from "@sveltejs/kit";
import type {Actions} from "./$types";
import {apiClient} from "../../lib/server/instances/API-client/apiClient.ts";
const MAX_DESCRIPTION_LENGTH = 600;
type FormField = "title" | "time" | "ingredients" | "instructions";
type FormErrors = Partial<Record<FormField | "global", string>>;
type FormValues = Record<FormField, string>;
const splitToList = (raw: string): readonly string[] => {
	return raw
		.split(/[\n,]+/)
		.map((entry) => entry.trim())
		.filter((entry) => entry.length > 0);
};
const normalizeValues = (formData: FormData): FormValues => {
	const getValue = (key: FormField): string => {
		const value = formData.get(key);
		if (typeof value !== "string") {
			return "";
		}
		return value.trim();
	};
	return {
		title: getValue("title"),
		time: getValue("time"),
		ingredients: getValue("ingredients"),
		instructions: getValue("instructions"),
	};
};
const validate = (
	values: FormValues,
): {errors: FormErrors; timeMinutes: number} => {
	const errors: FormErrors = {};
	const title = values.title;
	if (title.length < 3) {
		errors.title = "Nazwa przepisu musi mieć co najmniej 3 znaki.";
	}
	const parsedTime = Number.parseInt(values.time, 10);
	if (!Number.isFinite(parsedTime) || parsedTime <= 0) {
		errors.time = "Podaj dodatnią liczbę minut.";
	}
	const ingredientList = splitToList(values.ingredients);
	if (ingredientList.length === 0) {
		errors.ingredients = "Dodaj przynajmniej jeden składnik.";
	}
	const instructionList = splitToList(values.instructions);
	if (instructionList.length === 0) {
		errors.instructions = "Dodaj przynajmniej jeden krok przygotowania.";
	}
	return {errors, timeMinutes: parsedTime};
};
export const actions = {
	default: async ({request}) => {
		const formData = await request.formData();
		const values = normalizeValues(formData);
		const {errors, timeMinutes} = validate(values);
		const ingredientList = splitToList(values.ingredients);
		const instructionList = splitToList(values.instructions);
		if (Object.keys(errors).length > 0) {
			return fail(400, {errors, values});
		}
		const description = values.instructions.slice(0, MAX_DESCRIPTION_LENGTH);
		const response = await apiClient.createRecipe({
			title: values.title,
			ingredients: ingredientList,
			description,
			steps: instructionList,
			time_minutes: timeMinutes,
		});
		if (!response.success) {
			const message =
				response.error.message.length > 0 ?
					response.error.message
				:	"Nie udało się zapisać przepisu.";
			const serverErrors: FormErrors = {global: message};
			return fail(500, {errors: serverErrors, values});
		}
		return {
			success: true,
			recipeId: response.data.id,
			message: "Przepis został dodany!",
		};
	},
} satisfies Actions;
