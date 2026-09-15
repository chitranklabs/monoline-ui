import { expect, it } from "vitest"

import type { DocumentationPage } from "./content.ts"
import {
	inspectRenderedPage,
	validateRenderedLinks,
} from "./rendered-content.ts"

const page: DocumentationPage = {
	filePath: "/content/index.mdx",
	format: "mdx",
	route: "/",
	metadata: { title: "API", description: "Reference" },
	source: "",
}
const shell = (body: string) =>
	`<!doctype html><html><body><nav>Shell noise</nav><main id="content"><h1>API</h1><article data-docs-article>${body}</article></main><aside data-docs-toc></aside></body></html>`

it("preserves word boundaries after descriptions and component headings", () => {
	const result = inspectRenderedPage(
		shell('intro<h2 id="api">API</h2>component text'),
		page
	)
	expect(result.sections.map((section) => section.text)).toEqual([
		"Reference intro",
		"API component text",
	])
})

it("accepts the subpath home alias and validates SVG fragment references", () => {
	const result = inspectRenderedPage(
		shell(
			'<a href="/ask-widget">Home</a><svg><symbol id="icon"></symbol><use href="#icon"></use><image href="/ask-widget/assets/logo.svg"></image></svg>'
		),
		page
	)
	expect(() =>
		validateRenderedLinks(
			new Map([["/", result]]),
			new Set(["assets/logo.svg"]),
			"/ask-widget/"
		)
	).not.toThrow()
})

it.each([
	'<svg><use href="/ask-widget/assets/missing.svg#icon"></use></svg>',
	'<svg><image href="/ask-widget/assets/missing.svg"></image></svg>',
])("checks SVG asset references: %s", (body) => {
	const result = inspectRenderedPage(shell(body), page)
	expect(() =>
		validateRenderedLinks(new Map([["/", result]]), new Set(), "/ask-widget/")
	).toThrow(/missing local target/)
})

it("extracts rendered tables and stable headings without shell, code, or island noise", () => {
	const html = shell(
		'<h2 id="api">API <code>options</code><a class="heading-anchor">#</a></h2><table><tr><th>theme</th><td>light &amp; dark</td></tr></table><p>sub<em>path</em> support</p><pre>code-noise</pre><script>script-noise</script><style>style-noise</style><div data-docs-search="exclude"><h2>example-noise</h2></div><astro-island><h2>island-noise</h2></astro-island><p hidden>hidden-noise</p><p aria-hidden="true">aria-noise</p>'
	)
	const result = inspectRenderedPage(html, page)
	expect(result.headings).toEqual([
		{ id: "api", text: "API options", level: 2 },
	])
	expect(result.sections[1]?.text).toContain("theme light & dark")
	expect(result.sections[1]?.text).toContain("subpath support")
	expect(JSON.stringify(result.sections)).not.toMatch(/noise|Shell|#/)
	expect(result.html).toContain('href="#api"')
	expect(result.html).toContain(
		"<astro-island><h2>island-noise</h2></astro-island>"
	)
	expect(result.html.slice(0, html.indexOf("<aside"))).toBe(
		html.slice(0, html.indexOf("<aside"))
	)
})

it.each([
	["<h2>No ID</h2>", /heading requires a stable id/],
	['<h2 id="x">A</h2><div id="x">B</div>', /duplicate id/],
	['<h2 id="content">Reserved</h2>', /duplicate id/],
	['<h1 id="x">Second title</h1>', /owns h1/],
])("rejects ambiguous rendered headings: %s", (body, message) => {
	expect(() => inspectRenderedPage(shell(body), page)).toThrow(message)
})

it("validates component links and fragments against root and subpath output", () => {
	for (const base of ["/", "/ask-widget/"]) {
		const result = inspectRenderedPage(
			shell(
				`<h2 id="café">Options</h2><a href="${base}#caf%C3%A9">Options</a><img src="${base}assets/logo.svg"><a href="https://example.com/">External</a>`
			),
			page
		)
		expect(() =>
			validateRenderedLinks(
				new Map([["/", result]]),
				new Set(["assets/logo.svg"]),
				base
			)
		).not.toThrow()
	}
})

it.each([
	['<a href="/ask-widget/#missing">Missing</a>', /missing fragment/],
	['<a href="/ask-widget/missing/">Missing</a>', /missing local target/],
	['<img src="/ask-widget/assets/missing.svg">', /missing local target/],
	['<a href="/other/">Outside</a>', /outside base/],
	['<a href="javascript:alert(1)">Unsafe</a>', /unsupported URL/],
	['<a href="#%zz">Malformed</a>', /invalid URL/],
	[
		'<div data-docs-search="exclude"><a href="#missing">Hidden</a></div>',
		/missing fragment/,
	],
])("rejects invalid rendered references: %s", (body, message) => {
	const result = inspectRenderedPage(shell(body), page)
	expect(() =>
		validateRenderedLinks(new Map([["/", result]]), new Set(), "/ask-widget/")
	).toThrow(message)
})
