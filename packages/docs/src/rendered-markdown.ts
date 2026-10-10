import type { DefaultTreeAdapterTypes } from "parse5"

type Node = DefaultTreeAdapterTypes.Node
type Element = DefaultTreeAdapterTypes.Element
const children = (node: Node): Node[] =>
	"childNodes" in node ? node.childNodes : []
const attr = (node: Element, name: string): string | undefined =>
	node.attrs.find((entry) => entry.name === name)?.value
const classes = (node: Element): string[] =>
	(attr(node, "class") ?? "").split(/\s+/)
const omitted = new Set([
	"script",
	"style",
	"template",
	"nav",
	"footer",
	"button",
	"svg",
	"astro-island",
])
const blocks = new Set([
	"p",
	"div",
	"section",
	"article",
	"aside",
	"figure",
	"figcaption",
	"details",
	"summary",
	"dl",
	"dt",
	"dd",
])
const escape = (value: string): string =>
	value.replace(/([\\`*_[\]<>])/g, "\\$1")

function excluded(node: Element): boolean {
	return (
		omitted.has(node.tagName) ||
		attr(node, "aria-hidden") === "true" ||
		(attr(node, "hidden") !== undefined && attr(node, "role") !== "tabpanel") ||
		attr(node, "role") === "status" ||
		classes(node).some((name) =>
			["heading-anchor", "docs-source-teaser"].includes(name)
		) ||
		(node.tagName === "summary" &&
			"tagName" in node.parentNode! &&
			classes(node.parentNode as Element).includes("docs-example-source"))
	)
}

function rawText(node: Node): string {
	if ("value" in node) return node.value
	if ("tagName" in node && excluded(node)) return ""
	return children(node).map(rawText).join("")
}

function inlineCode(value: string): string {
	const runs = value.match(/`+/g) ?? []
	const fence = "`".repeat(Math.max(0, ...runs.map((run) => run.length)) + 1)
	const padding =
		value.startsWith("`") || value.endsWith("`") || /^ .* $/.test(value)
			? " "
			: ""
	return `${fence}${padding}${value}${padding}${fence}`
}

function compactBlocks(value: string): string {
	let fence = 0
	let blank = false
	return value
		.split("\n")
		.filter((line) => {
			const marker = line.match(/^\s*(?:>\s*)*(`{3,})/)
			if (marker) {
				if (!fence) fence = marker[1]!.length
				else if (marker[1]!.length >= fence) fence = 0
			}
			if (fence || line.trim()) {
				blank = false
				return true
			}
			if (blank) return false
			blank = true
			return true
		})
		.join("\n")
}

/** Reading export of static article content; search has its own exclusion rules. */
export function renderedMarkdown(article: Element): string {
	function render(node: Node): string {
		if ("value" in node) return escape(node.value.replace(/\s+/g, " "))
		if (!("tagName" in node) || excluded(node as Element)) return ""
		const element = node as Element
		const body = () => children(element).map(render).join("")
		const content = () => body().trim()
		const tag = element.tagName
		if (tag === "pre") {
			const code = children(element).find(
				(child) => "tagName" in child && child.tagName === "code"
			) as Element | undefined
			const source = rawText(code ?? element)
				.replace(/\r\n?/g, "\n")
				.replace(/\n$/, "")
			const language =
				attr(element, "data-language") ??
				(code
					? (attr(code, "class") ?? "").match(/(?:^|\s)language-([\w+-]+)/)?.[1]
					: undefined) ??
				""
			const runs = source.match(/`+/g) ?? []
			const fence = "`".repeat(
				Math.max(2, ...runs.map((run) => run.length)) + 1
			)
			return `\n\n${fence}${language.replace(/[^\w+-]/g, "")}\n${source}\n${fence}\n\n`
		}
		if (tag === "code") return inlineCode(rawText(element).replace(/\s+/g, " "))
		if (/^h[2-6]$/.test(tag))
			return `\n\n${"#".repeat(Number(tag[1]))} ${content()}\n\n`
		if (tag === "a") {
			const href = attr(element, "href")
			return href
				? `[${content()}](<${href.replace(/</g, "%3C").replace(/>/g, "%3E")}>)`.replace(
						/\]\(<([^\s<>()]+)>\)/,
						"]($1)"
					)
				: body()
		}
		if (tag === "img")
			return `![${escape(attr(element, "alt") ?? "")}](${attr(element, "src") ?? ""})`
		if (tag === "strong" || tag === "b") return `**${content()}**`
		if (tag === "em" || tag === "i") return `*${content()}*`
		if (tag === "del" || tag === "s") return `~~${content()}~~`
		if (tag === "br") return "  \n"
		if (tag === "hr") return "\n\n---\n\n"
		if (tag === "blockquote")
			return `\n\n${content()
				.split("\n")
				.map((line) => `> ${line}`)
				.join("\n")}\n\n`
		if (tag === "ul" || tag === "ol") {
			let index = Number(attr(element, "start") ?? "1")
			const items = children(element).filter(
				(child): child is Element =>
					"tagName" in child && child.tagName === "li" && !excluded(child)
			)
			return `\n\n${items
				.map((item) => {
					const marker = tag === "ol" ? `${index++}. ` : "- "
					const lines = children(item).map(render).join("").trim().split("\n")
					return (
						marker +
						lines
							.map((line, i) => (i ? " ".repeat(marker.length) + line : line))
							.join("\n")
							.replace(/\n +\n/g, "\n")
					)
				})
				.join("\n")}\n\n`
		}
		if (tag === "table") {
			const rows: string[][] = []
			let caption = ""
			function collect(current: Node): void {
				if (!("tagName" in current) || excluded(current)) return
				if (current.tagName === "caption")
					caption = children(current).map(render).join("").trim()
				else if (current.tagName === "tr")
					rows.push(
						children(current)
							.filter(
								(cell): cell is Element =>
									"tagName" in cell && ["td", "th"].includes(cell.tagName)
							)
							.map((cell) =>
								children(cell)
									.map(render)
									.join("")
									.trim()
									.replace(/\n+/g, "<br>")
									.replace(/\|/g, "\\|")
							)
					)
				else for (const child of children(current)) collect(child)
			}
			for (const child of children(element)) collect(child)
			if (!rows.length) return ""
			const width = Math.max(...rows.map((row) => row.length))
			const line = (row: string[]) =>
				`| ${Array.from({ length: width }, (_, i) => row[i] ?? "").join(" | ")} |`
			return `\n\n${caption ? caption + "\n\n" : ""}${[line(rows[0]!), line(Array(width).fill("---")), ...rows.slice(1).map(line)].join("\n")}\n\n`
		}
		return blocks.has(tag) ? `\n\n${content()}\n\n` : body()
	}
	return compactBlocks(children(article).map(render).join("").trim())
}
