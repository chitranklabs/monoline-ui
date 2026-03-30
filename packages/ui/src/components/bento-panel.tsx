import { cva, type VariantProps } from "class-variance-authority"
import { ArrowUpRight } from "lucide-react"
import type * as React from "react"

import { cn } from "../lib/utils"
import { Button } from "./button"

const bentoGridVariants = cva("grid w-full gap-4", {
	variants: {
		columns: {
			2: "grid-cols-1 md:grid-cols-2",
			3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
			4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
		},
	},
	defaultVariants: {
		columns: 3,
	},
})

interface BentoGridProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof bentoGridVariants> {
	autoRows?: string
}

function BentoGrid({
	className,
	columns,
	autoRows = "22rem",
	...props
}: BentoGridProps) {
	return (
		<div
			data-slot="bento-grid"
			className={cn(bentoGridVariants({ columns }), className)}
			style={{ gridAutoRows: autoRows }}
			{...props}
		/>
	)
}

export interface BentoPanelProps extends React.ComponentProps<"div"> {
	eyebrow?: string
	title: string
	description: string
	icon?: React.ReactNode
	ctaLabel?: string
}

function BentoPanel({
	eyebrow,
	title,
	description,
	icon,
	ctaLabel,
	className,
	...props
}: BentoPanelProps) {
	return (
		<div
			className={cn(
				"bg-card text-card-foreground flex h-full flex-col justify-between gap-8 rounded-[1.75rem] border border-border/80 p-6 shadow-[var(--shadow-soft)]",
				className
			)}
			{...props}
		>
			<div className="space-y-4">
				{icon ? (
					<div className="text-primary flex size-11 items-center justify-center rounded-2xl bg-primary/10">
						{icon}
					</div>
				) : null}
				<div className="space-y-2">
					{eyebrow ? (
						<p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.26em]">
							{eyebrow}
						</p>
					) : null}
					<h3 className="font-headline text-xl font-semibold tracking-tight">
						{title}
					</h3>
					<p className="text-muted-foreground text-sm leading-6">
						{description}
					</p>
				</div>
			</div>

			{ctaLabel ? (
				<Button variant="ghost" className="w-fit px-0">
					{ctaLabel}
					<ArrowUpRight className="size-4" />
				</Button>
			) : null}
		</div>
	)
}

export { BentoGrid, BentoPanel, bentoGridVariants }
