import MarkdownIt from "markdown-it"
import { createRequire } from "node:module"
import Prism from "prismjs"

import type { DocumentationPage } from "./content.ts"

// Load only supported grammars at build time, never modules named by content.
const loadLanguages = createRequire(import.meta.url)(
	"prismjs/components/index.js"
) as (languages: string[]) => void
loadLanguages(["typescript", "tsx", "bash", "json", "yaml", "sql"])

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
	resolveLink: (href: string) => string = (href) => href,
	resolveAsset: (href: string) => string = (href) => {
		if (!/^https:\/\//i.test(href))
			throw new Error(`Missing asset resolver for ${href}`)
		return href
	}
) {
	if (page.format !== "md") {
		throw new Error(
			`${page.filePath}: MDX rendering is not supported by the static prototype. Use Markdown.`
		)
	}
	const markdown = new MarkdownIt({
		html: false,
		highlight(code, language) {
			const grammar = Object.hasOwn(Prism.languages, language)
				? Prism.languages[language]
				: undefined
			return grammar && typeof grammar === "object"
				? Prism.highlight(code, grammar, language)
				: ""
		},
	})
	for (const rule of ["fence", "code_block"]) {
		const render = markdown.renderer.rules[rule]!
		markdown.renderer.rules[rule] = (...arguments_) =>
			`<div class="code-block">${render(...arguments_).replace("<pre>", '<pre tabindex="0">')}<button class="copy-code" type="button" aria-label="Copy code block" hidden>Copy</button><span class="copy-status" role="status"></span></div>`
	}
	const environment = {}
	const tokens = markdown.parse(page.source, environment)
	markdown.renderer.rules.blockquote_open = (
		entries,
		index,
		options,
		_env,
		renderer
	) => {
		const label = entries[index]!.meta?.calloutLabel as string | undefined
		return (
			renderer.renderToken(entries, index, options) +
			(label ? `<p class="callout-title">${label}</p>\n` : "")
		)
	}
	for (let index = 0; index < tokens.length; index += 1) {
		const opening = tokens[index]!
		const inline = tokens[index + 2]
		if (
			opening.type !== "blockquote_open" ||
			tokens[index + 1]?.type !== "paragraph_open" ||
			inline?.type !== "inline"
		)
			continue
		const marker = inline.content.match(
			/^\[!(NOTE|TIP|WARNING|CAUTION)\](?:\n|$)/
		)
		if (!marker) continue
		const closing = tokens
			.slice(index + 1)
			.find(
				(token) =>
					token.type === "blockquote_close" && token.level === opening.level
			)!
		const kind = marker[1]!.toLowerCase()
		const label = kind[0]!.toUpperCase() + kind.slice(1)
		opening.tag = closing.tag = "aside"
		opening.attrSet("class", `callout callout-${kind}`)
		opening.attrSet("role", "note")
		opening.attrSet("aria-label", label)
		opening.meta = { calloutLabel: label }
		inline.content = inline.content.slice(marker[0].length)
		inline.children = markdown.parseInline(
			inline.content,
			environment
		)[0]!.children
		if (!inline.content)
			tokens[index + 1]!.hidden = tokens[index + 3]!.hidden = true
	}
	const walkLinks = (entries: typeof tokens) => {
		for (const token of entries) {
			if (token.type === "link_open")
				token.attrSet("href", resolveLink(String(token.attrGet("href") ?? "")))
			if (token.type === "image")
				token.attrSet("src", resolveAsset(String(token.attrGet("src") ?? "")))
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
	markdown.renderer.rules.heading_close = (
		entries,
		index,
		options,
		_env,
		renderer
	) => {
		const id = entries[index - 2]!.attrGet("id")!
		const heading = headings.find((entry) => entry.id === id)!
		return `<a class="heading-anchor" href="#${encodeURIComponent(id)}" aria-label="Link to ${escapeHtml(heading.text)}"><span aria-hidden="true">#</span></a>${renderer.renderToken(entries, index, options)}`
	}
	const sections = [
		{ id: "", heading: "", text: page.metadata.description ?? "" },
	]
	for (const token of tokens) {
		if (token.type === "heading_open") {
			const heading = headings.find(
				(entry) => entry.id === token.attrGet("id")
			)!
			sections.push({ id: heading.id, heading: heading.text, text: "" })
		} else if (token.type === "inline") {
			const text = (token.children ?? [])
				.filter((child) =>
					["text", "code_inline", "image", "softbreak", "hardbreak"].includes(
						child.type
					)
				)
				.map((child) => child.content || " ")
				.join("")
			sections[sections.length - 1]!.text += ` ${text}`
		}
	}
	return {
		html: markdown.renderer.render(tokens, markdown.options, environment),
		headings,
		sections: sections.map((section) => ({
			...section,
			text: section.text.replace(/\s+/g, " ").trim(),
		})),
	}
}
