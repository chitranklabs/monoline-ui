import type * as React from "react"

export type TagSize = "sm" | "md" | "lg"

export interface TagProps extends React.ComponentPropsWithoutRef<"button"> {
	active?: boolean
	size?: TagSize
}

export type TagCountProps = React.ComponentPropsWithoutRef<"span">
