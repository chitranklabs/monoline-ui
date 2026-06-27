/**
 * @module BackLink
 * Description for BackLink component.
 */
import { BackLinkRoot } from "./root"

export * from "./types"

export const BackLink: typeof BackLinkRoot & {
	displayName: string
} = Object.assign(BackLinkRoot, {
	displayName: "BackLink" as const,
})
