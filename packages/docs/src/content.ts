import { load } from "js-yaml"
import { readFile, readdir } from "node:fs/promises"
import { basename, dirname, extname, join, relative, sep } from "node:path"

export interface DocumentationMetadata {
	title: string
	description?: string
	order?: number
	draft?: boolean
}

export interface DocumentationPage {
	filePath: string
	metadata: DocumentationMetadata
	route: `/${string}`
}

export interface DiscoverPagesOptions {
	environment?: "development" | "production"
}

function metadataError(filePath: string, message: string): Error {
	return new Error(
		`Invalid documentation metadata in "${filePath}": ${message}`
	)
}

function parseMetadata(
	filePath: string,
	source: string
): DocumentationMetadata {
	const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
	if (!frontmatter) throw metadataError(filePath, "frontmatter is required")

	let value: unknown
	try {
		value = load(frontmatter[1] ?? "")
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
	if (typeof metadata.title !== "string" || !metadata.title.trim()) {
		throw metadataError(filePath, "title must be a non-empty string")
	}
	if (
		metadata.description !== undefined &&
		typeof metadata.description !== "string"
	) {
		throw metadataError(filePath, "description must be a string")
	}
	if (
		metadata.order !== undefined &&
		(typeof metadata.order !== "number" || !Number.isFinite(metadata.order))
	) {
		throw metadataError(filePath, "order must be a finite number")
	}
	if (metadata.draft !== undefined && typeof metadata.draft !== "boolean") {
		throw metadataError(filePath, "draft must be a boolean")
	}

	return {
		title: metadata.title.trim(),
		...(metadata.description === undefined
			? {}
			: { description: metadata.description }),
		...(metadata.order === undefined ? {} : { order: metadata.order }),
		...(metadata.draft === undefined ? {} : { draft: metadata.draft }),
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
				const metadata = parseMetadata(
					filePath,
					await readFile(filePath, "utf8")
				)
				if (environment === "production" && metadata.draft) continue
				pages.push({
					filePath,
					metadata,
					route: routeFromFile(contentDirectory, filePath),
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
