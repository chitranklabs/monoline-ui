import type * as React from "react"

export type TestimonialSize = "sm" | "md" | "lg"
export type TestimonialVariant = "default" | "plain"

export interface TestimonialProps extends Omit<
	React.ComponentPropsWithoutRef<"figure">,
	"role"
> {
	quote: React.ReactNode
	author: React.ReactNode
	role?: React.ReactNode
	initials?: string
	avatarSrc?: string
	avatarAlt?: string
	size?: TestimonialSize
	variant?: TestimonialVariant
}
