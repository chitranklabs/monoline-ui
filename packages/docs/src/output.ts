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

import { isAssetName } from "./assets.ts"
import type { MonolineDocsConfig } from "./config.ts"

const manifest = ".monoline-generated.json"

async function canonicalPath(path: string): Promise<string> {
	try {
		return await realpath(path)
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
		return join(await canonicalPath(dirname(path)), basename(path))
	}
}

const inside = (parent: string, child: string) => {
	const path = relative(parent, child)
	return path === "" || (!path.startsWith("..") && !isAbsolute(path))
}

export async function resolveOutput(
	config: MonolineDocsConfig
): Promise<string> {
	const content = await realpath(
		resolve(config.contentDirectory ?? "./content")
	)
	const output = await canonicalPath(resolve(config.outDirectory ?? "./dist"))
	if (inside(content, output) || inside(output, content))
		throw new Error("Content and output directories must not overlap")
	if (config.assetsDirectory) {
		const assets = await realpath(resolve(config.assetsDirectory))
		if (inside(assets, output) || inside(output, assets))
			throw new Error("Assets and output directories must not overlap")
	}
	return output
}

function safeName(name: unknown): name is string {
	if (
		typeof name === "string" &&
		!isAbsolute(name) &&
		!name.includes("\\") &&
		name
			.split("/")
			.every(
				(part) =>
					part !== "." && part !== ".." && /^[\p{L}\p{N}_.@-]+$/u.test(part)
			)
	)
		return (
			isAssetName(name) ||
			/^(?:[\p{L}\p{N}_-]+\/)*index\.html$/u.test(name) ||
			/^(?:404\.html|docs\.css|theme\.js|client\.js|search\.js|search-index\.json|sitemap\.xml|robots\.txt)$/.test(
				name
			) ||
			/^_astro\/[\p{L}\p{N}_.@/-]+$/u.test(name)
		)
	return false
}

/** Replace only files recorded by Monoline Docs; unrelated output is refused. */
export async function publishFiles(
	output: string,
	files: Map<string, string | Uint8Array>
): Promise<void> {
	if ([...files.keys()].some((name) => !safeName(name)))
		throw new Error("Invalid generated output path")
	let previousFiles: string[] = []
	try {
		const entries = await readdir(output)
		if (entries.length && !entries.includes(manifest))
			throw new Error("Output directory is not managed by Monoline Docs")
		if (entries.includes(manifest)) {
			const previous: unknown = JSON.parse(
				await readFile(join(output, manifest), "utf8")
			)
			if (!Array.isArray(previous) || previous.some((name) => !safeName(name)))
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
}
