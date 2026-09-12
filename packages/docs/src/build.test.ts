// @vitest-environment node
import {
	access,
	mkdir,
	mkdtemp,
	readFile,
	rm,
	symlink,
	writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, expect, it } from "vitest"

import { buildDocs } from "./build"
import { renderMarkdown } from "./render"

const roots: string[] = []
afterEach(async () => {
	await Promise.all(
		roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
	)
})

async function fixture() {
	const root = await mkdtemp(join(tmpdir(), "monoline-static-"))
	roots.push(root)
	const contentDirectory = join(root, "content")
	await mkdir(contentDirectory)
	await writeFile(
		join(contentDirectory, "index.md"),
		"---\ntitle: Home\n---\n# Start\n[Guide](guide.md#install)\n"
	)
	await writeFile(
		join(contentDirectory, "guide.md"),
		"---\ntitle: Guide\n---\n# Install\n[Home](/)\n"
	)
	return {
		title: "Monoline",
		contentDirectory,
		outDirectory: join(root, "dist"),
	}
}

it("builds a browsable site under a base with matching sidebar, anchors, and CSS", async () => {
	const options = await fixture()
	await expect(
		buildDocs({ ...options, base: "/project/" })
	).resolves.toMatchObject({ pages: 2 })
	const home = await readFile(join(options.outDirectory, "index.html"), "utf8")
	expect(home).toContain('href="/project/guide/#install"')
	expect(home).toContain('href="/project/docs.css"')
	expect(home).toContain('aria-current="page"')
	expect(home).toContain('aria-label="On this page"')
	expect(home.match(/<h1>/g)).toHaveLength(1)
	const guide = await readFile(
		join(options.outDirectory, "guide/index.html"),
		"utf8"
	)
	expect(guide).toContain('id="install"')
	expect(guide).toContain('href="/project/"')
	await expect(
		access(join(options.outDirectory, "404.html"))
	).resolves.toBeUndefined()
})

it("removes a previously generated page when it becomes a draft", async () => {
	const options = await fixture()
	await buildDocs(options)
	await writeFile(
		join(options.contentDirectory, "index.md"),
		"---\ntitle: Home\n---\n# Start"
	)
	await writeFile(
		join(options.contentDirectory, "guide.md"),
		"---\ntitle: Guide\ndraft: true\n---\n"
	)
	await expect(buildDocs(options)).resolves.toMatchObject({ pages: 1 })
	await expect(
		access(join(options.outDirectory, "guide/index.html"))
	).rejects.toMatchObject({ code: "ENOENT" })
})

it.each(["missing.md", "guide.md#absent"])(
	"rejects a broken link before writing: %s",
	async (link) => {
		const options = await fixture()
		await writeFile(
			join(options.contentDirectory, "index.md"),
			`---\ntitle: Home\n---\n[Broken](${link})`
		)
		await expect(buildDocs(options)).rejects.toThrow(
			/broken internal link|missing heading/
		)
		await expect(access(options.outDirectory)).rejects.toMatchObject({
			code: "ENOENT",
		})
	}
)

it("refuses unmanaged output and overlapping content paths", async () => {
	const options = await fixture()
	await mkdir(options.outDirectory)
	await writeFile(join(options.outDirectory, "keep.txt"), "user file")
	await expect(buildDocs(options)).rejects.toThrow("not managed")
	expect(await readFile(join(options.outDirectory, "keep.txt"), "utf8")).toBe(
		"user file"
	)
	await expect(
		buildDocs({ ...options, outDirectory: options.contentDirectory })
	).rejects.toThrow("overlap")
})

it("rejects output symlinks and leaves unrelated files intact", async () => {
	const options = await fixture()
	await buildDocs(options)
	await rm(join(options.outDirectory, "index.html"))
	const target = join(options.contentDirectory, "private.txt")
	await writeFile(target, "keep me")
	await symlink(target, join(options.outDirectory, "index.html"))
	await expect(buildDocs(options)).rejects.toThrow("symbolic link")
	expect(await readFile(target, "utf8")).toBe("keep me")
})

it("rejects an invalid base and requires a published homepage", async () => {
	const options = await fixture()
	await expect(buildDocs({ ...options, base: "../" })).rejects.toThrow(
		"base must"
	)
	await rm(join(options.contentDirectory, "index.md"))
	await expect(buildDocs(options)).rejects.toThrow("index.md")
})

it("escapes raw HTML and gives repeated headings distinct IDs without including code fences", () => {
	const page = {
		filePath: "test.md",
		format: "md" as const,
		metadata: { title: "Test" },
		route: "/" as const,
		source:
			"# Same\n# Same\n```md\n# Noise\n```\n<script>alert(1)</script>\n[Unsafe](javascript:alert(1))",
	}
	const result = renderMarkdown(page)
	expect(result.headings.map((heading) => heading.id)).toEqual([
		"same",
		"same-1",
	])
	expect(result.html).not.toContain("<script>")
	expect(result.html).toContain('<pre tabindex="0">')
	expect(result.html).not.toContain('href="javascript:')
	expect(() => renderMarkdown({ ...page, format: "mdx" })).toThrow(
		"MDX rendering is not supported"
	)
})
