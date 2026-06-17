import type * as React from "react"

export type ToastVariant = "accent" | "success" | "warn"

export interface ToastProps extends React.ComponentProps<"div"> {
	variant?: ToastVariant
	onDismiss?: () => void
}
