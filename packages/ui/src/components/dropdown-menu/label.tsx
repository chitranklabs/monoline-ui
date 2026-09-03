"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import { cn } from "../../lib/utils"
import type { DropdownMenuLabelProps } from "./types"

export function DropdownMenuLabel({
	className,
	inset = false,
	ref,
	...props
}: DropdownMenuLabelProps): React.ReactElement {
	return (
		<DropdownPrimitive.Label
			ref={ref}
			data-inset={inset || undefined}
			className={cn("ml-dropdown-menu__label", className)}
			{...props}
		/>
	)
}
