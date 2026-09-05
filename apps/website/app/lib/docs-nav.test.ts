import { describe, expect, it } from "vitest"

import metadata from "@/lib/catalog.json"

import { componentsNav, foundationsSidebarNav, sectionsNav } from "./docs-nav"
import { routes } from "./routes"

function expectAlphabetical(items: readonly { label: string }[]) {
	const labels = items.map((item) => item.label)
	const sortedLabels = [...labels].sort((left, right) =>
		left.localeCompare(right, "en", { sensitivity: "base" })
	)

	expect(labels).toEqual(sortedLabels)
}

describe("docs sidebar navigation", () => {
	it("lists component pages alphabetically without duplicating the overview", () => {
		const hrefs = componentsNav.map((item) => item.href)

		expect(componentsNav).toHaveLength(metadata.count)
		expect(hrefs).not.toContain(routes.docs.components.root)
		expect(new Set(hrefs).size).toBe(hrefs.length)
		expectAlphabetical(componentsNav)
	})

	it("keeps general documentation in its reading order", () => {
		const hrefs = sectionsNav.map((item) => item.href)

		expect(hrefs).toContain(routes.docs.root)
		expect(hrefs).toContain(routes.docs.changelog)
		expect(
			hrefs.filter((href) => href?.startsWith("/docs/foundations"))
		).toEqual([routes.docs.foundations.root])
		expect(
			hrefs.filter((href) => href?.startsWith("/docs/components"))
		).toEqual([routes.docs.components.root])
		expect(sectionsNav.map((item) => item.label)).toEqual([
			"Introduction",
			"Installation",
			"Foundation",
			"Components",
			"Accessibility",
			"Theming",
			"Compatibility",
			"Patterns",
			"Changelog",
		])
		expect(hrefs).toContain(routes.docs.foundations.root)
		expect(hrefs).toContain(routes.docs.components.root)
	})

	it("lists foundation pages alphabetically without duplicating the overview", () => {
		const hrefs = foundationsSidebarNav.map((item) => item.href)

		expect(hrefs).not.toContain(routes.docs.foundations.root)
		expect(hrefs.every((href) => href?.startsWith("/docs/foundations"))).toBe(
			true
		)
		expectAlphabetical(foundationsSidebarNav)
	})
})
