import { cn } from "../../lib/utils"
import type { DataListItemProps } from "./types"

export function DataListItem({
	className,
	label,
	title,
	description,
	trailing,
	children,
	...props
}: DataListItemProps) {
	return (
		<div className={cn("ml-data-list__item", className)} {...props}>
			{children ?? (
				<>
					{label ? <span className="ml-data-list__label">{label}</span> : null}
					<div className="ml-data-list__content">
						{title ? (
							<span className="ml-data-list__title">{title}</span>
						) : null}
						{description ? (
							<p className="ml-data-list__description">{description}</p>
						) : null}
					</div>
					{trailing ? (
						<span className="ml-data-list__trailing">{trailing}</span>
					) : null}
				</>
			)}
		</div>
	)
}
