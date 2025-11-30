import {z} from "zod";
const userSchema = z.object({
	id: z.number(),
	email: z.string().email(),
	username: z.string(),
});
const tokenSchema = z.object({
	access_token: z.string(),
	token_type: z.literal("bearer"),
});
const recipeSchema = z.object({
	id: z.number(),
	owner_id: z.number(),
	title: z.string(),
	ingredients: z.array(z.string()),
	description: z.string(),
	steps: z.array(z.string()),
	time_minutes: z.number(),
});
const recipeDeleteSchema = z.object({detail: z.string()});
const ratingSchema = z.object({
	id: z.number(),
	user_id: z.number(),
	recipe_id: z.number(),
	score: z.number().int().min(1).max(5),
});
const ratingListSchema = z.array(ratingSchema);
export type User = z.infer<typeof userSchema>;
export type AuthToken = z.infer<typeof tokenSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type Rating = z.infer<typeof ratingSchema>;
export type RecipeDeleteResponse = z.infer<typeof recipeDeleteSchema>;
export type RegisterUserInput = {
	email: string;
	username: string;
	password: string;
};
export type LoginCredentials = {email: string; password: string};
export type CreateUserInput = {
	email: string;
	username: string;
	password: string;
};
export type RecipeCreateInput = {
	title: string;
	ingredients: string[];
	description: string;
	steps: string[];
	time_minutes: number;
};
export type RecipePatchInput = {
	title: string | null;
	description: string | null;
};
export type RatingCreateInput = {score: number; recipe_id: number};
export type ClientConfig = {baseUrl: string; accessToken: string | null};
export type ApiError = {
	status: number;
	message: string;
	details: unknown | null;
};
export type ApiResult<Data> =
	| {ok: true; data: Data; error: null}
	| {ok: false; data: null; error: ApiError};
export class ApiClient {
	private baseUrl: string;
	public constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}
	public async registerUser(
		input: RegisterUserInput,
	): Promise<ApiResult<User>> {
		const result = await this.sendJson(
			"/auth/register",
			"POST",
			input,
			userSchema,
		);
		return result;
	}
	public async login(
		credentials: LoginCredentials,
	): Promise<ApiResult<AuthToken>> {
		const form = new URLSearchParams();
		form.set("username", credentials.email);
		form.set("password", credentials.password);
		const result = await this.dispatch(
			"/auth/login",
			{
				method: "POST",
				headers: {"Content-Type": "application/x-www-form-urlencoded"},
				body: form.toString(),
			},
			tokenSchema,
		);
		return result;
	}
	public async createUser(input: CreateUserInput): Promise<ApiResult<User>> {
		const result = await this.sendJson("/users", "POST", input, userSchema);
		return result;
	}
	public async getUser(userId: number): Promise<ApiResult<User>> {
		const result = await this.dispatch(
			`/users/${userId}`,
			{method: "GET", headers: {}},
			userSchema,
		);
		return result;
	}
	public async getRecipes(): Promise<ApiResult<readonly Recipe[]>> {
		const result = await this.dispatch(
			"/recipes",
			{method: "GET", headers: {}},
			z.array(recipeSchema),
		);
		return result;
	}
	public async getRecipe(recipeId: number): Promise<ApiResult<Recipe>> {
		const result = await this.dispatch(
			`/recipes/${recipeId}`,
			{method: "GET", headers: {}},
			recipeSchema,
		);
		return result;
	}
	public async createRecipe(
		input: RecipeCreateInput,
	): Promise<ApiResult<Recipe>> {
		const result = await this.sendJson("/recipes", "POST", input, recipeSchema);
		return result;
	}
	public async updateRecipe(
		recipeId: number,
		input: RecipePatchInput,
	): Promise<ApiResult<Recipe>> {
		const result = await this.sendJson(
			`/recipes/${recipeId}`,
			"PUT",
			input,
			recipeSchema,
		);
		return result;
	}
	public async patchRecipe(
		recipeId: number,
		input: RecipePatchInput,
	): Promise<ApiResult<Recipe>> {
		const result = await this.sendJson(
			`/recipes/${recipeId}`,
			"PATCH",
			input,
			recipeSchema,
		);
		return result;
	}
	public async deleteRecipe(
		recipeId: number,
	): Promise<ApiResult<RecipeDeleteResponse>> {
		const result = await this.dispatch(
			`/recipes/${recipeId}`,
			{method: "DELETE", headers: {}},
			recipeDeleteSchema,
		);
		return result;
	}
	public async createRating(
		input: RatingCreateInput,
	): Promise<ApiResult<Rating>> {
		const result = await this.sendJson("/ratings", "POST", input, ratingSchema);
		return result;
	}
	public async listRatings(recipeId: number): Promise<ApiResult<Rating[]>> {
		const result = await this.dispatch(
			`/ratings/recipe/${recipeId}`,
			{method: "GET", headers: {}},
			ratingListSchema,
		);
		return result;
	}
	private async sendJson<Data>(
		path: string,
		method: string,
		payload: unknown,
		schema: z.ZodType<Data>,
	): Promise<ApiResult<Data>> {
		const result = await this.dispatch(
			path,
			{
				method,
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(payload),
			},
			schema,
		);
		return result;
	}
	private success<Data>(data: Data): ApiResult<Data> {
		return {ok: true, data, error: null};
	}
	private failure<Data>(error: ApiError): ApiResult<Data> {
		return {ok: false, data: null, error};
	}
	private extractErrorMessage(payload: unknown, fallback: string): string {
		if (typeof payload === "object" && payload !== null) {
			const data = payload as Record<string, unknown>;
			if (typeof data["detail"] === "string") {
				return data["detail"] as string;
			}
			if (typeof data["message"] === "string") {
				return data["message"] as string;
			}
		} else {
			// non-object payload falls through
		}
		if (typeof payload === "string" && payload.length > 0) {
			return payload;
		} else {
			if (fallback.length > 0) {
				return fallback;
			} else {
				return "Request failed";
			}
		}
	}
	private async parseResponse<Data>(
		response: Response,
		schema: z.ZodType<Data>,
	): Promise<ApiResult<Data>> {
		const parsedText = await response
			.text()
			.then((text) => ({kind: "ok" as const, text}))
			.catch((error) => ({
				kind: "error" as const,
				error: this.failure<Data>({
					status: response.status,
					message: "Failed to read response body",
					details: error,
				}),
			}));
		if (parsedText.kind === "ok") {
			const payload = this.parsePayload(parsedText.text);
			if (response.ok) {
				const parsed = schema.safeParse(payload);
				if (parsed.success) {
					const success = this.success(parsed.data);
					return success;
				} else {
					const failure = this.failure<Data>({
						status: response.status,
						message: "Response validation failed",
						details: parsed.error.flatten(),
					});
					return failure;
				}
			} else {
				const failure = this.failure<Data>({
					status: response.status,
					message: this.extractErrorMessage(payload, response.statusText),
					details: payload,
				});
				return failure;
			}
		} else {
			return parsedText.error;
		}
	}
	private parsePayload(bodyText: string): unknown | null {
		if (bodyText.length > 0) {
			try {
				return JSON.parse(bodyText);
			} catch {
				return bodyText;
			}
		} else {
			return null;
		}
	}
	private async dispatch<Data>(
		path: string,
		init: RequestInit,
		schema: z.ZodType<Data>,
	): Promise<ApiResult<Data>> {
		const url = `${this.baseUrl}/${path}`;
		const fetched = await fetch(url, init)
			.then((response) => ({kind: "ok" as const, response}))
			.catch((error) => ({
				kind: "error" as const,
				error: this.failure<Data>({
					status: 0,
					message: "Network error",
					details: error,
				}),
			}));
		if (fetched.kind === "ok") {
			const parsed = await this.parseResponse(fetched.response, schema);
			return parsed;
		} else {
			return fetched.error;
		}
	}
}
