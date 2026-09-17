import { type FSWatcher, watch } from "node:fs"
import { readFile } from "node:fs/promises"
import {
	type IncomingMessage,
	type ServerResponse,
	createServer,
} from "node:http"
import {
	dirname,
	extname,
	isAbsolute,
	join,
	relative,
	resolve,
} from "node:path"

import { assetTypes } from "./assets.ts"
import { buildAstroDocsWithDependencies } from "./astro-engine.ts"
import type { BuildOptions } from "./build.ts"
import { defineConfig } from "./config.ts"

/** A loopback-only preview. Rebuild errors leave the last successful page available. */
export async function startDevServer(options: BuildOptions, port = 4321) {
	const buildOptions = defineConfig({ ...options, environment: "development" })
	let result = await buildAstroDocsWithDependencies(buildOptions)
	let knownFiles = new Set<string>(
		JSON.parse(
			await readFile(
				join(result.outDirectory, ".monoline-generated.json"),
				"utf8"
			)
		)
	)
	const base = options.base ?? "/"
	const clients = new Set<ServerResponse>()
	const watchers: FSWatcher[] = []
	const dependencyWatchers = new Map<string, FSWatcher>()
	let revision = 0
	let errorMessage = ""
	let closed = false
	let dirty = false
	let running: Promise<void> | undefined
	let timer: ReturnType<typeof setTimeout> | undefined
	const broadcast = () => {
		const message = `data: ${JSON.stringify({ revision, error: errorMessage })}\n\n`
		for (const client of clients) client.write(message)
	}
	const scheduleRebuild = () => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			void rebuild()
		}, 80)
	}
	const inside = (parent: string, child: string) => {
		const path = relative(parent, child)
		return path === "" || (!path.startsWith("..") && !isAbsolute(path))
	}
	const watchDependencies = (paths: string[]) => {
		for (const watcher of dependencyWatchers.values()) watcher.close()
		dependencyWatchers.clear()
		const ignored = [
			result.outDirectory,
			resolve(buildOptions.contentDirectory),
			buildOptions.assetsDirectory && resolve(buildOptions.assetsDirectory),
		].filter((path): path is string => Boolean(path))
		for (const directory of new Set(paths.map(dirname))) {
			const watcher = watch(directory, { recursive: true }, (_event, name) => {
				const changed = name && resolve(directory, name)
				if (changed && ignored.some((path) => inside(path, changed))) return
				scheduleRebuild()
			})
			watcher.on("error", (error) => {
				errorMessage = `Watcher failed: ${error.message}. Restart the preview.`
				broadcast()
			})
			dependencyWatchers.set(directory, watcher)
		}
	}
	function rebuild(): Promise<void> {
		dirty = true
		if (running) return running
		running = (async () => {
			while (dirty && !closed) {
				dirty = false
				try {
					result = await buildAstroDocsWithDependencies(buildOptions)
					knownFiles = new Set(
						JSON.parse(
							await readFile(
								join(result.outDirectory, ".monoline-generated.json"),
								"utf8"
							)
						)
					)
					if (!closed) watchDependencies(result.dependencies)
					errorMessage = ""
					revision += 1
				} catch (error) {
					errorMessage = error instanceof Error ? error.message : String(error)
				}
				broadcast()
			}
		})().finally(() => {
			running = undefined
		})
		return running
	}

	async function serve(request: IncomingMessage, response: ServerResponse) {
		const address = server.address()
		const boundPort =
			address && typeof address === "object" ? address.port : port
		if (
			!["127.0.0.1", "localhost"].some(
				(host) => request.headers.host === `${host}:${boundPort}`
			)
		) {
			response.writeHead(403).end()
			return
		}
		if (request.method !== "GET" && request.method !== "HEAD") {
			response.writeHead(405, { Allow: "GET, HEAD" }).end()
			return
		}
		let path: string
		try {
			path = decodeURIComponent(
				new URL(request.url ?? "/", "http://localhost").pathname
			)
		} catch {
			response.writeHead(400).end()
			return
		}
		response.setHeader("Cache-Control", "no-store")
		response.setHeader("X-Content-Type-Options", "nosniff")
		if (base !== "/" && path === base.slice(0, -1)) {
			response.writeHead(308, { Location: base }).end()
			return
		}
		if (path === `${base}__monoline/events`) {
			response.writeHead(200, {
				"Content-Type": "text/event-stream",
				Connection: "keep-alive",
			})
			if (request.method === "HEAD") {
				response.end()
				return
			}
			clients.add(response)
			response.write(
				`data: ${JSON.stringify({ revision, error: errorMessage })}\n\n`
			)
			request.on("close", () => clients.delete(response))
			return
		}
		if (path === `${base}__monoline/dev-client.js`) {
			response.writeHead(200, {
				"Content-Type": "text/javascript; charset=utf-8",
			})
			response.end(
				request.method === "HEAD"
					? undefined
					: await readFile(new URL("./dev-client.js", import.meta.url))
			)
			return
		}
		await running
		const relative = path.startsWith(base) ? path.slice(base.length) : ""
		if (
			path.startsWith(base) &&
			relative &&
			!relative.endsWith("/") &&
			knownFiles.has(`${relative}/index.html`)
		) {
			response
				.writeHead(308, {
					Location:
						path + "/" + new URL(request.url ?? "/", "http://localhost").search,
				})
				.end()
			return
		}
		const name =
			relative.endsWith("/") || relative === ""
				? `${relative}index.html`
				: relative
		const found = path.startsWith(base) && knownFiles.has(name)
		const file = found ? name : "404.html"
		let body = await readFile(join(result.outDirectory, file))
		if (file.endsWith(".html"))
			body = Buffer.from(
				body
					.toString()
					.replace(
						"</head>",
						`<script src="${base}__monoline/dev-client.js" data-revision="${revision}" defer></script></head>`
					)
			)
		const type = file.endsWith(".html")
			? "text/html; charset=utf-8"
			: file.endsWith(".js")
				? "text/javascript; charset=utf-8"
				: (assetTypes[extname(file)] ?? "application/octet-stream")
		response.writeHead(found ? 200 : 404, { "Content-Type": type })
		response.end(request.method === "HEAD" ? undefined : body)
	}
	const server = createServer((request, response) => {
		void serve(request, response).catch(() => {
			if (!response.headersSent)
				response.writeHead(500, { "Content-Type": "text/plain" })
			response.end(
				"Preview could not read the generated page. Rebuild and retry."
			)
		})
	})
	async function close() {
		if (closed) return
		closed = true
		clearTimeout(timer)
		for (const watcher of watchers) watcher.close()
		for (const watcher of dependencyWatchers.values()) watcher.close()
		for (const client of clients) client.end()
		await running
		for (const watcher of dependencyWatchers.values()) watcher.close()
		dependencyWatchers.clear()
		server.closeAllConnections()
		if (server.listening)
			await new Promise<void>((resolve) => server.close(() => resolve()))
	}
	try {
		for (const directory of [
			buildOptions.contentDirectory,
			buildOptions.assetsDirectory,
		].filter((path): path is string => Boolean(path))) {
			const watcher = watch(directory, { recursive: true }, scheduleRebuild)
			watcher.on("error", (error) => {
				errorMessage = `Watcher failed: ${error.message}. Restart the preview.`
				broadcast()
			})
			watchers.push(watcher)
		}
		watchDependencies(result.dependencies)
		await new Promise<void>((resolve, reject) => {
			server.once("error", reject)
			server.listen(port, "127.0.0.1", () => {
				server.off("error", reject)
				resolve()
			})
		})
	} catch (error) {
		await close()
		throw error
	}
	const address = server.address() as { port: number }
	return { url: `http://127.0.0.1:${address.port}${base}`, rebuild, close }
}
