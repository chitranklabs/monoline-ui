import type * as React from "react"

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "ghost"
	| "accent"
	| "danger"
export type ButtonSize = "sm" | "md" | "lg"

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
	variant?: ButtonVariant
	size?: ButtonSize
	icon?: boolean
	pill?: boolean
	asChild?: boolean
}

export type ButtonArrowProps = React.ComponentPropsWithoutRef<"span">
