"use client"

import { ChangelogTimeline } from "@chitrank2050/monoline-ui/changelog"
import type { GitCliffRelease } from "@chitrank2050/monoline-ui/changelog"

import { ComponentPlayground } from "../../../_components/component-playground"

const mockReleases: GitCliffRelease[] = [
	{
		version: "v0.2.3",
		timestamp: 1782709517,
		commits: [
			{
				id: "948f68032a8745361fd45e452c4a0efe33157bd6",
				message: "bump version to v0.2.3",
				body: null,
				group: "Maintenance",
				breaking: false,
				scope: "release",
				author: {
					name: "chitrank-actions[bot]",
					email: "bot@github.com",
					timestamp: 1782709517,
				},
			},
			{
				id: "721bc6f32e987c1264b3c959f635678a1bcde45f",
				message: "introduce responsive mobile layouts",
				body: null,
				group: "Features",
				breaking: false,
				scope: "navbar",
				author: {
					name: "Chitrank Agnihotri",
					email: "chitrank@example.com",
					timestamp: 1782709210,
				},
				remote: {
					username: "chitrank2050",
					pr_number: 35,
				},
			},
			{
				id: "3f43881ae1ba717f0f2b4d1ddeb398c6c25d25b5",
				message: "fix hydration mismatch in light mode toggle",
				body: null,
				group: "Bug Fixes",
				breaking: false,
				scope: "theme-switcher",
				author: {
					name: "Chitrank Agnihotri",
					email: "chitrank@example.com",
					timestamp: 1782708100,
				},
			},
		],
	},
	{
		version: "v0.2.2",
		timestamp: 1780000000,
		commits: [
			{
				id: "2a34bc89de5678abf0123cd45ef67890abcdef12",
				message: "rearchitect token compiler system",
				body: "This changes the layout config format which is a breaking change.",
				group: "Features",
				breaking: true,
				scope: "foundations",
				author: {
					name: "Chitrank Agnihotri",
					email: "chitrank@example.com",
					timestamp: 1780000000,
				},
				remote: {
					username: "chitrank2050",
					pr_number: 28,
				},
			},
			{
				id: "8c7d6f5e4d3c2b1a0987f6e5d4c3b2a10987f6e5",
				message: "optimize bundle weights and bundle-splitting config",
				body: null,
				group: "Performance",
				breaking: false,
				scope: "build",
				author: {
					name: "renovate[bot]",
					email: "bot@renovate.com",
					timestamp: 1779950000,
				},
			},
		],
	},
]

const usageCode = `// 1. Generate release data with git-cliff:
// $ git cliff --context -o changelog.json

import {
  ChangelogTimeline,
  compactGitCliffReleases,
  type GitCliffRelease,
} from "@chitrank2050/monoline-ui/changelog"
import rawChangelog from "./changelog.json"

// Helper function filters unreleased blocks and normalizes commit SHAs
const releases = compactGitCliffReleases(rawChangelog as unknown as GitCliffRelease[])

export default function ChangelogPage() {
  return (
    <ChangelogTimeline
      releases={releases}
      githubOwner="chitranklabs"
      githubRepo="monoline-ui"
      allowedGroups={["Features", "Bug Fixes", "Performance"]}
    />
  )
}`

const sourceSnippet = `import {
  ChangelogTimeline,
  compactGitCliffReleases,
  generateChangelogRss,
  type GitCliffRelease,
} from "@chitrank2050/monoline-ui/changelog"
import rawChangelog from "./changelog.json"

/**
 * 1. UI TIMELINE INTEGRATION:
 * Helper function compactGitCliffReleases() cleans raw git-cliff JSON:
 * - Filters out null unreleased version blocks
 * - Normalizes commit IDs to 7-character short SHAs
 * - Strips automated version bump commits
 */
const releasesData: GitCliffRelease[] = compactGitCliffReleases(
  rawChangelog as unknown as GitCliffRelease[]
)

export function ChangelogView() {
  return (
    <section className="docs-page">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-mono">Changelog</h1>
        <p className="text-text-muted">
          Development log generated from conventional commits.
        </p>
      </header>

      <ChangelogTimeline
        releases={releasesData}
        githubOwner="chitranklabs"
        githubRepo="monoline-ui"
        allowedGroups={[
          "Features",
          "Bug Fixes",
          "Performance",
          "Documentation",
          "Maintenance",
        ]}
      />
    </section>
  )
}

/**
 * 2. RSS FEED ROUTE HANDLER (e.g. app/docs/changelog/feed.xml/route.ts):
 * Use generateChangelogRss() helper to serve an RSS 2.0 XML feed
 */
export async function getRssResponse(siteUrl: string) {
  const xml = generateChangelogRss({
    title: "Monoline UI Changelog",
    description: "Release notes and version updates",
    siteUrl,
    changelogPath: "/docs/changelog",
    releases: releasesData,
  })

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}`

const propsRows = [
	[
		"releases",
		"GitCliffRelease[]",
		"Array of release objects matching git-cliff schema (version, timestamp, commits). Clean with `compactGitCliffReleases()`.",
	],
	[
		"allowedGroups",
		"string[]",
		"Conventional categories to show (e.g. ['Features', 'Bug Fixes', 'Performance']). Default: ['Features', 'Bug Fixes', 'Performance']",
	],
	[
		"maxCommitsPerRelease",
		"number",
		"Maximum number of commits to render per category group before collapsing with a '+N more' counter (default: 8)",
	],
	[
		"githubOwner",
		"string",
		"GitHub org or owner name (e.g. 'chitranklabs') to form absolute release, commit, and PR links",
	],
	[
		"githubRepo",
		"string",
		"GitHub repository name (e.g. 'monoline-ui') to form absolute release, commit, and PR links",
	],
	[
		"showCommitHash",
		"boolean",
		"Show short 7-character commit SHA links (default: true)",
	],
	[
		"showAuthor",
		"boolean",
		"Show contributor username and avatar links (default: true)",
	],
	[
		"compactGitCliffReleases()",
		"Helper Function",
		"Utility to filter null unreleased blocks, truncate commit SHAs to 7 chars, and normalize raw git-cliff JSON data.",
	],
	[
		"generateChangelogRss()",
		"Helper Function",
		"Utility to generate a standard RSS 2.0 / Atom XML feed string from parsed git-cliff release data.",
	],
] as const

const tokenRows = [
	["--border-strong", "Chronological vertical timeline line color"],
	["--accent", "Circle release node border accent color"],
	["--destructive", "Breaking change badge background fill color"],
] as const

export default function ChangelogPageClient() {
	return (
		<ComponentPlayground
			slug="changelog"
			title="ChangelogTimeline"
			description="Turn git-cliff JSON into a release timeline with categories, stable dates, and links back to GitHub."
			importStatement='import { ChangelogTimeline, compactGitCliffReleases, generateChangelogRss, type GitCliffRelease } from "@chitrank2050/monoline-ui/changelog"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={() => (
				<div className="p-ml-6 w-full max-w-2xl text-left">
					<ChangelogTimeline
						releases={mockReleases}
						githubOwner="chitranklabs"
						githubRepo="monoline-ui"
					/>
				</div>
			)}
		/>
	)
}
