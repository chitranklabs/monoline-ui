import { cn } from "../../lib/utils"
import type { StatusProps, StatusSize, StatusVariant } from "./types"

const statusVariantClasses: Record<StatusVariant, string> = {
	accent: "ml-status--accent",
	success: "ml-status--success",
	muted: "ml-status--muted",
}

const statusSizeClasses: Record<StatusSize, string> = {
	sm: "ml-status--sm",
	md: "ml-status--md",
	lg: "ml-status--lg",
}

const statusDotSizeClasses: Record<StatusSize, string> = {
	sm: "size-ml-1",
	md: "size-ml-1-5",
	lg: "size-ml-2",
}

export function StatusRoot({
	className,
	variant = "accent",
	size = "md",
	animate = false,
	children,
	ref,
	...props
}: StatusProps): React.ReactElement {
	return (
		<span
			ref={ref}
			className={cn(
				"ml-status inline-flex items-center rounded-full border font-mono font-medium uppercase",
				statusVariantClasses[variant],
				statusSizeClasses[size],
				className
			)}
			{...props}
		>
			<span
				data-slot="status-dot"
				data-animate={animate || undefined}
				className={cn("shrink-0 rounded-full", statusDotSizeClasses[size])}
				aria-hidden="true"
			/>
			{children}
		</span>
	)
}
