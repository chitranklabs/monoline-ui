import { TagCount } from "./count"
import { TagRoot } from "./root"

export * from "./types"

export const Tag = Object.assign(TagRoot, {
	displayName: "Tag",
	Count: TagCount,
})
