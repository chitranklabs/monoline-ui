import { randomUUID } from "node:crypto"
import {
	lstat,
	mkdir,
	open,
	readFile,
	rename,
	rmdir,
	unlink,
} from "node:fs/promises"
import { join } from "node:path"

const packageName = "@chitrank2050/monoline-docs"
const scripts = { build: "monoline-docs build", dev: "monoline-docs dev" }

async function inspect(path: string) {
	try {
		return await lstat(path)
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined
		throw error
	}
}

function object(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value)
}

/** Create a starter without replacing authored content or conflicting scripts. */
export async function initializeDocs(cwd = process.cwd()): Promise<void> {
	for (const name of [
		"monoline-docs.yml",
		"monoline-docs.yaml",
		"monoline-docs.config.mjs",
		"content/index.md",
		"content/index.mdx",
	])
		if (await inspect(join(cwd, name)))
			throw new Error(
				`${name} already exists; initialize in a new directory or configure this site manually`
			)
	const contentPath = join(cwd, "content")
	const content = await inspect(contentPath)
	if (content && (!content.isDirectory() || content.isSymbolicLink()))
		throw new Error("content must be a directory, not a file or symbolic link")
	const packagePath = join(cwd, "package.json")
	const packageInfo = await inspect(packagePath)
	if (packageInfo && (!packageInfo.isFile() || packageInfo.isSymbolicLink()))
		throw new Error("package.json must be a regular file, not a symbolic link")
	const original = packageInfo ? await readFile(packagePath, "utf8") : undefined
	const manifest: unknown =
		original === undefined
			? { private: true, type: "module" }
			: JSON.parse(original)
	if (!object(manifest)) throw new Error("package.json must contain an object")
	for (const key of ["scripts", "dependencies", "devDependencies"])
		if (manifest[key] !== undefined && !object(manifest[key]))
			throw new Error(`package.json ${key} must be an object`)
	const existingScripts = (manifest.scripts ?? {}) as Record<string, unknown>
	for (const [name, command] of Object.entries(scripts))
		if (
			existingScripts[name] !== undefined &&
			existingScripts[name] !== command
		)
			throw new Error(
				`package.json scripts.${name} already exists; add Monoline commands manually or initialize in a new directory`
			)
	const { version } = JSON.parse(
		await readFile(new URL("../package.json", import.meta.url), "utf8")
	) as { version: string }
	const dependencies = (manifest.dependencies ?? {}) as Record<string, unknown>
	const devDependencies = (manifest.devDependencies ?? {}) as Record<
		string,
		unknown
	>
	manifest.scripts = { ...existingScripts, ...scripts }
	if (
		dependencies[packageName] === undefined &&
		devDependencies[packageName] === undefined
	)
		manifest.dependencies = { ...dependencies, [packageName]: `^${version}` }
	const serialized = `${JSON.stringify(manifest, null, 2)}\n`
	const created: string[] = []
	let createdContent = false
	const temporaryPackage = join(cwd, `.monoline-init-${randomUUID()}.json`)
	const createFile = async (path: string, body: string, mode?: number) => {
		const handle = await open(path, "wx", mode)
		created.push(path)
		try {
			await handle.writeFile(body)
		} finally {
			await handle.close()
		}
	}
	try {
		if (!content) {
			await mkdir(contentPath)
			createdContent = true
		}
		for (const [name, body] of [
			[
				"monoline-docs.yml",
				"# yaml-language-server: $schema=./node_modules/@chitrank2050/monoline-docs/schema.json\ntitle: Documentation\ncontentDirectory: ./content\noutDirectory: ./dist\n",
			],
			[
				"content/index.md",
				"---\ntitle: Introduction\ndescription: Welcome to the documentation.\n---\n\n## Getting started\n\nAdd Markdown pages to the content directory.\n",
			],
		] as const) {
			const path = join(cwd, name)
			await createFile(path, body)
		}
		if (original === undefined) {
			await createFile(packagePath, serialized)
		} else {
			// Stage the manifest so a failed write cannot truncate the existing file.
			await createFile(temporaryPackage, serialized, packageInfo!.mode & 0o777)
			const current = await inspect(packagePath)
			if (
				!current ||
				current.isSymbolicLink() ||
				current.ino !== packageInfo!.ino ||
				(await readFile(packagePath, "utf8")) !== original
			)
				throw new Error(
					"package.json changed during initialization; retry after other edits finish"
				)
			await rename(temporaryPackage, packagePath)
			created.pop()
		}
	} catch (error) {
		await Promise.all(
			created.map((path) => unlink(path).catch(() => undefined))
		)
		if (createdContent) await rmdir(contentPath).catch(() => undefined)
		throw error
	}
}
