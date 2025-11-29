import {fail} from "@sveltejs/kit";
const {apiClient: apiClient} = await import(
	"../../lib/server/instances/API-client/apiClient.ts"
);
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
	default: async (event) => {
		const formData = await event.request.formData();
		const values = normalizeValues(formData);
		const {errors, timeMinutes} = validate(values);
		const ingredientList = splitToList(values.ingredients);
		const instructionList = splitToList(values.instructions);
		if (Object.keys(errors).length > 0) {
			return fail(400, {errors, values});
		}
		const description = values.instructions.slice(0, MAX_DESCRIPTION_LENGTH);
		const token = cookies.get("auth_token");
		if (!token) {
			const serverErrors: FormErrors = {
				global: "Musisz być zalogowany, aby dodać przepis.",
			};
			return fail(401, {errors: serverErrors, values});
		}
		const response = await apiClient.createRecipe(
			{
				title: values.title,
				description,
				// image: null // TODO: support image upload from form if needed
			},
			token,
		);
		if (!response.success) {
			let serverErrors: FormErrors = {
				global: "Nie udało się zapisać przepisu.",
			};
			if (response.error.body) {
				try {
					const parsed =
						typeof response.error.body === "string" ?
							JSON.parse(response.error.body)
						:	response.error.body;
					if (parsed && typeof parsed === "object") {
						if (parsed.errors)
							serverErrors = {...serverErrors, ...parsed.errors};
						if (parsed.global) serverErrors.global = parsed.global;
					}
				} catch {}
			}
			serverErrors.global = response.error.message || serverErrors.global;
			return fail(response.status || 500, {errors: serverErrors, values});
		}
		return {
			success: true,
			recipeId: response.data.id,
			message: "Przepis został dodany!",
		};
	},
};
