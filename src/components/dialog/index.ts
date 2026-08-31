/** @module Accessible modal dialog behavior and presentation primitives. */
import { DialogClose } from "./close"
import {
	DialogContent,
	DialogDescription,
	DialogOverlay,
	DialogTitle,
} from "./content"
import { DialogRoot } from "./root"
import { DialogTrigger } from "./trigger"

export * from "./types"

export const Dialog: typeof DialogRoot & {
	displayName: string
	Trigger: typeof DialogTrigger
	Content: typeof DialogContent
	Overlay: typeof DialogOverlay
	Title: typeof DialogTitle
	Description: typeof DialogDescription
	Close: typeof DialogClose
} = Object.assign(DialogRoot, {
	displayName: "Dialog" as const,
	Trigger: DialogTrigger,
	Content: DialogContent,
	Overlay: DialogOverlay,
	Title: DialogTitle,
	Description: DialogDescription,
	Close: DialogClose,
})
