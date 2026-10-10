import { defineConfig } from "@playwright/test"

export default defineConfig({
	testDir: ".",
	testMatch: "docs.spec.ts",
	workers: 1,
	retries: 0,
	forbidOnly: Boolean(process.env.CI),
	updateSnapshots: "none",
	snapshotPathTemplate: "{testDir}/baselines/{platform}/{arg}{ext}",
	outputDir: `../../../test-results/docs-visual/${process.platform}`,
	reporter: "list",
	expect: {
		toHaveScreenshot: {
			animations: "disabled",
			caret: "hide",
			maxDiffPixels: 100,
			threshold: 0.15,
		},
	},
	use: {
		browserName: "chromium",
		reducedMotion: "reduce",
		locale: "en-US",
		timezoneId: "UTC",
		deviceScaleFactor: 1,
		trace: "retain-on-failure",
	},
})
