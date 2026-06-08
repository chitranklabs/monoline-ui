import type * as React from "react"

export type ToggleSize = "sm" | "md" | "lg"

export interface ToggleProps extends Omit<
	React.ComponentPropsWithoutRef<"button">,
	"onChange"
> {
	size?: ToggleSize
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (checked: boolean) => void
}
