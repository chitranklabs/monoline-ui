import type * as React from "react"

export type CardSize = "sm" | "md" | "lg"
export type CardImageRatio = "square" | "portrait" | "landscape" | "wide"
export type CardDescriptionLines = 2 | 3 | 4

export interface CardProps extends Omit<
	React.ComponentProps<"div">,
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

export type CardSlotProps = React.ComponentProps<"div">
export interface CardImageProps extends React.ComponentProps<"div"> {
	ratio?: CardImageRatio
	placeholder?: boolean
}
export type CardHeadingProps = React.ComponentProps<"h3">
export interface CardDescriptionProps extends React.ComponentProps<"p"> {
	lines?: CardDescriptionLines
}
export type CardTextProps = React.ComponentProps<"p">
export type CardActionProps = React.ComponentProps<"span">
export interface CardTagListProps extends React.ComponentProps<"div"> {
	totalCount?: number
	overflowFormatter?: (count: number) => React.ReactNode
}

export interface CardArrowProps extends React.ComponentProps<"span"> {
	children?: React.ReactNode
}
