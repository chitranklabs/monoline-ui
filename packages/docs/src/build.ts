import {
	lstat,
	mkdir,
	readFile,
	readdir,
	realpath,
	unlink,
	writeFile,
} from "node:fs/promises"
import {
	basename,
	dirname,
	isAbsolute,
	join,
	relative,
	resolve,
} from "node:path"

import { collectAssets, isAssetName } from "./assets.ts"
import { discoverPages } from "./content.ts"
import type { MonolineDocsConfig } from "./index.ts"
import { buildNavigation } from "./navigation.ts"
import type { NavigationItem } from "./navigation.ts"
import { escapeHtml as escape, renderMarkdown } from "./render.ts"

export interface BuildOptions extends MonolineDocsConfig {
	contentDirectory: string
	outDirectory: string
	base?: string
	assetsDirectory?: string
	stylesheet?: string
	environment?: "production" | "development"
}

function safeRoute(route: string): boolean {
	return (
		route === "/" || /^\/(?:[\p{L}\p{N}_-]+\/)*[\p{L}\p{N}_-]+$/u.test(route)
	)
}

async function canonicalPath(path: string): Promise<string> {
	try {
		return await realpath(path)
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
		return join(await canonicalPath(dirname(path)), basename(path))
	}
}

/** Build a local, static Markdown site. Paths are relative to the caller's cwd. */
export async function buildDocs(options: BuildOptions) {
	if (!options.title?.trim()) throw new Error("A site title is required")
	const base = options.base ?? "/"
	if (base !== "/" && (!base.endsWith("/") || !safeRoute(base.slice(0, -1)))) {
		throw new Error("base must be / or an absolute directory path ending in /")
	}
	const content = await realpath(resolve(options.contentDirectory))
	const output = await canonicalPath(resolve(options.outDirectory))
	const inside = (parent: string, child: string) => {
		const path = relative(parent, child)
		return path === "" || (!path.startsWith("..") && !isAbsolute(path))
	}
	if (inside(content, output) || inside(output, content))
		throw new Error("Content and output directories must not overlap")
	if (options.assetsDirectory) {
		const assetsPath = await realpath(resolve(options.assetsDirectory))
		if (inside(assetsPath, output) || inside(output, assetsPath))
			throw new Error("Assets and output directories must not overlap")
	}
	const assets = await collectAssets(options.assetsDirectory)
	const assetUrl = (link: string): string => {
		if (/^https:\/\//i.test(link)) return link
		const url = new URL(link, "https://docs.invalid/")
		const name = decodeURIComponent(url.pathname).slice(1)
		if (
			url.origin !== "https://docs.invalid" ||
			!isAssetName(name) ||
			!assets.has(name)
		)
			throw new Error(
				`Missing local asset: ${link}. Use /assets/ paths from assetsDirectory.`
			)
		return (
			base +
			name.split("/").map(encodeURIComponent).join("/") +
			url.search +
			url.hash
		)
	}
	if (
		options.stylesheet &&
		(!options.stylesheet.startsWith("/assets/") ||
			!options.stylesheet.endsWith(".css"))
	)
		throw new Error("stylesheet must name a local /assets/*.css file")
	const stylesheet = options.stylesheet
		? `<link rel="stylesheet" href="${escape(assetUrl(options.stylesheet))}">`
		: ""
	const pages = await discoverPages(content, {
		environment: options.environment ?? "production",
	})
	if (!pages.length) throw new Error("No published documentation pages found")
	if (!pages.some((page) => page.route === "/"))
		throw new Error(
			"A published index.md page is required for the documentation home"
		)
	for (const page of pages)
		if (!safeRoute(page.route))
			throw new Error(`Unsupported route: ${page.route}`)
	const navigation = buildNavigation(pages, options.navigation)
	const href = (route: string) =>
		base + (route === "/" ? "" : route.slice(1) + "/")
	const byRoute = new Map(pages.map((page) => [page.route as string, page]))
	const byFile = new Map(pages.map((page) => [resolve(page.filePath), page]))
	const references: Array<{ from: string; route: string; hash: string }> = []
	const documents = new Map(
		pages.map((page) => [
			page.route as string,
			renderMarkdown(
				page,
				(link) => {
					if (/^(?:https?:|mailto:|tel:|\/\/)/i.test(link)) return link
					if (link.startsWith("/assets/")) return assetUrl(link)
					const url = new URL(
						link,
						`https://docs.invalid${page.route === "/" ? "/" : page.route + "/"}`
					)
					const path = decodeURIComponent(url.pathname)
					let target
					if (/\.mdx?$/.test(path)) {
						const sourcePath = decodeURIComponent(link.split(/[?#]/)[0]!)
						target = byFile.get(
							resolve(
								sourcePath.startsWith("/") ? content : dirname(page.filePath),
								sourcePath.replace(/^\//, "")
							)
						)
					} else target = byRoute.get(path.replace(/\/$/, "") || "/")
					if (!target)
						throw new Error(`${page.filePath}: broken internal link "${link}"`)
					references.push({
						from: page.filePath,
						route: target.route,
						hash: decodeURIComponent(url.hash.slice(1)),
					})
					return href(target.route) + url.search + url.hash
				},
				assetUrl
			),
		])
	)
	for (const reference of references) {
		if (
			reference.hash &&
			reference.hash !== "content" &&
			!documents
				.get(reference.route)!
				.headings.some((heading) => heading.id === reference.hash)
		)
			throw new Error(
				`${reference.from}: missing heading #${reference.hash} on ${reference.route}`
			)
	}
	const files = new Map<string, string | Uint8Array>(assets)
	const nav = (items: NavigationItem[], current: string): string =>
		`<ul>${items
			.map((item) =>
				"href" in item
					? `<li><a href="${escape(href(item.href))}"${item.href === current ? ' aria-current="page"' : ""}>${escape(item.label)}</a></li>`
					: `<li><span class="group">${escape(item.label)}</span>${nav(item.items, current)}</li>`
			)
			.join("")}</ul>`
	for (const page of pages) {
		const rendered = documents.get(page.route)!
		const index = navigation.sequence.findIndex(
			(entry) => entry.href === page.route
		)
		const previous = index > 0 ? navigation.sequence[index - 1] : undefined
		const next = index >= 0 ? navigation.sequence[index + 1] : undefined
		const pager = [
			previous &&
				`<a rel="prev" href="${escape(href(previous.href))}">Previous: ${escape(previous.label)}</a>`,
			next &&
				`<a rel="next" href="${escape(href(next.href))}">Next: ${escape(next.label)}</a>`,
		]
			.filter(Boolean)
			.join("")
		const description = page.metadata.description ?? options.description ?? ""
		files.set(
			page.route === "/" ? "index.html" : `${page.route.slice(1)}/index.html`,
			`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>${escape(page.metadata.title)} | ${escape(options.title)}</title><meta name="description" content="${escape(description)}"><script src="${escape(base)}theme.js"></script><link rel="stylesheet" href="${escape(base)}docs.css">${stylesheet}<script src="${escape(base)}client.js" defer></script></head>
<body><a class="skip" href="#content">Skip to content</a><header><a class="brand" href="${escape(href("/"))}">${escape(options.title)}</a><label class="theme-control" hidden>Theme <select aria-label="Color theme"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label></header>
<div class="layout"><aside class="sidebar"><details open><summary>Navigation</summary><nav aria-label="Documentation">${nav(navigation.items, page.route)}</nav></details></aside>
<main id="content" tabindex="-1"><h1>${escape(page.metadata.title)}</h1>${description ? `<p class="description">${escape(description)}</p>` : ""}<article>${rendered.html}</article><nav class="pager" aria-label="Page navigation">${pager}</nav></main>
<aside class="toc"><nav aria-label="On this page"><strong>On this page</strong><ul>${rendered.headings
				.filter((heading) => heading.level <= 3)
				.map(
					(heading) =>
						`<li><a href="#${escape(heading.id)}">${escape(heading.text)}</a></li>`
				)
				.join("")}</ul></nav></aside></div></body></html>`
		)
	}
	files.set(
		"docs.css",
		await readFile(new URL("./docs.css", import.meta.url), "utf8")
	)
	for (const name of ["theme.js", "client.js"])
		files.set(
			name,
			await readFile(new URL(`./${name}`, import.meta.url), "utf8")
		)
	files.set(
		"404.html",
		`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>Page not found</title><script src="${escape(base)}theme.js"></script><link rel="stylesheet" href="${escape(base)}docs.css">${stylesheet}</head><body><main><h1>Page not found</h1><p>Check the address or <a href="${escape(href("/"))}">browse the documentation</a>.</p></main></body></html>`
	)
	// Refuse unrelated output directories; only replace files recorded by this builder.
	const manifest = ".monoline-generated.json"
	let previousFiles: string[] = []
	try {
		const entries = await readdir(output)
		if (entries.length && !entries.includes(manifest))
			throw new Error("Output directory is not managed by Monoline Docs")
		if (entries.includes(manifest)) {
			const previous: unknown = JSON.parse(
				await readFile(join(output, manifest), "utf8")
			)
			if (
				!Array.isArray(previous) ||
				previous.some(
					(name) =>
						typeof name !== "string" ||
						(!isAssetName(name) &&
							!/^(?:[\p{L}\p{N}_-]+\/)*(?:index\.html|404\.html|docs\.css|theme\.js|client\.js)$/u.test(
								name
							))
				)
			)
				throw new Error("Invalid generated-file manifest")
			previousFiles = previous
		}
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
	}
	for (const name of new Set([...files.keys(), ...previousFiles, manifest])) {
		const segments = name.split("/")
		for (let length = 1; length <= segments.length; length += 1) {
			const target = join(output, ...segments.slice(0, length))
			try {
				const stat = await lstat(target)
				if (stat.isSymbolicLink())
					throw new Error(
						`Refusing generated path through a symbolic link: ${target}`
					)
				if (
					length === segments.length &&
					files.has(name) &&
					!previousFiles.includes(name)
				)
					throw new Error(
						`Refusing to overwrite an untracked output file: ${target}`
					)
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
			}
		}
	}
	for (const [name, value] of files) {
		await mkdir(dirname(join(output, name)), { recursive: true })
		await writeFile(join(output, name), value)
	}
	for (const name of previousFiles)
		if (!files.has(name))
			await unlink(join(output, name)).catch((error: NodeJS.ErrnoException) => {
				if (error.code !== "ENOENT") throw error
			})
	await writeFile(join(output, manifest), JSON.stringify([...files.keys()]))
	return { pages: pages.length, outDirectory: output }
}
