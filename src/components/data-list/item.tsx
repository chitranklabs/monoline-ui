import { cn } from "../../lib/utils"
import type { DataListItemProps } from "./types"

export function DataListItem(props: DataListItemProps): React.ReactElement {
	const { label, title, description, trailing, children } = props
	const content = children ?? (
		<>
			{label ? <span className="ml-data-list__label">{label}</span> : null}
			<div className="ml-data-list__content">
				{title ? <span className="ml-data-list__title">{title}</span> : null}
				{description ? (
					<p className="ml-data-list__description">{description}</p>
				) : null}
			</div>
			{trailing ? (
				<span className="ml-data-list__trailing">{trailing}</span>
			) : null}
		</>
	)

	if (typeof props.onClick === "function") {
		const {
			className,
			label: _label,
			title: _title,
			description: _description,
			trailing: _trailing,
			children: _children,
			onClick,
			ref,
			type = "button",
			...buttonProps
		} = props

		return (
			<button
				ref={ref}
				type={type}
				data-interactive="true"
				className={cn("ml-data-list__item", className)}
				onClick={onClick}
				{...buttonProps}
			>
				{content}
			</button>
		)
	}

	const {
		className,
		label: _label,
		title: _title,
		description: _description,
		trailing: _trailing,
		children: _children,
		onClick: _onClick,
		ref,
		...divProps
	} = props

	const isInteractive =
		divProps.role === "button" ||
		divProps.role === "link" ||
		divProps.tabIndex !== undefined

	return (
		<div
			ref={ref}
			data-interactive={isInteractive || undefined}
			className={cn("ml-data-list__item", className)}
			{...divProps}
		>
			{content}
		</div>
	)
}
