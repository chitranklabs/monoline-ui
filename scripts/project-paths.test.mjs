import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"
import { fileURLToPath } from "node:url"

import { createProjectPaths, projectPaths } from "./lib/project-paths.mjs"

test("export check works outside the repo and leaves generated files unchanged", () => {
	const files = [
		projectPaths.libraryManifest,
		projectPaths.jsrManifest,
		projectPaths.websiteTsconfig,
		path.join(projectPaths.sourceDir, "index.ts"),
		path.join(projectPaths.sourceDir, "metadata.json"),
		path.join(projectPaths.sourceDir, "foundations/theme.css"),
	]
	const before = files.map((file) => readFileSync(file, "utf8"))
	const result = spawnSync(
		process.execPath,
		[fileURLToPath(new URL("./sync-exports.mjs", import.meta.url)), "--check"],
		{
			cwd: tmpdir(),
			encoding: "utf8",
			timeout: 10_000,
		}
	)
	assert.ifError(result.error)
	assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
	assert.deepEqual(
		files.map((file) => readFileSync(file, "utf8")),
		before
	)
})

test("flat layout preserves existing package and website locations", () => {
	const root = path.resolve("/tmp/monoline paths")
	const paths = createProjectPaths({ repositoryRoot: root })
	assert.equal(paths.libraryRoot, root)
	assert.equal(paths.websiteRoot, root)
	assert.equal(paths.sourceDir, path.join(root, "src"))
	assert.equal(paths.distDir, path.join(root, "dist"))
	assert.equal(paths.libraryManifest, path.join(root, "package.json.lib"))
	assert.equal(paths.websiteTsconfig, path.join(root, "tsconfig.json"))
	assert.equal(paths.websiteSourcePrefix, "./src")
})

test("separate roots do not move repository tools or publish assets", () => {
	const root = path.resolve("/tmp/monoline paths")
	const paths = createProjectPaths({
		repositoryRoot: root,
		libraryRoot: path.join(root, "packages/ui"),
		websiteRoot: path.join(root, "apps/website"),
	})
	assert.equal(paths.sourceDir, path.join(root, "packages/ui/src"))
	assert.equal(paths.distDir, path.join(root, "packages/ui/dist"))
	assert.equal(paths.jsrManifest, path.join(root, "packages/ui/jsr.json"))
	assert.equal(
		paths.websiteTsconfig,
		path.join(root, "apps/website/tsconfig.json")
	)
	assert.equal(paths.toolBinDir, path.join(root, "node_modules/.bin"))
	assert.equal(paths.repositoryRoot, root)
	assert.equal(paths.websiteSourcePrefix, "../../packages/ui/src")
})

test("roots must be explicit absolute paths, never depend on shell cwd", () => {
	for (const key of ["repositoryRoot", "libraryRoot", "websiteRoot"]) {
		assert.throws(
			() =>
				createProjectPaths({
					repositoryRoot: path.resolve("/tmp/repo"),
					[key]: "relative",
				}),
			/absolute/
		)
	}
})
