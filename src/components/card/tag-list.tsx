import * as React from "react"

import { cn } from "../../lib/utils"
import type { CardTagListProps } from "./types"

export function CardTagList({
	children,
	className,
	totalCount,
	overflowFormatter,
	...props
}: CardTagListProps) {
	const items = React.Children.toArray(children)
	const visibleCount = items.length
	const overflowCount =
		typeof totalCount === "number" ? Math.max(0, totalCount - visibleCount) : 0

	return (
		<div
			className={cn("flex flex-wrap items-center gap-ml-2", className)}
			{...props}
		>
			{items}
			{overflowCount > 0 ? (
				<span className="shrink-0 font-mono text-sm text-body opacity-65">
					{overflowFormatter?.(overflowCount) ?? `+${overflowCount}`}
				</span>
			) : null}
		</div>
	)
}
