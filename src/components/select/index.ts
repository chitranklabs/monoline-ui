/**
 * @module Select
 * Description for Select component.
 */
import { SelectContent } from "./content"
import { SelectItem } from "./item"
import { SelectLabel } from "./label"
import { SelectRoot } from "./root"
import { SelectTrigger } from "./trigger"
import { SelectValue } from "./value"

export * from "./types"

export const Select: typeof SelectRoot & {
	displayName: string
	Trigger: typeof SelectTrigger
	Label: typeof SelectLabel
	Value: typeof SelectValue
	Content: typeof SelectContent
	Item: typeof SelectItem
} = Object.assign(SelectRoot, {
	displayName: "Select",
	Trigger: SelectTrigger,
	Label: SelectLabel,
	Value: SelectValue,
	Content: SelectContent,
	Item: SelectItem,
})
