"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import type { DropdownMenuRadioGroupProps } from "./types"

export function DropdownMenuRadioGroup(
	props: DropdownMenuRadioGroupProps
): React.ReactElement {
	return <DropdownPrimitive.RadioGroup {...props} />
}
