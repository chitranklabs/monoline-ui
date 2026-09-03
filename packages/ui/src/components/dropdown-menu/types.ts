import type * as React from "react"

import type * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

export type DropdownMenuProps = React.ComponentProps<
	typeof DropdownPrimitive.Root
>
export type DropdownMenuTriggerProps = React.ComponentProps<
	typeof DropdownPrimitive.Trigger
>
export interface DropdownMenuContentProps extends React.ComponentProps<
	typeof DropdownPrimitive.Content
> {
	portalContainer?: HTMLElement | null
}
export interface DropdownMenuItemProps extends React.ComponentProps<
	typeof DropdownPrimitive.Item
> {
	destructive?: boolean
	inset?: boolean
}
export interface DropdownMenuLabelProps extends React.ComponentProps<
	typeof DropdownPrimitive.Label
> {
	inset?: boolean
}
export type DropdownMenuSeparatorProps = React.ComponentProps<
	typeof DropdownPrimitive.Separator
>
export type DropdownMenuGroupProps = React.ComponentProps<
	typeof DropdownPrimitive.Group
>
export type DropdownMenuCheckboxItemProps = React.ComponentProps<
	typeof DropdownPrimitive.CheckboxItem
>
export type DropdownMenuRadioGroupProps = React.ComponentProps<
	typeof DropdownPrimitive.RadioGroup
>
export type DropdownMenuRadioItemProps = React.ComponentProps<
	typeof DropdownPrimitive.RadioItem
>
export type DropdownMenuSubProps = React.ComponentProps<
	typeof DropdownPrimitive.Sub
>
export interface DropdownMenuSubTriggerProps extends React.ComponentProps<
	typeof DropdownPrimitive.SubTrigger
> {
	inset?: boolean
}
export type DropdownMenuSubContentProps = React.ComponentProps<
	typeof DropdownPrimitive.SubContent
>
export type DropdownMenuShortcutProps = React.ComponentProps<"span">
