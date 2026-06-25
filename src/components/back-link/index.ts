import "./back-link.css"
import { BackLinkRoot } from "./root"

export * from "./types"

export const BackLink = Object.assign(BackLinkRoot, {
	displayName: "BackLink" as const,
})
