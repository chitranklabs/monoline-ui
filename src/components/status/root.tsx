import { cn } from "../../lib/utils"
import type { StatusProps, StatusSize, StatusVariant } from "./types"

const statusVariantClasses: Record<StatusVariant, string> = {
	accent:
		"border-accent bg-accent-soft text-accent [&_[data-slot=status-dot]]:bg-accent [&_[data-slot=status-dot]]:shadow-[0_0_0_4px_var(--accent-soft)]",
	success:
		"border-[var(--callout-tip-accent)] bg-[oklch(0.72_0.15_150_/_0.12)] text-[var(--callout-tip-text)] [&_[data-slot=status-dot]]:bg-[var(--callout-tip-accent)]",
	muted:
		"border-border-strong bg-transparent text-muted-foreground [&_[data-slot=status-dot]]:bg-muted-foreground",
}

const statusSizeClasses: Record<StatusSize, string> = {
	sm: "gap-ml-1-5 px-ml-2 py-ml-1 text-[9px]",
	md: "gap-ml-2 px-ml-3 py-ml-1 text-[10px]",
	lg: "gap-ml-2 px-ml-4 py-ml-2 text-xs",
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
	children,
	...props
}: StatusProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border font-mono font-medium tracking-[0.16em] uppercase",
				statusVariantClasses[variant],
				statusSizeClasses[size],
				className
			)}
			{...props}
		>
			<span
				data-slot="status-dot"
				className={cn("shrink-0 rounded-full", statusDotSizeClasses[size])}
				aria-hidden="true"
			/>
			{children}
		</span>
	)
}
