import type * as React from "react"

export interface AuthorFooterLink {
	label: string
	href: string
}

export interface AuthorFooterProps extends React.ComponentPropsWithRef<"section"> {
	name: string
	bio?: string
	avatar?: React.ReactNode
	links?: AuthorFooterLink[]
	stack?: boolean
}
