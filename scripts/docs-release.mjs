import assert from "node:assert/strict"
import { execFile, execFileSync } from "node:child_process"
import {
	access,
	appendFile,
	mkdtemp,
	readFile,
	readdir,
	rm,
	writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import { pathToFileURL } from "node:url"
import { promisify } from "node:util"

import { projectPaths } from "./lib/project-paths.mjs"
import {
	docsName,
	releaseNotes,
	selectDocsRelease,
} from "./lib/release-plan.mjs"
import { packageDigest, registryJson } from "./release-registry.mjs"

const execute = promisify(execFile)
const manifestFile = "packages/docs/package.json"
const changelogFile = "packages/docs/CHANGELOG.md"
const candidateFile = "release-artifacts/monoline-docs.tgz"

const pendingChangesets = async (root) =>
	(await readdir(path.join(root, ".changeset"))).filter(
		(file) => file.endsWith(".md") && file !== "README.md"
	)
const readJson = async (root, file) =>
	JSON.parse(await readFile(path.join(root, file), "utf8"))
const run = (root, command, args) =>
	execute(command, args, {
		cwd: root,
		timeout: 120_000,
		maxBuffer: 4 * 1024 * 1024,
	})

export async function prepareDocsRelease(root = projectPaths.repositoryRoot) {
	try {
		await access(path.join(root, ".changeset/pre.json"))
		throw new Error("Prerelease mode is not supported by this stable workflow")
	} catch (error) {
		if (error.code !== "ENOENT") throw error
	}
	if (!(await pendingChangesets(root)).length) return null
	const temporary = await mkdtemp(joinTemporary("monoline-docs-release-"))
	try {
		const planFile = path.join(temporary, "plan.json")
		const cli = path.join(
			projectPaths.repositoryRoot,
			"node_modules/@changesets/cli/bin.js"
		)
		await run(root, process.execPath, [cli, "status", "--output", planFile])
		const release = selectDocsRelease(await readJson(temporary, "plan.json"))
		if (!release) return null
		for (const id of release.changesets) {
			const file = `.changeset/${id}.md`
			const { stdout } = await run(root, "git", [
				"status",
				"--porcelain",
				"--",
				file,
			])
			if (stdout.trim()) throw new Error(`Commit ${file} before preparing`)
		}
		await run(root, process.execPath, [cli, "version"])
		const manifest = await readJson(root, manifestFile)
		assert.equal(manifest.name, docsName)
		assert.equal(manifest.version, release.newVersion)
		return releaseIdentity(
			release.newVersion,
			await readFile(path.join(root, changelogFile), "utf8")
		)
	} finally {
		await rm(temporary, { recursive: true, force: true })
	}
}

const joinTemporary = (prefix) => path.join(tmpdir(), prefix)
const releaseIdentity = (version, changelog) => ({
	version,
	tag: `docs-v${version}`,
	notes: releaseNotes(changelog, version),
})

export async function verifyDocsRelease(root, requested) {
	if ((await pendingChangesets(root)).length)
		throw new Error("Unconsumed changesets remain; refresh the release PR")
	const manifest = await readJson(root, manifestFile)
	assert.equal(manifest.name, docsName)
	const release = releaseIdentity(
		manifest.version,
		await readFile(path.join(root, changelogFile), "utf8")
	)
	if (requested !== release.tag)
		throw new Error(
			"Requested tag and Docs package identity must match exactly"
		)
	return release
}

async function verifyNpm(root, publish) {
	const manifest = await readJson(root, manifestFile)
	assert.equal(manifest.name, docsName)
	assert.equal(process.env.RELEASE_TAG, `docs-v${manifest.version}`)
	const candidate = path.join(root, candidateFile)
	const url = `https://registry.npmjs.org/${encodeURIComponent(docsName)}/${manifest.version}`
	let metadata = await registryJson(url)
	if (!metadata && publish) {
		execFileSync(
			"npm",
			[
				"publish",
				candidate,
				"--access",
				"public",
				"--provenance",
				"--ignore-scripts",
			],
			{ cwd: root, stdio: "inherit" }
		)
		for (let attempt = 0; attempt < 10 && !metadata; attempt++) {
			await delay(2_000)
			metadata = await registryJson(url)
		}
	}
	assert(metadata, `Missing npm release ${docsName}@${manifest.version}`)
	const temporary = await mkdtemp(joinTemporary("monoline-docs-published-"))
	try {
		const response = await fetch(metadata.dist.tarball, {
			signal: AbortSignal.timeout(30_000),
		})
		assert(response.ok, "Could not download published npm artifact")
		const published = path.join(temporary, "published.tgz")
		await writeFile(published, Buffer.from(await response.arrayBuffer()))
		assert.equal(
			packageDigest(published),
			packageDigest(candidate),
			"Published npm contents differ from the verified candidate"
		)
	} finally {
		await rm(temporary, { recursive: true, force: true })
	}
}

async function main(command) {
	const root = projectPaths.repositoryRoot
	if (command === "prepare") {
		const release = await prepareDocsRelease(root)
		if (process.env.GITHUB_OUTPUT)
			await appendFile(
				process.env.GITHUB_OUTPUT,
				`release_ready=${Boolean(release)}\n${release ? `tag_name=${release.tag}\n` : ""}`
			)
		console.log(release ? `Prepared ${release.tag}` : "No pending Docs release")
		return
	}
	if (command === "verify") {
		const requested =
			process.env.INPUT_VERSION ||
			process.env.BRANCH_NAME?.replace(/^chore\/docs-release-/, "")
		const release = await verifyDocsRelease(root, requested)
		if (process.env.GITHUB_OUTPUT)
			await appendFile(
				process.env.GITHUB_OUTPUT,
				`tag_name=${release.tag}\nrelease_sha=${execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim()}\n`
			)
		if (process.env.RUNNER_TEMP)
			await writeFile(
				path.join(process.env.RUNNER_TEMP, "docs-release-notes.md"),
				release.notes + "\n"
			)
		console.log(`Verified ${release.tag}`)
		return
	}
	if (command === "publish-npm" || command === "verify-npm") {
		await verifyNpm(root, command === "publish-npm")
		return
	}
	throw new Error("Use prepare, verify, publish-npm, or verify-npm")
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
)
	main(process.argv[2]).catch((error) => {
		console.error(error)
		process.exitCode = 1
	})
