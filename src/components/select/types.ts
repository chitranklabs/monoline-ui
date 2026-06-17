import type * as React from "react"

export type SelectSize = "sm" | "md" | "lg"
export type SelectVariant = "default" | "ghost"

export interface SelectOption<T extends string = string> {
	value: T
	label: string
	description?: string
	disabled?: boolean
}

export interface SelectRootProps<T extends string = string> extends Omit<
	React.ComponentProps<"div">,
	"onChange"
> {
	value: T
	onChange: (value: T) => void
	options: SelectOption<T>[]
	size?: SelectSize
	variant?: SelectVariant
	label?: string
	placeholder?: string
	sheetLabel?: string
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	children?: React.ReactNode
}

export interface SelectTriggerProps extends Omit<
	React.ComponentProps<"button">,
	"children"
> {
	children?: React.ReactNode
}

export type SelectValueProps = React.ComponentProps<"span">

export type SelectLabelProps = React.ComponentProps<"span">

export interface SelectContentProps extends React.ComponentProps<"div"> {
	children?: React.ReactNode
}

export interface SelectItemProps extends Omit<
	React.ComponentProps<"button">,
	"value" | "children"
> {
	value: string
	description?: string
	children: React.ReactNode
}
