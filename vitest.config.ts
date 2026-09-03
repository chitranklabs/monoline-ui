import { resolve } from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		environment: "jsdom",
		include: [
			"packages/ui/src/**/*.test.{ts,tsx}",
			"apps/website/app/**/*.test.{ts,tsx}",
		],
		setupFiles: ["packages/ui/src/test-setup.ts"],
		css: true,
	},
	resolve: {
		alias: {
			"@": resolve(import.meta.dirname, "./apps/website/app"),
		},
	},
})
