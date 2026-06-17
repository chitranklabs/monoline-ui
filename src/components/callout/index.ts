import "./callout.css"
import { CalloutRoot } from "./root"

export * from "./types"

export const Callout = Object.assign(CalloutRoot, {
	displayName: "Callout" as const,
})
