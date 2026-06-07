import type * as React from "react"

export interface FooterLink {
	href: string
	label: React.ReactNode
	external?: boolean
	rel?: string
	target?: React.HTMLAttributeAnchorTarget
	as?: React.ComponentType<any>
}

export interface FooterColumn {
	title: React.ReactNode
	links: FooterLink[]
}

export type FooterSize = "sm" | "md" | "lg"

export interface FooterSubscribeFormProps extends Omit<
	React.ComponentProps<"form">,
	"children"
> {
	description?: React.ReactNode
	placeholder?: string
	inputName?: string
	submitLabel?: string
}

export interface FooterStatusProps extends React.ComponentProps<"span"> {
	children?: React.ReactNode
}

export interface FooterLinkProps extends React.ComponentProps<"a"> {
	asChild?: boolean
}

export interface FooterProps extends React.ComponentProps<"footer"> {
	size?: FooterSize
	brand?: React.ReactNode
	description?: React.ReactNode
	status?: React.ReactNode | false
	localTime?: React.ReactNode | false
	columns?: FooterColumn[]
	links?: FooterLink[]
	subscribe?: React.ReactNode | false
	credit?: React.ReactNode
	meta?: React.ReactNode
	attribution?: React.ReactNode
	linkComponent?: React.ComponentType<any>
}
