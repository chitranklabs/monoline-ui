import type * as React from "react"

export interface RailProps extends Omit<React.ComponentProps<"div">, "title"> {
	title?: React.ReactNode
}

export interface RailItemProps extends React.ComponentProps<"li"> {
	active?: boolean
}

export type RailCountProps = React.ComponentProps<"span">
