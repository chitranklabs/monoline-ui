"use client"

import { ChangelogTimeline } from "@chitrank2050/monoline-ui/changelog"
import type { GitCliffRelease } from "@chitrank2050/monoline-ui/changelog"

import { ComponentPlayground } from "../../_components/component-playground"

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

const usageCode = `<ChangelogTimeline
  releases={releasesData}
  githubOwner="chitranklabs"
  githubRepo="monoline-ui"
/>`

const sourceSnippet = `import { ChangelogTimeline } from "@chitrank2050/monoline-ui/changelog"

export function ChangelogView({ data }) {
  return (
    <ChangelogTimeline
      releases={data}
      githubOwner="chitranklabs"
      githubRepo="monoline-ui"
    />
  )
}`

const propsRows = [
	[
		"releases",
		"GitCliffRelease[]",
		"Array of releases parsed from git-cliff output",
	],
	[
		"allowedGroups",
		"string[]",
		"Conventional categories to show. Default: ['Features', 'Bug Fixes', 'Performance']",
	],
	["githubOwner", "string", "GitHub org/owner name to form absolute links"],
	["githubRepo", "string", "GitHub repository name to form absolute links"],
	["showCommitHash", "boolean", "Show short commit SHA links (default: true)"],
	["showAuthor", "boolean", "Show contributor username links (default: true)"],
] as const

const tokenRows = [
	["--border-strong", "Chronological vertical timeline line color"],
	["--accent", "Circle release node border accent color"],
	["--destructive", "Breaking change badge background fill color"],
] as const

export default function ChangelogPageClient() {
	return (
		<ComponentPlayground
			title="ChangelogTimeline"
			description="Render structured, categorized, and timezone-consistent conventional release timeline logs from automated git-cliff output."
			importStatement='import { ChangelogTimeline } from "@chitrank2050/monoline-ui/changelog"'
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
