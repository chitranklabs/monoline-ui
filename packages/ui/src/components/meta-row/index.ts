/**
 * @module MetaRow
 * Description for MetaRow component.
 */
import { MetaRowRoot } from "./root"
import { MetaRowSep } from "./sep"

export * from "./types"

export const MetaRow: typeof MetaRowRoot & {
	displayName: string
	Sep: typeof MetaRowSep
} = Object.assign(MetaRowRoot, {
	displayName: "MetaRow" as const,
	Sep: MetaRowSep,
})
