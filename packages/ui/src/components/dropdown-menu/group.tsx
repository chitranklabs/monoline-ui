"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import type { DropdownMenuGroupProps } from "./types"

export function DropdownMenuGroup(
	props: DropdownMenuGroupProps
): React.ReactElement {
	return <DropdownPrimitive.Group {...props} />
}
