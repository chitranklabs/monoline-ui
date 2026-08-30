import { describe, expect, it } from "vitest"

import metadata from "../../src/metadata.json"
import { componentGuidance, componentSlugs } from "./component-guidance"

describe("componentGuidance", () => {
	it("covers every public component reference exactly once", () => {
		expect([...componentSlugs].sort()).toEqual([...metadata.components].sort())
		expect(Object.keys(componentGuidance).sort()).toEqual(
			[...metadata.components].sort()
		)
	})

	it("links only to documented related components", () => {
		const knownSlugs = new Set(componentSlugs)
		for (const guidance of Object.values(componentGuidance)) {
			expect(guidance.whenToUse.length).toBeGreaterThan(30)
			expect(guidance.whenToAvoid.length).toBeGreaterThan(30)
			expect(guidance.accessibility.length).toBeGreaterThan(30)
			expect(guidance.related).toHaveLength(2)
			for (const relatedSlug of guidance.related) {
				expect(knownSlugs.has(relatedSlug)).toBe(true)
			}
		}
	})
})
