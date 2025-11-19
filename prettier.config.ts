import type {Config} from "prettier";
export default {
	arrowParens: "always",
	bracketSpacing: false,
	endOfLine: "lf",
	experimentalOperatorPosition: "start",
	experimentalTernaries: true,
	objectWrap: "collapse",
	overrides: [],
	plugins: ["prettier-plugin-svelte"],
	printWidth: 80,
	quoteProps: "preserve",
	semi: true,
	singleQuote: false,
	trailingComma: "all",
	useTabs: true,
} as const satisfies Config;
