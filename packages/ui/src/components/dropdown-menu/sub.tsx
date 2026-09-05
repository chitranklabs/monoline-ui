"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import type { DropdownMenuSubProps } from "./types"

export function DropdownMenuSub(
	props: DropdownMenuSubProps
): React.ReactElement {
	return <DropdownPrimitive.Sub {...props} />
}
