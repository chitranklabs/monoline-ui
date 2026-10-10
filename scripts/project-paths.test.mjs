import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs"
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
		path.join(projectPaths.websiteRoot, "app/lib/catalog.json"),
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
	assert.equal(paths.libraryManifest, path.join(root, "package.json"))
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

test("install.sh and obliviate.sh enforce monorepo structure and clean workspace artifacts", () => {
	const installSh = readFileSync(
		path.join(projectPaths.repositoryRoot, "scripts/install.sh"),
		"utf8"
	)
	const obliviateSh = readFileSync(
		path.join(projectPaths.repositoryRoot, "scripts/obliviate.sh"),
		"utf8"
	)

	const workspaceGuard =
		"test -f pnpm-workspace.yaml && test -f packages/ui/package.json && test -f apps/website/package.json"
	assert.ok(installSh.includes(workspaceGuard))
	assert.ok(obliviateSh.includes(workspaceGuard))
	assert.ok(installSh.includes("packages/ui/node_modules"))
	assert.ok(installSh.includes("apps/website/node_modules"))
	assert.ok(obliviateSh.includes("packages/ui/dist"))
	assert.ok(obliviateSh.includes("apps/website/.next"))
	assert.ok(obliviateSh.includes("tsconfig.tsbuildinfo"))
})

test("cleanup removes generated files from every workspace and preserves reproducible inputs", () => {
	const root = mkdtempSync(path.join(tmpdir(), "monoline cleanup "))
	try {
		for (const folder of [
			"scripts",
			"packages/ui",
			"packages/docs",
			"apps/website",
			"apps/docs-demo",
		]) {
			mkdirSync(path.join(root, folder), { recursive: true })
			writeFileSync(path.join(root, folder, "package.json"), "{}")
		}
		writeFileSync(path.join(root, "pnpm-workspace.yaml"), "packages: []")
		writeFileSync(path.join(root, "pnpm-lock.yaml"), "locked inputs")
		const generated = [
			"node_modules",
			"packages/ui/dist",
			"packages/docs/dist",
			"apps/website/.next",
			"apps/docs-demo/dist",
			...["packages/ui", "packages/docs", "apps/website", "apps/docs-demo"].map(
				(folder) => `${folder}/node_modules`
			),
		]
		for (const folder of generated)
			mkdirSync(path.join(root, folder), { recursive: true })
		copyFileSync(
			path.join(projectPaths.repositoryRoot, "scripts/obliviate.sh"),
			path.join(root, "scripts/obliviate.sh")
		)
		const result = spawnSync(
			"bash",
			[path.join(root, "scripts/obliviate.sh")],
			{ cwd: tmpdir(), encoding: "utf8" }
		)
		assert.equal(result.status, 0, result.stderr)
		for (const folder of generated)
			assert.equal(existsSync(path.join(root, folder)), false, folder)
		assert.equal(
			readFileSync(path.join(root, "pnpm-lock.yaml"), "utf8"),
			"locked inputs"
		)
		assert.equal(
			existsSync(path.join(root, "packages/docs/package.json")),
			true
		)
	} finally {
		rmSync(root, { recursive: true, force: true })
	}
})

test("Vercel upload retains UI package build metadata", () => {
	const root = mkdtempSync(path.join(tmpdir(), "monoline-vercel-ignore-"))
	try {
		spawnSync("git", ["init", "--quiet"], { cwd: root })
		writeFileSync(
			path.join(root, ".gitignore"),
			readFileSync(path.join(projectPaths.repositoryRoot, ".vercelignore"))
		)
		const required = [
			"packages/ui/README.md",
			"packages/ui/CHANGELOG.md",
			"LICENSE",
			"CONTRIBUTING.md",
			"CODE_OF_CONDUCT.md",
			"SECURITY.md",
			"assets/logo.png",
			"scripts/vercel-ignore.sh",
		]
		for (const file of required) {
			const result = spawnSync("git", ["check-ignore", "--no-index", file], {
				cwd: root,
				encoding: "utf8",
			})
			assert.equal(result.status, 1, `Build input excluded: ${file}`)
		}
	} finally {
		rmSync(root, { recursive: true, force: true })
	}
})

test("Vercel skips only unrelated commits from either working directory", () => {
	const root = mkdtempSync(path.join(tmpdir(), "monoline vercel "))
	const command = JSON.parse(
		readFileSync(path.join(projectPaths.websiteRoot, "vercel.json"), "utf8")
	).ignoreCommand
	assert.ok(command.length <= 256, "Vercel ignore command schema limit")
	const git = (...args) =>
		spawnSync("git", args, { cwd: root, encoding: "utf8" })
	try {
		assert.equal(git("init", "--quiet").status, 0)
		git("config", "user.name", "Test")
		git("config", "user.email", "test@example.com")
		git("config", "commit.gpgsign", "false")
		git("config", "core.hooksPath", "/dev/null")
		mkdirSync(path.join(root, "apps/website"), { recursive: true })
		mkdirSync(path.join(root, "scripts"))
		writeFileSync(
			path.join(root, "scripts/vercel-ignore.sh"),
			readFileSync(
				path.join(projectPaths.repositoryRoot, "scripts/vercel-ignore.sh")
			)
		)
		writeFileSync(path.join(root, "README.md"), "initial")
		git("add", ".")
		git("commit", "--quiet", "-m", "initial")
		for (const previous of ["", "5ac45464e26822de83c6dd28d082c75fa7ea98a8"]) {
			for (const cwd of [root, path.join(root, "apps/website")]) {
				const result = spawnSync("bash", ["-c", command], {
					cwd,
					env: { ...process.env, VERCEL_GIT_PREVIOUS_SHA: previous },
					encoding: "utf8",
				})
				assert.equal(result.status, 1, "Missing history must allow the build")
			}
		}
		for (const [file, expected] of [
			["apps/website/page.tsx", 1],
			["packages/ui/src/index.ts", 1],
			["pnpm-lock.yaml", 1],
			["pnpm-workspace.yaml", 1],
			["package.json", 1],
			["scripts/build-lib.mjs", 1],
			["tsconfig.json", 1],
			["packages/docs/src/index.ts", 0],
			["README.md", 0],
		]) {
			mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
			writeFileSync(path.join(root, file), file)
			git("add", ".")
			git("commit", "--quiet", "-m", file)
			for (const cwd of [root, path.join(root, "apps/website")]) {
				const result = spawnSync("bash", ["-c", command], {
					cwd,
					env: { ...process.env, VERCEL_GIT_PREVIOUS_SHA: "" },
					encoding: "utf8",
				})
				assert.equal(
					result.status,
					expected,
					`${file} from ${cwd}: ${result.stderr}`
				)
			}
		}
		const result = spawnSync("bash", ["-c", command], {
			cwd: root,
			env: { ...process.env, VERCEL_GIT_PREVIOUS_SHA: "HEAD~3" },
			encoding: "utf8",
		})
		assert.equal(
			result.status,
			1,
			"Changes since the previous deployment must trigger a build"
		)
	} finally {
		rmSync(root, { recursive: true, force: true })
	}
})
