import type * as React from "react"

export type TagSize = "sm" | "md" | "lg"

export interface TagProps extends Omit<
	React.ComponentProps<"button">,
	"prefix"
> {
	/**
	 * Maps to aria-pressed and selected filter styling on the default button.
	 * With asChild, pass semantics supported by the child element explicitly.
	 * @default false
	 */
	active?: boolean
	/**
	 * Alias for active.
	 * @default false
	 */
	selected?: boolean
	/**
	 * Optional prefix / key label (e.g. "Status", "Author", "Environment"). Rendered in 90% size and muted text.
	 */
	prefix?: React.ReactNode
	/**
	 * Optional suffix element / text. Rendered in 90% size and muted text.
	 */
	suffix?: React.ReactNode
	/**
	 * Callback when the cross icon is clicked in the selected state.
	 */
	onDismiss?: (e: React.MouseEvent) => void
	/**
	 * Accessible label for the dismiss cross icon.
	 * @default "Remove filter"
	 */
	dismissAriaLabel?: string
	/**
	 * Tag scale. Maintains exact token height, padding, font-size, and pill radius.
	 * @default "md"
	 */
	size?: TagSize
	/**
	 * Render as a child element via Radix Slot.
	 * @default false
	 */
	asChild?: boolean
}

export type TagCountProps = React.ComponentProps<"span">
