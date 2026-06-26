/**
 * @module Button
 * Description for Button component.
 */
import { ButtonArrow, ButtonIcon } from "./arrow"
import { ButtonRoot } from "./root"

export * from "./types"

export const Button: typeof ButtonRoot & {
	displayName: string
	Arrow: typeof ButtonArrow
	Icon: typeof ButtonIcon
} = Object.assign(ButtonRoot, {
	displayName: "Button",
	Arrow: ButtonArrow,
	Icon: ButtonIcon,
})
