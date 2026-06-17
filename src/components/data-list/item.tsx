import { cn } from "../../lib/utils"
import type { DataListItemProps } from "./types"

export function DataListItem({
	className,
	label,
	title,
	description,
	trailing,
	children,
	onClick,
	...props
}: DataListItemProps) {
	const isInteractive =
		typeof onClick === "function" ||
		props.role === "button" ||
		props.role === "link" ||
		props.tabIndex !== undefined

	const handleKeyDown = onClick
		? (e: React.KeyboardEvent<HTMLDivElement>) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault()
					onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
				}
			}
		: undefined

	const interactiveProps =
		onClick && !props.role
			? { role: "button" as const, tabIndex: 0, onKeyDown: handleKeyDown }
			: {}

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- keyboard support added via interactiveProps spread
		<div
			data-interactive={isInteractive || undefined}
			className={cn("ml-data-list__item", className)}
			onClick={onClick}
			{...interactiveProps}
			{...props}
		>
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
