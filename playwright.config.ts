import { defineConfig, devices } from "@playwright/test"

const externalServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER === "1"
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://127.0.0.1:3200"

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
	use: {
		baseURL,
		screenshot: "only-on-failure",
		trace: "retain-on-failure",
		video: "retain-on-failure",
	},
	webServer: externalServer
		? undefined
		: {
				command:
					"pnpm build:lib && pnpm --filter @monoline/website exec next dev --hostname 127.0.0.1 --port 3200",
				url: baseURL,
				reuseExistingServer: !process.env.CI,
				timeout: 120_000,
			},
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
		{ name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
	],
})
