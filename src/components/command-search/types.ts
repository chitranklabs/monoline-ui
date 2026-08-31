import type * as React from "react"

import type { Command } from "cmdk"

export interface CommandSearchProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	shortcut?: string | false
	debounce?: number | false
	minChars?: number
	placeholder?: string
	onQueryChange?: (query: string) => void
	filter?: (query: string, itemValue: string) => boolean
	shouldFilter?: boolean
	className?: string
	ref?: React.Ref<HTMLDivElement>
	children?: React.ReactNode
	showFooter?: boolean
}

export interface CommandSearchInputProps extends Omit<
	React.ComponentProps<typeof Command.Input>,
	"children" | "className" | "onValueChange" | "size" | "value"
> {
	className?: string
	inputClassName?: string
	size?: "sm" | "md" | "lg"
	placeholder?: string
}

export type CommandSearchListProps = React.ComponentProps<typeof Command.List>

export interface CommandSearchItemProps extends Omit<
	React.ComponentProps<typeof Command.Item>,
	"disabled" | "onSelect" | "value"
> {
	value: string
	onSelect?: () => void
	disabled?: boolean
}

export type CommandSearchEmptyProps = React.ComponentProps<typeof Command.Empty>

export type CommandSearchGroupProps = React.ComponentProps<typeof Command.Group>

export interface CommandSearchFooterProps extends React.ComponentProps<"div"> {
	children?: React.ReactNode
}

export interface CommandSearchContextValue {
	search: string
	rawSearch: string
	setRawSearch: (q: string) => void
	minChars: number
	placeholder: string
	close: () => void
}
