import "./badge.css"
import { BadgeCount } from "./count"
import { BadgeRoot } from "./root"

export * from "./types"

export const Badge = Object.assign(BadgeRoot, {
	displayName: "Badge",
	Count: BadgeCount,
})
