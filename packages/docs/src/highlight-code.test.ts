// @vitest-environment node
import { expect, it } from "vitest"

import { highlightCodeBlock, highlightCodeLines } from "./highlight-code"

function toText(node: {
	type: string
	value?: string
	children?: readonly unknown[]
}): string {
	if (node.type === "text") return node.value ?? ""
	return (
		node.children
			?.map((child) => toText(child as Parameters<typeof toText>[0]))
			.join("") ?? ""
	)
}

it("highlights MDX fences and adds line numbers without changing copied source", async () => {
	const source =
		'import Example from "./Example.astro"\n\n<Example title="Hello" />\n'
	const tree = await highlightCodeBlock(source, "mdx")
	expect(JSON.stringify(tree)).toContain("token")
	expect(JSON.stringify(tree)).toContain('"data-line":3')
	expect(toText(tree)).toBe(source)
})

it("preserves multiline tokens and blank lines in numbered fences", async () => {
	const source = '/* first\nsecond */\n\nconst value = "<&>"\n'
	const tree = await highlightCodeBlock(source, "javascript")
	expect(toText(tree)).toBe(source)
	expect(JSON.stringify(tree)).toContain('"data-line":4')
})

it("highlights code across balanced multiline tokens without losing authored text", async () => {
	const lines = await highlightCodeLines(
		'/* first\nsecond */\nconst value = "<&>"',
		"javascript"
	)
	expect(lines).toHaveLength(3)
	expect(lines[0]).toContain('class="token comment"')
	expect(lines[1]).toContain('class="token comment"')
	expect(lines[2]).toContain('class="token keyword">const</span>')
	for (const line of lines)
		expect((line.match(/<span /g) ?? []).length).toBe(
			(line.match(/<\/span>/g) ?? []).length
		)
	expect(lines[2]).toContain("&lt;&amp;&gt;")
})

it.each(["unknown", "constructor", "__proto__"])(
	"escapes unsupported grammar %s as copyable text",
	async (language) => {
		expect(
			await highlightCodeLines('<script>"unsafe"</script>', language)
		).toEqual(["&lt;script&gt;&quot;unsafe&quot;&lt;/script&gt;"])
	}
)
