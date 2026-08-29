import { cn } from "../../lib/utils"
import { ChangelogRelease } from "./release"
import type { ChangelogTimelineProps } from "./types"

const DEFAULT_ALLOWED_GROUPS = ["Features", "Bug Fixes", "Performance"]

export function ChangelogTimeline({
	releases,
	allowedGroups = DEFAULT_ALLOWED_GROUPS,
	githubOwner,
	githubRepo,
	showCommitHash = true,
	showAuthor = true,
	className,
	...props
}: ChangelogTimelineProps) {
	if (!releases || releases.length === 0) {
		return (
			<div
				className={cn(
					"ml-changelog-empty py-8 text-center text-text-muted",
					className
				)}
			>
				No releases found.
			</div>
		)
	}

	return (
		<div className={cn("ml-changelog", className)} {...props}>
			{releases.map((release, idx) => (
				<ChangelogRelease
					key={release.version || `unreleased-${idx}`}
					release={release}
					allowedGroups={allowedGroups}
					githubOwner={githubOwner}
					githubRepo={githubRepo}
					showCommitHash={showCommitHash}
					showAuthor={showAuthor}
				/>
			))}
		</div>
	)
}

ChangelogTimeline.displayName = "ChangelogTimeline"
