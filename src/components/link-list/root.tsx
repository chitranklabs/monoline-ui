import { cn } from "../../lib/utils"
import { LinkListItem } from "./item"
import type { LinkListProps } from "./types"

export function LinkListRoot({
	className,
	size = "md",
	title,
	meta,
	action,
	items,
	children,
	linkComponent,
	...props
}: LinkListProps) {
	return (
		<section
			data-slot="link-list"
			data-size={size}
			className={cn("ml-link-list", className)}
			{...props}
		>
			{title || meta || action ? (
				<header className="ml-link-list__header">
					<span className="ml-link-list__heading">
						{title ? <span>{title}</span> : null}
						{meta ? <span>{meta}</span> : null}
					</span>
					{action ? (
						<span className="ml-link-list__action">{action}</span>
					) : null}
				</header>
			) : null}
			<div className="ml-link-list__items">
				{children ??
					items?.map((item, index) => (
						<LinkListItem
							key={
								typeof item.title === "string"
									? `${item.title}-${index}`
									: `${item.href ?? item.label ?? "link"}-${index}`
							}
							item={item}
							linkComponent={linkComponent}
						/>
					))}
			</div>
		</section>
	)
}
