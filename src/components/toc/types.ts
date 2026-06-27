import type * as React from "react"

export interface TocItem {
	id: string
	label: React.ReactNode
}

export interface TocProps extends React.ComponentProps<"nav"> {
	items: TocItem[]
	activeId?: string
	heading?: React.ReactNode
	scrollOffset?: number
	collapsible?: boolean
	defaultOpen?: boolean
}
