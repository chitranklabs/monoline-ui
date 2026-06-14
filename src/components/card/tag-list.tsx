import * as React from "react"

import { cn } from "../../lib/utils"
import type { CardTagListProps } from "./types"

export function CardTagList({
	children,
	className,
	maxVisible,
	overflowFormatter,
	...props
}: CardTagListProps) {
	const items = React.Children.toArray(children)
	const shouldCollapse =
		typeof maxVisible === "number" &&
		maxVisible >= 0 &&
		items.length > maxVisible

	const visibleItems = shouldCollapse ? items.slice(0, maxVisible) : items
	const overflowCount = shouldCollapse ? items.length - maxVisible : 0

	return (
		<div
			className={cn("flex flex-wrap items-center gap-ml-2", className)}
			{...props}
		>
			{visibleItems}
			{overflowCount > 0 ? (
				<span className="shrink-0 font-mono text-sm text-body opacity-65">
					{overflowFormatter?.(overflowCount) ?? `+${overflowCount}`}
				</span>
			) : null}
		</div>
	)
}
