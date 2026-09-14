#!/usr/bin/env node
import { parseArgs } from "node:util"

import { buildDocs } from "./build.js"
import { startDevServer } from "./dev.js"
import { loadConfig } from "./load-config.js"

try {
	const { values, positionals } = parseArgs({
		options: {
			config: { type: "string" },
			port: { type: "string" },
			site: { type: "string" },
			base: { type: "string" },
			indexing: { type: "string" },
			help: { type: "boolean" },
		},
		allowPositionals: true,
	})
	if (values.help) {
		console.log(
			"monoline-docs <build|dev> [--config monoline-docs.yml] [--site https://docs.example.com] [--base /] [--indexing true|false] [--port 4321]\nDiscovers monoline-docs.yml, .yaml or monoline-docs.config.mjs. Paths are relative to that file. --port is for dev only."
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
		if (
			values.indexing !== undefined &&
			!["true", "false"].includes(values.indexing)
		)
			throw new Error("--indexing must be true or false")
		const config = await loadConfig({
			config: values.config,
			overrides: {
				...(values.site !== undefined && { site: values.site }),
				...(values.base !== undefined && { base: values.base }),
				...(values.indexing !== undefined && {
					indexing: values.indexing === "true",
				}),
			},
		})
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
