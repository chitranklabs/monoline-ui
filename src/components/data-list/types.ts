import type * as React from "react"

export type DataListSize = "sm" | "md" | "lg"
export type DataListVariant = "default" | "numbered"

export interface DataListItemData {
	label?: React.ReactNode
	title: React.ReactNode
	description?: React.ReactNode
	trailing?: React.ReactNode
}

export interface DataListProps extends React.ComponentProps<"div"> {
	size?: DataListSize
	variant?: DataListVariant
	prose?: boolean
	items?: DataListItemData[]
}

export interface DataListItemProps extends Omit<
	React.ComponentProps<"div">,
	"title"
> {
	label?: React.ReactNode
	title?: React.ReactNode
	description?: React.ReactNode
	trailing?: React.ReactNode
}
