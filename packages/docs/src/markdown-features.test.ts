// @vitest-environment node
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, expect, it } from "vitest"

import { buildDocs } from "./build"
import { inspectRenderedPage } from "./rendered-content"

const roots: string[] = []
afterEach(async () => {
	await Promise.all(
		roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
	)
})
const render = async (source: string) => {
	const root = await mkdtemp(join(tmpdir(), "docs-markdown-production-"))
	roots.push(root)
	const contentDirectory = join(root, "content")
	await mkdir(contentDirectory)
	const filePath = join(contentDirectory, "index.md")
	await writeFile(filePath, `---\ntitle: Page\n---\n${source}`)
	await buildDocs({
		title: "Docs",
		contentDirectory,
		outDirectory: join(root, "dist"),
	})
	const html = await readFile(join(root, "dist/index.html"), "utf8")
	const inspected = inspectRenderedPage(html, {
		filePath,
		format: "md",
		metadata: { title: "Page" },
		route: "/",
		source,
	})
	return { ...inspected, html: html.match(/<article\b[\s\S]*?<\/article>/)![0] }
}

it.each(["NOTE", "TIP", "WARNING", "CAUTION"])(
	"renders %s as a labeled static note without polluting headings or search",
	async (type) => {
		const output = await render(
			`> [!${type}]\n> Keep **this** and [the link](https://example.com).\n>\n> - A list item\n\n## Next`
		)
		expect(output.html).toContain(
			`class="callout callout-${type.toLowerCase()}"`
		)
		expect(output.html).toContain('role="note"')
		expect(output.html).not.toContain('class="callout-title"')
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

it("keeps ordinary and unsupported blockquotes unchanged and safely escapes callout text", async () => {
	const output = await render(
		"> Ordinary quote\n\n> [!CUSTOM]\n> Not a callout\n\n> [!CAUTION]\n> <script>alert(1)</script>"
	)
	expect(output.html).toContain("<blockquote>")
	expect(output.html).toContain("[!CUSTOM]")
	expect(output.html).not.toContain("<script>")
	expect(output.html.match(/class="callout /g)).toHaveLength(1)
})

it("supports empty, nested and consecutive callouts with balanced wrappers", async () => {
	const output = await render(
		"> [!NOTE]\n\n> [!TIP]\n> Outer\n>\n> > [!WARNING]\n> > Inner"
	)
	expect(output.html.match(/<aside/g)).toHaveLength(3)
	expect(output.html.match(/<\/aside>/g)).toHaveLength(3)
})

it("adds keyboard-accessible permalinks without changing heading IDs, labels or search text", async () => {
	const output = await render(
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
it("preserves reference links inside callouts", async () => {
	const output = await render(
		"> [!NOTE]\n> See [guide][ref] and ![diagram][image].\n\n[ref]: https://example.com\n[image]: https://example.com/diagram.svg"
	)
	expect(output.html).toContain('href="https://example.com"')
	expect(output.html).toContain('src="https://example.com/diagram.svg"')
})

it("distinguishes single-line and multiline code for stable copy placement", async () => {
	const { html } = await render(
		"```js\nconst one = 1\n```\n\n```js\nconst one = 1\nconst two = 2\n```"
	)
	expect(html.match(/data-single-line="true"/g)).toHaveLength(1)
	expect(html.match(/class="code-block"/g)).toHaveLength(2)
})
