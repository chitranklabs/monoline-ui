import type * as React from "react"

export type CalloutVariant = "note" | "tip" | "warn"

export interface CalloutProps extends React.ComponentProps<"aside"> {
	variant?: CalloutVariant
	label?: React.ReactNode
}
