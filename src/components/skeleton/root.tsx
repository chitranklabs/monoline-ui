import { cn } from "../../lib/utils"
import type { SkeletonProps, SkeletonVariant } from "./types"

const skeletonVariantClasses: Record<SkeletonVariant, string> = {
	rect: "rounded-sm",
	pill: "rounded-(--radius-pill)",
	circle: "aspect-square rounded-(--radius-pill)",
}

export function SkeletonRoot({
	className,
	variant = "rect",
	ref,
	...props
}: SkeletonProps): React.ReactElement {
	return (
		<div
			ref={ref}
			aria-hidden
			className={cn(
				"ml-skeleton animate-shimmer",
				skeletonVariantClasses[variant],
				className
			)}
			{...props}
		/>
	)
}
