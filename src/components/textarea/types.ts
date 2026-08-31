import type * as React from "react"

export type TextareaSize = "sm" | "md" | "lg"
export type TextareaResize = "none" | "vertical" | "both"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
	size?: TextareaSize
	resize?: TextareaResize
}
