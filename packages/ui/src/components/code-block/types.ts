import type * as React from "react"

export interface CodeBlockProps extends Omit<
	React.ComponentProps<"figure">,
	"children"
> {
	filename?: string
	description?: React.ReactNode
	code?: string
	language?: string
	children?: React.ReactNode
}
