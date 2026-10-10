import { satteri, satteriHighlightPlugin } from "@astrojs/markdown-satteri"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
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
import { dirname, isAbsolute, join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

import { collectAssets, createAssetUrl } from "./assets.ts"
import { type MonolineDocsConfig, defineConfig, safeRoute } from "./config.ts"
import { type DocumentationPage, discoverPages } from "./content.ts"
import { createHeadingId } from "./heading-id.ts"
import { highlightCodeBlock } from "./highlight-code.ts"
import { createPageLinks } from "./links.ts"
import { buildNavigation } from "./navigation.ts"
import { loadOpenApi } from "./openapi.ts"
import { publishFiles, resolveOutput } from "./output.ts"
import {
	type RenderedPage,
	inspectRenderedPage,
	validateRenderedLinks,
} from "./rendered-content.ts"
import { pageFile, routeHref } from "./urls.ts"

export interface StagedAstroSite {
	directory: string
	pages: DocumentationPage[]
	dependencies: string[]
	dispose(): Promise<void>
}

const inside = (parent: string, child: string) => {
	const path = relative(parent, child)
	return path === "" || (!path.startsWith("..") && !isAbsolute(path))
}

function resolveExportLinks(
	source: string,
	resolveLink: (link: string) => string,
	resolveAsset: (link: string) => string
): string {
	let fence: string | undefined
	const rewrite = (text: string) =>
		text.replace(
			/(!?\[[^\]\n]*\]\()([^\s)]+)(\))/g,
			(_match, opening: string, link: string, closing: string) =>
				`${opening}${opening.startsWith("!") ? (link.startsWith("/assets/") ? resolveAsset(link) : link) : resolveLink(link)}${closing}`
		)
	return source.replace(/^.*$/gm, (line) => {
		const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/)
		if (fence) {
			if (
				marker &&
				marker[1]![0] === fence[0] &&
				marker[1]!.length >= fence.length &&
				!marker[2]!.trim()
			)
				fence = undefined
			return line
		}
		if (marker) {
			fence = marker[1]
			return line
		}
		const reference = line.match(/^( {0,3}\[[^\]]+\]:\s*)(\S+)(.*)$/)
		if (reference)
			return `${reference[1]}${resolveLink(reference[2]!)}${reference[3]}`
		let result = ""
		let cursor = 0
		while (cursor < line.length) {
			const start = line.indexOf("`", cursor)
			if (start < 0) return result + rewrite(line.slice(cursor))
			result += rewrite(line.slice(cursor, start))
			const marker = line.slice(start).match(/^`+/)![0]
			const end = line.indexOf(marker, start + marker.length)
			if (end < 0) return result + line.slice(start)
			result += line.slice(start, end + marker.length)
			cursor = end + marker.length
		}
		return result
	})
}

/** Internal parity path: stage, validate, then update only managed output files. */
export async function buildAstroDocsWithDependencies(
	config: MonolineDocsConfig
) {
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
		return {
			pages: staged.pages.length,
			outDirectory: output,
			dependencies: staged.dependencies,
		}
	} finally {
		await staged.dispose()
	}
}

export async function buildAstroDocs(config: MonolineDocsConfig) {
	const { dependencies: _dependencies, ...result } =
		await buildAstroDocsWithDependencies(config)
	return result
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
	const generated = options.openapi
		? await loadOpenApi(options.openapi.file, options.openapi.route)
		: undefined
	if (generated) {
		const routes = new Set(pages.map((page) => page.route))
		for (const page of generated.pages) {
			if (routes.has(page.route))
				throw new Error(
					`${generated.dependency}: duplicate documentation route ${page.route}`
				)
			pages.push(page)
		}
		pages.sort((a, b) => a.route.localeCompare(b.route))
	}
	const assets = await collectAssets(options.assetsDirectory)
	const assetUrl = createAssetUrl(assets, options.base)
	const appearance = options.appearance
	const fontRules: string[] = []
	const tokens: string[] = []
	if (appearance.radius !== undefined)
		tokens.push(`--radius:${appearance.radius}rem`)
	if (appearance.accent)
		tokens.push(
			`--accent:light-dark(${appearance.accent.light},${appearance.accent.dark})`
		)
	for (const role of ["body", "code"] as const) {
		const font = appearance.fonts?.[role]
		if (!font) continue
		const family = JSON.stringify(font.family)
		if (font.src)
			fontRules.push(
				`@font-face{font-family:${family};src:url(${JSON.stringify(assetUrl(font.src))});font-display:optional}`
			)
		tokens.push(
			`--font-${role}:${family},${role === "body" ? "system-ui,sans-serif" : "ui-monospace,monospace"}`
		)
	}
	const appearanceCss = `${fontRules.join("\n")}\n:root{${tokens.join(";")}}`
	const published = pages.filter((page) => !page.metadata.noindex)
	const markdownPath = (page: DocumentationPage) =>
		page.route === "/"
			? "index.md"
			: `${page.route.slice(1)}${options.cleanUrls ? ".md" : "/index.md"}`
	const exportFiles = new Set(published.map(markdownPath))
	if (options.indexing && options.environment === "production") {
		exportFiles.add("llms.txt")
		exportFiles.add("llms-full.txt")
	}
	const links = createPageLinks(
		pages,
		content,
		options.base,
		assetUrl,
		options.cleanUrls,
		exportFiles
	)
	if (!pages.some((page) => page.route === "/"))
		throw new Error("Documentation requires an index.md or index.mdx home page")
	for (const page of pages) {
		if (!safeRoute(page.route))
			throw new Error(`Unsupported documentation route: ${page.route}`)
	}
	const navigationConfig =
		options.navigation ??
		(generated
			? [
					...pages
						.filter((page) => !generated.pages.includes(page))
						.map((page) => ({
							label: page.metadata.navTitle ?? page.metadata.title,
							href: page.route,
						})),
					...generated.navigation,
				]
			: undefined)
	const navigation = buildNavigation(pages, navigationConfig)
	const workspace = await realpath(
		await mkdtemp(join(tmpdir(), "monoline-astro-"))
	)
	const directory = join(workspace, "output")
	const dependencies = new Set<string>()
	if (generated) dependencies.add(generated.dependency)
	const runtime = dirname(fileURLToPath(import.meta.url))
	const dispose = () => rm(workspace, { recursive: true, force: true })
	try {
		await mkdir(join(workspace, "source"))
		if (generated) {
			for (const [index, page] of generated.pages.entries()) {
				page.filePath = join(workspace, "source", `openapi-${index}.md`)
				await writeFile(page.filePath, page.source)
			}
		}
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
				cleanUrls: options.cleanUrls,
				lang: options.lang,
				defaultMode: options.defaultMode,
				density: appearance.density,
				sidebarEnabled: options.sidebar.enabled,
				showLastUpdated: options.content.showLastUpdated,
				copyPageLink: options.content.copyPageLink,
				primaryAction: options.header.primaryAction,
				announcement: options.header.announcement,
				favicon: options.branding.favicon
					? assetUrl(options.branding.favicon)
					: undefined,
				socialImage: options.seo.socialImage
					? options.site
						? new URL(assetUrl(options.seo.socialImage), options.site).href
						: undefined
					: undefined,
				integrationScripts:
					options.integrations?.scripts?.map((script) =>
						script.startsWith("/assets/") ? assetUrl(script) : script
					) ?? [],
				stylesheet: options.stylesheet
					? assetUrl(options.stylesheet)
					: undefined,
				logo: options.logo
					? { ...options.logo, src: assetUrl(options.logo.src) }
					: undefined,
				headerLinks: options.headerLinks,
				footer: options.footer ?? {},
				navigation,
				noindex: options.environment === "development" || !options.indexing,
				searchEnabled: options.search.enabled,
				markdownEnabled: true,
				titleTemplate: options.seo.titleTemplate,
			})};`,
			`export const pages = [${pages.map((page, index) => `{route:${JSON.stringify(page.route)},metadata:${JSON.stringify(page.metadata)},markdownHref:${JSON.stringify(!page.metadata.noindex ? options.base + (page.route === "/" ? "index.md" : page.route.slice(1) + (options.cleanUrls ? ".md" : "/index.md")) : undefined)},editHref:${JSON.stringify(options.editLink && !generated?.pages.includes(page) ? options.editLink.href.replace("{path}", relative(content, page.filePath).split(sep).map(encodeURIComponent).join("/")) : undefined)},editLabel:${JSON.stringify(options.editLink?.label ?? "Edit this page")},Content:document${index}.Content ?? document${index}.default}`).join(",")}];`,
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
										// Build-time highlighting must retain package-relative native bindings.
										if (id === "@astrojs/markdown-satteri" || id === "prismjs")
											return {
												id: fileURLToPath(import.meta.resolve(id)),
												external: true,
											}
										// The owned staging root has no node_modules; use this package's engine.
										if (
											id === "astro" ||
											id.startsWith("astro/") ||
											id === "@astrojs/react" ||
											id.startsWith("@astrojs/react/")
										)
											return fileURLToPath(import.meta.resolve(id))
									},
									load(id) {
										if (id === resolvedId) return moduleSource
									},
									moduleParsed({ id }) {
										const path = id.split("?", 1)[0]!
										if (
											isAbsolute(path) &&
											!path.includes(`${sep}node_modules${sep}`) &&
											!inside(content, path) &&
											!inside(workspace, path) &&
											!inside(runtime, path)
										)
											dependencies.add(path)
									},
								},
							],
						},
					})
				},
			},
		}
		const safeHighlight = satteriHighlightPlugin(highlightCodeBlock, undefined)
		await build({
			root: workspace,
			configFile: false,
			srcDir: "./source/",
			publicDir: "./public/",
			outDir: directory,
			build: {
				format: options.cleanUrls ? "file" : "directory",
				server: "./.server/",
			},
			cacheDir: "./cache/",
			output: "static",
			base: options.base,
			trailingSlash: options.cleanUrls ? "never" : "always",
			logLevel: "silent",
			markdown: {
				syntaxHighlight: false,
				processor: satteri({
					hastPlugins: [
						safeHighlight,
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
													tagName: "svg",
													properties: {
														ariaHidden: "true",
														viewBox: "0 0 24 24",
														width: 16,
														height: 16,
														fill: "none",
														stroke: "currentColor",
														strokeWidth: "1.5",
														focusable: "false",
													},
													children: [
														{
															type: "element",
															tagName: "path",
															properties: {
																d: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2",
															},
															children: [],
														},
													],
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
											properties: {
												className: ["code-block"],
												"data-single-line": !context
													.textContent(node)
													.replace(/\n$/, "")
													.includes("\n")
													? "true"
													: undefined,
											},
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
								if (page && context.data.astro) {
									const { layout: _layout, ...frontmatter } = page.metadata
									context.data.astro.frontmatter = frontmatter
								}
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
			integrations: [mdx(), ...(options.react ? [react()] : []), integration],
		})
		for (const [name, data] of assets) {
			await mkdir(dirname(join(directory, name)), { recursive: true })
			await writeFile(join(directory, name), data)
		}
		await writeFile(
			join(directory, "docs.css"),
			(await readFile(new URL("./theme-tokens.css", import.meta.url), "utf8")) +
				(await readFile(new URL("./docs.css", import.meta.url), "utf8")) +
				"\n" +
				appearanceCss
		)
		for (const name of [
			"theme.js",
			"client.js",
			...(options.search.enabled ? ["search.js"] : []),
		])
			await writeFile(
				join(directory, name),
				await readFile(new URL(`./${name}`, import.meta.url), "utf8")
			)
		const home = options.base
		await writeFile(
			join(directory, "404.html"),
			`<!doctype html><html lang="${options.lang}" data-theme="${options.defaultMode}" data-density="${options.appearance.density}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="robots" content="noindex"><title>Page not found</title><script src="${options.base}theme.js"></script><link rel="stylesheet" href="${options.base}docs.css">${options.stylesheet ? `<link rel="stylesheet" href="${assetUrl(options.stylesheet)}">` : ""}</head><body><main class="not-found"><p>404</p><h1>Page not found</h1><p>Check the address or return to the documentation.</p><a class="primary-action" href="${home}">Browse documentation</a></main></body></html>`
		)
		if (
			options.site &&
			options.indexing &&
			options.environment === "production"
		) {
			await writeFile(
				join(directory, "sitemap.xml"),
				`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages
					.filter((page) => !page.metadata.noindex)
					.map(
						(page) =>
							`<url><loc>${new URL(routeHref(page.route, options.base, options.cleanUrls), options.site).href}</loc></url>`
					)
					.join("")}</urlset>`
			)
			if (options.base === "/")
				await writeFile(
					join(directory, "robots.txt"),
					`User-agent: *\nAllow: /\nSitemap: ${options.site}/sitemap.xml\n`
				)
		}
		// Validate links to exports against the same routes used to write them below.
		const files = new Set(exportFiles)
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
		for (const page of pages)
			documents.set(
				page.route,
				inspectRenderedPage(
					await readFile(
						join(directory, pageFile(page.route, options.cleanUrls)),
						"utf8"
					),
					page
				)
			)
		validateRenderedLinks(
			documents,
			files,
			options.base,
			options.site,
			options.cleanUrls
		)
		for (const [route, document] of documents)
			await writeFile(
				join(directory, pageFile(route, options.cleanUrls)),
				document.html
			)
		const markdownPages = published.map((page) => {
			const markdown =
				page.format === "md"
					? resolveExportLinks(
							page.source,
							(link) => links.resolve(page, link),
							assetUrl
						)
					: documents.get(page.route)!.markdown
			const path = markdownPath(page)
			return {
				page,
				path,
				markdown:
					page.format === "md"
						? `${markdown.trim()}\n`
						: `# ${page.metadata.title}\n\n${markdown.trim()}\n`,
			}
		})
		for (const entry of markdownPages) {
			await mkdir(dirname(join(directory, entry.path)), { recursive: true })
			await writeFile(join(directory, entry.path), entry.markdown)
		}
		if (options.indexing && options.environment === "production") {
			await writeFile(
				join(directory, "llms.txt"),
				`# ${options.title}\n\n${options.description ?? ""}\n\n${markdownPages.map(({ page, path }) => `- [${page.metadata.title}](${options.base}${path})${page.metadata.description ? `: ${page.metadata.description}` : ""}`).join("\n")}\n`
			)
			await writeFile(
				join(directory, "llms-full.txt"),
				markdownPages
					.map(
						({ page, markdown }) =>
							`<!-- ${routeHref(page.route, options.base, options.cleanUrls)} -->\n${markdown}`
					)
					.join("\n---\n\n")
			)
		}
		if (options.search.enabled)
			await writeFile(
				join(directory, "search-index.json"),
				JSON.stringify(
					pages
						.filter(
							(page) => page.metadata.search !== false && !page.metadata.noindex
						)
						.flatMap((page) =>
							documents.get(page.route)!.sections.map((section) => ({
								scope:
									page.metadata.layout === "reference" ||
									generated?.pages.includes(page)
										? "api"
										: "guide",
								title: page.metadata.title,
								heading: section.heading,
								text: section.text,
								url:
									routeHref(page.route, options.base, options.cleanUrls) +
									(section.id ? `#${encodeURIComponent(section.id)}` : ""),
							}))
						)
				)
			)
		return { directory, pages, dependencies: [...dependencies].sort(), dispose }
	} catch (error) {
		await dispose()
		throw error
	}
}
