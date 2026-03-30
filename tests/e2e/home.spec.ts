import { expect, test } from "@playwright/test"

test("homepage renders core Foundry UI content", async ({ page }) => {
	await page.goto("/")

	await expect(
		page.getByRole("heading", {
			name: /a blueprint for interface decisions, not just a component dump/i,
		})
	).toBeVisible()

	await expect(
		page.getByRole("heading", {
			name: /accent palettes/i,
		})
	).toBeVisible()
	await expect(
		page.getByRole("heading", {
			name: /component lab/i,
		})
	).toBeVisible()
})
