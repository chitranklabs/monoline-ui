import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
	testDir: "./tests/e2e",
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
	},
	webServer: {
		command: "pnpm --filter @foundry/docs dev",
		port: 3000,
		reuseExistingServer: !process.env.CI,
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
})
