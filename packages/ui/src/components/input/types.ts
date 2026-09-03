import type * as React from "react"

export type InputVariant = "default" | "error"
export type InputSize = "sm" | "md" | "lg"

export interface InputProps extends Omit<
	React.ComponentProps<"input">,
	"size" | "prefix"
> {
	variant?: InputVariant
	size?: InputSize
	prefix?: React.ReactNode
	suffix?: React.ReactNode
	wrapperClassName?: string
}

export type InputKbdProps = React.ComponentProps<"span">
