import type {User} from "../lib/server/core/API-client/ApiClient.ts";
export type LayoutData = {
	readonly user: User | null;
	readonly userError: string | null;
};
export async function load({cookies}): Promise<LayoutData> {
	const token = cookies.get("auth_token");
	const {apiClient: apiClient} = await import(
		"../lib/server/instances/API-client/apiClient.ts"
	);
	// TODO: BRAK METODY!
	return {user: null, userError: null};
}
