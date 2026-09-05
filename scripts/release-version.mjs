import { execFile } from "node:child_process"
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
import { pathToFileURL } from "node:url"
import { promisify } from "node:util"

import { projectPaths } from "./lib/project-paths.mjs"
import {
	libraryName,
	mergeTimelineEntries,
	releaseNotes,
	selectLibraryRelease,
	timelineEntry,
} from "./lib/release-plan.mjs"

const execute = promisify(execFile)
const json = (value) => JSON.stringify(value, null, "\t") + "\n"
const readJson = async (file) => JSON.parse(await readFile(file, "utf8"))

export async function versionRelease(root = projectPaths.repositoryRoot) {
	const temporary = await mkdtemp(path.join(tmpdir(), "monoline-release-"))
	const cli = path.join(
		projectPaths.repositoryRoot,
		"node_modules/@changesets/cli/bin.js"
	)
	const run = (command, args) =>
		execute(command, args, {
			cwd: root,
			timeout: 120_000,
			maxBuffer: 4 * 1024 * 1024,
		})
	try {
		try {
			await access(path.join(root, ".changeset/pre.json"))
			throw new Error(
				"Prerelease mode is not supported by this stable release workflow"
			)
		} catch (error) {
			if (error.code !== "ENOENT") throw error
		}
		const pending = (await readdir(path.join(root, ".changeset"))).filter(
			(file) => file.endsWith(".md") && file !== "README.md"
		)
		if (pending.length === 0) return null
		const planFile = path.join(temporary, "plan.json")
		await run(process.execPath, [cli, "status", "--output", planFile])
		const plan = await readJson(planFile)
		const release = selectLibraryRelease(plan)
		if (!release) return null
		const manifestPath = path.join(root, "packages/ui/package.json")
		const jsrPath = path.join(root, "packages/ui/jsr.json")
		const historyPath = path.join(root, "apps/website/app/lib/changelog.json")
		const manifest = await readJson(manifestPath)
		const jsr = await readJson(jsrPath)
		const history = await readJson(historyPath)
		if (
			manifest.version !== release.oldVersion ||
			jsr.version !== manifest.version ||
			jsr.name !== libraryName
		)
			throw new Error(
				"Library and JSR versions must agree before preparing a release"
			)
		if (history.some((entry) => entry.version === `v${release.newVersion}`))
			throw new Error("Release already exists in the website history")
		const commits = []
		for (const id of release.changesets) {
			const file = `.changeset/${id}.md`
			const { stdout: dirty } = await run("git", [
				"status",
				"--porcelain",
				"--",
				file,
			])
			if (dirty.trim())
				throw new Error(`Commit ${file} before preparing the release`)
			const { stdout } = await run("git", [
				"log",
				"-1",
				"--format=%H%x00%an%x00%at",
				"--",
				file,
			])
			const [sha, name, timestamp] = stdout.trim().split("\0")
			if (!/^[a-f0-9]{40}$/.test(sha))
				throw new Error(`Missing committed attribution for ${file}`)
			const change = plan.changesets.find((entry) => entry.id === id)
			const bump = change.releases.find(
				(entry) => entry.name === libraryName
			)?.type
			commits.push(
				timelineEntry(change, bump, {
					id: sha,
					name,
					timestamp: Number(timestamp),
				})
			)
		}
		await run(process.execPath, [cli, "version"])
		if ((await readJson(manifestPath)).version !== release.newVersion)
			throw new Error("Changesets produced an unexpected library version")
		const notes = releaseNotes(
			await readFile(path.join(root, "packages/ui/CHANGELOG.md"), "utf8"),
			release.newVersion
		)
		await writeFile(jsrPath, json({ ...jsr, version: release.newVersion }))
		await writeFile(
			historyPath,
			json([
				{
					version: `v${release.newVersion}`,
					timestamp: Math.floor(Date.now() / 1000),
					commits: mergeTimelineEntries(commits),
				},
				...history,
			])
		)
		return { version: release.newVersion, tag: `v${release.newVersion}`, notes }
	} finally {
		await rm(temporary, { recursive: true, force: true })
	}
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
	const release = await versionRelease()
	if (process.env.GITHUB_OUTPUT)
		await appendFile(
			process.env.GITHUB_OUTPUT,
			`release_ready=${Boolean(release)}\n${release ? `tag_name=${release.tag}\n` : ""}`
		)
	console.log(
		release
			? `Prepared ${release.tag}; review the generated files before committing.`
			: "No pending library release; nothing changed."
	)
}
