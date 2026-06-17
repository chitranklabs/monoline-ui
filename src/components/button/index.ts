import { ButtonArrow, ButtonIcon } from "./arrow"
import "./button.css"
import { ButtonRoot } from "./root"

export * from "./types"

export const Button = Object.assign(ButtonRoot, {
	Arrow: ButtonArrow,
	Icon: ButtonIcon,
})
