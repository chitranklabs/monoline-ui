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

const isNoiseCommit = (commit: GitCliffCommit): boolean => {
	const msg = commit.message.toLowerCase()
	return (
		msg.includes("bump version") ||
		msg.startsWith("releasebump") ||
		msg.startsWith("release: bump") ||
		msg.startsWith("chore: bump") ||
		msg.startsWith("chore(release)") ||
		msg.startsWith("chore: update changelog") ||
		msg.startsWith("docs: update changelog")
	)
}

function IconLink({ className = "size-3" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
			<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
		</svg>
	)
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
		if (isNoiseCommit(commit)) return

		const rawGroup = commit.group || "Miscellaneous Tasks"
		const cleanGroup =
			rawGroup
				.replace(/<!--.*?-->/g, "")
				.replace(/^[^\w]+/, "")
				.trim() || rawGroup

		const matchedGroup =
			allowedGroups.find(
				(g) =>
					g.toLowerCase() === cleanGroup.toLowerCase() ||
					g.toLowerCase() === rawGroup.toLowerCase()
			) || cleanGroup

		if (
			allowedGroups.some(
				(g) =>
					g.toLowerCase() === cleanGroup.toLowerCase() ||
					g.toLowerCase() === rawGroup.toLowerCase()
			)
		) {
			if (!commitsByGroup[matchedGroup]) {
				commitsByGroup[matchedGroup] = []
			}
			commitsByGroup[matchedGroup].push(commit)
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
								className="ml-changelog-release-link inline-flex items-center gap-1.5"
								title={`View release ${displayVersion} on GitHub`}
							>
								<IconLink className="size-3 text-text-muted opacity-80" />
								<span>{displayVersion}</span>
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
