export const libraryName = "@chitrank2050/monoline-ui"

export function selectLibraryRelease(plan) {
	if (!Array.isArray(plan.releases) || !Array.isArray(plan.changesets)) {
		throw new Error("Invalid Changesets release plan")
	}
	const releases = plan.releases.filter((release) => release.type !== "none")
	if (releases.length === 0) return null
	if (releases.length !== 1 || releases[0].name !== libraryName) {
		throw new Error("Release automation currently supports only the UI package")
	}
	const release = releases[0]
	if (
		!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(release.newVersion) ||
		release.newVersion === release.oldVersion
	) {
		throw new Error(
			"Expected a new stable library version; prereleases require a separate workflow"
		)
	}
	if (!release.changesets?.length)
		throw new Error("Library release needs explicit changeset intent")
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
