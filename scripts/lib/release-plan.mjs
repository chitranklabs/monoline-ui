import { load } from "js-yaml"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

export const libraryName = "@chitrank2050/monoline-ui"
export const docsName = "@chitrank2050/monoline-docs"

const releaseProduct = (name) => {
	if (name === libraryName)
		return { label: "Monoline UI", directory: "ui", registries: "npm and JSR" }
	if (name === docsName)
		return { label: "Monoline Docs", directory: "docs", registries: "npm" }
	throw new Error("Unknown release package")
}

export function releasePrBody(release, name) {
	const product = releaseProduct(name)
	return `## ${product.label} ${release.version}

Release of \`${name}@${release.version}\` to ${product.registries}.

${release.notes.trim()}

[Package changelog](https://github.com/chitranklabs/monoline-ui/blob/release/${release.tag}/packages/${product.directory}/CHANGELOG.md)
`
}

export function publicReleaseNotes(
	release,
	name,
	installation,
	requirements,
	artifact
) {
	const product = releaseProduct(name)
	const reference = `https://github.com/chitranklabs/monoline-ui/blob/${release.tag}`
	return `## ${product.label} ${release.version}

${release.notes.trim()}

### Install

\`\`\`sh
${installation}
\`\`\`

${requirements}

### Links

- [Package guide](${reference}/packages/${product.directory}/README.md)
- [Changelog](${reference}/packages/${product.directory}/CHANGELOG.md)
- [npm package](https://www.npmjs.com/package/${name}/v/${release.version})

The attached \`${artifact}\` is the verified release candidate. npm publication includes provenance.
`
}

function selectRelease(plan, name, label) {
	if (!Array.isArray(plan.releases) || !Array.isArray(plan.changesets)) {
		throw new Error("Invalid Changesets release plan")
	}
	const releases = plan.releases.filter((release) => release.type !== "none")
	if (releases.length === 0) return null
	const release = releases.find((entry) => entry.name === name)
	if (!release) return null
	if (releases.some((entry) => ![libraryName, docsName].includes(entry.name)))
		throw new Error(`${label} release cannot include an unsupported package`)
	if (
		plan.changesets.some(
			(change) =>
				change.releases?.some((entry) => entry.name === name) &&
				change.releases.some((entry) => entry.name !== name)
		)
	)
		throw new Error(
			"Split cross-package changesets before preparing an independent release"
		)
	if (
		!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(release.newVersion) ||
		release.newVersion === release.oldVersion
	) {
		throw new Error(
			`Expected a new stable ${label} version; prereleases require a separate workflow`
		)
	}
	if (!release.changesets?.length)
		throw new Error(`${label} release needs explicit changeset intent`)
	for (const id of release.changesets) {
		if (
			!/^[a-zA-Z0-9_-]+$/.test(id) ||
			!plan.changesets.some(
				(change) => change.id === id && change.summary?.trim()
			)
		) {
			throw new Error("Missing or invalid changeset summary")
		}
	}
	return release
}

export const selectLibraryRelease = (plan) =>
	selectRelease(plan, libraryName, "library")
export const selectDocsRelease = (plan) => selectRelease(plan, docsName, "Docs")

export function releaseNotes(changelog, version) {
	if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(version))
		throw new Error("Invalid stable release version")
	const marker = `## ${version}\n`
	const start = changelog.startsWith(marker)
		? 0
		: changelog.indexOf(`\n${marker}`) + 1
	if (start === 0 && !changelog.startsWith(marker))
		throw new Error(`Missing package changelog for ${version}`)
	const body = changelog.slice(start + marker.length)
	const end = body.search(/^## /m)
	const notes = (end < 0 ? body : body.slice(0, end)).trim()
	if (!notes) throw new Error("Empty release notes")
	return notes
}

export function timelineEntry(change, type, author) {
	const [headline, ...body] = change.summary.trim().split("\n")
	const conventional =
		/^(feat|fix|perf|refactor|docs|test|build|ci|chore)(?:\(([^)]+)\))?(!)?:\s*(.+)$/.exec(
			headline
		)
	const groups = {
		feat: "Features",
		fix: "Bug Fixes",
		perf: "Performance",
		refactor: "Refactoring",
		docs: "Documentation",
		test: "Maintenance",
		build: "Maintenance",
		ci: "Maintenance",
		chore: "Maintenance",
	}
	return {
		id: author.id,
		message: conventional ? conventional[4] : headline,
		body: body.join("\n").trim() || null,
		group: conventional
			? groups[conventional[1]]
			: type === "minor" || type === "major"
				? "Features"
				: "Maintenance",
		breaking: type === "major" || Boolean(conventional?.[3]),
		scope: conventional?.[2] ?? null,
		author: { name: author.name, email: "", timestamp: author.timestamp },
	}
}

// The timeline keys rows by commit ID inside each group. A single commit may
// contain several changesets; combine their summaries without inventing SHAs.
export function mergeTimelineEntries(entries) {
	const result = new Map()
	for (const entry of entries) {
		const key = `${entry.id}:${entry.group}`
		const previous = result.get(key)
		if (!previous) {
			result.set(key, { ...entry })
			continue
		}
		previous.message += `; ${entry.message}`
		previous.body =
			[previous.body, entry.body].filter(Boolean).join("\n\n") || null
		previous.breaking ||= entry.breaking
		if (previous.scope !== entry.scope) previous.scope = null
	}
	return [...result.values()]
}

export async function pendingPackageChangesets(root, name) {
	const directory = path.join(root, ".changeset")
	const files = (await readdir(directory)).filter(
		(file) => file.endsWith(".md") && file !== "README.md"
	)
	const pending = []
	for (const file of files) {
		const content = await readFile(path.join(directory, file), "utf8")
		const frontmatter = /^---\r?\n([\s\S]*?)^---[ \t]*(?:\r?\n|$)/m.exec(
			content
		)
		if (!frontmatter) throw new Error(`Invalid changeset frontmatter: ${file}`)
		const releases = frontmatter[1].trim() ? load(frontmatter[1]) : {}
		if (releases && (typeof releases !== "object" || Array.isArray(releases)))
			throw new Error(`Invalid changeset releases: ${file}`)
		if (releases && Object.hasOwn(releases, name)) pending.push(file)
	}
	return pending
}
