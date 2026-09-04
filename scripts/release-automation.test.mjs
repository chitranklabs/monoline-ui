import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import {
	access,
	mkdir,
	mkdtemp,
	readFile,
	rm,
	writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"

import {
	libraryName,
	releaseNotes,
	selectLibraryRelease,
	timelineEntry,
} from "./lib/release-plan.mjs"
import { verifyRelease } from "./release-verify.mjs"
import { versionRelease } from "./release-version.mjs"

const config = JSON.parse(
	await readFile(new URL("../.changeset/config.json", import.meta.url))
)
const oldHistory = [
	{
		version: "v0.4.0",
		timestamp: 123,
		commits: [],
		previous: { version: "v0.3.0" },
		custom: "preserve",
	},
]

async function fixture(t) {
	const root = await mkdtemp(path.join(tmpdir(), "monoline-release-test-"))
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
	await write("package.json", {
		name: "monoline",
		private: true,
		version: "0.4.0",
	})
	await write("pnpm-workspace.yaml", "packages:\n  - packages/*\n  - apps/*\n")
	await write("packages/ui/package.json", {
		name: libraryName,
		version: "0.4.0",
	})
	await write("packages/ui/jsr.json", {
		name: libraryName,
		version: "0.4.0",
		exports: { ".": "./src/index.ts" },
	})
	await write(
		"packages/ui/CHANGELOG.md",
		"# Monoline UI\n\nHistorical releases are archived.\n"
	)
	await write("apps/website/package.json", {
		name: "@monoline/website",
		private: true,
		version: "0.0.0",
		dependencies: { [libraryName]: "workspace:*" },
	})
	await write("apps/website/app/lib/changelog.json", oldHistory)
	await write(
		"CHANGELOG.md",
		"Historical mixed release archive: never rewrite.\n"
	)
	await write(".changeset/config.json", config)
	git("init", "-b", "main")
	git("config", "user.name", "Release Test")
	git("config", "user.email", "release-test@example.invalid")
	git("add", ".")
	git("commit", "-m", "chore: baseline")
	const add = async (
		id = "stable-button",
		summary = "fix(button): Preserve keyboard focus."
	) => {
		await write(
			`.changeset/${id}.md`,
			`---\n"${libraryName}": patch\n---\n\n${summary}\n`
		)
	}
	const commit = () => {
		git("add", ".")
		git("commit", "-m", "fix: add release intent")
		return git("rev-parse", "HEAD")
	}
	return { root, read, write, git, add, commit }
}

test("real Changesets versioning preserves private packages and historical releases", async (t) => {
	const f = await fixture(t)
	const privateBefore = await f.read("apps/website/package.json")
	await f.add()
	const sha = f.commit()
	const result = await versionRelease(f.root)
	assert.deepEqual(await verifyRelease(f.root, result.tag), {
		tag: result.tag,
		notes: result.notes,
	})
	await assert.rejects(verifyRelease(f.root, "v9.9.9"), /must match exactly/)
	assert.equal(result.tag, "v0.4.1")
	assert.match(result.notes, /Preserve keyboard focus/)
	assert.equal((await f.read("packages/ui/package.json")).version, "0.4.1")
	assert.equal((await f.read("packages/ui/jsr.json")).version, "0.4.1")
	assert.equal((await f.read("package.json")).version, "0.4.0")
	assert.deepEqual(await f.read("apps/website/package.json"), privateBefore)
	const history = await f.read("apps/website/app/lib/changelog.json")
	assert.deepEqual(history.slice(1), oldHistory)
	assert.equal(history[0].commits[0].id, sha)
	assert.equal(history[0].commits[0].author.name, "Release Test")
	assert.equal(history[0].commits[0].author.email, "")
	assert.equal(history[0].commits[0].group, "Bug Fixes")
	assert.equal(
		await readFile(path.join(f.root, "CHANGELOG.md"), "utf8"),
		"Historical mixed release archive: never rewrite.\n"
	)
	await assert.rejects(
		access(path.join(f.root, ".changeset/stable-button.md")),
		{ code: "ENOENT" }
	)
	const before = f.git("diff")
	assert.equal(await versionRelease(f.root), null)
	assert.equal(f.git("diff"), before)
	await f.add("newer-change")
	await assert.rejects(
		verifyRelease(f.root, result.tag),
		/Unconsumed changesets/
	)
})

test("website-only work and empty changesets never bump the library", async (t) => {
	const f = await fixture(t)
	await f.write("apps/website/page.tsx", "// documentation only\n")
	f.commit()
	assert.equal(await versionRelease(f.root), null)
	await f.write(".changeset/no-release.md", "---\n{}\n---\n")
	f.commit()
	assert.equal(await versionRelease(f.root), null)
	assert.equal(f.git("status", "--porcelain"), "")
})

test("changesets sharing a commit retain all summaries without duplicate timeline keys", async (t) => {
	const f = await fixture(t)
	await f.add("focus", "fix(button): Preserve keyboard focus.")
	await f.add("spacing", "fix(card): Correct spacing.")
	f.commit()
	await versionRelease(f.root)
	const history = await f.read("apps/website/app/lib/changelog.json")
	assert.equal(history[0].commits.length, 1)
	assert.match(history[0].commits[0].message, /Preserve keyboard focus/)
	assert.match(history[0].commits[0].message, /Correct spacing/)
	await f.write("apps/website/app/lib/changelog.json", oldHistory)
	await assert.rejects(verifyRelease(f.root, "v0.4.1"), /matching, nonempty/)
})

for (const [name, setup, error] of [
	["uncommitted release intent", async () => {}, /Commit .changeset/],
	[
		"JSR version drift",
		async (f) => {
			await f.write("packages/ui/jsr.json", {
				name: libraryName,
				version: "0.3.0",
			})
			f.commit()
		},
		/versions must agree/,
	],
	[
		"duplicate website release",
		async (f) => {
			await f.write("apps/website/app/lib/changelog.json", [
				{ version: "v0.4.1" },
				...oldHistory,
			])
			f.commit()
		},
		/already exists/,
	],
	[
		"prerelease mode",
		async (f) => {
			await f.write(".changeset/pre.json", {})
			f.commit()
		},
		/Prerelease mode/,
	],
]) {
	test(`release preparation rejects ${name} before mutation`, async (t) => {
		const f = await fixture(t)
		await f.add()
		await setup(f)
		const before = f.git("status", "--porcelain")
		await assert.rejects(versionRelease(f.root), error)
		assert.equal((await f.read("packages/ui/package.json")).version, "0.4.0")
		assert.equal(f.git("status", "--porcelain"), before)
		await access(path.join(f.root, ".changeset/stable-button.md"))
	})
}

test("release plan rejects unsupported packages, prereleases and missing intent", () => {
	const release = {
		name: libraryName,
		oldVersion: "0.4.0",
		newVersion: "0.4.1",
		changesets: ["focus"],
	}
	const plan = {
		releases: [release],
		changesets: [{ id: "focus", summary: "Fix focus." }],
	}
	assert.equal(selectLibraryRelease(plan), release)
	assert.equal(selectLibraryRelease({ releases: [], changesets: [] }), null)
	assert.throws(() => selectLibraryRelease({}), /Invalid/)
	for (const invalid of [
		{ ...release, name: "@monoline/future" },
		{ ...release, newVersion: "0.4.1-beta.1" },
		{ ...release, newVersion: "0.4.0" },
		{ ...release, changesets: [] },
		{ ...release, changesets: ["../unsafe"] },
	])
		assert.throws(() => selectLibraryRelease({ ...plan, releases: [invalid] }))
})

test("release notes select only the exact version heading", () => {
	assert.equal(
		releaseNotes(
			"# UI\n\n## 0.4.1\n\n### Patch Changes\n\n- Fix focus.\n\n## 0.4.0\n\nOld.\n",
			"0.4.1"
		),
		"### Patch Changes\n\n- Fix focus."
	)
	assert.throws(
		() => releaseNotes("### 0.4.1\nWrong heading", "0.4.1"),
		/Missing/
	)
	assert.throws(() => releaseNotes("## 0.4.1\n\n", "0.4.1"), /Empty/)
	assert.throws(() => releaseNotes("", "v0.4.1"), /Invalid/)
})

test("timeline retains breaking intent without fabricating GitHub identities", () => {
	const entry = timelineEntry(
		{ summary: "feat(dialog)!: Replace the focus API.\n\nMigration details." },
		"major",
		{ id: "a".repeat(40), name: "Author", timestamp: 123 }
	)
	assert.equal(entry.group, "Features")
	assert.equal(entry.breaking, true)
	assert.equal(entry.scope, "dialog")
	assert.equal(entry.body, "Migration details.")
	assert.equal(entry.remote, undefined)
})
