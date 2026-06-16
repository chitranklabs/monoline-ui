import type * as React from "react"

export type ResourcesPanelSize = "sm" | "md" | "lg"

export type ResourcesPanelKind =
	| "live"
	| "source"
	| "npm"
	| "docs"
	| "changelog"
	| "figma"
	| "video"
	| "paper"
	| "external"

type ResourcesPanelLinkComponentProps = React.ComponentPropsWithoutRef<"a"> & {
	href: string
}

export interface ResourcesPanelItem {
	kind?: ResourcesPanelKind
	label: React.ReactNode
	href?: string
	host?: React.ReactNode
	badge?: React.ReactNode
	meta?: React.ReactNode
	primary?: boolean
	icon?: React.ReactNode
	external?: boolean
	rel?: string
	target?: React.HTMLAttributeAnchorTarget
	as?: React.ComponentType<ResourcesPanelLinkComponentProps>
}

export interface ResourcesPanelProps extends Omit<
	React.ComponentPropsWithoutRef<"aside">,
	"children" | "title"
> {
	size?: ResourcesPanelSize
	title?: string
	meta?: React.ReactNode
	items: ResourcesPanelItem[]
	footer?: React.ReactNode
	footerLabel?: React.ReactNode
	children?: React.ReactNode
	linkComponent?: React.ComponentType<ResourcesPanelLinkComponentProps>
}
