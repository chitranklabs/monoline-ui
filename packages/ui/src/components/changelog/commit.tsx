import { cn } from "../../lib/utils"
import { Badge } from "../badge"
import type { ChangelogCommitProps } from "./types"

function renderFormattedMessage(text: string) {
	const parts = text.split(/(`[^`]+`)/g)
	return parts.map((part, i) => {
		if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
			return (
				<code key={i} className="ml-changelog-inline-code">
					{part.slice(1, -1)}
				</code>
			)
		}
		return part
	})
}

export function ChangelogCommit({
	commit,
	githubOwner,
	githubRepo,
	showCommitHash,
	showAuthor,
	className,
	...props
}: ChangelogCommitProps) {
	const message =
		commit.message.charAt(0).toUpperCase() + commit.message.slice(1)
	const isBreaking = commit.breaking

	// Resolve GitHub info
	const authorUsername = commit.remote?.username || commit.github?.username
	const authorName = commit.author.name
	const prNumber = commit.remote?.pr_number || commit.github?.pr_number

	const hasGithubConfig = githubOwner && githubRepo
	const commitUrl = hasGithubConfig
		? `https://github.com/${githubOwner}/${githubRepo}/commit/${commit.id}`
		: undefined
	const prUrl =
		hasGithubConfig && prNumber
			? `https://github.com/${githubOwner}/${githubRepo}/pull/${prNumber}`
			: undefined
	const authorUrl = authorUsername
		? `https://github.com/${authorUsername}`
		: undefined

	return (
		<li
			className={cn("ml-changelog-commit-item group/commit", className)}
			{...props}
		>
			{/* Scope + message row */}
			<div className="ml-changelog-commit-row">
				{commit.scope && (
					<span className="ml-changelog-commit-scope">{commit.scope}</span>
				)}
				<span className="ml-changelog-commit-message">
					{renderFormattedMessage(message)}
					{isBreaking && (
						<Badge
							variant="solid"
							className="ml-2 bg-destructive! border-destructive! text-destructive-foreground! font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5"
						>
							breaking
						</Badge>
					)}
				</span>
			</div>

			{/* Meta row — SHA, PR, author */}
			<span className="ml-changelog-commit-meta">
				{prNumber && prUrl && (
					<a
						href={prUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="ml-changelog-commit-link text-accent hover:underline font-medium"
					>
						#{prNumber}
					</a>
				)}

				{showCommitHash && commitUrl && (
					<a
						href={commitUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="ml-changelog-commit-link"
						title={commit.id}
					>
						{commit.id.slice(0, 7)}
					</a>
				)}

				{showAuthor && (authorUsername || authorName) && (
					<span className="inline-flex items-center gap-1">
						by{" "}
						{authorUrl ? (
							<a
								href={authorUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="ml-changelog-commit-author"
							>
								@{authorUsername}
							</a>
						) : (
							<span className="text-text-muted">{authorName}</span>
						)}
					</span>
				)}
			</span>
		</li>
	)
}

ChangelogCommit.displayName = "ChangelogTimeline.Commit"
