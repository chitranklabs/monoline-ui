import type * as React from "react"

export type CardSize = "sm" | "md" | "lg"
export type CardImageRatio = "square" | "portrait" | "landscape" | "wide"
export type CardDescriptionLines = 2 | 3 | 4

export interface CardProps extends Omit<
	React.ComponentPropsWithoutRef<"div">,
	"onClick"
> {
	size?: CardSize
	asChild?: boolean
	href?: string
	target?: React.HTMLAttributeAnchorTarget
	rel?: string
	download?: React.AnchorHTMLAttributes<HTMLAnchorElement>["download"]
	referrerPolicy?: React.HTMLAttributeReferrerPolicy
	onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLDivElement>
}

export type CardSlotProps = React.ComponentPropsWithoutRef<"div">
export interface CardImageProps extends React.ComponentPropsWithoutRef<"div"> {
	ratio?: CardImageRatio
	placeholder?: boolean
}
export type CardHeadingProps = React.ComponentPropsWithoutRef<"h3">
export interface CardDescriptionProps extends React.ComponentPropsWithoutRef<"p"> {
	lines?: CardDescriptionLines
}
export type CardTextProps = React.ComponentPropsWithoutRef<"p">
export type CardActionProps = React.ComponentPropsWithoutRef<"span">
export interface CardTagListProps extends React.ComponentPropsWithoutRef<"div"> {
	totalCount?: number
	overflowFormatter?: (count: number) => React.ReactNode
}

export interface CardArrowProps extends React.ComponentPropsWithoutRef<"span"> {
	children?: React.ReactNode
}
