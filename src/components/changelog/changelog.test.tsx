import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ChangelogTimeline } from "./index"
import type { GitCliffRelease } from "./types"

const mockReleases: GitCliffRelease[] = [
	{
		version: "v1.0.0",
		timestamp: 1700000000,
		commits: [
			{
				id: "abcdef1234567890abcdef1234567890abcdef12",
				message: "add cool feature",
				body: null,
				group: "Features",
				breaking: false,
				scope: "core",
				author: {
					name: "Chitrank",
					email: "chitrank@example.com",
					timestamp: 1700000000,
				},
				remote: {
					username: "chitrank2050",
					pr_number: 42,
				},
			},
			{
				id: "1234567890abcdef1234567890abcdef12345678",
				message: "fix annoying bug",
				body: null,
				group: "Bug Fixes",
				breaking: true,
				scope: null,
				author: {
					name: "Collaborator",
					email: "collab@example.com",
					timestamp: 1700000000,
				},
			},
			{
				id: "9999999999999999999999999999999999999999",
				message: "update docs info",
				body: null,
				group: "Documentation",
				breaking: false,
				scope: null,
				author: {
					name: "Chitrank",
					email: "chitrank@example.com",
					timestamp: 1700000000,
				},
			},
		],
	},
]

describe("ChangelogTimeline", () => {
	it("renders version and formatted date", () => {
		render(<ChangelogTimeline releases={mockReleases} />)
		expect(screen.getByText("v1.0.0")).toBeInTheDocument()
		// Test date output (D MMMM, YYYY in UTC)
		expect(screen.getByText("14 November, 2023")).toBeInTheDocument()
	})

	it("filters and groups commits according to default allowedGroups", () => {
		render(<ChangelogTimeline releases={mockReleases} />)
		// Core features group title
		expect(screen.getByText("Features")).toBeInTheDocument()
		expect(screen.getByText("Add cool feature")).toBeInTheDocument()

		// Bug Fixes group
		expect(screen.getByText("Bug Fixes")).toBeInTheDocument()
		expect(screen.getByText("Fix annoying bug")).toBeInTheDocument()

		// Documentation group is filtered out by default
		expect(screen.queryByText("Documentation")).not.toBeInTheDocument()
		expect(screen.queryByText("Update docs info")).not.toBeInTheDocument()
	})

	it("shows breaking badges when commit is marked as breaking", () => {
		render(<ChangelogTimeline releases={mockReleases} />)
		const breakingBadges = screen.getAllByText("breaking")
		expect(breakingBadges.length).toBeGreaterThan(0)
	})

	it("displays short commit hashes", () => {
		render(
			<ChangelogTimeline
				releases={mockReleases}
				githubOwner="chitranklabs"
				githubRepo="monoline-ui"
			/>
		)
		expect(screen.getByText("abcdef1")).toBeInTheDocument()
	})

	it("links release version to GitHub release tag when repo is configured", () => {
		render(
			<ChangelogTimeline
				releases={mockReleases}
				githubOwner="chitranklabs"
				githubRepo="monoline-ui"
			/>
		)
		const versionLink = screen.getByRole("link", { name: "v1.0.0" })
		expect(versionLink).toHaveAttribute(
			"href",
			"https://github.com/chitranklabs/monoline-ui/releases/tag/v1.0.0"
		)
	})

	it("normalizes git-cliff group names with ordering comments and emojis", () => {
		const rawGroupReleases: GitCliffRelease[] = [
			{
				version: "v2.0.0",
				timestamp: 1700000000,
				commits: [
					{
						id: "1111111111111111111111111111111111111111",
						message: "add cool feature with comments",
						body: null,
						group: "<!-- 0 -->🚀 Features",
						breaking: false,
						scope: "core",
						author: {
							name: "Chitrank",
							email: "chitrank@example.com",
							timestamp: 1700000000,
						},
					},
				],
			},
		]

		render(
			<ChangelogTimeline
				releases={rawGroupReleases}
				allowedGroups={["Features"]}
			/>
		)
		expect(screen.getByText("v2.0.0")).toBeInTheDocument()
		expect(screen.getByText("Features")).toBeInTheDocument()
		expect(
			screen.getByText("Add cool feature with comments")
		).toBeInTheDocument()
	})
})

describe("generateChangelogRss", () => {
	it("generates a valid RSS 2.0 XML string with deep-links and releases", async () => {
		const { generateChangelogRss } = await import("./index")
		const xml = generateChangelogRss({
			title: "monoline-ui Changelog",
			description: "Release updates for monoline-ui",
			siteUrl: "https://monolineui.chitrankagnihotri.com",
			releases: mockReleases,
		})

		expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
		expect(xml).toContain('<rss version="2.0"')
		expect(xml).toContain("<title><![CDATA[monoline-ui Changelog]]></title>")
		expect(xml).toContain("<title><![CDATA[v1.0.0]]></title>")
		expect(xml).toContain(
			"<link>https://monolineui.chitrankagnihotri.com/changelog#release-v1-0-0</link>"
		)
		expect(xml).toContain("[core]")
		expect(xml).toContain("add cool feature")
	})
})
