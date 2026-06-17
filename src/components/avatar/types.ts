import type * as React from "react"

export type AvatarSize = "inherit" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

export interface AvatarProps extends Omit<
	React.ComponentProps<"span">,
	"children"
> {
	size?: AvatarSize
	src?: string
	alt?: string
	children?: React.ReactNode
}

export interface AvatarImageProps extends React.ComponentProps<"img"> {
	asChild?: boolean
}
