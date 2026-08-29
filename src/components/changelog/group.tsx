import { cn } from "../../lib/utils"
import { ChangelogCommit } from "./commit"
import type { ChangelogGroupProps } from "./types"

export function ChangelogGroup({
	groupName,
	commits,
	maxCommitsPerRelease,
	githubOwner,
	githubRepo,
	showCommitHash,
	showAuthor,
	className,
	...props
}: ChangelogGroupProps) {
	if (commits.length === 0) return null

	const visibleCommits = commits.slice(0, maxCommitsPerRelease)
	const hiddenCount = commits.length - visibleCommits.length

	return (
		<div className={cn("ml-changelog-group", className)} {...props}>
			<h4 className="ml-changelog-group-title">{groupName}</h4>
			<ul className="ml-changelog-commits">
				{visibleCommits.map((commit) => (
					<ChangelogCommit
						key={commit.id}
						commit={commit}
						githubOwner={githubOwner}
						githubRepo={githubRepo}
						showCommitHash={showCommitHash}
						showAuthor={showAuthor}
					/>
				))}
			</ul>
			{hiddenCount > 0 && (
				<p className="ml-changelog-more">
					+{hiddenCount} more commit{hiddenCount !== 1 ? "s" : ""}
				</p>
			)}
		</div>
	)
}

ChangelogGroup.displayName = "ChangelogTimeline.Group"
