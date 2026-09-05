import {
	type GitCliffRelease,
	compactGitCliffReleases,
} from "@chitrank2050/monoline-ui/changelog"
import pkg from "@chitrank2050/monoline-ui/package.json"

import changelogJson from "./changelog.json"

export interface ReleaseInfo {
	version: string
	date: string
}

const PACKAGE_NAME = "@chitrank2050/monoline-ui"
const NPM_REGISTRY_URL = `https://registry.npmjs.org/${PACKAGE_NAME}`
const REVALIDATE_SECONDS = 3600 // Cache for 1 hour

function formatReleaseDate(dateString: string): string {
	const date = new Date(dateString)
	if (isNaN(date.getTime())) return ""
	return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export function getCompactChangelog(): GitCliffRelease[] {
	return compactGitCliffReleases(changelogJson as unknown as GitCliffRelease[])
}

export async function getLatestRelease(): Promise<ReleaseInfo> {
	// Fallback to local package.json version and current month/year
	const fallbackVersion = `v${pkg.version}`
	const fallbackDate = new Date().toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	})

	try {
		const res = await fetch(NPM_REGISTRY_URL, {
			next: { revalidate: REVALIDATE_SECONDS },
		})

		if (!res.ok) {
			return { version: fallbackVersion, date: fallbackDate }
		}

		const data = await res.json()
		const latestVersion = data["dist-tags"]?.latest

		if (!latestVersion) {
			return { version: fallbackVersion, date: fallbackDate }
		}

		const publishTime = data.time?.[latestVersion]
		const formattedDate = publishTime
			? formatReleaseDate(publishTime)
			: fallbackDate

		return {
			version: `v${latestVersion}`,
			date: formattedDate,
		}
	} catch {
		return { version: fallbackVersion, date: fallbackDate }
	}
}
