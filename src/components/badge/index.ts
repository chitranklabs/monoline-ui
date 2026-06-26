/**
 * @module Badge
 * Description for Badge component.
 */
import { BadgeCount } from "./count"
import { BadgeRoot } from "./root"

export * from "./types"

export const Badge: typeof BadgeRoot & {
	displayName: string
	Count: typeof BadgeCount
} = Object.assign(BadgeRoot, {
	displayName: "Badge",
	Count: BadgeCount,
})
