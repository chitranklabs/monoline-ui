// @vitest-environment node
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { get } from "node:http"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, expect, it } from "vitest"

import { startDevServer } from "./dev"

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
	for (const cleanup of cleanups.splice(0).reverse()) await cleanup()
})
async function fixture() {
	const root = await mkdtemp(join(tmpdir(), "docs-preview-"))
	cleanups.push(() => rm(root, { force: true, recursive: true }))
	const contentDirectory = join(root, "content")
	const assetsDirectory = join(root, "assets")
	await mkdir(contentDirectory)
	await mkdir(assetsDirectory)
	await writeFile(
		join(contentDirectory, "index.md"),
		"---\ntitle: Original\n---\n# Hello"
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
		},
		0
	)
	cleanups.push(server.close)
	return { ...server, contentDirectory, assetsDirectory }
}

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
	await writeFile(
		join(server.contentDirectory, "index.md"),
		"---\ntitle: Edited\n---\n# Hello"
	)
	let changed = (await stream.next()).value!
	while (changed.revision <= first.revision)
		changed = (await stream.next()).value!
	expect(await (await fetch(server.url)).text()).toContain("Edited")
	await writeFile(
		join(server.contentDirectory, "index.md"),
		"---\ntitle: 42\n---"
	)
	let failed = (await stream.next()).value!
	while (!failed.error) failed = (await stream.next()).value!
	expect(failed.error).toContain("title must")
	expect(await (await fetch(server.url)).text()).toContain("Edited")
	await writeFile(
		join(server.contentDirectory, "index.md"),
		"---\ntitle: Recovered\n---\n# Hello"
	)
	let recovered = (await stream.next()).value!
	while (recovered.error || recovered.revision <= changed.revision)
		recovered = (await stream.next()).value!
	expect(await (await fetch(server.url)).text()).toContain("Recovered")
	await writeFile(join(server.assetsDirectory, "font.woff2"), Buffer.from([4]))
	let assetChanged = (await stream.next()).value!
	while (assetChanged.revision <= recovered.revision)
		assetChanged = (await stream.next()).value!
	expect(
		new Uint8Array(
			await (await fetch(server.url + "assets/font.woff2")).arrayBuffer()
		)
	).toEqual(new Uint8Array([4]))
	await server.close()
	await expect(fetch(server.url)).rejects.toThrow()
}, 10000)
