import { type DefaultTreeAdapterTypes, parse } from "parse5"

import type { DocumentationPage } from "./content.ts"
import { type Heading, escapeHtml } from "./render.ts"

type Node = DefaultTreeAdapterTypes.Node
type Element = DefaultTreeAdapterTypes.Element
type Reference = { value: string; asset: boolean; fragment?: boolean }

const attribute = (node: Element, name: string) =>
	node.attrs.find((entry) => entry.name === name)?.value
const children = (node: Node) => ("childNodes" in node ? node.childNodes : [])
const ignored = new Set([
	"nav",
	"footer",
	"script",
	"style",
	"pre",
	"template",
	"astro-island",
])
const blocks = new Set([
	"p",
	"div",
	"section",
	"aside",
	"blockquote",
	"li",
	"ul",
	"ol",
	"table",
	"tr",
	"th",
	"td",
	"caption",
	"dl",
	"dt",
	"dd",
	"br",
	"hr",
])
const normalize = (value: string) => value.replace(/\s+/g, " ").trim()

function excluded(node: Element): boolean {
	return (
		ignored.has(node.tagName) ||
		attribute(node, "hidden") !== undefined ||
		attribute(node, "aria-hidden") === "true" ||
		attribute(node, "data-docs-search") === "exclude" ||
		(attribute(node, "class") ?? "").split(/\s+/).includes("heading-anchor")
	)
}

function text(node: Node): string {
	if ("value" in node) return node.value
	if ("tagName" in node && excluded(node)) return ""
	if ("tagName" in node && node.tagName === "img")
		return attribute(node, "alt") ?? ""
	return children(node).map(text).join("")
}

/** Inspect browser-parsed output, never evaluate content or rewrite an island. */
export function inspectRenderedPage(html: string, page: DocumentationPage) {
	const document = parse(html, { sourceCodeLocationInfo: true })
	const ids = new Set<string>()
	const references: Reference[] = []
	const articles: Element[] = []
	const slots: Element[] = []
	const fail = (message: string): never => {
		throw new Error(`${page.filePath}: ${message}`)
	}
	function scan(node: Node, inArticle = false): void {
		if ("tagName" in node) {
			if (attribute(node, "data-docs-article") !== undefined) {
				articles.push(node)
				inArticle = true
			}
			if (attribute(node, "data-docs-toc") !== undefined) slots.push(node)
			const id = attribute(node, "id")
			if (id !== undefined) {
				if (!id || /\s/.test(id)) fail(`invalid id "${id}"`)
				if (ids.has(id)) fail(`duplicate id "${id}"`)
				ids.add(id)
			}
			if (inArticle) {
				const href = attribute(node, "href")
				if (
					href !== undefined &&
					["a", "area", "link", "use", "image"].includes(node.tagName)
				)
					references.push({
						value: href,
						asset: !["a", "area"].includes(node.tagName),
						fragment: ["use", "image"].includes(node.tagName),
					})
				for (const name of ["src", "poster"]) {
					const value = attribute(node, name)
					if (value !== undefined) references.push({ value, asset: true })
				}
			}
		}
		for (const child of children(node)) scan(child, inArticle)
	}
	scan(document)
	if (articles.length !== 1 || slots.length !== 1)
		fail("expected one documentation article and TOC slot")
	const headings: Heading[] = []
	const sections = [
		{ id: "", heading: "", text: (page.metadata.description ?? "") + " " },
	]
	function extract(node: Node): void {
		if ("tagName" in node && excluded(node)) return
		if ("tagName" in node && /^h[1-6]$/.test(node.tagName)) {
			if (node.tagName === "h1")
				fail("the documentation shell owns h1; use h2–h6 in components")
			const id = attribute(node, "id")
			if (!id) fail("component heading requires a stable id")
			const title = normalize(text(node))
			headings.push({
				id: id!,
				text: title,
				level: Number(node.tagName.slice(1)),
			})
			sections.push({ id: id!, heading: title, text: title + " " })
			return
		}
		const block = "tagName" in node && blocks.has(node.tagName)
		if (block) sections[sections.length - 1]!.text += " "
		if ("value" in node) sections[sections.length - 1]!.text += node.value
		else if ("tagName" in node && node.tagName === "img")
			sections[sections.length - 1]!.text += text(node)
		else for (const child of children(node)) extract(child)
		if (block) sections[sections.length - 1]!.text += " "
	}
	for (const child of articles[0]!.childNodes) extract(child)
	const location = slots[0]!.sourceCodeLocation
	if (!location?.startTag || !location.endTag)
		fail("invalid documentation TOC slot")
	const toc = headings.filter((heading) => heading.level <= 3)
	const tocHtml = toc.length
		? `<nav aria-label="On this page"><strong>On this page</strong><ul>${toc.map((heading) => `<li><a href="#${escapeHtml(encodeURIComponent(heading.id))}">${escapeHtml(heading.text)}</a></li>`).join("")}</ul></nav>`
		: ""
	return {
		filePath: page.filePath,
		ids,
		references,
		headings,
		sections: sections.map((section) => ({
			...section,
			text: normalize(section.text),
		})),
		// Replace only the shell-owned slot; article and island bytes stay untouched.
		html:
			html.slice(0, location!.startTag!.endOffset) +
			tocHtml +
			html.slice(location!.endTag!.startOffset),
	}
}

export type RenderedPage = ReturnType<typeof inspectRenderedPage>

/** Validate actual rendered URLs, including links generated by imported components. */
export function validateRenderedLinks(
	documents: Map<string, RenderedPage>,
	files: Set<string>,
	base: string,
	site = "https://docs.invalid"
): void {
	const origin = new URL(site).origin
	const targets = new Map<string, RenderedPage>()
	for (const [route, document] of documents) {
		const path = base + (route === "/" ? "" : route.slice(1) + "/")
		for (const alias of [path, path.slice(0, -1), path + "index.html"])
			targets.set(alias, document)
	}
	for (const [route, document] of documents) {
		const current = new URL(
			base + (route === "/" ? "" : route.slice(1) + "/"),
			origin
		)
		for (const reference of document.references) {
			const fail = (message: string): never => {
				throw new Error(`${document.filePath}: ${message} "${reference.value}"`)
			}
			let url: URL
			let path: string
			let hash: string
			try {
				url = new URL(reference.value, current)
				path = decodeURIComponent(url.pathname)
				hash = decodeURIComponent(url.hash.slice(1)).split(":~:")[0]!
			} catch {
				fail("invalid URL")
			}
			if (!reference.asset && ["mailto:", "tel:"].includes(url!.protocol))
				continue
			if (!["http:", "https:"].includes(url!.protocol)) fail("unsupported URL")
			if (url!.origin !== origin) {
				if (reference.asset && url!.protocol !== "https:")
					fail("unsupported URL")
				continue
			}
			const target = targets.get(path!)
			if (!target && !path!.startsWith(base))
				fail(`local URL outside base ${base}`)
			if (target && (!reference.asset || reference.fragment)) {
				if (hash! && !target.ids.has(hash!)) fail("missing fragment")
			} else if (!files.has(path!.slice(base.length)))
				fail("missing local target")
		}
	}
}
