import type * as React from "react"

export type ButtonVariant = "primary" | "secondary" | "ghost"
export type ButtonSize = "sm" | "md" | "lg"
export type ButtonIconSide = "left" | "right"

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
	variant?: ButtonVariant
	size?: ButtonSize
	icon?: boolean
	pill?: boolean
	loading?: boolean
	asChild?: boolean
}

export interface ButtonIconProps extends React.ComponentPropsWithoutRef<"span"> {
	side?: ButtonIconSide
	reveal?: boolean
}

export type ButtonArrowProps = Omit<ButtonIconProps, "children">
