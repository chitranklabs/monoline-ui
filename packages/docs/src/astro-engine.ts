import { satteri } from "@astrojs/markdown-satteri"
import mdx from "@astrojs/mdx"
import { type AstroIntegration, build } from "astro"
import {
	mkdir,
	mkdtemp,
	readFile,
	readdir,
	realpath,
	rm,
	writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

import { collectAssets, createAssetUrl } from "./assets.ts"
import { type MonolineDocsConfig, defineConfig, safeRoute } from "./config.ts"
import { type DocumentationPage, discoverPages } from "./content.ts"
import { createHeadingId } from "./heading-id.ts"
import { createPageLinks } from "./links.ts"
import { buildNavigation } from "./navigation.ts"
import { publishFiles, resolveOutput } from "./output.ts"
import {
	type RenderedPage,
	inspectRenderedPage,
	validateRenderedLinks,
} from "./rendered-content.ts"

export interface StagedAstroSite {
	directory: string
	pages: DocumentationPage[]
	dispose(): Promise<void>
}

/** Internal parity path: stage, validate, then update only managed output files. */
export async function buildAstroDocs(config: MonolineDocsConfig) {
	const options = defineConfig(config)
	const output = await resolveOutput(options)
	const staged = await buildAstroSite(options)
	try {
		const files = new Map<string, Uint8Array>()
		for (const entry of await readdir(staged.directory, {
			recursive: true,
			withFileTypes: true,
		})) {
			if (!entry.isFile()) continue
			const name = relative(
				staged.directory,
				join(entry.parentPath, entry.name)
			)
				.split(sep)
				.join("/")
			files.set(name, await readFile(join(staged.directory, name)))
		}
		await publishFiles(output, files)
		return { pages: staged.pages.length, outDirectory: output }
	} finally {
		await staged.dispose()
	}
}

/** Internal renderer only: never writes to the configured final output. */
export async function buildAstroSite(
	config: MonolineDocsConfig
): Promise<StagedAstroSite> {
	const options = defineConfig(config)
	const content = await realpath(options.contentDirectory)
	const pages = await discoverPages(content, {
		environment: options.environment,
	})
	const assets = await collectAssets(options.assetsDirectory)
	const assetUrl = createAssetUrl(assets, options.base)
	const links = createPageLinks(pages, content, options.base, assetUrl)
	if (!pages.some((page) => page.route === "/"))
		throw new Error("Documentation requires an index.md or index.mdx home page")
	for (const page of pages) {
		if (!safeRoute(page.route))
			throw new Error(`Unsupported documentation route: ${page.route}`)
	}
	const navigation = buildNavigation(pages, options.navigation)
	const workspace = await mkdtemp(join(tmpdir(), "monoline-astro-"))
	const directory = join(workspace, "output")
	const dispose = () => rm(workspace, { recursive: true, force: true })
	try {
		await mkdir(join(workspace, "source"))
		const virtualId = "virtual:monoline-docs/pages"
		const resolvedId = `\0${virtualId}`
		const sources = new Map(
			pages.map((page) => [page.filePath.replaceAll("\\", "/"), page])
		)
		const headingIds = new WeakMap<object, ReturnType<typeof createHeadingId>>()
		const moduleSource = [
			...pages.map(
				(page, index) =>
					`import * as document${index} from ${JSON.stringify(page.filePath.replaceAll("\\", "/"))};`
			),
			`export const site = ${JSON.stringify({
				title: options.title,
				description: options.description,
				site: options.site,
				base: options.base,
				lang: options.lang,
				defaultMode: options.defaultMode,
				stylesheet: options.stylesheet
					? assetUrl(options.stylesheet)
					: undefined,
				logo: options.logo
					? { ...options.logo, src: assetUrl(options.logo.src) }
					: undefined,
				headerLinks: options.headerLinks,
				navigation,
				noindex: options.environment === "development" || !options.indexing,
			})};`,
			`export const pages = [${pages.map((page, index) => `{route:${JSON.stringify(page.route)},metadata:${JSON.stringify(page.metadata)},Content:document${index}.Content ?? document${index}.default}`).join(",")}];`,
		].join("\n")
		const integration: AstroIntegration = {
			name: "monoline-docs",
			hooks: {
				"astro:config:done"({ setAdapter }) {
					setAdapter({
						name: "monoline-staging",
						entrypointResolution: "auto",
						adapterFeatures: {
							buildOutput: "static",
							preserveBuildServerDir: true,
						},
						supportedAstroFeatures: { staticOutput: "stable" },
					})
				},
				"astro:config:setup"({ injectRoute, updateConfig }) {
					injectRoute({
						pattern: "/[...slug]",
						entrypoint: fileURLToPath(
							new URL("./astro-page.astro", import.meta.url)
						),
						prerender: true,
					})
					updateConfig({
						vite: {
							plugins: [
								{
									name: "monoline-documents",
									enforce: "pre",
									resolveId(id) {
										if (id === virtualId) return resolvedId
										// The owned staging root has no node_modules; use this package's engine.
										if (id === "astro" || id.startsWith("astro/"))
											return fileURLToPath(import.meta.resolve(id))
									},
									load(id) {
										if (id === resolvedId) return moduleSource
									},
								},
							],
						},
					})
				},
			},
		}
		await build({
			root: workspace,
			configFile: false,
			srcDir: "./source/",
			publicDir: "./public/",
			outDir: directory,
			build: { server: "./.server/" },
			cacheDir: "./cache/",
			output: "static",
			base: options.base,
			trailingSlash: "always",
			logLevel: "silent",
			markdown: {
				syntaxHighlight: "prism",
				processor: satteri({
					hastPlugins: [
						{
							name: "monoline-heading-ids",
							before(_tree, context) {
								headingIds.set(context.data, createHeadingId())
							},
							element: {
								filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
								visit(node, context) {
									const id = headingIds.get(context.data)!(
										context.textContent(node)
									)
									context.setProperty(node, "id", id)
								},
							},
						},
						{
							name: "monoline-authoring-ui",
							element: [
								{
									filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
									visit(node, context) {
										const id = String(node.properties.id)
										const text = context.textContent(node)
										context.appendChild(node, {
											type: "element",
											tagName: "a",
											properties: {
												className: ["heading-anchor"],
												href: `#${encodeURIComponent(id)}`,
												ariaLabel: `Link to ${text}`,
											},
											children: [
												{
													type: "element",
													tagName: "span",
													properties: { ariaHidden: "true" },
													children: [{ type: "text", value: "#" }],
												},
											],
										})
									},
								},
								{
									filter: ["pre"],
									visit(node, context) {
										context.setProperty(node, "tabIndex", 0)
										context.wrapNode(node, {
											type: "element",
											tagName: "div",
											properties: { className: ["code-block"] },
											children: [
												{
													type: "element",
													tagName: "button",
													properties: {
														className: ["copy-code"],
														type: "button",
														ariaLabel: "Copy code block",
														hidden: true,
													},
													children: [{ type: "text", value: "Copy" }],
												},
												{
													type: "element",
													tagName: "span",
													properties: {
														className: ["copy-status"],
														role: "status",
													},
													children: [],
												},
											],
										})
									},
								},
								{
									filter: ["table"],
									visit(node, context) {
										context.setProperty(node, "tabIndex", 0)
									},
								},
								{
									filter: ["blockquote"],
									visit(node, context) {
										const paragraphIndex = node.children.findIndex(
											(child) =>
												child.type === "element" && child.tagName === "p"
										)
										const paragraph = node.children[paragraphIndex]
										if (
											paragraph?.type !== "element" ||
											paragraph.tagName !== "p"
										)
											return
										const first = paragraph.children.find(
											(child) => child.type === "text"
										)
										if (!first || first.type !== "text") return
										const match = context
											.textContent(paragraph)
											.match(/^\[!(NOTE|TIP|WARNING|CAUTION)\](?:\s|$)/)
										if (!match) return
										const kind = match[1]!.toLowerCase()
										const label = kind[0]!.toUpperCase() + kind.slice(1)
										context.replaceNode(node, {
											...node,
											tagName: "aside",
											properties: {
												...node.properties,
												className: ["callout", `callout-${kind}`],
												role: "note",
												ariaLabel: label,
											},
											children: [
												{
													type: "element",
													tagName: "p",
													properties: { className: ["callout-title"] },
													children: [{ type: "text", value: label }],
												},
												{
													...paragraph,
													children: [
														{
															...first,
															value: first.value.replace(
																/^\[!(?:NOTE|TIP|WARNING|CAUTION)\]\s*/,
																""
															),
														},
														...paragraph.children.slice(1),
													],
												},
												...node.children.slice(paragraphIndex + 1),
											],
										})
									},
								},
							],
						},
					],
					mdastPlugins: [
						{
							name: "monoline-markdown-policy",
							before(_tree, context) {
								const page =
									context.fileURL &&
									sources.get(
										fileURLToPath(context.fileURL).replaceAll("\\", "/")
									)
								// Astro reads Markdown directly; filter metadata in its processor before layout resolution.
								if (page && context.data.astro)
									context.data.astro.frontmatter = { ...page.metadata }
							},
							html(node) {
								return { type: "text", value: node.value }
							},
							heading(node, context) {
								if (node.depth === 1) context.setProperty(node, "depth", 2)
							},
							link(node, context) {
								const page =
									context.fileURL &&
									sources.get(
										fileURLToPath(context.fileURL).replaceAll("\\", "/")
									)
								if (page)
									context.setProperty(
										node,
										"url",
										links.resolve(page, node.url)
									)
							},
							definition(node, context) {
								const page =
									context.fileURL &&
									sources.get(
										fileURLToPath(context.fileURL).replaceAll("\\", "/")
									)
								if (page)
									context.setProperty(
										node,
										"url",
										links.resolve(page, node.url)
									)
							},
							image(node, context) {
								context.setProperty(node, "url", assetUrl(node.url))
							},
						},
					],
				}),
			},
			integrations: [mdx(), integration],
		})
		for (const [name, data] of assets) {
			await mkdir(dirname(join(directory, name)), { recursive: true })
			await writeFile(join(directory, name), data)
		}
		await writeFile(
			join(directory, "docs.css"),
			(await readFile(new URL("./theme-tokens.css", import.meta.url), "utf8")) +
				(await readFile(new URL("./docs.css", import.meta.url), "utf8"))
		)
		for (const name of ["theme.js", "client.js", "search.js"])
			await writeFile(
				join(directory, name),
				await readFile(new URL(`./${name}`, import.meta.url), "utf8")
			)
		const home = options.base
		await writeFile(
			join(directory, "404.html"),
			`<!doctype html><html lang="${options.lang}" data-theme="${options.defaultMode}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="robots" content="noindex"><title>Page not found</title><script src="${options.base}theme.js"></script><link rel="stylesheet" href="${options.base}docs.css">${options.stylesheet ? `<link rel="stylesheet" href="${assetUrl(options.stylesheet)}">` : ""}</head><body><main><h1>Page not found</h1><p>Check the address or <a href="${home}">browse the documentation</a>.</p></main></body></html>`
		)
		if (
			options.site &&
			options.indexing &&
			options.environment === "production"
		) {
			const href = (route: string) =>
				options.base + (route === "/" ? "" : route.slice(1) + "/")
			await writeFile(
				join(directory, "sitemap.xml"),
				`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${new URL(href(page.route), options.site).href}</loc></url>`).join("")}</urlset>`
			)
			if (options.base === "/")
				await writeFile(
					join(directory, "robots.txt"),
					`User-agent: *\nAllow: /\nSitemap: ${options.site}/sitemap.xml\n`
				)
		}
		const files = new Set<string>()
		for (const entry of await readdir(directory, {
			recursive: true,
			withFileTypes: true,
		})) {
			if (entry.isSymbolicLink())
				throw new Error(`Unexpected staged symlink: ${entry.name}`)
			if (entry.isFile())
				files.add(
					relative(directory, join(entry.parentPath, entry.name))
						.split(sep)
						.join("/")
				)
		}
		const documents = new Map<string, RenderedPage>()
		const pageFile = (route: string) =>
			join(
				directory,
				route === "/" ? "index.html" : `${route.slice(1)}/index.html`
			)
		for (const page of pages)
			documents.set(
				page.route,
				inspectRenderedPage(await readFile(pageFile(page.route), "utf8"), page)
			)
		validateRenderedLinks(documents, files, options.base, options.site)
		for (const [route, document] of documents)
			await writeFile(pageFile(route), document.html)
		await writeFile(
			join(directory, "search-index.json"),
			JSON.stringify(
				pages.flatMap((page) =>
					documents.get(page.route)!.sections.map((section) => ({
						title: page.metadata.title,
						heading: section.heading,
						text: section.text,
						url:
							options.base +
							(page.route === "/" ? "" : page.route.slice(1) + "/") +
							(section.id ? `#${encodeURIComponent(section.id)}` : ""),
					}))
				)
			)
		)
		return { directory, pages, dispose }
	} catch (error) {
		await dispose()
		throw error
	}
}
