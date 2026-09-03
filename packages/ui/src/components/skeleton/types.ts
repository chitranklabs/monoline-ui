import type * as React from "react"

export type SkeletonVariant = "rect" | "pill" | "circle"

export interface SkeletonProps extends React.ComponentProps<"div"> {
	variant?: SkeletonVariant
}
