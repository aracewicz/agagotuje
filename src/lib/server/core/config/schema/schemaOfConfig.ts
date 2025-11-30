import {z} from "zod";
import type {Config} from "../Config.ts";
export const schemaOfConfig = z.object({}).transform((env): Config => {
	return {api: {baseUrl: "http://localhost:8000"}};
});
