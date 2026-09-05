/** @module RadioGroup */
import { RadioGroupItem } from "./item"
import { RadioGroupRoot } from "./root"

export * from "./types"

export const RadioGroup: typeof RadioGroupRoot & {
	displayName: string
	Item: typeof RadioGroupItem
} = Object.assign(RadioGroupRoot, {
	displayName: "RadioGroup",
	Item: RadioGroupItem,
})
