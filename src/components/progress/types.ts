import type * as React from "react"

export type ProgressSize = "sm" | "md" | "lg"

export interface ProgressProps extends Omit<
	React.ComponentPropsWithoutRef<"div">,
	"children"
> {
	value?: number | null
	max?: number
	size?: ProgressSize
	followScroll?: boolean
}
