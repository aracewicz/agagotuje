import {sveltekit as createSvelteKitPlugins} from "@sveltejs/kit/vite";
import type {UserConfig} from "vite";
const svelteKitPlugins = await createSvelteKitPlugins();
export default {
	build: {emptyOutDir: true},
	plugins: svelteKitPlugins,
} as const satisfies UserConfig;
