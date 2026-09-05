"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import { cn } from "../../lib/utils"
import type { DropdownMenuSeparatorProps } from "./types"

export function DropdownMenuSeparator({
	className,
	ref,
	...props
}: DropdownMenuSeparatorProps): React.ReactElement {
	return (
		<DropdownPrimitive.Separator
			ref={ref}
			className={cn("ml-dropdown-menu__separator", className)}
			{...props}
		/>
	)
}
