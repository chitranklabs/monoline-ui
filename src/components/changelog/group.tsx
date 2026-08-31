import { cn } from "../../lib/utils"
import { ChangelogCommit } from "./commit"
import type { ChangelogGroupProps } from "./types"

function getGroupIcon(groupName: string) {
	const lower = groupName.toLowerCase()
	if (lower.includes("feature")) {
		return (
			<svg
				className="size-3 text-emerald-500 dark:text-emerald-400 shrink-0"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
			</svg>
		)
	}
	if (lower.includes("fix") || lower.includes("bug")) {
		return (
			<svg
				className="size-3 text-amber-500 dark:text-amber-400 shrink-0"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<rect width="8" height="14" x="8" y="6" rx="4" />
				<path d="m19 7-3 2" />
				<path d="m5 7 3 2" />
				<path d="m19 19-3-2" />
				<path d="m5 19 3-2" />
				<path d="M20 13h-4" />
				<path d="M4 13h4" />
			</svg>
		)
	}
	if (lower.includes("perf")) {
		return (
			<svg
				className="size-3 text-cyan-500 dark:text-cyan-400 shrink-0"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
			</svg>
		)
	}
	if (lower.includes("doc")) {
		return (
			<svg
				className="size-3 text-blue-500 dark:text-blue-400 shrink-0"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
				<path d="M6 6h10" />
			</svg>
		)
	}
	return (
		<svg
			className="size-3 text-purple-500 dark:text-purple-400 shrink-0"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</svg>
	)
}

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
			<div className="ml-changelog-group-head">
				<h3 className="ml-changelog-group-title">
					{getGroupIcon(groupName)}
					<span>{groupName}</span>
					<span className="ml-changelog-group-count">{commits.length}</span>
				</h3>
			</div>
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
