import { satteri } from "@astrojs/markdown-satteri"
import mdx from "@astrojs/mdx"
import { type AstroIntegration, build } from "astro"
import { mkdir, mkdtemp, realpath, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import { type MonolineDocsConfig, defineConfig, safeRoute } from "./config.ts"
import { type DocumentationPage, discoverPages } from "./content.ts"

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
						},
					],
				}),
			},
			integrations: [mdx(), integration],
		})
		return { directory, pages, dispose }
	} catch (error) {
		await dispose()
		throw error
	}
}
