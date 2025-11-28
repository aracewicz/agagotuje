import {z} from "zod";
export type ApiError = {readonly message: string; readonly body: unknown};
export type ApiSuccess<T> = {
	readonly success: true;
	readonly status: number;
	readonly data: T;
};
export type ApiFailure = {
	readonly success: false;
	readonly status: number;
	readonly error: ApiError;
};
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
const TokenSchema = z
	.strictObject({
		access_token: z.string().nonempty(),
		token_type: z.string().nonempty(),
	})
	.readonly();
const UserSchema = z
	.strictObject({
		id: z.number().int().nonnegative(),
		email: z.string().email().nonempty(),
		username: z.string().nonempty(),
	})
	.readonly();
const CategorySchema = z
	.strictObject({
		id: z.number().int().nonnegative(),
		name: z.string().nonempty(),
	})
	.readonly();
const RecipeSchema = z
	.strictObject({
		id: z.number().int().nonnegative(),
		title: z.string().nonempty(),
		ingredients: z.array(z.string().nonempty()).readonly(),
		description: z.string().nonempty(),
		steps: z.array(z.string().nonempty()).readonly(),
		time_minutes: z.number(),
		owner_id: z.number().int().nonnegative(),
		image_url: z.url(),
	})
	.readonly();
export type Recipe = z.infer<typeof RecipeSchema>;
const RatingSchema = z
	.strictObject({
		id: z.number().int().nonnegative(),
		score: z.number(),
		recipe_id: z.number().int().nonnegative(),
		user_id: z.number().int().nonnegative(),
	})
	.readonly();
const DetailSchema = z.strictObject({detail: z.string().nonempty()}).readonly();
const CategoryListSchema = z.array(CategorySchema).readonly();
const RecipeListSchema = z.array(RecipeSchema).readonly();
export type RecipeList = z.infer<typeof RecipeListSchema>;
const RatingListSchema = z.array(RatingSchema).readonly();
export type RegisterPayload = {
	readonly email: string;
	readonly username: string;
	readonly password: string;
};
export type LoginPayload = {readonly email: string; readonly password: string};
export type CategoryPayload = {readonly name: string};
export type RecipePayload = {
	readonly title: string;
	readonly ingredients: readonly string[];
	readonly description: string;
	readonly steps: readonly string[];
	readonly time_minutes: number;
};
export type RecipeUpdatePayload = {
	readonly title: string | null;
	readonly description: string | null;
};
export type RatingPayload = {
	readonly score: number;
	readonly recipe_id: number;
};
export type CreateUserPayload = {
	readonly email: string;
	readonly username: string;
	readonly password: string;
};
export class ApiClient {
	private readonly baseUrl: string;
	public constructor(baseUrl: string) {
		this.baseUrl = baseUrl.replace(/\/+$/, "");
	}
	private buildUrl(path: string): string {
		const normalized = path.startsWith("/") ? path : `/${path}`;
		const url = `${this.baseUrl}${normalized}`;
		return url;
	}
	private buildBaseHeaders(): Record<string, string> {
		const headers: Record<string, string> = {Accept: "application/json"};
		return headers;
	}
	private buildJsonHeaders(): Record<string, string> {
		const headers = this.buildBaseHeaders();
		headers["Content-Type"] = "application/json";
		return headers;
	}
	private buildFormHeaders(): Record<string, string> {
		const headers = this.buildBaseHeaders();
		headers["Content-Type"] = "application/x-www-form-urlencoded";
		return headers;
	}
	private failure(status: number, message: string, body: unknown): ApiFailure {
		const result: ApiFailure = {success: false, status, error: {message, body}};
		return result;
	}
	private success<T>(status: number, data: T): ApiSuccess<T> {
		const result: ApiSuccess<T> = {success: true, status, data};
		return result;
	}
	private async parseBody(response: Response): Promise<unknown> {
		const text = await response.text();
		if (text.length === 0) {
			const empty = null;
			return empty;
		}
		try {
			const parsed = JSON.parse(text);
			return parsed;
		} catch {
			const fallback = text;
			return fallback;
		}
	}
	private async send<S extends z.ZodTypeAny>(
		path: string,
		method: string,
		init: RequestInit,
		schema: S,
	): Promise<ApiResponse<z.infer<S>>> {
		try {
			const requestInit: RequestInit = {...init, method};
			const response = await fetch(this.buildUrl(path), requestInit);
			const parsed = await this.parseBody(response);
			if (!response.ok) {
				const failureResponse = this.failure(
					response.status,
					response.statusText.length > 0 ?
						response.statusText
					:	"Request failed",
					parsed,
				);
				return failureResponse;
			}
			const validated = schema.safeParse(parsed);
			if (!validated.success) {
				const invalidResponse = this.failure(
					response.status,
					"Response validation failed",
					parsed,
				);
				return invalidResponse;
			}
			const successResponse = this.success(response.status, validated.data);
			return successResponse;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Unknown error";
			const failureResponse = this.failure(0, message, null);
			return failureResponse;
		}
	}
	private async sendWithJsonBody<S extends z.ZodTypeAny>(
		path: string,
		method: string,
		body: unknown,
		schema: S,
	): Promise<ApiResponse<z.infer<S>>> {
		return this.send(
			path,
			method,
			{headers: this.buildJsonHeaders(), body: JSON.stringify(body)},
			schema,
		);
	}
	private async sendWithFormBody<S extends z.ZodTypeAny>(
		path: string,
		method: string,
		body: URLSearchParams,
		schema: S,
	): Promise<ApiResponse<z.infer<S>>> {
		return this.send(
			path,
			method,
			{headers: this.buildFormHeaders(), body},
			schema,
		);
	}
	private async sendWithoutBody<S extends z.ZodTypeAny>(
		path: string,
		method: string,
		schema: S,
	): Promise<ApiResponse<z.infer<S>>> {
		return this.send(path, method, {headers: this.buildBaseHeaders()}, schema);
	}
	public async registerUser(
		payload: RegisterPayload,
	): Promise<ApiResponse<z.infer<typeof UserSchema>>> {
		const response = await this.sendWithJsonBody(
			"/auth/register",
			"POST",
			payload,
			UserSchema,
		);
		return response;
	}
	public async login(
		payload: LoginPayload,
	): Promise<ApiResponse<z.infer<typeof TokenSchema>>> {
		const form = new URLSearchParams();
		form.set("username", payload.email);
		form.set("password", payload.password);
		const response = await this.sendWithFormBody(
			"/auth/login",
			"POST",
			form,
			TokenSchema,
		);
		return response;
	}
	public async listCategories(): Promise<
		ApiResponse<z.infer<typeof CategoryListSchema>>
	> {
		const response = await this.sendWithoutBody(
			"/categories",
			"GET",
			CategoryListSchema,
		);
		return response;
	}
	public async getCategory(
		categoryId: number,
	): Promise<ApiResponse<z.infer<typeof CategorySchema>>> {
		const categoryIdPath = categoryId.toString(10);
		const response = await this.sendWithoutBody(
			`/categories/${categoryIdPath}`,
			"GET",
			CategorySchema,
		);
		return response;
	}
	public async createCategory(
		payload: CategoryPayload,
	): Promise<ApiResponse<z.infer<typeof CategorySchema>>> {
		const response = await this.sendWithJsonBody(
			"/categories",
			"POST",
			payload,
			CategorySchema,
		);
		return response;
	}
	public async deleteCategory(
		categoryId: number,
	): Promise<ApiResponse<z.infer<typeof DetailSchema>>> {
		const categoryIdPath = categoryId.toString(10);
		const response = await this.sendWithoutBody(
			`/categories/${categoryIdPath}`,
			"DELETE",
			DetailSchema,
		);
		return response;
	}
	public async listRecipes(): Promise<
		ApiResponse<z.infer<typeof RecipeListSchema>>
	> {
		const response = await this.sendWithoutBody(
			"/recipes",
			"GET",
			RecipeListSchema,
		);
		return response;
	}
	public async getRecipe(
		recipeId: number,
	): Promise<ApiResponse<z.infer<typeof RecipeSchema>>> {
		const recipeIdPath = recipeId.toString(10);
		const response = await this.sendWithoutBody(
			`/recipes/${recipeIdPath}`,
			"GET",
			RecipeSchema,
		);
		return response;
	}
	public async createRecipe(
		payload: RecipePayload,
	): Promise<ApiResponse<z.infer<typeof RecipeSchema>>> {
		const response = await this.sendWithJsonBody(
			"/recipes",
			"POST",
			payload,
			RecipeSchema,
		);
		return response;
	}
	public async putRecipe(
		recipeId: number,
		payload: RecipeUpdatePayload,
	): Promise<ApiResponse<z.infer<typeof RecipeSchema>>> {
		const recipeIdPath = recipeId.toString(10);
		const response = await this.sendWithJsonBody(
			`/recipes/${recipeIdPath}`,
			"PUT",
			payload,
			RecipeSchema,
		);
		return response;
	}
	public async patchRecipe(
		recipeId: number,
		payload: RecipeUpdatePayload,
	): Promise<ApiResponse<z.infer<typeof RecipeSchema>>> {
		const recipeIdPath = recipeId.toString(10);
		const response = await this.sendWithJsonBody(
			`/recipes/${recipeIdPath}`,
			"PATCH",
			payload,
			RecipeSchema,
		);
		return response;
	}
	public async deleteRecipe(
		recipeId: number,
	): Promise<ApiResponse<z.infer<typeof DetailSchema>>> {
		const recipeIdPath = recipeId.toString(10);
		const response = await this.sendWithoutBody(
			`/recipes/${recipeIdPath}`,
			"DELETE",
			DetailSchema,
		);
		return response;
	}
	public async createRating(
		payload: RatingPayload,
	): Promise<ApiResponse<z.infer<typeof RatingSchema>>> {
		const response = await this.sendWithJsonBody(
			"/ratings",
			"POST",
			payload,
			RatingSchema,
		);
		return response;
	}
	public async listRatingsForRecipe(
		recipeId: number,
	): Promise<ApiResponse<z.infer<typeof RatingListSchema>>> {
		const recipeIdPath = recipeId.toString(10);
		const response = await this.sendWithoutBody(
			`/ratings/recipe/${recipeIdPath}`,
			"GET",
			RatingListSchema,
		);
		return response;
	}
	public async createUser(
		payload: CreateUserPayload,
	): Promise<ApiResponse<z.infer<typeof UserSchema>>> {
		const response = await this.sendWithJsonBody(
			"/users",
			"POST",
			payload,
			UserSchema,
		);
		return response;
	}
	public async getUser(
		userId: number,
	): Promise<ApiResponse<z.infer<typeof UserSchema>>> {
		const userIdPath = userId.toString(10);
		const response = await this.sendWithoutBody(
			`/users/${userIdPath}`,
			"GET",
			UserSchema,
		);
		return response;
	}
}
