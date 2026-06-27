/**
 * @module Tag
 * Description for Tag component.
 */
import { TagCount } from "./count"
import { TagRoot } from "./root"

export * from "./types"

export const Tag: typeof TagRoot & {
	displayName: string
	Count: typeof TagCount
} = Object.assign(TagRoot, {
	displayName: "Tag",
	Count: TagCount,
})
