import type * as React from "react"

export type SectionHeadSize = "sm" | "md" | "lg" | "xl"
export type SectionHeadLevel = 1 | 2 | 3

export interface SectionHeadProps extends Omit<
	React.ComponentProps<"div">,
	"title"
> {
	as?: "div" | "header"
	eyebrow?: React.ReactNode
	title: React.ReactNode
	subtitle?: React.ReactNode
	lede?: React.ReactNode
	level?: SectionHeadLevel
	size?: SectionHeadSize
}
