import {z} from "zod";
import type {Config} from "../Config.ts";
export const schemaOfConfig = z
	.object({API__BASE_URL: z.url()})
	.transform((env): Config => {
		return {api: {baseUrl: env.API__BASE_URL}};
	});
