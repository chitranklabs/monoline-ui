import type * as React from "react"

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
	children?: React.ReactNode
	showFooter?: boolean
}

export interface CommandSearchInputProps {
	className?: string
	size?: "sm" | "md" | "lg"
}

export type CommandSearchListProps = React.ComponentProps<"div">

export interface CommandSearchItemProps extends Omit<
	React.ComponentPropsWithoutRef<"div">,
	"onSelect"
> {
	value: string
	onSelect?: () => void
	disabled?: boolean
}

export type CommandSearchEmptyProps = React.ComponentProps<"div">

export interface CommandSearchGroupProps extends React.ComponentProps<"div"> {
	heading?: string
}

export interface CommandSearchFooterProps extends React.ComponentPropsWithoutRef<"div"> {
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
