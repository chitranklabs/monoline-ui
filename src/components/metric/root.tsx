import { cn } from "../../lib/utils"
import type { MetricProps, MetricSize, MetricTrend } from "./types"

const trendLabel: Record<MetricTrend, string> = {
	up: "↑",
	down: "↓",
	flat: "→",
}

const trendClasses: Record<MetricTrend, string> = {
	up: "text-[var(--callout-tip-accent)]",
	down: "text-destructive",
	flat: "text-muted-foreground",
}

const metricSizeClasses: Record<MetricSize, string> = {
	sm: "gap-ml-1-5 rounded-lg p-ml-4",
	md: "gap-ml-2 rounded-xl p-ml-5",
	lg: "gap-ml-3 rounded-2xl p-ml-7",
}

const metricValueSizeClasses: Record<MetricSize, string> = {
	sm: "text-2xl",
	md: "text-[32px]",
	lg: "text-5xl",
}

const metricLabelSizeClasses: Record<MetricSize, string> = {
	sm: "text-[9px]",
	md: "text-[10px]",
	lg: "text-xs",
}

export function MetricRoot({
	className,
	value,
	label,
	description,
	trend,
	size = "md",
	...props
}: MetricProps) {
	return (
		<div
			className={cn(
				"flex flex-col border border-border bg-surface",
				metricSizeClasses[size],
				className
			)}
			{...props}
		>
			<div className="flex items-baseline gap-ml-2">
				<div
					className={cn(
						"font-mono leading-none font-semibold tracking-tight text-primary",
						metricValueSizeClasses[size]
					)}
				>
					{value}
				</div>
				{trend ? (
					<span className={cn("font-mono text-xs", trendClasses[trend])}>
						{trendLabel[trend]}
					</span>
				) : null}
			</div>
			<div
				className={cn(
					"font-mono tracking-[0.14em] text-muted-foreground uppercase",
					metricLabelSizeClasses[size]
				)}
			>
				{label}
			</div>
			{description ? (
				<p className="m-0 text-sm leading-relaxed text-body">{description}</p>
			) : null}
		</div>
	)
}
