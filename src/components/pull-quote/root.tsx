import { cn } from "../../lib/utils"
import type { PullQuoteProps } from "./types"

export function PullQuoteRoot({
	className,
	attribution,
	children,
	ref,
	...props
}: PullQuoteProps) {
	return (
		<figure
			ref={ref}
			className={cn(
				"ml-pull-quote my-10 border-l-2 border-(--accent) pl-6",
				className
			)}
			{...props}
		>
			<blockquote className="m-0 text-balance font-[var(--font-headline)] text-2xl font-medium leading-[1.35] tracking-[-0.015em] text-(--text-primary)">
				{children}
			</blockquote>
			{attribution && (
				<figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-(--text-muted)">
					— {attribution}
				</figcaption>
			)}
		</figure>
	)
}
