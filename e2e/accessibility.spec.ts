import { expect, test } from "@playwright/test"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const axePath = require.resolve("axe-core/axe.min.js")
const routes = [
	"/",
	"/docs",
	"/docs/accessibility",
	"/docs/compatibility",
	"/docs/components",
	"/docs/components/dialog",
	"/docs/components/select",
	"/docs/components/tooltip",
	"/docs/foundations",
	"/docs/installation",
	"/docs/patterns",
	"/docs/theming",
]

for (const route of routes) {
	test(`${route} has no automated accessibility violations`, async ({
		page,
	}) => {
		await page.goto(route)
		await page.addScriptTag({ path: axePath })
		const results = await page.evaluate(async () => window.axe.run(document))

		expect(results.violations).toEqual([])
	})
}

test("documentation pages preserve layout and theme state", async ({
	page,
}) => {
	await page.goto("/docs/components/button")
	await expect(
		page.getByRole("heading", { level: 1, name: "Button" })
	).toBeVisible()

	let themeButton = page
		.getByRole("button", {
			name: /switch to dark theme/i,
		})
		.filter({ visible: true })
	if ((await themeButton.count()) === 0) {
		await page.getByRole("button", { name: "Open menu" }).click()
		themeButton = page
			.getByRole("button", { name: /switch to dark theme/i })
			.filter({ visible: true })
	}
	await themeButton.click()
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
	const overflow = await page.evaluate(
		() =>
			document.documentElement.scrollWidth >
			document.documentElement.clientWidth
	)
	expect(overflow).toBe(false)
})

test("dialog traps focus, closes with Escape, and restores focus", async ({
	page,
}) => {
	await page.goto("/docs/components/dialog")
	const trigger = page.getByRole("button", { name: "Edit profile" })
	await trigger.click()
	await expect(page.getByRole("dialog", { name: "Edit profile" })).toBeVisible()
	await page.keyboard.press("Escape")
	await expect(page.getByRole("dialog", { name: "Edit profile" })).toBeHidden()
	await expect(trigger).toBeFocused()
})

test("tooltip is available from the keyboard", async ({ page }) => {
	await page.goto("/docs/components/tooltip")
	const trigger = page.getByRole("button", { name: "Copy command" })
	await trigger.focus()
	await expect(page.getByRole("tooltip")).toContainText(
		"Copy the pnpm install command"
	)
})

declare global {
	interface Window {
		axe: typeof import("axe-core")
	}
}
