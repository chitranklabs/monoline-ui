import { cn } from "../../lib/utils"
import { DataListItem } from "./item"
import type { DataListProps } from "./types"

export function DataListRoot({
	className,
	size = "md",
	variant = "default",
	prose = false,
	items,
	children,
	ref,
	...props
}: DataListProps) {
	return (
		<div
			ref={ref}
			data-slot="data-list"
			data-size={size}
			data-variant={variant}
			data-prose={prose || undefined}
			className={cn("ml-data-list", className)}
			{...props}
		>
			{children ??
				items?.map((item, index) => (
					<DataListItem
						key={index}
						label={item.label}
						title={item.title}
						description={item.description}
						trailing={item.trailing}
					/>
				))}
		</div>
	)
}
