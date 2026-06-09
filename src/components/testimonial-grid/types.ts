import type * as React from "react"

export type TestimonialGridVariant = "grid" | "masonry"
export type TestimonialGridAlign = "start" | "stretch"

export interface TestimonialGridProps extends React.ComponentPropsWithoutRef<"div"> {
	variant?: TestimonialGridVariant
	align?: TestimonialGridAlign
}
