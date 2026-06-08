import type * as React from "react"

export type AvatarSize = "sm" | "md" | "lg" | "xl"

export interface AvatarProps extends Omit<
	React.ComponentPropsWithoutRef<"span">,
	"children"
> {
	size?: AvatarSize
	src?: string
	alt?: string
	children?: React.ReactNode
}

export interface AvatarImageProps
	extends React.ComponentPropsWithoutRef<"img"> {
	asChild?: boolean
}
