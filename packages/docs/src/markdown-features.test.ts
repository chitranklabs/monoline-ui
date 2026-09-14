// @vitest-environment node
import { expect, it } from "vitest"

import { renderMarkdown } from "./render"

const render = (source: string) =>
	renderMarkdown({
		filePath: "page.md",
		format: "md",
		metadata: { title: "Page" },
		route: "/",
		source,
	})

it.each(["NOTE", "TIP", "WARNING", "CAUTION"])(
	"renders %s as a labeled static note without polluting headings or search",
	(type) => {
		const output = render(
			`> [!${type}]\n> Keep **this** and [the link](https://example.com).\n>\n> - A list item\n\n## Next`
		)
		expect(output.html).toContain(
			`class="callout callout-${type.toLowerCase()}"`
		)
		expect(output.html).toContain('role="note"')
		expect(output.html).toContain("<strong>this</strong>")
		expect(output.html).toContain('href="https://example.com"')
		expect(output.html).toContain("<li>A list item</li>")
		expect(output.html).not.toContain(`[!${type}]`)
		expect(output.headings.map((heading) => heading.text)).toEqual(["Next"])
		expect(
			output.sections.map((section) => section.text).join(" ")
		).not.toContain(`[!${type}]`)
	}
)

it("keeps ordinary and unsupported blockquotes unchanged and safely escapes callout text", () => {
	const output = render(
		"> Ordinary quote\n\n> [!CUSTOM]\n> Not a callout\n\n> [!NOTE] extra text\n\n> [!CAUTION]\n> <script>alert(1)</script>"
	)
	expect(output.html).toContain("<blockquote>")
	expect(output.html).toContain("[!CUSTOM]")
	expect(output.html).toContain("[!NOTE] extra text")
	expect(output.html).not.toContain("<script>")
	expect(output.html.match(/class="callout /g)).toHaveLength(1)
})

it("supports empty, nested and consecutive callouts with balanced wrappers", () => {
	const output = render(
		"> [!NOTE]\n\n> [!TIP]\n> Outer\n>\n> > [!WARNING]\n> > Inner"
	)
	expect(output.html.match(/<aside/g)).toHaveLength(3)
	expect(output.html.match(/<\/aside>/g)).toHaveLength(3)
	expect(output.html).not.toContain("<p></p>")
})

it("adds keyboard-accessible permalinks without changing heading IDs, labels or search text", () => {
	const output = render(
		"## Same & `code`\n## Same & `code`\n## [Linked](https://example.com)\n## 日本語"
	)
	expect(output.headings.map((heading) => heading.id)).toEqual([
		"same-code",
		"same-code-1",
		"linked",
		"日本語",
	])
	expect(output.html).toContain('class="heading-anchor" href="#same-code"')
	expect(output.html).toContain('aria-label="Link to Same &amp; code"')
	expect(output.html).toContain('href="#%E6%97%A5%E6%9C%AC%E8%AA%9E"')
	expect(output.sections[1]!.text).toBe("Same & code")
	expect(output.html).not.toContain('<a href="https://example.com"><a')
})
it("preserves reference links inside callouts", () => {
	const output = render(
		"> [!NOTE]\n> See [guide][ref] and ![diagram][image].\n\n[ref]: https://example.com\n[image]: https://example.com/diagram.svg"
	)
	expect(output.html).toContain('href="https://example.com"')
	expect(output.html).toContain('src="https://example.com/diagram.svg"')
})
