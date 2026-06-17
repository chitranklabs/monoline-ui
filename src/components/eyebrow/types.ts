import type * as React from "react"

export type EyebrowSize = "xs" | "sm" | "md"

export interface EyebrowProps extends React.ComponentProps<"span"> {
	size?: EyebrowSize
}
