import type * as React from "react"

export interface CodeBlockProps extends Omit<
	React.ComponentProps<"figure">,
	"children"
> {
	filename?: string
	code?: string
	language?: string
	children?: React.ReactNode
}
