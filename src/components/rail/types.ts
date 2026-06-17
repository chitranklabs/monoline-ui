import type * as React from "react"

export type RailProps = React.ComponentProps<"ul">

export interface RailItemProps extends React.ComponentProps<"li"> {
	active?: boolean
}

export type RailCountProps = React.ComponentProps<"span">
