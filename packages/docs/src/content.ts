import { JSON_SCHEMA, load } from "js-yaml"
import { readFile, readdir } from "node:fs/promises"
import { basename, dirname, extname, join, relative, sep } from "node:path"

export interface DocumentationMetadata {
	title: string
	navTitle?: string
	seoTitle?: string
	description?: string
	slug?: string
	order?: number
	draft?: boolean
	sidebar?: boolean
	toc?: boolean
	search?: boolean
	noindex?: boolean
	updatedAt?: string
	tags?: string[]
	badge?: string
	layout?: "docs" | "reference"
}

export interface DocumentationPage {
	filePath: string
	format: "md" | "mdx"
	metadata: DocumentationMetadata
	route: `/${string}`
	source: string
}

export interface DiscoverPagesOptions {
	environment?: "development" | "production"
}

function metadataError(filePath: string, message: string): Error {
	return new Error(
		`Invalid documentation metadata in "${filePath}": ${message}`
	)
}

function parseDocument(
	filePath: string,
	source: string
): { metadata: DocumentationMetadata; source: string } {
	const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
	if (!frontmatter) throw metadataError(filePath, "frontmatter is required")

	let value: unknown
	try {
		value = load(frontmatter[1] ?? "", { schema: JSON_SCHEMA })
	} catch (error) {
		throw metadataError(
			filePath,
			error instanceof Error ? error.message : "frontmatter is not valid YAML"
		)
	}

	if (!value || typeof value !== "object" || Array.isArray(value)) {
		throw metadataError(filePath, "frontmatter must be an object")
	}

	const metadata = value as Record<string, unknown>
	const supported = new Set([
		"title",
		"navTitle",
		"seoTitle",
		"description",
		"slug",
		"order",
		"draft",
		"sidebar",
		"toc",
		"search",
		"noindex",
		"updatedAt",
		"tags",
		"badge",
		"layout",
	])
	for (const key of Object.keys(metadata))
		if (!supported.has(key))
			throw metadataError(filePath, `unknown option ${key}`)
	if (typeof metadata.title !== "string" || !metadata.title.trim()) {
		throw metadataError(filePath, "title must be a non-empty string")
	}
	for (const key of [
		"navTitle",
		"seoTitle",
		"description",
		"slug",
		"updatedAt",
		"badge",
	] as const) {
		if (
			metadata[key] !== undefined &&
			(typeof metadata[key] !== "string" || !metadata[key].trim())
		)
			throw metadataError(filePath, `${key} must be a non-empty string`)
	}
	if (
		typeof metadata.slug === "string" &&
		(metadata.slug === "/" ||
			!/^\/?(?:[\p{L}\p{N}_-]+\/)*[\p{L}\p{N}_-]+$/u.test(metadata.slug))
	)
		throw metadataError(filePath, "slug must be a safe non-root route")
	if (
		metadata.order !== undefined &&
		(typeof metadata.order !== "number" || !Number.isFinite(metadata.order))
	) {
		throw metadataError(filePath, "order must be a finite number")
	}
	if (metadata.draft !== undefined && typeof metadata.draft !== "boolean") {
		throw metadataError(filePath, "draft must be a boolean")
	}
	for (const key of ["sidebar", "toc", "search", "noindex"] as const) {
		if (metadata[key] !== undefined && typeof metadata[key] !== "boolean")
			throw metadataError(filePath, `${key} must be a boolean`)
	}
	if (
		metadata.tags !== undefined &&
		(!Array.isArray(metadata.tags) ||
			metadata.tags.length === 0 ||
			metadata.tags.some((tag) => typeof tag !== "string" || !tag.trim()))
	)
		throw metadataError(filePath, "tags must be a non-empty string array")
	if (
		metadata.updatedAt !== undefined &&
		!/^\d{4}-\d{2}-\d{2}$/.test(metadata.updatedAt as string)
	)
		throw metadataError(filePath, "updatedAt must use YYYY-MM-DD")
	if (
		metadata.layout !== undefined &&
		!["docs", "reference"].includes(metadata.layout as string)
	)
		throw metadataError(filePath, "layout must be docs or reference")

	return {
		metadata: {
			title: metadata.title.trim(),
			...Object.fromEntries(
				["navTitle", "seoTitle", "description", "slug", "updatedAt", "badge"]
					.filter((key) => metadata[key] !== undefined)
					.map((key) => [key, (metadata[key] as string).trim()])
			),
			...(metadata.order === undefined ? {} : { order: metadata.order }),
			...(metadata.draft === undefined ? {} : { draft: metadata.draft }),
			...(metadata.sidebar === undefined
				? {}
				: { sidebar: metadata.sidebar as boolean }),
			...(metadata.toc === undefined ? {} : { toc: metadata.toc as boolean }),
			...(metadata.search === undefined
				? {}
				: { search: metadata.search as boolean }),
			...(metadata.noindex === undefined
				? {}
				: { noindex: metadata.noindex as boolean }),
			...(metadata.tags === undefined
				? {}
				: { tags: (metadata.tags as string[]).map((tag) => tag.trim()) }),
			...(metadata.layout === undefined
				? {}
				: { layout: metadata.layout as "docs" | "reference" }),
		},
		source: source.slice(frontmatter[0].length).replaceAll("\r\n", "\n"),
	}
}

function routeFromFile(
	contentDirectory: string,
	filePath: string
): `/${string}` {
	const extension = extname(filePath)
	const relativePath = relative(contentDirectory, filePath).slice(
		0,
		-extension.length
	)
	const routePath =
		basename(relativePath) === "index" ? dirname(relativePath) : relativePath
	const normalized = routePath === "." ? "" : routePath.split(sep).join("/")
	return `/${normalized}`
}

export async function discoverPages(
	contentDirectory: string,
	options: DiscoverPagesOptions = {}
): Promise<DocumentationPage[]> {
	const pages: DocumentationPage[] = []
	const environment =
		options.environment ??
		(process.env.NODE_ENV === "production" ? "production" : "development")

	async function visit(directory: string): Promise<void> {
		const entries = await readdir(directory, { withFileTypes: true })
		for (const entry of entries) {
			const filePath = join(directory, entry.name)
			if (entry.isDirectory()) await visit(filePath)
			else if (/\.mdx?$/.test(entry.name)) {
				const document = parseDocument(
					filePath,
					await readFile(filePath, "utf8")
				)
				if (environment === "production" && document.metadata.draft) continue
				pages.push({
					filePath,
					format: extname(filePath) === ".mdx" ? "mdx" : "md",
					metadata: document.metadata,
					route: document.metadata.slug
						? (`/${document.metadata.slug.replace(/^\//, "")}` as const)
						: routeFromFile(contentDirectory, filePath),
					source: document.source,
				})
			}
		}
	}

	await visit(contentDirectory)
	pages.sort((left, right) => left.route.localeCompare(right.route))

	for (let index = 1; index < pages.length; index += 1) {
		if (pages[index - 1]?.route === pages[index]?.route) {
			throw new Error(`Duplicate documentation route "${pages[index]?.route}"`)
		}
	}

	return pages
}

export function findPage(
	pages: DocumentationPage[],
	route: `/${string}`
): DocumentationPage | undefined {
	return pages.find((page) => page.route === route)
}
