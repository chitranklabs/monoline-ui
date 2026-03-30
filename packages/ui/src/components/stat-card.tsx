import type * as React from "react"

import { cn } from "../lib/utils"

export interface StatCardProps extends React.ComponentProps<"div"> {
	label: string
	value: string
	helper?: string
}

function StatCard({
	label,
	value,
	helper,
	className,
	...props
}: StatCardProps) {
	return (
		<div
			className={cn(
				"bg-card text-card-foreground rounded-[1.5rem] border border-border/80 p-5 shadow-[var(--shadow-soft)]",
				className
			)}
			{...props}
		>
			<p className="text-muted-foreground mb-3 font-mono text-xs uppercase tracking-[0.26em]">
				{label}
			</p>
			<p className="font-mono text-3xl font-semibold tracking-tight">{value}</p>
			{helper ? (
				<p className="text-muted-foreground mt-2 text-sm leading-6">{helper}</p>
			) : null}
		</div>
	)
}

export { StatCard }
