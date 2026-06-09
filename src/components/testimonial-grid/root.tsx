import { cn } from "../../lib/utils"
import type { TestimonialGridProps } from "./types"

export function TestimonialGrid({
	align = "stretch",
	className,
	variant = "masonry",
	...props
}: TestimonialGridProps) {
	return (
		<div
			data-align={align}
			data-slot="testimonial-grid"
			data-variant={variant}
			className={cn("ml-testimonial-grid", className)}
			{...props}
		/>
	)
}
