import { ButtonArrow, ButtonIcon } from "./arrow"
import { ButtonRoot } from "./root"

export * from "./types"

export const Button = Object.assign(ButtonRoot, {
	displayName: "Button",
	Arrow: ButtonArrow,
	Icon: ButtonIcon,
})
