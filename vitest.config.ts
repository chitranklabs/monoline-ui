import { resolve } from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		environment: "jsdom",
		include: ["src/**/*.test.{ts,tsx}"],
		setupFiles: ["src/test-setup.ts"],
		css: true,
	},
	resolve: {
		alias: {
			"@chitrank2050/monoline-ui/lib": resolve(__dirname, "./src/lib"),
			"@chitrank2050/monoline-ui/components": resolve(
				__dirname,
				"./src/components"
			),
			"@chitrank2050/monoline-ui/foundations": resolve(
				__dirname,
				"./src/foundations"
			),
			"@chitrank2050/monoline-ui": resolve(__dirname, "./src/index.ts"),
		},
	},
})
