import type * as React from "react"

export type AvatarSize = "inherit" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

export interface AvatarProps extends Omit<
	React.ComponentPropsWithoutRef<"span">,
	"children"
> {
	size?: AvatarSize
	src?: string
	alt?: string
	children?: React.ReactNode
}

export interface AvatarImageProps extends React.ComponentPropsWithoutRef<"img"> {
	asChild?: boolean
}
