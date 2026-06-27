/**
 * @module Callout
 * Description for Callout component.
 */
import { CalloutRoot } from "./root"

export * from "./types"

export const Callout: typeof CalloutRoot & {
	displayName: string
} = Object.assign(CalloutRoot, {
	displayName: "Callout" as const,
})
