import { InputKbd } from "./kbd"
import { InputRoot } from "./root"

export * from "./types"

export const Input = Object.assign(InputRoot, {
	displayName: "Input",
	Kbd: InputKbd,
})
