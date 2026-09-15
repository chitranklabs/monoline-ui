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
			`export const site = ${JSON.stringify({ title: options.title, lang: options.lang })};`,
			`export const pages = [${pages.map((page, index) => `{route:${JSON.stringify(page.route)},metadata:${JSON.stringify(page.metadata)},Content:document${index}.Content ?? document${index}.default}`).join(",")}];`,
		].join("\n")
		const integration: AstroIntegration = {
			name: "monoline-docs",
			hooks: {
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
			cacheDir: "./cache/",
			output: "static",
			base: options.base,
			trailingSlash: "always",
			logLevel: "silent",
			markdown: {
				syntaxHighlight: false,
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
