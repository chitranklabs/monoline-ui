import { describe, expect, it } from "vitest"

import metadataJson from "../../src/metadata.json"
import {
	componentPath,
	componentSlugs,
	legacyRedirects,
	routes,
	siteRoutes,
} from "./routes"

describe("route registry", () => {
	it("matches the component package metadata", () => {
		expect(componentSlugs).toEqual(metadataJson.components)
		expect(componentSlugs.map(componentPath)).toEqual(
			metadataJson.components.map((slug) => `/docs/components/${slug}`)
		)
	})

	it("contains unique canonical routes", () => {
		expect(new Set(siteRoutes).size).toBe(siteRoutes.length)
		expect(siteRoutes).toContain(routes.docs.components.root)
		expect(siteRoutes).toContain(routes.docs.foundations.root)
	})

	it("redirects only legacy routes to registered canonical routes", () => {
		const canonicalRoutes = new Set(siteRoutes)
		const sources = legacyRedirects.map(({ source }) => source)

		expect(new Set(sources).size).toBe(sources.length)
		for (const redirect of legacyRedirects) {
			expect(canonicalRoutes.has(redirect.source)).toBe(false)
			expect(canonicalRoutes.has(redirect.destination)).toBe(true)
			expect(redirect.permanent).toBe(true)
		}
	})
})
