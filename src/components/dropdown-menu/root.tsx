"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import type { DropdownMenuProps } from "./types"

export function DropdownMenuRoot(props: DropdownMenuProps): React.ReactElement {
	return <DropdownPrimitive.Root {...props} />
}
