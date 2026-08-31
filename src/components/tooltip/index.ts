/** @module Tooltip */
import { TooltipContent } from "./content"
import { TooltipProvider } from "./provider"
import { TooltipRoot } from "./root"
import { TooltipTrigger } from "./trigger"

export * from "./types"

export const Tooltip: typeof TooltipRoot & {
	displayName: string
	Provider: typeof TooltipProvider
	Trigger: typeof TooltipTrigger
	Content: typeof TooltipContent
} = Object.assign(TooltipRoot, {
	displayName: "Tooltip",
	Provider: TooltipProvider,
	Trigger: TooltipTrigger,
	Content: TooltipContent,
})
