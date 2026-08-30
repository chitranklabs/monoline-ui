/**
 * @module ChangelogTimeline
 * Component to read and render standard conventional-commit changelogs.
 */
import { ChangelogCommit } from "./commit"
import { ChangelogGroup } from "./group"
import { ChangelogRelease } from "./release"
import { ChangelogTimeline as ChangelogTimelineRoot } from "./root"

export * from "./types"
export * from "./feed"

export const ChangelogTimeline: typeof ChangelogTimelineRoot & {
	displayName: string
	Release: typeof ChangelogRelease
	Group: typeof ChangelogGroup
	Commit: typeof ChangelogCommit
} = Object.assign(ChangelogTimelineRoot, {
	displayName: "ChangelogTimeline",
	Release: ChangelogRelease,
	Group: ChangelogGroup,
	Commit: ChangelogCommit,
})

export { ChangelogCommit, ChangelogGroup, ChangelogRelease }
