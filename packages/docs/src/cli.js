#!/usr/bin/env node
import { dirname, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { parseArgs } from "node:util"

import { buildDocs } from "./build.js"
import { defineConfig } from "./config.js"
import { startDevServer } from "./dev.js"

try {
	const { values, positionals } = parseArgs({
		options: {
			config: { type: "string" },
			port: { type: "string" },
			help: { type: "boolean" },
		},
		allowPositionals: true,
	})
	if (values.help) {
		console.log(
			"monoline-docs <build|dev> [--config monoline.config.mjs] [--port 4321]\nPaths are relative to the configuration file. --port is for dev only."
		)
	} else {
		const [command] = positionals
		if (positionals.length !== 1 || !["build", "dev"].includes(command))
			throw new Error(
				"Use monoline-docs build or monoline-docs dev. See --help."
			)
		if (command === "build" && values.port !== undefined)
			throw new Error("--port is only available for dev")
		const port = values.port === undefined ? 4321 : Number(values.port)
		if (!Number.isInteger(port) || port < 1 || port > 65535)
			throw new Error("--port must be an integer between 1 and 65535")
		const path = resolve(values.config ?? "monoline.config.mjs")
		const config = defineConfig(
			(await import(pathToFileURL(path).href)).default
		)
		for (const key of ["contentDirectory", "outDirectory", "assetsDirectory"]) {
			if (config[key]) config[key] = resolve(dirname(path), config[key])
		}
		if (command === "build") {
			const result = await buildDocs({ ...config, environment: "production" })
			console.log(`Built ${result.pages} pages in ${result.outDirectory}`)
		} else {
			const preview = await startDevServer(config, port)
			console.log(`Monoline Docs preview: ${preview.url}`)
			for (const signal of ["SIGINT", "SIGTERM"])
				process.once(signal, () => {
					void preview.close()
				})
		}
	}
} catch (error) {
	console.error(
		`Monoline Docs: ${error instanceof Error ? error.message : String(error)}`
	)
	process.exitCode = 1
}
