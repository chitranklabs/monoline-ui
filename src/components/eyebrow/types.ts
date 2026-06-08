import type * as React from "react"

export type EyebrowSize = "xs" | "sm" | "md"

export interface EyebrowProps extends React.ComponentPropsWithoutRef<"span"> {
	size?: EyebrowSize
}
