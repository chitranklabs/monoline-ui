import { ButtonArrow } from "./arrow"
import { ButtonRoot } from "./root"

export * from "./types"

export const Button = Object.assign(ButtonRoot, {
	Arrow: ButtonArrow,
})
