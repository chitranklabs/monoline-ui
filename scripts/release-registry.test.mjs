import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"

import {
	packageDigest,
	registryJson,
	verifyJsrManifest,
} from "./release-registry.mjs"

test("registry absence is distinct from authorization failure and transient outage", async (t) => {
	const request = t.mock.method(
		globalThis,
		"fetch",
		async () => new Response(null, { status: 404 })
	)
	assert.equal(await registryJson("https://registry.example"), null)
	request.mock.mockImplementation(
		async () => new Response(null, { status: 403 })
	)
	await assert.rejects(
		registryJson("https://registry.example"),
		/rejected lookup: 403/
	)
	let attempts = 0
	request.mock.mockImplementation(async () =>
		++attempts === 1
			? new Response(null, { status: 503 })
			: Response.json({ version: "1.0.0" })
	)
	assert.deepEqual(await registryJson("https://registry.example"), {
		version: "1.0.0",
	})
	assert.equal(attempts, 2)
})

test("release verification compares actual package and JSR contents", async (t) => {
	const directory = await mkdtemp(
		path.join(tmpdir(), "monoline-registry-test-")
	)
	t.after(() => rm(directory, { recursive: true, force: true }))
	const file = path.join(directory, "index.ts")
	await writeFile(file, "export const value = 1;")
	const checksum = `sha256-${createHash("sha256").update("export const value = 1;").digest("hex")}`
	await verifyJsrManifest({ "/index.ts": { checksum } }, directory)
	await assert.rejects(
		verifyJsrManifest({ "/index.ts": { checksum: "different" } }, directory),
		/differs/
	)
	await assert.rejects(
		verifyJsrManifest({ "/../outside": { checksum } }, directory),
		/Invalid JSR file path/
	)
	await assert.rejects(verifyJsrManifest({}, directory), /Empty JSR manifest/)
	const tarball = path.join(directory, "candidate.tgz")
	execFileSync("tar", ["-czf", tarball, "-C", directory, "index.ts"])
	const before = packageDigest(tarball)
	await writeFile(file, "export const value = 2;")
	execFileSync("tar", ["-czf", tarball, "-C", directory, "index.ts"])
	assert.notEqual(packageDigest(tarball), before)
})
