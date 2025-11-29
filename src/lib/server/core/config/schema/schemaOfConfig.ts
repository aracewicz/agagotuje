import {z} from "zod";
import type {Config} from "../Config.ts";
export const schemaOfConfig = z.object({}).transform((env): Config => {
	return {api: {baseUrl: "http://172.17.0.1:8000"}};
});
