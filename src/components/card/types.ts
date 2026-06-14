import type * as React from "react"

export type CardVariant = "default" | "hover" | "interactive"
export type CardSize = "sm" | "md" | "lg"
export type CardImageRatio = "square" | "portrait" | "landscape" | "wide"

export interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
	variant?: CardVariant
	size?: CardSize
	asChild?: boolean
}

export type CardSlotProps = React.ComponentPropsWithoutRef<"div">
export interface CardImageProps extends React.ComponentPropsWithoutRef<"div"> {
	ratio?: CardImageRatio
	placeholder?: boolean
}
export type CardHeadingProps = React.ComponentPropsWithoutRef<"h3">
export type CardTextProps = React.ComponentPropsWithoutRef<"p">
export type CardActionProps = React.ComponentPropsWithoutRef<"span">

export interface CardArrowProps extends React.ComponentPropsWithoutRef<"span"> {
	children?: React.ReactNode
}
