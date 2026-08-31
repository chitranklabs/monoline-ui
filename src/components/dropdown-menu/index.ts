/** @module DropdownMenu */
import { DropdownMenuCheckboxItem } from "./checkbox-item"
import { DropdownMenuContent } from "./content"
import { DropdownMenuGroup } from "./group"
import { DropdownMenuItem } from "./item"
import { DropdownMenuLabel } from "./label"
import { DropdownMenuRadioGroup } from "./radio-group"
import { DropdownMenuRadioItem } from "./radio-item"
import { DropdownMenuRoot } from "./root"
import { DropdownMenuSeparator } from "./separator"
import { DropdownMenuShortcut } from "./shortcut"
import { DropdownMenuSub } from "./sub"
import { DropdownMenuSubContent } from "./sub-content"
import { DropdownMenuSubTrigger } from "./sub-trigger"
import { DropdownMenuTrigger } from "./trigger"

export * from "./types"

export const DropdownMenu: typeof DropdownMenuRoot & {
	displayName: string
	Trigger: typeof DropdownMenuTrigger
	Content: typeof DropdownMenuContent
	Item: typeof DropdownMenuItem
	Label: typeof DropdownMenuLabel
	Separator: typeof DropdownMenuSeparator
	Group: typeof DropdownMenuGroup
	Shortcut: typeof DropdownMenuShortcut
	CheckboxItem: typeof DropdownMenuCheckboxItem
	RadioGroup: typeof DropdownMenuRadioGroup
	RadioItem: typeof DropdownMenuRadioItem
	Sub: typeof DropdownMenuSub
	SubTrigger: typeof DropdownMenuSubTrigger
	SubContent: typeof DropdownMenuSubContent
} = Object.assign(DropdownMenuRoot, {
	displayName: "DropdownMenu",
	Trigger: DropdownMenuTrigger,
	Content: DropdownMenuContent,
	Item: DropdownMenuItem,
	Label: DropdownMenuLabel,
	Separator: DropdownMenuSeparator,
	Group: DropdownMenuGroup,
	Shortcut: DropdownMenuShortcut,
	CheckboxItem: DropdownMenuCheckboxItem,
	RadioGroup: DropdownMenuRadioGroup,
	RadioItem: DropdownMenuRadioItem,
	Sub: DropdownMenuSub,
	SubTrigger: DropdownMenuSubTrigger,
	SubContent: DropdownMenuSubContent,
})
