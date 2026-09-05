import path from "node:path"
import { fileURLToPath } from "node:url"

// Separate ownership before moving files. Do not infer layout from cwd or from
// which folders happen to exist: both make partial migrations unpredictable.
export function createProjectPaths({
	repositoryRoot,
	libraryRoot = repositoryRoot,
	websiteRoot = repositoryRoot,
}) {
	for (const [name, value] of Object.entries({
		repositoryRoot,
		libraryRoot,
		websiteRoot,
	})) {
		if (typeof value !== "string" || !path.isAbsolute(value)) {
			throw new TypeError(`${name} must be an absolute path`)
		}
	}
	const sourceDir = path.join(libraryRoot, "src")
	const relativeSource = path
		.relative(websiteRoot, sourceDir)
		.split(path.sep)
		.join("/")
	return Object.freeze({
		repositoryRoot,
		libraryRoot,
		websiteRoot,
		sourceDir,
		distDir: path.join(libraryRoot, "dist"),
		libraryManifest: path.join(libraryRoot, "package.json"),
		jsrManifest: path.join(libraryRoot, "jsr.json"),
		websiteTsconfig: path.join(websiteRoot, "tsconfig.json"),
		websiteSourcePrefix: relativeSource.startsWith(".")
			? relativeSource
			: `./${relativeSource}`,
		toolBinDir: path.join(repositoryRoot, "node_modules", ".bin"),
	})
}

const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url))

export const projectPaths = createProjectPaths({
	repositoryRoot,
	libraryRoot: path.join(repositoryRoot, "packages/ui"),
	websiteRoot: path.join(repositoryRoot, "apps/website"),
})
