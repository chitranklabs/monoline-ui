import type * as React from "react"

export type BadgeVariant = "outline" | "solid" | "muted" | "accent"
export type BadgeSize = "xs" | "sm" | "md"

export interface BadgeProps extends React.ComponentProps<"span"> {
	variant?: BadgeVariant
	size?: BadgeSize
	asChild?: boolean
}

export type BadgeCountProps = React.ComponentProps<"span">
