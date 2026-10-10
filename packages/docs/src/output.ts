import {
	copyFile,
	lstat,
	mkdir,
	readFile,
	readdir,
	realpath,
	rename,
	rm,
	rmdir,
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
	if (config.openapi) {
		const source = await realpath(resolve(config.openapi.file))
		if (inside(output, source))
			throw new Error("OpenAPI source must not be inside the output directory")
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
			/^(?:[\p{L}\p{N}_-]+\/)*[\p{L}\p{N}_-]+\.html$/u.test(name) ||
			/^(?:[\p{L}\p{N}_-]+\/)*[\p{L}\p{N}_-]+\.md$/u.test(name) ||
			/^(?:404\.html|docs\.css|theme\.js|client\.js|search\.js|search-index\.json|sitemap\.xml|robots\.txt)$/.test(
				name
			) ||
			/^(?:llms\.txt|llms-full\.txt)$/.test(name) ||
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
	output = await canonicalPath(resolve(output))
	const firstCreated = await mkdir(output, { recursive: true })
	const lock = join(output, ".monoline-promotion")
	try {
		await mkdir(lock)
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "EEXIST")
			throw new Error(
				`Output promotion is locked: ${lock}. Another build may be running; inspect retained recovery files before removing a stale lock.`,
				{ cause: error }
			)
		throw error
	}
	let retainRecovery = false
	let failed = false
	let promotionError: unknown
	try {
		await promoteFiles(output, files, lock, () => {
			retainRecovery = true
		})
	} catch (error) {
		failed = true
		promotionError = error
	}
	if (!retainRecovery) {
		try {
			await rm(lock, { recursive: true })
			if (failed && firstCreated) {
				let directory = output
				while (true) {
					await rmdir(directory)
					if (directory === firstCreated) break
					directory = dirname(directory)
				}
			}
		} catch (error) {
			if (failed)
				throw new AggregateError(
					[promotionError, error],
					`Output was preserved but cleanup failed at ${lock}. Inspect before retrying.`,
					{ cause: error }
				)
			// The manifest committed successfully: callers must adopt the new site.
			process.emitWarning(
				new Error(
					`Output promotion succeeded, but cleanup failed at ${lock}. Inspect before retrying.`,
					{ cause: error }
				)
			)
		}
	}
	if (failed) throw promotionError
}

async function promoteFiles(
	output: string,
	files: Map<string, string | Uint8Array>,
	lock: string,
	retainRecovery: () => void
): Promise<void> {
	let previousFiles: string[] = []
	try {
		const entries = (await readdir(output)).filter(
			(name) => name !== ".monoline-promotion"
		)
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
				if (length === segments.length ? !stat.isFile() : !stat.isDirectory())
					throw new Error(`Invalid generated path type: ${target}`)
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
	const next = new Map(files)
	next.set(manifest, JSON.stringify([...files.keys()]))
	const names = [...new Set([...next.keys(), ...previousFiles])]
	const backups = new Map<string, string | undefined>()
	const staged = new Map<string, string>()
	// Snapshot and prepare all bytes on the destination filesystem before mutation.
	for (const [index, name] of names.entries()) {
		const backup = join(lock, `old-${index}`)
		try {
			await copyFile(join(output, name), backup)
			backups.set(name, backup)
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
			backups.set(name, undefined)
		}
		if (next.has(name)) {
			const file = join(lock, `new-${index}`)
			await writeFile(file, next.get(name)!)
			staged.set(name, file)
		}
	}
	await writeFile(
		join(lock, "recovery.json"),
		JSON.stringify({
			output,
			files: names.map((name) => ({ name, backup: backups.get(name) ?? null })),
		})
	)
	const changed: string[] = []
	const createdDirectories: string[] = []
	async function ensureDirectory(directory: string): Promise<void> {
		try {
			await mkdir(directory)
			createdDirectories.push(directory)
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === "ENOENT") {
				await ensureDirectory(dirname(directory))
				await ensureDirectory(directory)
			} else if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error
		}
	}
	try {
		for (const name of names.filter((name) => name !== manifest)) {
			if (next.has(name)) {
				await ensureDirectory(dirname(join(output, name)))
				changed.push(name)
				await rename(staged.get(name)!, join(output, name))
			} else if (backups.get(name)) {
				changed.push(name)
				await unlink(join(output, name))
			}
		}
		await ensureDirectory(output)
		changed.push(manifest)
		await rename(staged.get(manifest)!, join(output, manifest))
	} catch (error) {
		const recoveryErrors: unknown[] = []
		for (const name of changed.reverse()) {
			try {
				const backup = backups.get(name)
				if (backup) await rename(backup, join(output, name))
				else
					await unlink(join(output, name)).catch(
						(failure: NodeJS.ErrnoException) => {
							if (failure.code !== "ENOENT") throw failure
						}
					)
			} catch (failure) {
				recoveryErrors.push(failure)
			}
		}
		for (const directory of createdDirectories.reverse()) {
			try {
				await rmdir(directory)
			} catch (failure) {
				recoveryErrors.push(failure)
			}
		}
		if (recoveryErrors.length) {
			retainRecovery()
			throw new AggregateError(
				[error, ...recoveryErrors],
				`Output promotion and recovery failed. Recovery files retained at ${lock}; do not deploy this output.`,
				{ cause: error }
			)
		}
		throw error
	}
}
