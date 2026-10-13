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
import { type DefaultTreeAdapterTypes, parse } from "parse5"
import { afterEach, expect, it } from "vitest"

import { buildDocs } from "./build"
import { inspectRenderedPage } from "./rendered-content"

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

it("mounts existing Markdown and MDX trees with one heading, links, exports and draft filtering", async () => {
	const options = await fixture()
	const directory = join(options.contentDirectory, "..", "repository")
	await mkdir(directory)
	await writeFile(
		join(directory, "README.md"),
		"---\ntitle: Repository\n---\n# Repository\n\n[Architecture](architecture.md#boundaries)\n[Home](../content/index.md)\n"
	)
	await writeFile(
		join(directory, "architecture.md"),
		"---\ntitle: Architecture\n---\n# Architecture\n\n## Boundaries\n\nRepository guidance.\n"
	)
	await writeFile(
		join(directory, "example.mdx"),
		'---\ntitle: Example\n---\nexport const value = "sample"\n\n# Example\n\n## Usage\n\n{value}\n'
	)
	await writeFile(
		join(directory, "draft.md"),
		"---\ntitle: Draft\ndraft: true\n---\nHidden text"
	)
	await buildDocs({
		...options,
		base: "/handbook/",
		contentMounts: [{ directory, route: "/repository" }],
	})
	const html = await readFile(
		join(options.outDirectory, "repository/index.html"),
		"utf8"
	)
	expect(html.match(/<h1\b/g)).toHaveLength(1)
	expect(html).not.toMatch(/<h2[^>]*>Repository/)
	expect(html).toContain('href="/handbook/repository/architecture/#boundaries"')
	expect(html).toContain('href="/handbook/"')
	const mdx = await readFile(
		join(options.outDirectory, "repository/example/index.html"),
		"utf8"
	)
	expect(mdx.match(/<h1\b/g)).toHaveLength(1)
	expect(mdx).not.toMatch(/<h2[^>]*>Example/)
	expect(mdx).toContain("sample")
	expect(
		await readFile(
			join(options.outDirectory, "repository/architecture/index.md"),
			"utf8"
		)
	).toContain("## Boundaries")
	expect(
		await readFile(join(options.outDirectory, "llms.txt"), "utf8")
	).toContain("/handbook/repository/architecture/index.md")
	await expect(
		access(join(options.outDirectory, "repository/draft/index.html"))
	).rejects.toThrow()
	await expect(
		buildDocs({
			...options,
			contentMounts: [
				{ directory, route: "/repository" },
				{ directory, route: "/repository" },
			],
		})
	).rejects.toThrow("duplicate documentation route")
	expect(
		await readFile(join(options.outDirectory, "repository/index.html"), "utf8")
	).toBe(html)
	await expect(
		buildDocs({
			...options,
			outDirectory: join(directory, "output"),
			contentMounts: [{ directory, route: "/repository" }],
		})
	).rejects.toThrow("must not overlap")
	await expect(
		buildDocs({
			...options,
			contentMounts: [
				{ directory, route: "/repository" },
				{ directory, route: "/copy" },
			],
		})
	).rejects.toThrow("source is included more than once")
})

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
	await expect(access(join(options.outDirectory, "llms.txt"))).rejects.toThrow()
	await expect(
		access(join(options.outDirectory, "llms-full.txt"))
	).rejects.toThrow()
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
	expect(
		await readFile(join(options.outDirectory, "llms-full.txt"), "utf8")
	).not.toContain("Secret content")
})

it("keeps noindex routes out of the sitemap while preserving their pages", async () => {
	const options = { ...(await fixture()), site: "https://example.com" }
	await writeFile(
		join(options.contentDirectory, "guide.md"),
		"---\ntitle: Private guide\nnoindex: true\n---\n# Install\n"
	)
	await buildDocs(options)
	const sitemap = await readFile(
		join(options.outDirectory, "sitemap.xml"),
		"utf8"
	)
	expect(sitemap).toContain("https://example.com/")
	expect(sitemap).not.toContain("/guide/")
	expect(
		await readFile(join(options.outDirectory, "guide/index.html"), "utf8")
	).toContain('name="robots" content="noindex, nofollow"')
	expect(
		await readFile(join(options.outDirectory, "guide/index.html"), "utf8")
	).not.toContain("application/ld+json")
	expect(
		await readFile(join(options.outDirectory, "llms.txt"), "utf8")
	).not.toContain("Private guide")
	expect(
		await readFile(join(options.outDirectory, "llms-full.txt"), "utf8")
	).not.toContain("Private guide")
	expect(
		await readFile(join(options.outDirectory, "search-index.json"), "utf8")
	).not.toContain("Private guide")
	await expect(
		access(join(options.outDirectory, "guide/index.md"))
	).rejects.toThrow()
})

it("rewrites relative links in Markdown exports for slugged routes", async () => {
	const options = { ...(await fixture()), base: "/handbook/" }
	await mkdir(join(options.contentDirectory, "manual"))
	await writeFile(
		join(options.contentDirectory, "manual/start.md"),
		"---\ntitle: Start\nslug: getting-started\n---\n# Start\n[Next](next.md) and `[Sample](next.md)`\n[More][next]\n\n[next]: next.md\n\n```md\n[Example](next.md)\n```\n"
	)
	await writeFile(
		join(options.contentDirectory, "manual/next.md"),
		"---\ntitle: Next\n---\n# Next\n"
	)
	await buildDocs(options)
	const exported = await readFile(
		join(options.outDirectory, "getting-started/index.md"),
		"utf8"
	)
	expect(exported).toContain("[Next](/handbook/manual/next/)")
	expect(exported).toContain("`[Sample](next.md)`")
	expect(exported).toContain("[next]: /handbook/manual/next/")
	expect(exported).toContain("```md\n[Example](next.md)\n```")
})

it("validates links to generated Markdown and AI exports", async () => {
	const options = { ...(await fixture()), base: "/handbook/" }
	await writeFile(
		join(options.contentDirectory, "index.md"),
		"---\ntitle: Home\n---\n[Guide Markdown](/handbook/guide/index.md)\n[AI index](/handbook/llms.txt)\n[Full reference](/handbook/llms-full.txt)\n"
	)
	await buildDocs(options)
	for (const file of ["guide/index.md", "llms.txt", "llms-full.txt"])
		await expect(
			access(join(options.outDirectory, file))
		).resolves.toBeUndefined()
	await expect(buildDocs({ ...options, indexing: false })).rejects.toThrow(
		/broken internal link|missing local target/
	)
})

it("exports published Markdown and emits configured social and integration metadata", async () => {
	const options = {
		...(await fixture()),
		site: "https://example.com",
		base: "/docs/",
	}
	const assetsDirectory = join(options.contentDirectory, "../assets")
	await mkdir(assetsDirectory)
	await writeFile(join(assetsDirectory, "social.png"), "image")
	await writeFile(
		join(assetsDirectory, "analytics.js"),
		"window.__analyticsLoaded = true"
	)
	await buildDocs({
		...options,
		assetsDirectory,
		seo: {
			socialImage: "/assets/social.png",
			socialImageAlt: "An SDK diagram",
			publisher: { type: "Organization", name: "Example" },
		},
		integrations: { scripts: ["/assets/analytics.js"] },
	})
	const html = await readFile(join(options.outDirectory, "index.html"), "utf8")
	expect(html).toContain('content="https://example.com/docs/assets/social.png"')
	expect(html).toContain('property="og:site_name" content="Monoline"')
	expect(html).toContain('name="twitter:title" content="Home | Monoline"')
	expect(html).toContain('property="og:type" content="website"')
	expect(html).toContain('property="og:image:alt" content="An SDK diagram"')
	expect(html).toContain('name="twitter:image:alt" content="An SDK diagram"')
	const entities = [
		...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),
	].map((match) => JSON.parse(match[1]))
	expect(entities).toContainEqual(
		expect.objectContaining({
			"@type": "WebSite",
			"@id": "https://example.com/docs/#website",
			url: "https://example.com/docs/",
			name: "Monoline",
			publisher: { "@type": "Organization", name: "Example" },
		})
	)
	expect(entities).toContainEqual(
		expect.objectContaining({
			"@type": "WebPage",
			isPartOf: { "@id": "https://example.com/docs/#website" },
		})
	)
	expect(html).toContain('src="/docs/assets/analytics.js"')
	expect(html).toContain('data-markdown-url="/docs/index.md"')
	expect(
		await readFile(join(options.outDirectory, "guide/index.md"), "utf8")
	).toContain("# Install")
	expect(
		await readFile(join(options.outDirectory, "llms.txt"), "utf8")
	).toContain("/docs/guide/index.md")
	expect(
		await readFile(join(options.outDirectory, "llms-full.txt"), "utf8")
	).toContain("# Install")
	expect(
		await readFile(join(options.outDirectory, "guide/index.html"), "utf8")
	).toContain("BreadcrumbList")
	const guideHtml = await readFile(
		join(options.outDirectory, "guide/index.html"),
		"utf8"
	)
	expect(guideHtml).toContain('"@type":"Article"')
	expect(guideHtml).toContain(
		'"isPartOf":{"@id":"https://example.com/docs/#website"}'
	)
	await writeFile(
		join(options.contentDirectory, "guide.md"),
		"---\ntitle: Guide\nlayout: reference\n---\n# Install\n"
	)
	await buildDocs({
		...options,
		assetsDirectory,
		seo: { socialImage: "/assets/social.png" },
	})
	expect(
		await readFile(join(options.outDirectory, "index.html"), "utf8")
	).toContain('property="og:image:alt" content="Monoline"')
	expect(
		await readFile(join(options.outDirectory, "guide/index.html"), "utf8")
	).toContain('"@type":"TechArticle"')
	await buildDocs({
		...options,
		assetsDirectory,
		indexing: false,
		seo: {
			author: { type: "Person", name: "Hidden author" },
			publisher: { type: "Organization", name: "Hidden publisher" },
		},
	})
	expect(
		await readFile(join(options.outDirectory, "index.html"), "utf8")
	).not.toContain("application/ld+json")
})

it("removes search artifacts when site search is disabled on rebuild", async () => {
	const options = await fixture()
	await buildDocs(options)
	await buildDocs({ ...options, search: { enabled: false } })
	await expect(
		access(join(options.outDirectory, "search-index.json"))
	).rejects.toThrow()
	await expect(
		access(join(options.outDirectory, "search.js"))
	).rejects.toThrow()
	expect(
		await readFile(join(options.outDirectory, "index.html"), "utf8")
	).not.toContain("search-dialog")
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
		scope: "guide",
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

it("escapes raw HTML and gives repeated headings distinct IDs without including code fences", async () => {
	const options = await fixture()
	const page = {
		filePath: join(options.contentDirectory, "index.md"),
		format: "md" as const,
		metadata: { title: "Test" },
		route: "/" as const,
		source: "# Same\n# Same\n```md\n# Noise\n```\n<script>alert(1)</script>",
	}
	await writeFile(page.filePath, `---\ntitle: Test\n---\n${page.source}`)
	await buildDocs(options)
	const html = await readFile(join(options.outDirectory, "index.html"), "utf8")
	const result = inspectRenderedPage(html, page)
	expect(result.headings.map((heading) => heading.id)).toEqual([
		"same",
		"same-1",
	])
	expect(result.html).not.toContain("<script>alert(1)</script>")
	expect(result.html).toMatch(/<pre\b[^>]*tabindex="0"/)
	expect(result.html).not.toContain('href="javascript:')
	await writeFile(
		page.filePath,
		"---\ntitle: Test\n---\n[Unsafe](javascript:alert(1))"
	)
	await expect(buildDocs(options)).rejects.toThrow(
		/broken internal link "javascript:/
	)
})

it.each([
	{ base: "/", cleanUrls: false },
	{ base: "/handbook/", cleanUrls: true },
])(
	"aligns escaped SEO metadata and indexing output for %j",
	async ({ base, cleanUrls }) => {
		const options = {
			...(await fixture()),
			site: "https://example.com",
			base,
			cleanUrls,
			description: "Site fallback",
		}
		const title = 'API </script><script>alert("test")</script> & SDK'
		const description = 'Use "quotes", <tags> & examples.'
		await writeFile(
			join(options.contentDirectory, "guide.md"),
			`---
title: Guide
navTitle: Short guide
seoTitle: '${title}'
description: '${description}'
updatedAt: 2026-10-11
layout: reference
---
# Install
[Home](/)
`
		)
		await buildDocs({
			...options,
			seo: {
				titleTemplate: "%s — Handbook",
				author: {
					type: "Person",
					name: title,
					url: "https://example.com/author",
				},
				publisher: {
					type: "Organization",
					name: "Example SDK",
					sameAs: ["https://github.com/example"],
				},
			},
		})
		const html = await readFile(
			join(options.outDirectory, cleanUrls ? "guide.html" : "guide/index.html"),
			"utf8"
		)
		const document = parse(html)
		const nodes: DefaultTreeAdapterTypes.Node[] = []
		const visit = (node: DefaultTreeAdapterTypes.Node) => {
			nodes.push(node)
			if ("childNodes" in node) node.childNodes.forEach(visit)
		}
		visit(document)
		const elements = nodes.filter(
			(node): node is DefaultTreeAdapterTypes.Element => "tagName" in node
		)
		const attribute = (node: DefaultTreeAdapterTypes.Element, key: string) =>
			node.attrs.find((entry) => entry.name === key)?.value
		const text = (node: DefaultTreeAdapterTypes.Node): string =>
			"value" in node
				? node.value
				: "childNodes" in node
					? node.childNodes.map(text).join("")
					: ""
		const meta = (key: string) =>
			elements.find(
				(node) =>
					node.tagName === "meta" &&
					(attribute(node, "name") === key ||
						attribute(node, "property") === key)
			)
		const canonical = `https://example.com${base}guide${cleanUrls ? "" : "/"}`
		expect(text(elements.find((node) => node.tagName === "title")!)).toBe(
			`${title} — Handbook`
		)
		expect(attribute(meta("description")!, "content")).toBe(description)
		expect(attribute(meta("twitter:title")!, "content")).toBe(
			`${title} — Handbook`
		)
		expect(attribute(meta("og:url")!, "content")).toBe(canonical)
		expect(elements.filter((node) => node.tagName === "h1").map(text)).toEqual([
			"Guide",
		])
		expect(
			elements
				.filter((node) => node.tagName === "script")
				.some((node) => text(node) === 'alert("test")')
		).toBe(false)
		const entities = elements
			.filter(
				(node) =>
					node.tagName === "script" &&
					attribute(node, "type") === "application/ld+json"
			)
			.map((node) => JSON.parse(text(node)))
		expect(entities).toContainEqual(
			expect.objectContaining({
				"@type": "TechArticle",
				name: title,
				headline: title,
				description,
				dateModified: "2026-10-11",
				author: {
					"@type": "Person",
					name: title,
					url: "https://example.com/author",
				},
				publisher: {
					"@type": "Organization",
					name: "Example SDK",
					sameAs: ["https://github.com/example"],
				},
				url: canonical,
				isPartOf: { "@id": `https://example.com${base}#website` },
			})
		)
		expect(
			await readFile(join(options.outDirectory, "sitemap.xml"), "utf8")
		).toContain(`<loc>${canonical}</loc><lastmod>2026-10-11</lastmod>`)
		if (base === "/")
			expect(
				await readFile(join(options.outDirectory, "robots.txt"), "utf8")
			).toContain("Sitemap: https://example.com/sitemap.xml")
		else
			await expect(
				access(join(options.outDirectory, "robots.txt"))
			).rejects.toThrow()
	}
)

it("uses site-description fallback without inventing an origin", async () => {
	const options = await fixture()
	await buildDocs({ ...options, description: "A helpful handbook." })
	const html = await readFile(join(options.outDirectory, "index.html"), "utf8")
	expect(html).toContain('name="description" content="A helpful handbook."')
	expect(html).toContain(
		'name="twitter:description" content="A helpful handbook."'
	)
	expect(html).not.toContain('rel="canonical"')
	expect(html).not.toContain('property="og:url"')
	expect(html).not.toContain("application/ld+json")
	await expect(
		access(join(options.outDirectory, "sitemap.xml"))
	).rejects.toThrow()
	await expect(
		access(join(options.outDirectory, "robots.txt"))
	).rejects.toThrow()
})
