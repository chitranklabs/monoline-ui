import { satteriCreateHighlightFn } from "@astrojs/markdown-satteri"
import Prism from "prismjs"

type Highlighter = NonNullable<
	Awaited<ReturnType<typeof satteriCreateHighlightFn>>
>
let highlighter: Promise<Highlighter> | undefined

/** Keep unsupported grammars as text; Prism's raw HTML fallback is unsafe. */
export async function highlightCode(
	code: string,
	language: string,
	meta?: string
) {
	if (
		Object.hasOwn(Prism.languages, language) ||
		!(language in Prism.languages)
	) {
		highlighter ??= satteriCreateHighlightFn({ type: "prism" }, undefined).then(
			(value) => value!
		)
		const highlighted = await (await highlighter)(code, language, meta)
		if (Object.hasOwn(Prism.languages, language)) return highlighted
	}
	return {
		type: "element" as const,
		tagName: "pre",
		properties: { className: [`language-${language}`] },
		children: [
			{
				type: "element" as const,
				tagName: "code",
				properties: { className: [`language-${language}`] },
				children: [{ type: "text" as const, value: code }],
			},
		],
	}
}

const escape = (text: string) =>
	text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")

/** Balance token spans on every line, including multiline comments and strings. */
export async function highlightCodeLines(code: string, language = "text") {
	const tree = await highlightCode(code, language)
	if (!("children" in tree)) return code.split("\n").map(escape)
	const children = tree.children
	const lines = [""]
	function visit(nodes: typeof children, wrappers: string[] = []) {
		for (const node of nodes) {
			if (node.type === "text") {
				for (const [index, part] of node.value.split("\n").entries()) {
					if (index) lines.push("")
					lines[lines.length - 1] +=
						wrappers.join("") + escape(part) + "</span>".repeat(wrappers.length)
				}
			} else if (node.type === "element") {
				const classes = node.properties.className
				visit(
					node.children,
					node.tagName === "span"
						? [
								...wrappers,
								`<span class="${escape(Array.isArray(classes) ? classes.join(" ") : String(classes ?? ""))}">`,
							]
						: wrappers
				)
			}
		}
	}
	visit(children)
	return lines
}

/** Give fenced code the same decorative line structure as the CodeBlock component. */
export async function highlightCodeBlock(
	code: string,
	language: string,
	meta?: string
): Promise<Awaited<ReturnType<typeof highlightCode>>> {
	const tree = await highlightCode(
		code,
		language === "mdx" ? "jsx" : language,
		meta
	)
	if (!("children" in tree)) return tree
	const codeNode = tree.children.find(
		(node) => node.type === "element" && node.tagName === "code"
	)
	if (!codeNode || codeNode.type !== "element") return tree
	type Node = (typeof codeNode.children)[number]
	const lines: Node[][] = [[]]
	const visit = (
		nodes: Node[],
		ancestors: Extract<Node, { type: "element" }>[] = []
	) => {
		for (const node of nodes) {
			if (node.type === "text") {
				for (const [index, value] of node.value.split("\n").entries()) {
					if (index) lines.push([])
					let fragment: Node = { type: "text", value }
					for (const ancestor of [...ancestors].reverse())
						fragment = { ...ancestor, children: [fragment] }
					lines[lines.length - 1]!.push(fragment)
				}
			} else if (node.type === "element")
				visit(node.children, [...ancestors, node])
		}
	}
	visit(codeNode.children)
	const trailing = code.endsWith("\n")
	if (trailing && lines.length > 1) lines.pop()
	codeNode.children = lines.flatMap((children, index) => [
		{
			type: "element",
			tagName: "span",
			properties: { className: ["docs-code-line"], "data-line": index + 1 },
			children,
		} as Node,
		...(index < lines.length - 1 || trailing
			? [{ type: "text", value: "\n" } as Node]
			: []),
	])
	return tree
}
