import type * as React from "react"

export type NavbarSize = "sm" | "md" | "lg"

type NavbarLinkComponentProps = React.ComponentPropsWithoutRef<"a"> & {
	href: string
}

export interface NavbarLinkItem {
	href: string
	label: React.ReactNode
	active?: boolean
	external?: boolean
	rel?: string
	target?: React.HTMLAttributeAnchorTarget
	as?: React.ComponentType<NavbarLinkComponentProps>
}

interface NavbarBaseProps extends Omit<
	React.ComponentProps<"header">,
	"children"
> {
	size?: NavbarSize
	navLabel?: string
	linkComponent?: React.ComponentType<NavbarLinkComponentProps>
	sticky?: boolean
	glass?: boolean
}

export type NavbarProps =
	| (NavbarBaseProps & {
			brand: React.ReactNode
			links?: NavbarLinkItem[]
			actions?: React.ReactNode
			children?: undefined
	  })
	| (NavbarBaseProps & {
			brand?: React.ReactNode
			links?: NavbarLinkItem[]
			actions?: React.ReactNode
			children: React.ReactNode
	  })

export interface NavbarBrandProps extends React.ComponentProps<"a"> {
	asChild?: boolean
	mark?: React.ReactNode
	children: React.ReactNode
}

export interface NavbarLinkProps extends React.ComponentProps<"a"> {
	asChild?: boolean
	active?: boolean
	external?: boolean
}

export interface NavbarNavProps extends React.ComponentProps<"nav"> {
	label?: string
}

export type NavbarActionsProps = React.ComponentProps<"div">
