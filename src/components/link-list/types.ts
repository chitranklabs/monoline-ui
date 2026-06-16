import type * as React from "react"

export type LinkListSize = "sm" | "md" | "lg"

type LinkListLinkComponentProps = React.ComponentPropsWithoutRef<"a"> & {
	href: string
}

export interface LinkListItem {
	label?: React.ReactNode
	date?: React.ReactNode
	title: React.ReactNode
	href?: string
	tag?: React.ReactNode
	meta?: React.ReactNode
	trailing?: React.ReactNode
	external?: boolean
	rel?: string
	target?: React.HTMLAttributeAnchorTarget
	as?: React.ComponentType<LinkListLinkComponentProps>
}

export interface LinkListProps extends Omit<
	React.ComponentPropsWithoutRef<"section">,
	"children" | "title"
> {
	size?: LinkListSize
	title?: string
	meta?: React.ReactNode
	action?: React.ReactNode
	items?: LinkListItem[]
	children?: React.ReactNode
	linkComponent?: React.ComponentType<LinkListLinkComponentProps>
}

export interface LinkListItemProps extends Omit<
	React.ComponentPropsWithoutRef<"article">,
	"title"
> {
	item: LinkListItem
	linkComponent?: React.ComponentType<LinkListLinkComponentProps>
}
