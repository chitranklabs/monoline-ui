import { cn } from "../../lib/utils"
import type { LinkListItemProps } from "./types"

function isExternalHref(href?: string, external?: boolean) {
	return external ?? /^(https?:|mailto:|tel:)/.test(href ?? "")
}

function LinkListItemContent({ item }: Pick<LinkListItemProps, "item">) {
	return (
		<>
			{item.label ? (
				<span className="ml-link-list__label">{item.label}</span>
			) : null}
			{item.date ? (
				<span className="ml-link-list__date">{item.date}</span>
			) : null}
			<span className="ml-link-list__content">
				<span className="ml-link-list__title">{item.title}</span>
				<span className="ml-link-list__mobile-meta">
					{item.date}
					{item.date && item.tag ? " · " : null}
					{item.tag}
				</span>
			</span>
			{item.tag ? <span className="ml-link-list__tag">{item.tag}</span> : null}
			<span className="ml-link-list__trailing">
				{item.trailing ?? item.meta ?? "→"}
			</span>
		</>
	)
}

export function LinkListItem({
	className,
	item,
	linkComponent,
	ref,
	...props
}: LinkListItemProps): React.ReactElement {
	const external = isExternalHref(item.href, item.external)
	const LinkComp = item.as ?? linkComponent ?? "a"
	const content = <LinkListItemContent item={item} />

	if (item.href) {
		return (
			<LinkComp
				href={item.href}
				target={item.target ?? (external ? "_blank" : undefined)}
				rel={item.rel ?? (external ? "noopener noreferrer" : undefined)}
				className={cn("ml-link-list__item", className)}
			>
				{content}
			</LinkComp>
		)
	}

	return (
		<article
			ref={ref}
			className={cn("ml-link-list__item", className)}
			data-disabled="true"
			{...props}
		>
			{content}
		</article>
	)
}
