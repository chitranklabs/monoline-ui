import { RailCount } from "./count"
import { RailItem } from "./item"
import { RailRoot } from "./root"

export * from "./types"

export const Rail = Object.assign(RailRoot, {
	displayName: "Rail" as const,
	Item: RailItem,
	Count: RailCount,
})
