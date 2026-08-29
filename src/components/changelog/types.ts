import type * as React from "react"

export interface GitCliffAuthor {
	name: string
	email: string
	timestamp: number
}

export interface GitCliffRemote {
	username?: string | null
	pr_title?: string | null
	pr_number?: number | null
	pr_labels?: string[]
	is_first_time?: boolean
}

export interface GitCliffCommit {
	id: string
	message: string
	body: string | null
	group: string | null
	breaking: boolean
	scope: string | null
	author: GitCliffAuthor
	remote?: GitCliffRemote | null
	github?: GitCliffRemote | null
}

export interface GitCliffRelease {
	version: string | null
	timestamp: number | null
	commits: GitCliffCommit[]
}

export interface ChangelogTimelineProps extends React.ComponentProps<"div"> {
	releases: GitCliffRelease[]
	/**
	 * Allowed commit groups to display.
	 * @default ["Features", "Bug Fixes", "Performance"]
	 */
	allowedGroups?: string[]
	/**
	 * GitHub repository owner (e.g. "chitranklabs"). Used to build links if remote metadata is partial.
	 */
	githubOwner?: string
	/**
	 * GitHub repository name (e.g. "monoline-ui"). Used to build links if remote metadata is partial.
	 */
	githubRepo?: string
	/**
	 * Whether to show commit hashes.
	 * @default true
	 */
	showCommitHash?: boolean
	/**
	 * Whether to show the author details (username and link).
	 * @default true
	 */
	showAuthor?: boolean
}

export interface ChangelogReleaseProps extends React.ComponentProps<"div"> {
	release: GitCliffRelease
	allowedGroups: string[]
	githubOwner?: string
	githubRepo?: string
	showCommitHash: boolean
	showAuthor: boolean
}

export interface ChangelogGroupProps extends React.ComponentProps<"div"> {
	groupName: string
	commits: GitCliffCommit[]
	githubOwner?: string
	githubRepo?: string
	showCommitHash: boolean
	showAuthor: boolean
}

export interface ChangelogCommitProps extends React.ComponentProps<"li"> {
	commit: GitCliffCommit
	githubOwner?: string
	githubRepo?: string
	showCommitHash: boolean
	showAuthor: boolean
}
