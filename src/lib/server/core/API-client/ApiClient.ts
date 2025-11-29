import {z} from "zod";
export type ApiError = {readonly message: string; readonly body: unknown};
export type ApiSuccess<DataType> = {
	readonly success: true;
	readonly status: number;
	readonly data: DataType;
};
export type ApiFailure = {
	readonly success: false;
	readonly status: number;
	readonly error: ApiError;
};
export type ApiResponse<DataType> = ApiSuccess<DataType> | ApiFailure;
const schemaOfToken = z
	.strictObject({
		access_token: z.string().nonempty(),
		token_type: z.string().nonempty(),
	})
	.readonly();
const schemaOfUser = z
	.strictObject({
		id: z.number().int().nonnegative(),
		email: z.string().email().nonempty(),
		username: z.string().nonempty(),
	})
	.readonly();
const schemaOfCategory = z
	.strictObject({
		id: z.number().int().nonnegative(),
		name: z.string().nonempty(),
	})
	.readonly();
const schemaOfRecipe = z
	.strictObject({
		id: z.number().int().nonnegative(),
		title: z.string().nonempty(),
		description: z.string().nonempty(),
		author_id: z.number().int().nonnegative(),
		image_url: z.string().url().optional(),
	})
	.readonly();
export type Recipe = z.infer<typeof schemaOfRecipe>;
const schemaOfRating = z
	.strictObject({
		id: z.number().int().nonnegative(),
		value: z.number(),
		recipe_id: z.number().int().nonnegative(),
		user_id: z.number().int().nonnegative(),
	})
	.readonly();
const schemaOfDetail = z
	.strictObject({detail: z.string().nonempty()})
	.readonly();
const schemaOfCategoryList = z.array(schemaOfCategory).readonly();
const schemaOfRecipeList = z.array(schemaOfRecipe).readonly();
export type RecipeList = z.infer<typeof schemaOfRecipeList>;
const schemaOfRatingList = z.array(schemaOfRating).readonly();
export type RegisterPayload = {
	readonly email: string;
	readonly username: string;
	readonly password: string;
};
export type LoginPayload = {readonly email: string; readonly password: string};
export type CategoryPayload = {readonly name: string};
export type RecipePayload = {
	readonly title: string;
	readonly description: string;
	readonly image?: File | null;
};
export type RecipeUpdatePayload = {
	readonly title: string | null;
	readonly description: string | null;
};
export type RatingPayload = {
	readonly value: number;
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
		const n = path.startsWith("/") ? path : `/${path}`;
		return `${this.baseUrl}${n}`;
	}
	private buildBaseHeaders(): Record<string, string> {
		return {Accept: "application/json"};
	}
	private buildJsonHeaders(): Record<string, string> {
		return {Accept: "application/json", "Content-Type": "application/json"};
	}
	private buildFormHeaders(): Record<string, string> {
		return {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
		};
	}
	private buildAuthHeaders(token: string): Record<string, string> {
		return {Accept: "application/json", Authorization: `Bearer ${token}`};
	}
	private buildJsonAuthHeaders(token: string): Record<string, string> {
		return {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		};
	}
	private buildFormAuthHeaders(token: string): Record<string, string> {
		return {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Bearer ${token}`,
		};
	}
	private failure(status: number, message: string, body: unknown): ApiFailure {
		return {success: false, status, error: {message, body}};
	}
	private success<DataType>(
		status: number,
		data: DataType,
	): ApiSuccess<DataType> {
		return {success: true, status, data};
	}
	private async parseBody(r: Response): Promise<unknown> {
		const t = await r.text();
		if (t.length === 0) return null;
		try {
			return JSON.parse(t);
		} catch {
			return t;
		}
	}
	private async send<SchemaType extends z.ZodTypeAny>(
		path: string,
		method: string,
		init: RequestInit,
		schema: SchemaType,
	) {
		try {
			const rr: RequestInit = {...init, method};
			const res = await fetch(this.buildUrl(path), rr);
			const parsed = await this.parseBody(res);
			if (!res.ok)
				return this.failure(
					res.status,
					res.statusText || "Request failed",
					parsed,
				);
			const val = schema.safeParse(parsed);
			if (!val.success)
				return this.failure(res.status, "Response validation failed", parsed);
			return this.success(res.status, val.data);
		} catch (e) {
			return this.failure(
				0,
				e instanceof Error ? e.message : "Unknown error",
				null,
			);
		}
	}
	private async sendAuth<SchemaType extends z.ZodTypeAny>(
		path: string,
		method: string,
		init: RequestInit,
		schema: SchemaType,
		token: string,
	) {
		try {
			const rr: RequestInit = {
				...init,
				method,
				headers: {...(init.headers ?? {}), Authorization: `Bearer ${token}`},
			};
			const res = await fetch(this.buildUrl(path), rr);
			const parsed = await this.parseBody(res);
			if (!res.ok)
				return this.failure(
					res.status,
					res.statusText || "Request failed",
					parsed,
				);
			const val = schema.safeParse(parsed);
			if (!val.success)
				return this.failure(res.status, "Response validation failed", parsed);
			return this.success(res.status, val.data);
		} catch (e) {
			return this.failure(
				0,
				e instanceof Error ? e.message : "Unknown error",
				null,
			);
		}
	}
	private async sendWithJsonBody<SchemaType extends z.ZodTypeAny>(
		path: string,
		method: string,
		body: unknown,
		schema: SchemaType,
	) {
		return this.send(
			path,
			method,
			{headers: this.buildJsonHeaders(), body: JSON.stringify(body)},
			schema,
		);
	}
	private async sendWithJsonBodyAuth<SchemaType extends z.ZodTypeAny>(
		path: string,
		method: string,
		body: unknown,
		schema: SchemaType,
		token: string,
	) {
		return this.sendAuth(
			path,
			method,
			{headers: this.buildJsonAuthHeaders(token), body: JSON.stringify(body)},
			schema,
			token,
		);
	}
	private async sendWithFormBody<SchemaType extends z.ZodTypeAny>(
		path: string,
		method: string,
		body: URLSearchParams,
		schema: SchemaType,
	) {
		return this.send(
			path,
			method,
			{headers: this.buildFormHeaders(), body},
			schema,
		);
	}
	private async sendWithFormBodyAuth<SchemaType extends z.ZodTypeAny>(
		path: string,
		method: string,
		body: URLSearchParams,
		schema: SchemaType,
		token: string,
	) {
		return this.sendAuth(
			path,
			method,
			{headers: this.buildFormAuthHeaders(token), body},
			schema,
			token,
		);
	}
	private async sendWithoutBody<SchemaType extends z.ZodTypeAny>(
		path: string,
		method: string,
		schema: SchemaType,
	) {
		return this.send(path, method, {headers: this.buildBaseHeaders()}, schema);
	}
	private async sendWithoutBodyAuth<SchemaType extends z.ZodTypeAny>(
		path: string,
		method: string,
		schema: SchemaType,
		token: string,
	) {
		return this.sendAuth(
			path,
			method,
			{headers: this.buildAuthHeaders(token)},
			schema,
			token,
		);
	}
	public async registerUser(payload: RegisterPayload) {
		const result = this.sendWithJsonBody(
			"/auth/register",
			"POST",
			payload,
			schemaOfUser,
		);
		return result;
	}
	public async login(payload: LoginPayload) {
		const f = new URLSearchParams();
		f.set("username", payload.email);
		f.set("password", payload.password);
		const result = this.sendWithFormBody(
			"/auth/login",
			"POST",
			f,
			schemaOfToken,
		);
		return result;
	}
	public async listCategories() {
		const result = this.sendWithoutBody(
			"/categories",
			"GET",
			schemaOfCategoryList,
		);
		return result;
	}
	public async getCategory(id: number) {
		const categoryIdStr = id.toString(10);
		const result = this.sendWithoutBody(
			`/categories/${categoryIdStr}`,
			"GET",
			schemaOfCategory,
		);
		return result;
	}
	public async createCategory(payload: CategoryPayload, token: string) {
		const result = this.sendWithJsonBodyAuth(
			"/categories",
			"POST",
			payload,
			schemaOfCategory,
			token,
		);
		return result;
	}
	public async deleteCategory(id: number, token: string) {
		const categoryIdStr = id.toString(10);
		const result = this.sendWithoutBodyAuth(
			`/categories/${categoryIdStr}`,
			"DELETE",
			schemaOfDetail,
			token,
		);
		return result;
	}
	public async listRecipes() {
		const result = this.sendWithoutBody("/recipes", "GET", schemaOfRecipeList);
		return result;
	}
	public async getRecipe(id: number) {
		const recipeIdStr = id.toString(10);
		const result = this.sendWithoutBody(
			`/recipes/${recipeIdStr}`,
			"GET",
			schemaOfRecipe,
		);
		return result;
	}
	public async createRecipe(payload: RecipePayload, token: string) {
		const fd = new FormData();
		fd.append("title", payload.title);
		fd.append("description", payload.description);
		if (payload.image) fd.append("image", payload.image);
		const result = this.sendAuth(
			"/recipes",
			"POST",
			{body: fd},
			schemaOfRecipe,
			token,
		);
		return result;
	}
	public async putRecipe(
		id: number,
		payload: RecipeUpdatePayload,
		token: string,
	) {
		const recipeIdStr = id.toString(10);
		const result = this.sendWithJsonBodyAuth(
			`/recipes/${recipeIdStr}`,
			"PUT",
			payload,
			schemaOfRecipe,
			token,
		);
		return result;
	}
	public async patchRecipe(
		id: number,
		payload: RecipeUpdatePayload,
		token: string,
	) {
		const recipeIdStr = id.toString(10);
		const result = this.sendWithJsonBodyAuth(
			`/recipes/${recipeIdStr}`,
			"PATCH",
			payload,
			schemaOfRecipe,
			token,
		);
		return result;
	}
	public async deleteRecipe(id: number, token: string) {
		const recipeIdStr = id.toString(10);
		const result = this.sendWithoutBodyAuth(
			`/recipes/${recipeIdStr}`,
			"DELETE",
			schemaOfDetail,
			token,
		);
		return result;
	}
	public async createRating(payload: RatingPayload, token: string) {
		const result = this.sendWithJsonBodyAuth(
			"/ratings",
			"POST",
			payload,
			schemaOfRating,
			token,
		);
		return result;
	}
	public async listRatingsForRecipe(id: number) {
		const recipeIdStr = id.toString(10);
		const result = this.sendWithoutBody(
			`/ratings/recipe/${recipeIdStr}`,
			"GET",
			schemaOfRatingList,
		);
		return result;
	}
	public async createUser(payload: CreateUserPayload) {
		const result = this.sendWithJsonBody(
			"/users",
			"POST",
			payload,
			schemaOfUser,
		);
		return result;
	}
	public async getUser(id: number) {
		const userIdStr = id.toString(10);
		const result = this.sendWithoutBody(
			`/users/${userIdStr}`,
			"GET",
			schemaOfUser,
		);
		return result;
	}
}
