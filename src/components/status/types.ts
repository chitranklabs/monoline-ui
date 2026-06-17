import type * as React from "react"

export type StatusVariant = "accent" | "success" | "muted"
export type StatusSize = "sm" | "md" | "lg"

export interface StatusProps extends React.ComponentProps<"span"> {
	variant?: StatusVariant
	size?: StatusSize
	animate?: boolean
}
