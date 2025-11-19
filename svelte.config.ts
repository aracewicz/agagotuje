import createNodeAdapter from "@sveltejs/adapter-node";
import type {Config} from "@sveltejs/kit";
const nodeAdapter = createNodeAdapter();
export default {
	kit: {
		adapter: nodeAdapter,
		csrf: {trustedOrigins: []},
		env: {dir: "."},
		paths: {assets: "", base: "", relative: false},
	},
	compilerOptions: {runes: true},
} as const satisfies Config;
