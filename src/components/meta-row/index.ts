import { MetaRowRoot } from "./root"
import { MetaRowSep } from "./sep"

export * from "./types"

export const MetaRow = Object.assign(MetaRowRoot, {
	displayName: "MetaRow" as const,
	Sep: MetaRowSep,
})
