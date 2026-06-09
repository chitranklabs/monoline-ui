import type * as React from "react"

export type NavbarSize = "sm" | "md" | "lg"

export interface NavbarLinkItem {
	href: string
	label: React.ReactNode
	active?: boolean
	external?: boolean
	rel?: string
	target?: React.HTMLAttributeAnchorTarget
	as?: React.ComponentType<any>
}

export interface NavbarProps extends React.ComponentProps<"header"> {
	size?: NavbarSize
	brand?: React.ReactNode
	links?: NavbarLinkItem[]
	actions?: React.ReactNode
	children?: React.ReactNode
	navLabel?: string
	linkComponent?: React.ComponentType<any>
	sticky?: boolean
	glass?: boolean
}

export interface NavbarBrandProps extends React.ComponentProps<"a"> {
	asChild?: boolean
	mark?: React.ReactNode
}

export interface NavbarLinkProps extends React.ComponentProps<"a"> {
	asChild?: boolean
	active?: boolean
	external?: boolean
}

export type NavbarActionsProps = React.ComponentProps<"div">
