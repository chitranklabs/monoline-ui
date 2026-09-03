import { resolve } from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		environment: "jsdom",
		include: ["src/**/*.test.{ts,tsx}", "app/**/*.test.{ts,tsx}"],
		setupFiles: ["src/test-setup.ts"],
		css: true,
	},
	resolve: {
		alias: {
			"@chitrank2050/monoline-ui/lib": resolve(
				import.meta.dirname,
				"./src/lib"
			),
			"@chitrank2050/monoline-ui/components": resolve(
				import.meta.dirname,
				"./src/components"
			),
			"@chitrank2050/monoline-ui/foundations": resolve(
				import.meta.dirname,
				"./src/foundations"
			),
			"@chitrank2050/monoline-ui": resolve(
				import.meta.dirname,
				"./src/index.ts"
			),
		},
	},
})
