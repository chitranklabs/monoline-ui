// @vitest-environment node
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { get } from "node:http"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, expect, it, vi } from "vitest"

import { startDevServer } from "./dev"

const promotionFailure = vi.hoisted(() => ({ armed: false, cleanup: false }))
vi.mock("node:fs/promises", async (importOriginal) => {
	const actual = await importOriginal<typeof import("node:fs/promises")>()
	return {
		...actual,
		rm: (...args: Parameters<typeof actual.rm>) => {
			if (
				promotionFailure.cleanup &&
				String(args[0]).endsWith("/.monoline-promotion")
			) {
				promotionFailure.cleanup = false
				throw new Error("Injected preview cleanup failure")
			}
			return actual.rm(...args)
		},
		rename: (...args: Parameters<typeof actual.rename>) => {
			if (
				promotionFailure.armed &&
				String(args[0]).includes("/new-") &&
				String(args[1]).endsWith("/docs.css")
			)
				throw new Error("Injected preview promotion failure")
			return actual.rename(...args)
		},
	}
})

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
	promotionFailure.armed = false
	promotionFailure.cleanup = false
	vi.restoreAllMocks()
	for (const cleanup of cleanups.splice(0).reverse()) await cleanup()
})

it("serves the prior page and search after failed promotion, then recovers", async () => {
	const server = await fixture()
	const priorPage = await (await fetch(server.url)).text()
	const priorSearch = await (
		await fetch(server.url + "search-index.json")
	).text()
	promotionFailure.armed = true
	await writeFile(
		join(server.contentDirectory, "index.mdx"),
		"---\ntitle: Promotion recovered\n---\nNew content"
	)
	await server.rebuild()
	expect(await (await fetch(server.url)).text()).toBe(priorPage)
	expect(await (await fetch(server.url + "search-index.json")).text()).toBe(
		priorSearch
	)
	promotionFailure.armed = false
	await server.rebuild()
	expect(await (await fetch(server.url)).text()).toContain(
		"Promotion recovered"
	)
	expect(
		await (await fetch(server.url + "search-index.json")).text()
	).toContain("Promotion recovered")
}, 10000)

it("adopts newly generated preview routes when committed-output cleanup warns", async () => {
	const server = await fixture()
	const warning = vi.spyOn(process, "emitWarning").mockImplementation(() => {})
	promotionFailure.cleanup = true
	await writeFile(
		join(server.contentDirectory, "new-page.md"),
		"---\ntitle: New route\n---\nPublished successfully"
	)
	await server.rebuild()
	const page = await fetch(server.url + "new-page/")
	expect(page.status).toBe(200)
	expect(await page.text()).toContain("Published successfully")
	expect(warning).toHaveBeenCalled()
}, 10000)
async function fixture(cleanUrls = false) {
	const root = await mkdtemp(join(tmpdir(), "docs-preview-"))
	cleanups.push(() => rm(root, { force: true, recursive: true }))
	const contentDirectory = join(root, "content")
	const assetsDirectory = join(root, "assets")
	const componentsDirectory = join(root, "components")
	await mkdir(contentDirectory)
	await mkdir(assetsDirectory)
	await mkdir(componentsDirectory)
	const component = join(componentsDirectory, "Status.astro")
	await writeFile(component, "<p>Component original</p>")
	await writeFile(
		join(contentDirectory, "index.mdx"),
		'---\ntitle: Original\n---\nimport Status from "../components/Status.astro"\n\n# Hello\n\n<Status />'
	)
	await writeFile(
		join(contentDirectory, "draft.md"),
		"---\ntitle: Draft\ndraft: true\n---\nPreview only"
	)
	await writeFile(join(assetsDirectory, "font.woff2"), Buffer.from([1, 2, 3]))
	const server = await startDevServer(
		{
			title: "Docs",
			contentDirectory,
			assetsDirectory,
			outDirectory: join(root, "dist"),
			base: "/project/",
			cleanUrls,
		},
		0
	)
	cleanups.push(server.close)
	return { ...server, contentDirectory, assetsDirectory, component }
}

it("serves extensionless clean URLs from flat HTML files", async () => {
	const server = await fixture(true)
	const clean = await fetch(server.url + "draft")
	expect(clean.status).toBe(200)
	expect(await clean.text()).toContain("Preview only")
	expect((await fetch(server.url + "draft.html")).status).toBe(200)
	expect((await fetch(server.url + "draft/")).status).toBe(404)
})

async function* updates(response: Response) {
	const reader = response.body!.getReader()
	const decoder = new TextDecoder()
	let buffer = ""
	try {
		while (true) {
			const { done, value } = await reader.read()
			if (done) return
			buffer += decoder.decode(value, { stream: true })
			let boundary
			while ((boundary = buffer.indexOf("\n\n")) >= 0) {
				const message = buffer.slice(0, boundary)
				buffer = buffer.slice(boundary + 2)
				yield JSON.parse(message.replace(/^data: /, "")) as {
					revision: number
					error: string
				}
			}
		}
	} finally {
		await reader.cancel().catch(() => {})
	}
}

it("serves only generated files under the base, including draft previews and fonts", async () => {
	const server = await fixture()
	expect(await (await fetch(server.url)).text()).toContain("Original")
	expect(await (await fetch(server.url + "draft/")).text()).toContain(
		"Preview only"
	)
	expect(
		(await fetch(server.url + "draft", { redirect: "manual" })).status
	).toBe(308)
	const asset = await fetch(server.url + "assets/font.woff2")
	const missing = await fetch(server.url + "missing/")
	expect(missing.status).toBe(404)
	const missingHtml = await missing.text()
	expect(missingHtml).toContain("__monoline/dev-client.js")
	expect(missingHtml).toContain("/project/theme.js")
	expect(asset.headers.get("content-type")).toBe("font/woff2")
	expect(new Uint8Array(await asset.arrayBuffer())).toEqual(
		new Uint8Array([1, 2, 3])
	)
	expect((await fetch(server.url + ".monoline-generated.json")).status).toBe(
		404
	)
	expect((await fetch(server.url + "%2e%2e%2fcontent%2findex.md")).status).toBe(
		404
	)
	expect((await fetch(server.url, { method: "POST" })).status).toBe(405)
	const status = await new Promise<number | undefined>((resolve, reject) => {
		get(server.url, { headers: { Host: "untrusted.example" } }, (response) => {
			response.resume()
			resolve(response.statusCode)
		}).on("error", reject)
	})
	expect(status).toBe(403)
})

it("watches real edits, reports errors, recovers, and closes active streams", async () => {
	const server = await fixture()
	const abort = new AbortController()
	cleanups.push(async () => {
		abort.abort()
	})
	const stream = updates(
		await fetch(server.url + "__monoline/events", { signal: abort.signal })
	)
	const first = (await stream.next()).value!
	await fetch(server.url)
	await writeFile(
		server.component,
		'---\nimport { message } from "./message.js"\n---\n<p>{message}</p>'
	)
	let dependencyFailed = (await stream.next()).value!
	while (!dependencyFailed.error)
		dependencyFailed = (await stream.next()).value!
	await writeFile(
		join(dirname(server.component), "message.js"),
		'export const message = "Component recovered"'
	)
	let componentChanged = (await stream.next()).value!
	while (componentChanged.error || componentChanged.revision <= first.revision)
		componentChanged = (await stream.next()).value!
	expect(await (await fetch(server.url)).text()).toContain(
		"Component recovered"
	)
	await writeFile(
		join(server.contentDirectory, "index.mdx"),
		"---\ntitle: Edited\n---\n# Hello"
	)
	let changed = (await stream.next()).value!
	while (changed.revision <= first.revision)
		changed = (await stream.next()).value!
	expect(await (await fetch(server.url)).text()).toContain("Edited")
	const search = await fetch(server.url + "search-index.json")
	expect(search.headers.get("content-type")).toContain("application/json")
	expect(await search.text()).toContain("Edited")
	await writeFile(
		join(server.contentDirectory, "index.mdx"),
		"---\ntitle: 42\n---"
	)
	let failed = (await stream.next()).value!
	while (!failed.error) failed = (await stream.next()).value!
	expect(failed.error).toContain("title must")
	expect(await (await fetch(server.url)).text()).toContain("Edited")
	await writeFile(
		join(server.contentDirectory, "index.mdx"),
		"---\ntitle: Recovered\n---\n# Hello"
	)
	let recovered = (await stream.next()).value!
	while (recovered.error || recovered.revision <= changed.revision)
		recovered = (await stream.next()).value!
	expect(await (await fetch(server.url)).text()).toContain("Recovered")
	expect(
		await (await fetch(server.url + "search-index.json")).text()
	).toContain("Recovered")
	await writeFile(join(server.assetsDirectory, "font.woff2"), Buffer.from([4]))
	let assetChanged = (await stream.next()).value!
	while (assetChanged.revision <= recovered.revision)
		assetChanged = (await stream.next()).value!
	expect(
		new Uint8Array(
			await (await fetch(server.url + "assets/font.woff2")).arrayBuffer()
		)
	).toEqual(new Uint8Array([4]))
	const finalRebuild = server.rebuild()
	await server.close()
	await finalRebuild
	await expect(fetch(server.url)).rejects.toThrow()
}, 10000)
