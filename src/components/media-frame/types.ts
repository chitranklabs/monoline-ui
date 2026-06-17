import type * as React from "react"

export type MediaFrameRatio =
	| "square"
	| "portrait"
	| "landscape"
	| "wide"
	| "cinematic"
export type MediaFrameSize = "sm" | "md" | "lg"

export interface MediaFrameProps extends React.ComponentProps<"div"> {
	ratio?: MediaFrameRatio
	size?: MediaFrameSize
	placeholder?: boolean
	asChild?: boolean
}

export type MediaFrameCaptionProps = React.ComponentProps<"div">
export type MediaFrameMetaProps = React.ComponentProps<"div">
