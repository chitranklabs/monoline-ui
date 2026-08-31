import js from "@eslint/js"
import jsxA11y from "eslint-plugin-jsx-a11y"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
	{
		ignores: [
			"**/.next/**",
			"**/.turbo/**",
			"**/dist/**",
			"**/dist-playground/**",
			"**/coverage/**",
			"**/node_modules/**",
			"**/.tmp*/**",
			"**/.tmp-*/**",
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	jsxA11y.flatConfigs.recommended,
	{
		files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ["**/*.{ts,tsx,mts,cts}"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
			],
		},
	}
)
