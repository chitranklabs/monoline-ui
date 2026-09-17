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

it("keeps hosted previews noindex without exposing drafts and restores production metadata", async () => {
	const options = { ...(await fixture()), site: "https://example.com" }
	await writeFile(
		join(options.contentDirectory, "draft.md"),
		"---\ntitle: Unpublished\ndraft: true\n---\nSecret content"
	)
	await buildDocs(options)
	await buildDocs({ ...options, indexing: false })
	expect(
		await readFile(join(options.outDirectory, "index.html"), "utf8")
	).toContain('content="noindex, nofollow"')
	expect(
		await readFile(join(options.outDirectory, "search-index.json"), "utf8")
	).not.toContain("Secret content")
	await expect(
		access(join(options.outDirectory, "draft/index.html"))
	).rejects.toThrow()
	await expect(
		access(join(options.outDirectory, "sitemap.xml"))
	).rejects.toThrow()
	await expect(
		access(join(options.outDirectory, "robots.txt"))
	).rejects.toThrow()
	await buildDocs(options)
	expect(
		await readFile(join(options.outDirectory, "index.html"), "utf8")
	).not.toContain("noindex")
	await expect(
		access(join(options.outDirectory, "sitemap.xml"))
	).resolves.toBeUndefined()
})

it("applies branding, stylesheet order, default mode, language and production URLs", async () => {
	const options = await fixture()
	const assetsDirectory = join(options.contentDirectory, "../assets")
	await mkdir(assetsDirectory)
	await writeFile(
		join(assetsDirectory, "logo.svg"),
		'<svg xmlns="http://www.w3.org/2000/svg"/>'
	)
	await writeFile(join(assetsDirectory, "custom.css"), ":root { --radius: 0; }")
	const configuration = {
		...options,
		assetsDirectory,
		stylesheet: "/assets/custom.css",
		site: "https://example.com",
		base: "/handbook/",
		lang: "fr",
		defaultMode: "dark" as const,
		logo: { src: "/assets/logo.svg", alt: "A & B", width: 24, height: 24 },
		headerLinks: [
			{ label: "Source & issues", href: "https://example.com/?a=1&b=2" },
		],
	}
	await buildDocs(configuration)
	const html = await readFile(join(options.outDirectory, "index.html"), "utf8")
	expect(html).toContain('lang="fr" data-theme="dark"')
	expect(html).toContain('href="https://example.com/handbook/"')
	expect(html).toContain(
		'src="/handbook/assets/logo.svg" alt="A &amp; B" width="24" height="24"'
	)
	expect(html).toContain('href="https://example.com/?a=1&amp;b=2"')
	expect(html.indexOf("/handbook/docs.css")).toBeLessThan(
		html.indexOf("/handbook/assets/custom.css")
	)
	expect(
		await readFile(join(options.outDirectory, "sitemap.xml"), "utf8")
	).toContain("<loc>https://example.com/handbook/guide/</loc>")
	await expect(
		access(join(options.outDirectory, "robots.txt"))
	).rejects.toThrow()
	expect(
		await readFile(join(options.outDirectory, "404.html"), "utf8")
	).toContain('name="robots" content="noindex"')
	await buildDocs({ ...configuration, base: "/" })
	expect(
		await readFile(join(options.outDirectory, "robots.txt"), "utf8")
	).toContain("Sitemap: https://example.com/sitemap.xml")
	await buildDocs({ ...configuration, environment: "development" })
	await expect(
		access(join(options.outDirectory, "sitemap.xml"))
	).rejects.toThrow()
	await expect(
		access(join(options.outDirectory, "robots.txt"))
	).rejects.toThrow()
	expect(
		await readFile(join(options.outDirectory, "index.html"), "utf8")
	).toContain("noindex, nofollow")
})

it("fails invalid config and missing logos before creating output", async () => {
	const options = await fixture()
	await expect(
		buildDocs({ ...options, defaultMode: "sepia" as "dark" })
	).rejects.toThrow("defaultMode")
	await expect(
		buildDocs({
			...options,
			logo: { src: "/assets/missing.svg", alt: "Logo", width: 20, height: 20 },
		})
	).rejects.toThrow("Missing local asset")
	await expect(access(options.outDirectory)).rejects.toThrow()
})

it("indexes readable sections with stable anchors and removes production drafts on rebuild", async () => {
	const options = { ...(await fixture()), base: "/handbook/" }
	await writeFile(
		join(options.contentDirectory, "draft.md"),
		"---\ntitle: Secret draft\ndraft: true\n---\nPrivate words"
	)
	await writeFile(
		join(options.contentDirectory, "guide.md"),
		"---\ntitle: Guide\n---\n# Install\nUse **packages** and `pnpm`.\n# Install\nSecond section.\n```js\n// excluded fence noise\n```\n"
	)
	await buildDocs({ ...options, environment: "development" })
	expect(
		await readFile(join(options.outDirectory, "search-index.json"), "utf8")
	).toContain("Secret draft")
	await buildDocs(options)
	const raw = await readFile(
		join(options.outDirectory, "search-index.json"),
		"utf8"
	)
	const index = JSON.parse(raw)
	expect(raw).not.toContain("Secret draft")
	expect(raw).not.toContain("excluded fence noise")
	expect(index).toContainEqual({
		title: "Guide",
		heading: "Install",
		text: "Install Use packages and pnpm.",
		url: "/handbook/guide/#install",
	})
	expect(
		index.some(
			(entry: { url: string }) => entry.url === "/handbook/guide/#install-1"
		)
	).toBe(true)
	expect(
		await readFile(join(options.outDirectory, "index.html"), "utf8")
	).toContain('data-index="/handbook/search-index.json"')
	await expect(
		access(join(options.outDirectory, "search.js"))
	).resolves.toBeUndefined()
})

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

it("emits flat files and extensionless links when clean URLs are enabled", async () => {
	const options = {
		...(await fixture()),
		base: "/project/",
		site: "https://example.com",
		cleanUrls: true,
	}
	await buildDocs(options)
	const home = await readFile(join(options.outDirectory, "index.html"), "utf8")
	const guide = await readFile(join(options.outDirectory, "guide.html"), "utf8")
	expect(home).toContain('href="/project/guide#install"')
	expect(guide).toContain('href="/project/"')
	expect(
		await readFile(join(options.outDirectory, "sitemap.xml"), "utf8")
	).toContain("<loc>https://example.com/project/guide</loc>")
	await expect(
		access(join(options.outDirectory, "guide/index.html"))
	).rejects.toMatchObject({ code: "ENOENT" })
	expect(
		await readFile(join(options.outDirectory, "search-index.json"), "utf8")
	).toContain('"url":"/project/guide#install"')
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
