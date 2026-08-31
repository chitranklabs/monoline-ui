import { describe, expect, it } from "vitest"

import { collectDocsTocItems } from "../lib/docs-toc"

describe("collectDocsTocItems", () => {
	it("keeps section headings and ignores preview or nested heading noise", () => {
		const main = document.createElement("main")
		main.innerHTML = `
			<h2 id="usage">Usage</h2>
			<div data-toc-exclude>
				<h2>Dark mode sample</h2>
			</div>
			<h3>--surface</h3>
			<h2 class="sr-only">Interactive preview</h2>
			<h2>Design tokens</h2>
		`

		expect(collectDocsTocItems(main)).toEqual([
			{ id: "usage", label: "Usage", depth: 2 },
			{ id: "design-tokens", label: "Design tokens", depth: 2 },
		])
	})

	it("generates stable unique IDs for repeated section labels", () => {
		const main = document.createElement("main")
		main.innerHTML = `
			<h2>Examples</h2>
			<h2>Examples</h2>
		`

		expect(collectDocsTocItems(main)).toEqual([
			{ id: "examples", label: "Examples", depth: 2 },
			{ id: "examples-2", label: "Examples", depth: 2 },
		])
	})
})
