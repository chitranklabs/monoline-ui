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

interface DataListItemBaseProps {
	label?: React.ReactNode
	title?: React.ReactNode
	description?: React.ReactNode
	trailing?: React.ReactNode
}

export type DataListItemProps =
	| (DataListItemBaseProps & {
			onClick: React.MouseEventHandler<HTMLButtonElement>
			ref?: React.Ref<HTMLButtonElement>
	  } & Omit<
				React.ComponentPropsWithRef<"button">,
				"title" | "onClick" | "ref"
			>)
	| (DataListItemBaseProps & {
			onClick?: never
			ref?: React.Ref<HTMLDivElement>
	  } & Omit<React.ComponentPropsWithRef<"div">, "title" | "onClick" | "ref">)
