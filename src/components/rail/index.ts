/**
 * @module Rail
 * Description for Rail component.
 */
import { RailCount } from "./count"
import { RailItem } from "./item"
import { RailRoot } from "./root"

export * from "./types"

export const Rail: typeof RailRoot & {
	displayName: string
	Item: typeof RailItem
	Count: typeof RailCount
} = Object.assign(RailRoot, {
	displayName: "Rail" as const,
	Item: RailItem,
	Count: RailCount,
})
