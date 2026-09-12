import { readdir } from "node:fs/promises"
import { basename, dirname, extname, join, relative, sep } from "node:path"

export interface DocumentationPage {
	filePath: string
	route: `/${string}`
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
	contentDirectory: string
): Promise<DocumentationPage[]> {
	const pages: DocumentationPage[] = []

	async function visit(directory: string): Promise<void> {
		const entries = await readdir(directory, { withFileTypes: true })
		for (const entry of entries) {
			const filePath = join(directory, entry.name)
			if (entry.isDirectory()) await visit(filePath)
			else if (/\.mdx?$/.test(entry.name)) {
				pages.push({
					filePath,
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
