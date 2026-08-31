/** @module Accessible anchored popover behavior and presentation primitives. */
import { PopoverClose } from "./close"
import { PopoverArrow, PopoverContent } from "./content"
import { PopoverRoot } from "./root"
import { PopoverAnchor, PopoverTrigger } from "./trigger"

export * from "./types"

export const Popover: typeof PopoverRoot & {
	displayName: string
	Trigger: typeof PopoverTrigger
	Anchor: typeof PopoverAnchor
	Content: typeof PopoverContent
	Close: typeof PopoverClose
	Arrow: typeof PopoverArrow
} = Object.assign(PopoverRoot, {
	displayName: "Popover" as const,
	Trigger: PopoverTrigger,
	Anchor: PopoverAnchor,
	Content: PopoverContent,
	Close: PopoverClose,
	Arrow: PopoverArrow,
})
