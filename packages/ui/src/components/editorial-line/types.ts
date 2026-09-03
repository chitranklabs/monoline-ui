import type * as React from "react"

export interface EditorialLineProps extends Omit<
	React.ComponentProps<"article">,
	"title"
> {
	n: number
	date: React.ReactNode
	title: React.ReactNode
	readTime?: number
	tag?: React.ReactNode
	href?: string
	hover?: boolean
}
