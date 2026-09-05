import type { GitCliffRelease } from "./types"

export interface GenerateRssOptions {
	/**
	 * Title of the RSS feed channel (e.g. "monoline-ui Changelog").
	 */
	title: string
	/**
	 * Description of the feed channel.
	 */
	description: string
	/**
	 * Canonical root site URL (e.g. "https://monolineui.chitrankagnihotri.com").
	 */
	siteUrl: string
	/**
	 * Path to the changelog web page.
	 * @default "/docs/changelog"
	 */
	changelogPath?: string
	/**
	 * Parsed git-cliff releases dataset.
	 */
	releases: GitCliffRelease[]
	/**
	 * Feed language code.
	 * @default "en-us"
	 */
	language?: string
}

const isNoiseCommit = (msg: string): boolean => {
	const lower = msg.toLowerCase()
	return (
		lower.includes("bump version") ||
		lower.startsWith("releasebump") ||
		lower.startsWith("release: bump") ||
		lower.startsWith("chore: bump") ||
		lower.startsWith("chore(release)") ||
		lower.startsWith("chore: update changelog") ||
		lower.startsWith("docs: update changelog")
	)
}

function escapeXml(unsafe: string): string {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;")
}

/**
 * Generate a standard RSS 2.0 / Atom XML feed string from a list of GitCliff releases.
 */
export function generateChangelogRss({
	title,
	description,
	siteUrl,
	changelogPath = "/docs/changelog",
	releases,
	language = "en-us",
}: GenerateRssOptions): string {
	const cleanSiteUrl = siteUrl.replace(/\/$/, "")
	const changelogUrl = `${cleanSiteUrl}${changelogPath.startsWith("/") ? changelogPath : `/${changelogPath}`}`
	const feedSelfUrl = `${changelogUrl}/feed.xml`

	const validReleases = releases.filter((r) => r.version !== null)

	const items = validReleases
		.map((release) => {
			const version = release.version ?? "Unreleased"
			const tagId = `release-${version.replace(/\./g, "-")}`
			const itemUrl = `${changelogUrl}#${tagId}`
			const pubDate = release.timestamp
				? new Date(release.timestamp * 1000).toUTCString()
				: new Date().toUTCString()

			const commitLines = (release.commits ?? [])
				.filter((c) => !isNoiseCommit(c.message))
				.map((c) => {
					const scope = c.scope ? `[${escapeXml(c.scope)}] ` : ""
					const sha = c.id ? ` (${c.id.slice(0, 7)})` : ""
					return `<li>${scope}${escapeXml(c.message)}${sha}</li>`
				})

			const commitHtml =
				commitLines.length > 0
					? `<ul>${commitLines.join("")}</ul>`
					: `<p>Release ${escapeXml(version)}</p>`

			return `
    <item>
      <title><![CDATA[${version}]]></title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${commitHtml}]]></description>
    </item>`
		})
		.join("")

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${title}]]></title>
    <link>${changelogUrl}</link>
    <description><![CDATA[${description}]]></description>
    <language>${language}</language>
    <atom:link href="${feedSelfUrl}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`.trim()
}

/**
 * Filter and normalize raw git-cliff JSON output:
 * - Omits null unreleased versions
 * - Truncates commit IDs to 7-character short SHAs
 * - Strips automated version bump noise
 */
export function compactGitCliffReleases(
	releases: GitCliffRelease[]
): GitCliffRelease[] {
	return (releases || [])
		.filter((r) => r && r.version !== null)
		.map((r) => ({
			version: r.version,
			timestamp: r.timestamp,
			commits: (r.commits || [])
				.filter((c) => c && !isNoiseCommit(c.message || ""))
				.map((c) => ({
					id: c.id ? c.id.slice(0, 7) : "",
					message: c.message || "",
					body: c.body ?? null,
					group: c.group ?? null,
					breaking: Boolean(c.breaking),
					scope: c.scope ?? null,
					author: {
						name: c.author?.name || "",
						email: c.author?.email || "",
						timestamp: c.author?.timestamp || 0,
					},
					remote: c.remote ?? c.github ?? null,
				})),
		}))
}
