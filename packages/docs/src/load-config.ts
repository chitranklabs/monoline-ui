import { JSON_SCHEMA, load } from "js-yaml"
import { readFile, readdir } from "node:fs/promises"
import { dirname, extname, resolve } from "node:path"
import { pathToFileURL } from "node:url"

import { type MonolineDocsConfig, defineConfig } from "./config.ts"

export interface LoadConfigOptions {
	config?: string
	cwd?: string
	overrides?: Pick<MonolineDocsConfig, "site" | "base" | "indexing">
}

/** CLI and API share discovery, validation and config-relative paths. */
export async function loadConfig(options: LoadConfigOptions = {}) {
	const cwd = resolve(options.cwd ?? process.cwd())
	let name = options.config
	if (!name) {
		const candidates = (await readdir(cwd)).filter((entry) =>
			[
				"monoline-docs.yml",
				"monoline-docs.yaml",
				"monoline-docs.config.mjs",
			].includes(entry)
		)
		if (candidates.length !== 1)
			throw new Error(
				candidates.length
					? `Multiple documentation configs in ${cwd}: ${candidates.join(", ")}. Select one with --config.`
					: `No documentation config in ${cwd}. Create monoline-docs.yml or select a file with --config.`
			)
		name = candidates[0]!
	}
	const file = resolve(cwd, name)
	let raw: unknown
	try {
		switch (extname(file)) {
			case ".yml":
			case ".yaml":
				raw = load(await readFile(file, "utf8"), {
					schema: JSON_SCHEMA,
					filename: file,
				})
				break
			case ".mjs":
				raw = (await import(pathToFileURL(file).href)).default
				break
			default:
				throw new Error("Supported config extensions are .yml, .yaml and .mjs")
		}
		// Validate the document itself before applying deployment overrides.
		const config = defineConfig({
			...defineConfig(raw as MonolineDocsConfig),
			...options.overrides,
		})
		for (const key of [
			"contentDirectory",
			"outDirectory",
			"assetsDirectory",
		] as const) {
			if (config[key]) config[key] = resolve(dirname(file), config[key])
		}
		return config
	} catch (error) {
		throw new Error(
			`Invalid documentation config ${file}: ${error instanceof Error ? error.message : String(error)}`,
			{ cause: error }
		)
	}
}
