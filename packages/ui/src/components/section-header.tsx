import type * as React from "react"

import { cn } from "../lib/utils"

export interface SectionHeaderProps extends React.ComponentProps<"div"> {
	eyebrow?: string
	title: string
	description?: string
	actions?: React.ReactNode
	align?: "left" | "center"
}

function SectionHeader({
	eyebrow,
	title,
	description,
	actions,
	align = "left",
	className,
	...props
}: SectionHeaderProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-4",
				align === "center" && "items-center text-center",
				className
			)}
			{...props}
		>
			<div className="space-y-3">
				{eyebrow ? (
					<p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.32em]">
						{eyebrow}
					</p>
				) : null}
				<div className="space-y-2">
					<h2 className="font-mono text-2xl font-semibold tracking-tight sm:text-3xl">
						{title}
					</h2>
					{description ? (
						<p className="text-muted-foreground max-w-2xl text-sm leading-6 sm:text-base">
							{description}
						</p>
					) : null}
				</div>
			</div>
			{actions ? (
				<div className="flex flex-wrap items-center gap-3">{actions}</div>
			) : null}
		</div>
	)
}

export { SectionHeader }
