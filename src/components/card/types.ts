import type * as React from "react"

export type CardVariant = "default" | "hover" | "interactive"
export type CardSize = "sm" | "md" | "lg"

export interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
	variant?: CardVariant
	size?: CardSize
	asChild?: boolean
}

export type CardSlotProps = React.ComponentPropsWithoutRef<"div">

export interface CardArrowProps extends React.ComponentPropsWithoutRef<"span"> {
	children?: React.ReactNode
}
