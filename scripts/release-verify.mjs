import { appendFile, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"

import { projectPaths } from "./lib/project-paths.mjs"
import { libraryName, releaseNotes } from "./lib/release-plan.mjs"

export async function verifyRelease(root, requested) {
	const pending = (await readdir(path.join(root, ".changeset"))).filter(
		(file) => file.endsWith(".md") && file !== "README.md"
	)
	if (pending.length)
		throw new Error(
			"Unconsumed changesets remain; refresh the release PR before publishing"
		)
	const readJson = async (file) =>
		JSON.parse(await readFile(path.join(root, file), "utf8"))
	const manifest = await readJson("packages/ui/package.json")
	const jsr = await readJson("packages/ui/jsr.json")
	const tag = `v${manifest.version}`
	if (
		requested !== tag ||
		jsr.version !== manifest.version ||
		manifest.name !== libraryName ||
		jsr.name !== libraryName
	) {
		throw new Error(
			"Requested tag, library manifest and JSR identity must match exactly"
		)
	}
	const notes = releaseNotes(
		await readFile(path.join(root, "packages/ui/CHANGELOG.md"), "utf8"),
		manifest.version
	)
	const history = await readJson("apps/website/app/lib/changelog.json")
	if (
		history[0]?.version !== tag ||
		!history[0]?.commits?.length ||
		history.filter((entry) => entry.version === tag).length !== 1
	) {
		throw new Error(
			"Prepared release must have one matching, nonempty website timeline entry"
		)
	}
	return { tag, notes }
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
	const requested =
		process.env.INPUT_VERSION ||
		process.env.BRANCH_NAME?.replace(/^chore\/release-/, "")
	const release = await verifyRelease(projectPaths.repositoryRoot, requested)
	if (process.env.GITHUB_OUTPUT)
		await appendFile(process.env.GITHUB_OUTPUT, `tag_name=${release.tag}\n`)
	if (process.env.RUNNER_TEMP)
		await writeFile(
			path.join(process.env.RUNNER_TEMP, "release-notes.md"),
			release.notes + "\n"
		)
	console.log(`Verified ${release.tag}`)
}
