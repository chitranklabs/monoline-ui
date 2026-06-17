import type * as React from "react"

export type CardSize = "sm" | "md" | "lg"
export type CardImageRatio = "square" | "portrait" | "landscape" | "wide"
export type CardDescriptionLines = 2 | 3 | 4

interface CardBaseProps {
	size?: CardSize
}

export type CardProps =
	| (CardBaseProps & {
			asChild?: false
			href: string
			target?: React.HTMLAttributeAnchorTarget
			rel?: string
			download?: React.AnchorHTMLAttributes<HTMLAnchorElement>["download"]
			referrerPolicy?: React.HTMLAttributeReferrerPolicy
			onClick?: React.MouseEventHandler<HTMLAnchorElement>
			ref?: React.Ref<HTMLAnchorElement>
	  } & Omit<React.ComponentPropsWithRef<"a">, "size" | "onClick" | "ref">)
	| (CardBaseProps & {
			asChild: true
			href?: never
			target?: never
			rel?: never
			download?: never
			referrerPolicy?: never
			onClick?: never
			ref?: React.Ref<HTMLElement>
	  } & Omit<React.ComponentPropsWithRef<"div">, "size" | "onClick" | "ref">)
	| (CardBaseProps & {
			asChild?: false
			href?: never
			target?: never
			rel?: never
			download?: never
			referrerPolicy?: never
			onClick?: React.MouseEventHandler<HTMLDivElement>
			ref?: React.Ref<HTMLDivElement>
	  } & Omit<React.ComponentPropsWithRef<"div">, "size" | "onClick" | "ref">)

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
