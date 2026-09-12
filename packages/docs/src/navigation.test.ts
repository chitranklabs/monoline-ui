// @vitest-environment node
import { describe, expect, it } from "vitest"

import type { DocumentationPage } from "./content"
import { buildNavigation } from "./navigation"

function page(
	route: `/${string}`,
	title: string,
	order?: number
): DocumentationPage {
	return {
		filePath: `/content${route === "/" ? "/index" : route}.md`,
		format: "md",
		metadata: { title, ...(order === undefined ? {} : { order }) },
		route,
		source: "",
	}
}

describe("buildNavigation", () => {
	it("orders generated navigation by order and then route", () => {
		const result = buildNavigation([
			page("/reference", "Reference"),
			page("/install", "Installation", 2),
			page("/", "Introduction", 1),
		])

		expect(result.items).toEqual([
			{ label: "Introduction", href: "/" },
			{ label: "Installation", href: "/install" },
			{ label: "Reference", href: "/reference" },
		])
		expect(result.sequence).toEqual(result.items)
	})

	it("preserves explicit groups and uses their links for page order", () => {
		const result = buildNavigation(
			[
				page("/", "Introduction"),
				page("/install", "Installation"),
				page("/internal", "Internal"),
			],
			[
				{ label: "Introduction", href: "/" },
				{
					label: "Guides",
					items: [{ label: "Installation", href: "/install" }],
				},
			]
		)

		expect(result.items).toEqual([
			{ label: "Introduction", href: "/" },
			{
				label: "Guides",
				items: [{ label: "Installation", href: "/install" }],
			},
		])
		expect(result.sequence).toEqual([
			{ label: "Introduction", href: "/" },
			{ label: "Installation", href: "/install" },
		])
	})

	it("rejects configured links to unknown pages", () => {
		expect(() =>
			buildNavigation(
				[page("/", "Introduction")],
				[{ label: "Missing", href: "/missing" }]
			)
		).toThrow('Unknown documentation route "/missing" in navigation')
	})

	it("rejects duplicate configured links", () => {
		expect(() =>
			buildNavigation(
				[page("/", "Introduction")],
				[
					{ label: "Introduction", href: "/" },
					{ label: "Introduction again", href: "/" },
				]
			)
		).toThrow('Duplicate documentation route "/" in navigation')
	})
})
