import type * as React from "react"

export type TagSize = "sm" | "md" | "lg"
export type TagVariant = "filter" | "chip"

interface TagBaseProps {
	active?: boolean
	interactive?: boolean
	size?: TagSize
	variant?: TagVariant
}

export type InteractiveTagProps = TagBaseProps &
	React.ComponentPropsWithoutRef<"button"> & {
		interactive?: true
	}

export type StaticTagProps = TagBaseProps &
	React.ComponentPropsWithoutRef<"span"> & {
		interactive?: false
	}

export type TagProps = InteractiveTagProps | StaticTagProps

export type TagCountProps = React.ComponentPropsWithoutRef<"span">
