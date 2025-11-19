import type {Config} from "prettier";
export default {
	arrowParens: "always",
	bracketSpacing: false,
	endOfLine: "lf",
	experimentalOperatorPosition: "start",
	experimentalTernaries: true,
	objectWrap: "collapse",
	overrides: [],
	plugins: [],
	printWidth: 80,
	quoteProps: "preserve",
	semi: true,
	singleQuote: false,
	trailingComma: "all",
	useTabs: true,
} as const satisfies Config;
