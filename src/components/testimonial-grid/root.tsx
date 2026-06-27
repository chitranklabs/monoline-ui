import { cn } from "../../lib/utils"
import type { TestimonialGridProps } from "./types"

export function TestimonialGrid({
	align = "stretch",
	className,
	variant = "masonry",
	ref,
	...props
}: TestimonialGridProps): React.ReactElement {
	return (
		<div
			ref={ref}
			data-align={align}
			data-slot="testimonial-grid"
			data-variant={variant}
			className={cn("ml-testimonial-grid", className)}
			{...props}
		/>
	)
}
