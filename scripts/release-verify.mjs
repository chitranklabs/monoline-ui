import { execFileSync } from "node:child_process"
import { appendFile, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"

import { projectPaths } from "./lib/project-paths.mjs"
import {
	libraryName,
	pendingPackageChangesets,
	publicReleaseNotes,
	releaseNotes,
} from "./lib/release-plan.mjs"

export async function verifyRelease(root, requested) {
	const pending = await pendingPackageChangesets(root, libraryName)
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
		process.env.BRANCH_NAME?.replace(/^(?:release\/|chore\/release-)/, "")
	const release = await verifyRelease(projectPaths.repositoryRoot, requested)
	const manifest = JSON.parse(
		await readFile(projectPaths.libraryManifest, "utf8")
	)
	if (process.env.GITHUB_OUTPUT)
		await appendFile(
			process.env.GITHUB_OUTPUT,
			`tag_name=${release.tag}\nrelease_sha=${execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim()}\n`
		)
	if (process.env.RUNNER_TEMP)
		await writeFile(
			path.join(process.env.RUNNER_TEMP, "release-notes.md"),
			publicReleaseNotes(
				{ ...release, version: release.tag.slice(1) },
				libraryName,
				`npm install ${libraryName}@${release.tag.slice(1)}`,
				`Requires React \`${manifest.peerDependencies.react}\`, React DOM \`${manifest.peerDependencies["react-dom"]}\` and Tailwind CSS \`${manifest.peerDependencies.tailwindcss}\`. Import the theme stylesheet as described in the package guide. Also available on JSR.`,
				"monoline.tgz"
			)
		)
	console.log(`Verified ${release.tag}`)
}
