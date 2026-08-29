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

	it("supports custom allowlist of groups", () => {
		render(
			<ChangelogTimeline
				releases={mockReleases}
				allowedGroups={["Documentation"]}
			/>
		)
		expect(screen.getByText("Documentation")).toBeInTheDocument()
		expect(screen.getByText("Update docs info")).toBeInTheDocument()
		expect(screen.queryByText("Features")).not.toBeInTheDocument()
	})
})
