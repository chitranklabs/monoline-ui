import type * as React from "react"

export type TagSize = "sm" | "md" | "lg"
export type TagVariant = "filter" | "chip"

interface TagBaseProps {
	active?: boolean
	interactive?: boolean
	size?: TagSize
	variant?: TagVariant
	asChild?: boolean
}

export type InteractiveTagProps = TagBaseProps &
	React.ComponentProps<"button"> & {
		interactive?: true
	}

export type StaticTagProps = TagBaseProps &
	React.ComponentProps<"span"> & {
		interactive?: false
	}

export type TagProps = InteractiveTagProps | StaticTagProps

export type TagCountProps = React.ComponentProps<"span">
