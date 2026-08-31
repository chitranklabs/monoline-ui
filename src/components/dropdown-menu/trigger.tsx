"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import type { DropdownMenuTriggerProps } from "./types"

export function DropdownMenuTrigger({
	asChild = true,
	...props
}: DropdownMenuTriggerProps): React.ReactElement {
	return <DropdownPrimitive.Trigger asChild={asChild} {...props} />
}
