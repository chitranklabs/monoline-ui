/**
 * @module Input
 * Description for Input component.
 */
import { InputKbd } from "./kbd"
import { InputRoot } from "./root"

export * from "./types"

export const Input: typeof InputRoot & {
	displayName: string
	Kbd: typeof InputKbd
} = Object.assign(InputRoot, {
	displayName: "Input",
	Kbd: InputKbd,
})
