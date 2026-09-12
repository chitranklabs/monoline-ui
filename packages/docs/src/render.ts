import MarkdownIt from "markdown-it"

import type { DocumentationPage } from "./content"

export interface Heading {
	id: string
	text: string
	level: number
}

export function escapeHtml(value: string): string {
	return value.replace(
		/[&<>"']/g,
		(character) =>
			({
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#39;",
			})[character]!
	)
}

export function renderMarkdown(
	page: DocumentationPage,
	resolveLink: (href: string) => string = (href) => href
) {
	if (page.format !== "md") {
		throw new Error(
			`${page.filePath}: MDX rendering is not supported by the static prototype. Use Markdown.`
		)
	}
	const markdown = new MarkdownIt({ html: false })
	for (const rule of ["fence", "code_block"]) {
		const render = markdown.renderer.rules[rule]!
		markdown.renderer.rules[rule] = (...arguments_) =>
			render(...arguments_).replace("<pre>", '<pre tabindex="0">')
	}
	const tokens = markdown.parse(page.source, {})
	const walkLinks = (entries: typeof tokens) => {
		for (const token of entries) {
			if (token.type === "link_open")
				token.attrSet("href", resolveLink(String(token.attrGet("href") ?? "")))
			if (
				token.type === "image" &&
				!/^https:\/\//.test(String(token.attrGet("src") ?? ""))
			)
				throw new Error(
					`${page.filePath}: local images require an asset pipeline; use an HTTPS image URL for this prototype`
				)
			if (token.children) walkLinks(token.children)
		}
	}
	walkLinks(tokens)
	const headings: Heading[] = []
	const ids = new Set<string>(["content"])
	for (let index = 0; index < tokens.length; index += 1) {
		const token = tokens[index]!
		if (token.type === "table_open") token.attrSet("tabindex", "0")
		if (token.type !== "heading_open") continue
		const inline = tokens[index + 1]
		const text = (inline?.children ?? [])
			.map((child) =>
				child.type === "text" ||
				child.type === "code_inline" ||
				child.type === "image"
					? child.content
					: ""
			)
			.join("")
		const base =
			text
				.toLowerCase()
				.normalize("NFC")
				.replace(/[^\p{L}\p{N}\s-]/gu, "")
				.trim()
				.replace(/\s+/g, "-") || "section"
		let id = base
		let suffix = 1
		while (ids.has(id)) id = `${base}-${suffix++}`
		ids.add(id)
		token.attrSet("id", id)
		// The page title owns H1; preserve normal Markdown H2-H6 levels.
		const level = Math.max(2, Number(token.tag.slice(1)))
		token.tag = `h${level}`
		if (tokens[index + 2]?.type === "heading_close")
			tokens[index + 2]!.tag = token.tag
		headings.push({ id, text, level })
	}
	return {
		html: markdown.renderer.render(tokens, markdown.options, {}),
		headings,
	}
}
