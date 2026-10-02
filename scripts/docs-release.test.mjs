import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"

import {
	prepareDocsRelease,
	verifyDocsRelease,
	verifyNpm,
} from "./docs-release.mjs"
import { docsName, libraryName } from "./lib/release-plan.mjs"

const changesetsConfig = JSON.parse(
	await readFile(new URL("../.changeset/config.json", import.meta.url))
)

async function fixture(t) {
	const root = await mkdtemp(path.join(tmpdir(), "monoline-docs-release-test-"))
	t.after(() => rm(root, { recursive: true, force: true }))
	const write = async (file, value) => {
		await mkdir(path.dirname(path.join(root, file)), { recursive: true })
		await writeFile(
			path.join(root, file),
			typeof value === "string" ? value : JSON.stringify(value)
		)
	}
	const read = async (file) =>
		JSON.parse(await readFile(path.join(root, file), "utf8"))
	const git = (...args) =>
		execFileSync(
			"git",
			["-c", "core.hooksPath=/dev/null", "-c", "commit.gpgsign=false", ...args],
			{ cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
		).trim()
	await write("package.json", { name: "fixture", private: true })
	await write("pnpm-workspace.yaml", "packages:\n  - packages/*\n")
	await write("packages/docs/package.json", {
		name: docsName,
		version: "0.0.0",
	})
	await write("packages/ui/package.json", {
		name: libraryName,
		version: "0.5.0",
	})
	await write(".changeset/config.json", changesetsConfig)
	await write(".changeset/README.md", "Changesets\n")
	git("init", "-b", "main")
	git("config", "user.name", "Docs Release Test")
	git("config", "user.email", "docs-release@example.invalid")
	git("add", ".")
	git("commit", "-m", "chore: baseline")
	const add = async (name = docsName) => {
		await write(
			`.changeset/docs-release.md`,
			`---\n"${name}": minor\n---\n\nRelease the documentation package.\n`
		)
	}
	const commit = () => {
		git("add", ".")
		git("commit", "-m", "feat(docs): add release intent")
	}
	return { root, read, git, add, commit }
}

test("Docs release preparation versions only Docs and verifies its namespaced tag", async (t) => {
	const f = await fixture(t)
	await f.add()
	f.commit()
	const release = await prepareDocsRelease(f.root)
	assert.equal(release.tag, "docs-v0.1.0")
	assert.equal((await f.read("packages/docs/package.json")).version, "0.1.0")
	assert.equal((await f.read("packages/ui/package.json")).version, "0.5.0")
	assert.deepEqual(await verifyDocsRelease(f.root, release.tag), release)
	await assert.rejects(verifyDocsRelease(f.root, "v0.1.0"), /must match/)
})

test("Docs preparation ignores UI-only intent and rejects uncommitted Docs intent", async (t) => {
	const f = await fixture(t)
	await f.add(libraryName)
	f.commit()
	assert.equal(await prepareDocsRelease(f.root), null)
	assert.equal((await f.read("packages/ui/package.json")).version, "0.5.0")
	await f.add()
	await assert.rejects(prepareDocsRelease(f.root), /Commit .changeset/)
})

test("Docs npm recovery verifies a landed artifact after a failed publish command", async (t) => {
	const f = await fixture(t)
	await writeFile(
		path.join(f.root, "packages/docs/package.json"),
		JSON.stringify({ name: docsName, version: "0.1.0" })
	)
	await mkdir(path.join(f.root, "release-artifacts"))
	const candidate = path.join(f.root, "release-artifacts/monoline-docs.tgz")
	execFileSync("tar", [
		"-czf",
		candidate,
		"-C",
		f.root,
		"packages/docs/package.json",
	])
	const bytes = await readFile(candidate)
	t.mock.method(globalThis, "fetch", async () => new Response(bytes))
	let lookups = 0
	let publications = 0
	const options = {
		releaseTag: "docs-v0.1.0",
		lookup: async () =>
			++lookups === 1
				? null
				: { dist: { tarball: "https://registry.example/candidate.tgz" } },
		pause: async () => {},
		publishCandidate: () => {
			publications++
			throw new Error("Upload connection closed")
		},
	}
	await verifyNpm(f.root, true, options)
	assert.equal(publications, 1)
	assert.equal(lookups, 2)
	await verifyNpm(f.root, true, options)
	assert.equal(
		publications,
		1,
		"an existing matching release is never republished"
	)
	await assert.rejects(
		verifyNpm(f.root, true, { ...options, lookup: async () => null }),
		/Upload connection closed/
	)
	await writeFile(
		path.join(f.root, "packages/docs/package.json"),
		JSON.stringify({ name: docsName, version: "0.1.0", changed: true })
	)
	execFileSync("tar", [
		"-czf",
		candidate,
		"-C",
		f.root,
		"packages/docs/package.json",
	])
	await assert.rejects(verifyNpm(f.root, true, options), /contents differ/)
})
