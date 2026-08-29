import { cn } from "../../lib/utils"
import { ChangelogGroup } from "./group"
import type { ChangelogReleaseProps, GitCliffCommit } from "./types"

const formatDate = (timestamp: number | null) => {
	if (!timestamp) return "Unreleased"
	const date = new Date(timestamp * 1000)
	if (isNaN(date.getTime())) return "Unknown Date"

	const day = date.getUTCDate()
	const month = date.toLocaleDateString("en-GB", {
		timeZone: "UTC",
		month: "long",
	})
	const year = date.getUTCFullYear()

	// Output: e.g. "29 June, 2026" in UTC to avoid offset shifts
	return `${day} ${month}, ${year}`
}

export function ChangelogRelease({
	release,
	allowedGroups,
	maxCommitsPerRelease,
	githubOwner,
	githubRepo,
	showCommitHash,
	showAuthor,
	className,
	...props
}: ChangelogReleaseProps) {
	// 1. Filter and group commits
	const commitsByGroup: Record<string, GitCliffCommit[]> = {}

	release.commits.forEach((commit) => {
		const groupName = commit.group || "Miscellaneous Tasks"
		if (allowedGroups.includes(groupName)) {
			if (!commitsByGroup[groupName]) {
				commitsByGroup[groupName] = []
			}
			commitsByGroup[groupName].push(commit)
		}
	})

	// Check if this release has any commits in the allowed groups
	const totalAllowedCommits = Object.values(commitsByGroup).reduce(
		(sum, list) => sum + list.length,
		0
	)

	// If there are no commits that belong to allowed categories, skip rendering this release block.
	if (totalAllowedCommits === 0) return null

	const formattedDate = formatDate(release.timestamp)
	const displayVersion = release.version || "Unreleased"
	const releaseTagUrl =
		githubOwner && githubRepo && release.version
			? `https://github.com/${githubOwner}/${githubRepo}/releases/tag/${release.version}`
			: undefined

	return (
		<div className={cn("ml-changelog-release", className)} {...props}>
			<div className="ml-changelog-release-node">
				<div className="ml-changelog-release-dot" />
			</div>
			<div className="ml-changelog-release-content">
				<header className="ml-changelog-release-header">
					<h3
						id={`release-${displayVersion.replace(/\./g, "-")}`}
						className="ml-changelog-release-version"
					>
						{releaseTagUrl ? (
							<a
								href={releaseTagUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="ml-changelog-release-link"
							>
								{displayVersion}
							</a>
						) : (
							displayVersion
						)}
					</h3>
					<span className="ml-changelog-release-date">{formattedDate}</span>
				</header>
				{allowedGroups.map((groupName) => {
					const groupCommits = commitsByGroup[groupName] || []
					if (groupCommits.length === 0) return null

					return (
						<ChangelogGroup
							key={groupName}
							groupName={groupName}
							commits={groupCommits}
							maxCommitsPerRelease={maxCommitsPerRelease}
							githubOwner={githubOwner}
							githubRepo={githubRepo}
							showCommitHash={showCommitHash}
							showAuthor={showAuthor}
						/>
					)
				})}
			</div>
		</div>
	)
}

ChangelogRelease.displayName = "ChangelogTimeline.Release"
