// @vitest-environment node
import { describe, expect, it } from "vitest"

import type { DocumentationPage } from "./content"
import { type NavigationConfig, buildNavigation } from "./navigation"

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

	it("uses navTitle without changing the page title", () => {
		const api = page("/reference/api", "Acme API reference")
		api.metadata.navTitle = "API"

		expect(buildNavigation([api]).items).toEqual([
			{ label: "API", href: "/reference/api" },
		])
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

	it("resolves ordered sections, nested sidebars and local sequences from stable routes", () => {
		const config: NavigationConfig = {
			sections: [
				{
					label: "API",
					href: "/api",
					order: 2,
					items: [{ label: "API", href: "/api", icon: "◇", badge: "Beta" }],
				},
				{
					label: "Guides",
					href: "/",
					order: 1,
					items: [
						{
							label: "Setup",
							expanded: true,
							items: [
								{ label: "Install", href: "/install", order: 2 },
								{ label: "Home", href: "/", order: 1 },
							],
						},
					],
				},
			],
		}
		const install = page("/install", "Install")
		install.filePath = "/content/renamed.md"
		install.metadata.slug = "install"
		const result = buildNavigation(
			[
				page("/api", "API"),
				install,
				page("/", "Home"),
				page("/omitted", "Omitted"),
			],
			config
		)
		expect(result.sections.map((section) => section.label)).toEqual([
			"Guides",
			"API",
		])
		expect(result.sections[0]?.sequence.map((link) => link.href)).toEqual([
			"/",
			"/install",
		])
		expect(result.sections[1]?.sequence).toEqual([
			{ label: "API", href: "/api", icon: "◇", badge: "Beta" },
		])
		expect(result.sectionByRoute).toEqual({ "/": 0, "/install": 0, "/api": 1 })
		expect(config.sections[0]?.label).toBe("API")
	})

	it.each([
		[
			{
				label: "Missing",
				href: "/missing",
				items: [{ label: "Home", href: "/" }],
			},
			"section landing route",
		],
		[{ label: "Empty", href: "/", items: [] }, "section landing route"],
	])("rejects a section without a published landing link", (section, error) => {
		expect(() =>
			buildNavigation([page("/", "Home")], {
				sections: [section],
			} as NavigationConfig)
		).toThrow(error)
	})

	it("rejects routes belonging to more than one section", () => {
		const section = {
			label: "Guides",
			href: "/" as const,
			items: [{ label: "Home", href: "/" as const }],
		}
		expect(() =>
			buildNavigation([page("/", "Home")], {
				sections: [section, { ...section, label: "API" }],
			})
		).toThrow("Duplicate documentation route")
	})
})
