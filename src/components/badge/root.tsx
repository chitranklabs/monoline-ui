import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { BadgeProps, BadgeSize, BadgeVariant } from "./types"

const badgeVariantClasses: Record<BadgeVariant, string> = {
	outline: "ml-badge--outline",
	solid: "ml-badge--solid",
	muted: "ml-badge--muted",
	accent: "ml-badge--accent",
}

const badgeSizeClasses: Record<BadgeSize, string> = {
	xs: "px-ml-2 py-0.5 text-[10px]",
	sm: "px-ml-2-5 py-ml-1 text-[11px]",
	md: "px-ml-3-5 py-ml-1-5 text-xs",
}

export function BadgeRoot({
	className,
	variant = "outline",
	size = "sm",
	asChild = false,
	ref,
	...props
}: BadgeProps) {
	const Comp = asChild ? Slot : "span"
	return (
		<Comp
			ref={ref}
			className={cn(
				"ml-badge inline-flex items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-pill)] border font-medium",
				badgeVariantClasses[variant],
				badgeSizeClasses[size],
				className
			)}
			{...props}
		/>
	)
}
