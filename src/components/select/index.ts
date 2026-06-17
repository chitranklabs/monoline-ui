import { SelectContent } from "./content"
import { SelectItem } from "./item"
import { SelectLabel } from "./label"
import { SelectRoot } from "./root"
import "./select.css"
import { SelectTrigger } from "./trigger"
import { SelectValue } from "./value"

export * from "./types"

export const Select = Object.assign(SelectRoot, {
	Trigger: SelectTrigger,
	Label: SelectLabel,
	Value: SelectValue,
	Content: SelectContent,
	Item: SelectItem,
})
