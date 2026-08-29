import { cn } from "../../lib/utils"
import { ChangelogCommit } from "./commit"
import type { ChangelogGroupProps } from "./types"

export function ChangelogGroup({
	groupName,
	commits,
	githubOwner,
	githubRepo,
	showCommitHash,
	showAuthor,
	className,
	...props
}: ChangelogGroupProps) {
	if (commits.length === 0) return null

	return (
		<div className={cn("ml-changelog-group", className)} {...props}>
			<h4 className="ml-changelog-group-title">{groupName}</h4>
			<ul className="ml-changelog-commits">
				{commits.map((commit) => (
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
		</div>
	)
}

ChangelogGroup.displayName = "ChangelogTimeline.Group"
