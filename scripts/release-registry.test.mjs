import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"

import { jsrSource } from "./lib/jsr-publication.mjs"
import {
	packageDigest,
	registryJson,
	verifyJsrManifest,
	verifyJsrProvenance,
	verifyPublishedJsrVersion,
	waitForNpmMetadata,
} from "./release-registry.mjs"

test("JSR verification accepts only the expected Deno rewrites and intact source", async (t) => {
	const directory = await mkdtemp(path.join(tmpdir(), "monoline-jsr-rewrite-"))
	t.after(() => rm(directory, { recursive: true, force: true }))
	await writeFile(
		path.join(directory, "root.tsx"),
		"export const root = <div />\n"
	)
	const source =
		'import { root } from "./root"\nimport type * as React from "react"\nexport const value = 1\n'
	await writeFile(path.join(directory, "index.ts"), source)
	const context = {
		dependencies: { react: "^19.2.8" },
		typeDependencies: { "@types/react": "^19.3.0" },
	}
	const published =
		'import { root } from "./root.tsx"\n/* @ts-types="npm:@types/react@^19.3.0" */ import type * as React from "npm:react@^19.2.8"\nexport const value = 1\n'
	const digest = (value) =>
		`sha256-${createHash("sha256").update(value).digest("hex")}`
	assert.equal(
		jsrSource(
			source,
			path.join(directory, "index.ts"),
			context.dependencies,
			context.typeDependencies
		),
		published
	)
	await verifyJsrManifest(
		{ "/index.ts": { checksum: digest(published) } },
		directory,
		context
	)
	for (const changed of [
		published.replace("value = 1", "value = 2"),
		published.replace("root.tsx", "other.tsx"),
		published.replace("react@^19.2.8", "react@^20.0.0"),
		published.replace("@types/react@^19.3.0", "@types/react@*"),
	]) {
		await assert.rejects(
			verifyJsrManifest(
				{ "/index.ts": { checksum: digest(changed) } },
				directory,
				context
			),
			/differs/
		)
	}
	await assert.rejects(
		verifyJsrManifest(
			{ "/index.ts": { checksum: digest(published) } },
			directory,
			{ ...context, files: ["/index.ts", "/root.tsx"] }
		),
		/file set differs/
	)
	const jsx =
		"/** @jsxRuntime automatic *//** @jsxImportSource npm:react@^19.2.8 *//** @jsxImportSourceTypes npm:react@^19.2.8 */export const root = <div />\n"
	assert.equal(
		jsrSource(
			"export const root = <div />\n",
			"root.tsx",
			context.dependencies,
			context.typeDependencies
		),
		jsx
	)
	assert.throws(
		() =>
			jsrSource(
				"/** @jsxImportSource preact */<div />",
				"root.tsx",
				context.dependencies,
				context.typeDependencies
			),
		/Custom JSX pragmas/
	)
	assert.throws(
		() =>
			jsrSource(
				'import "./missing"',
				path.join(directory, "index.ts"),
				context.dependencies,
				context.typeDependencies
			),
		/Unresolved publication import/
	)
})

test("JSR provenance requires an explicit and disclosed recovery exception", () => {
	assert.equal(verifyJsrProvenance({ rekorLogId: "123" }), true)
	assert.throws(
		() => verifyJsrProvenance({ rekorLogId: null }),
		/no provenance/
	)
	assert.equal(
		verifyJsrProvenance({ rekorLogId: null }, "disabled-for-recovery"),
		false
	)
	assert.throws(
		() => verifyJsrProvenance(null, "disabled-for-recovery"),
		/unavailable/
	)
	assert.throws(
		() => verifyJsrProvenance({ rekorLogId: "123" }, "ignore"),
		/Invalid JSR provenance policy/
	)
})

test("npm availability polling tolerates publish-time scanning and stays bounded", async () => {
	let calls = 0
	const pauses = []
	const metadata = { version: "3.4.5" }
	assert.deepEqual(
		await waitForNpmMetadata("https://registry.example", {
			lookup: async () => (++calls === 20 ? metadata : null),
			pause: async (milliseconds) => pauses.push(milliseconds),
		}),
		metadata
	)
	assert.equal(calls, 20)
	assert.equal(pauses.length, 19)
	assert.ok(pauses.every((milliseconds) => milliseconds >= 20_000))
	calls = 0
	assert.equal(
		await waitForNpmMetadata("https://registry.example", {
			lookup: async () => {
				calls++
				return null
			},
			pause: async () => {},
		}),
		null
	)
	assert.equal(calls, 61)
	await assert.rejects(
		waitForNpmMetadata("https://registry.example", {
			lookup: async () => {
				throw new Error("Unauthorized")
			},
			pause: async () => {
				throw new Error("Must not retry authorization failure")
			},
		}),
		/Unauthorized/
	)
})

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

test("published JSR lookup fails on missing or mismatched artifact identity", async (t) => {
	const directory = await mkdtemp(path.join(tmpdir(), "monoline-jsr-identity-"))
	t.after(() => rm(directory, { recursive: true, force: true }))
	await writeFile(path.join(directory, "index.ts"), "verified source")
	let manifest = { "/index.ts": { checksum: "different" } }
	t.mock.method(globalThis, "fetch", async (url) =>
		Response.json(
			url.endsWith("/meta.json") ? { versions: { "0.5.0": {} } } : { manifest }
		)
	)
	await assert.rejects(
		verifyPublishedJsrVersion(
			"https://jsr.example/meta.json",
			"0.5.0",
			directory
		),
		/Published JSR file differs/
	)
	manifest = undefined
	await assert.rejects(
		verifyPublishedJsrVersion(
			"https://jsr.example/meta.json",
			"0.5.0",
			directory
		),
		/manifest is unavailable/
	)
	manifest = {
		"/index.ts": {
			checksum: `sha256-${createHash("sha256").update("verified source").digest("hex")}`,
		},
	}
	assert.equal(
		await verifyPublishedJsrVersion(
			"https://jsr.example/meta.json",
			"0.5.0",
			directory
		),
		true
	)
	await assert.rejects(
		verifyPublishedJsrVersion(
			"https://jsr.example/meta.json",
			"0.5.0",
			directory,
			{ exports: { ".": "./index.ts" } }
		),
		/Published JSR exports differ/
	)
	assert.equal(
		await verifyPublishedJsrVersion(
			"https://jsr.example/meta.json",
			"0.4.0",
			directory
		),
		false
	)
})
