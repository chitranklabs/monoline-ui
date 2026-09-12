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

const directories: string[] = []
afterEach(async () => {
	await Promise.all(
		directories
			.splice(0)
			.map((directory) => rm(directory, { force: true, recursive: true }))
	)
})
async function fixture() {
	const root = await mkdtemp(join(tmpdir(), "docs-authoring-"))
	directories.push(root)
	const options = {
		title: "Docs",
		contentDirectory: join(root, "content"),
		assetsDirectory: join(root, "assets"),
		outDirectory: join(root, "dist"),
		base: "/project/",
		stylesheet: "/assets/site.css",
	}
	await mkdir(options.contentDirectory)
	await mkdir(join(options.assetsDirectory, "fonts"), { recursive: true })
	await writeFile(
		join(options.contentDirectory, "index.md"),
		"---\ntitle: Home\n---\n![Logo](/assets/logo.svg)\n[Download](/assets/readme.txt)"
	)
	await writeFile(
		join(options.assetsDirectory, "logo.svg"),
		'<svg xmlns="http://www.w3.org/2000/svg"/>'
	)
	await writeFile(join(options.assetsDirectory, "readme.txt"), "Download")
	await writeFile(
		join(options.assetsDirectory, "site.css"),
		'@font-face {font-family: local;src:url("fonts/demo.woff2")}'
	)
	await writeFile(
		join(options.assetsDirectory, "fonts/demo.woff2"),
		Buffer.from([0, 255, 127, 65])
	)
	return options
}

it("copies binary assets and resolves images, downloads, and styles under a base", async () => {
	const options = await fixture()
	await buildDocs(options)
	const html = await readFile(join(options.outDirectory, "index.html"), "utf8")
	for (const path of [
		"assets/logo.svg",
		"assets/readme.txt",
		"assets/site.css",
		"theme.js",
		"client.js",
	])
		expect(html).toContain(`/project/${path}`)
	expect(
		await readFile(join(options.outDirectory, "assets/fonts/demo.woff2"))
	).toEqual(Buffer.from([0, 255, 127, 65]))
	await rm(join(options.assetsDirectory, "fonts/demo.woff2"))
	await buildDocs(options)
	await expect(
		access(join(options.outDirectory, "assets/fonts/demo.woff2"))
	).rejects.toMatchObject({ code: "ENOENT" })
})

it("rejects missing assets and child symlinks before generating output", async () => {
	const options = await fixture()
	await rm(join(options.assetsDirectory, "logo.svg"))
	await expect(buildDocs(options)).rejects.toThrow("Missing local asset")
	await expect(access(options.outDirectory)).rejects.toMatchObject({
		code: "ENOENT",
	})
	await symlink(
		join(options.assetsDirectory, "readme.txt"),
		join(options.assetsDirectory, "logo.svg")
	)
	await expect(buildDocs(options)).rejects.toThrow("symlinks")
})

it("rejects overlapping asset/output paths and unsafe stylesheet paths", async () => {
	const options = await fixture()
	await expect(
		buildDocs({ ...options, outDirectory: options.assetsDirectory })
	).rejects.toThrow("overlap")
	await expect(
		buildDocs({ ...options, stylesheet: "https://example.com/site.css" })
	).rejects.toThrow("stylesheet")
})

it("highlights known languages, escapes unknown code, and preserves copyable text", () => {
	const page = {
		filePath: "test.md",
		route: "/" as const,
		format: "md" as const,
		metadata: { title: "Test" },
		source:
			'```typescript\nconst value: string = "<&>"\n```\n```unknown\n<script>alert(1)</script>\n```',
	}
	const result = renderMarkdown(page)
	expect(result.html).toContain('class="token keyword"')
	expect(result.html).toContain('aria-label="Copy code block"')
	expect(result.html).toContain("&lt;script&gt;")
	expect(result.html).not.toContain("<script>")
})
