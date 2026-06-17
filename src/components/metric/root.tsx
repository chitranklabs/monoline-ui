import { cn } from "../../lib/utils"
import type { MetricProps, MetricSize, MetricTrend } from "./types"

const TREND_LABEL_MAP: Record<MetricTrend, string> = {
	up: "↑",
	down: "↓",
	flat: "→",
}

const TREND_CLASSES_MAP: Record<MetricTrend, string> = {
	up: "text-[var(--callout-tip-accent)]",
	down: "text-destructive",
	flat: "text-muted-foreground",
}

const METRIC_SIZE_CLASSES_MAP: Record<MetricSize, string> = {
	sm: "gap-ml-1-5 rounded-lg p-ml-4",
	md: "gap-ml-2 rounded-xl p-ml-5",
	lg: "gap-ml-3 rounded-2xl p-ml-7",
}

const METRIC_VALUE_SIZE_CLASSES_MAP: Record<MetricSize, string> = {
	sm: "text-2xl",
	md: "text-3xl",
	lg: "text-5xl",
}

const METRIC_LABEL_SIZE_CLASSES_MAP: Record<MetricSize, string> = {
	sm: "text-3xs",
	md: "text-2xs",
	lg: "text-xs",
}

export function MetricRoot({
	className,
	value,
	label,
	description,
	trend,
	size = "md",
	ref,
	...props
}: MetricProps) {
	return (
		<div
			ref={ref}
			className={cn(
				"flex flex-col border border-border bg-surface",
				METRIC_SIZE_CLASSES_MAP[size],
				className
			)}
			{...props}
		>
			<div className="flex items-baseline gap-ml-2">
				<div
					className={cn(
						"font-mono leading-none font-semibold tracking-tight text-primary",
						METRIC_VALUE_SIZE_CLASSES_MAP[size]
					)}
				>
					{value}
				</div>
				{trend ? (
					<span className={cn("font-mono text-xs", TREND_CLASSES_MAP[trend])}>
						{TREND_LABEL_MAP[trend]}
					</span>
				) : null}
			</div>
			<div
				className={cn(
					"font-mono tracking-[0.14em] text-muted-foreground uppercase",
					METRIC_LABEL_SIZE_CLASSES_MAP[size]
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
