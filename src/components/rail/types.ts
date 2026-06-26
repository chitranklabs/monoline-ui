import type * as React from "react"

export interface RailProps extends React.ComponentProps<"div"> {
	title?: React.ReactNode
}

export interface RailItemProps extends React.ComponentProps<"li"> {
	active?: boolean
}

export type RailCountProps = React.ComponentProps<"span">
