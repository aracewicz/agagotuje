import {env} from "$env/dynamic/private";
import {z} from "zod";
import {schemaOfConfig} from "../../core/config/schema/schemaOfConfig.ts";
import type {Config} from "../../core/config/Config.ts";
const resultOfParsing = schemaOfConfig.safeParse(env);
if (!resultOfParsing.success) {
	console.error(
		`An error occurred while loading the config from the environment variables:
${z.prettifyError(resultOfParsing.error)}`,
	);
	process.exit(1);
}
export const config: Config = resultOfParsing.data;
