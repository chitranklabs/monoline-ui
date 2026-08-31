import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
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

	it("matches the client boundaries declared by component source", async () => {
		const sourceClientComponents = []

		for (const slug of componentSlugs) {
			const componentDirectory = path.join(
				process.cwd(),
				"src",
				"components",
				slug
			)
			const files = await readdir(componentDirectory, { withFileTypes: true })
			const sources = await Promise.all(
				files
					.filter((file) => file.isFile() && /\.[cm]?[jt]sx?$/.test(file.name))
					.map((file) =>
						readFile(path.join(componentDirectory, file.name), "utf8")
					)
			)

			if (
				sources.some((source) =>
					/^(?:"use client"|'use client');?/.test(source)
				)
			) {
				sourceClientComponents.push(slug)
			}
		}

		const documentedClientComponents = componentSlugs.filter(
			(slug) => componentGuidance[slug].runtime === "client"
		)

		expect(documentedClientComponents).toEqual(sourceClientComponents)
	})
})
