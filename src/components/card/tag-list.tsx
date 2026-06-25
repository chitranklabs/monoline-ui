import * as React from "react"

import { cn } from "../../lib/utils"
import type { CardTagListProps } from "./types"

export function CardTagList({
	children,
	className,
	totalCount,
	overflowFormatter,
	ref,
	...props
}: CardTagListProps): React.ReactElement {
	const items = React.Children.toArray(children)
	const visibleCount = items.length
	const overflowCount =
		typeof totalCount === "number" ? Math.max(0, totalCount - visibleCount) : 0

	return (
		<div
			ref={ref}
			className={cn(
				"ml-card__tag-list flex min-w-0 flex-wrap items-center gap-ml-2",
				className
			)}
			{...props}
		>
			{items}
			{overflowCount > 0 ? (
				<span className="ml-card__tag-overflow shrink-0 font-mono text-xs text-text-muted">
					{overflowFormatter?.(overflowCount) ?? `+${overflowCount} more`}
				</span>
			) : null}
		</div>
	)
}
