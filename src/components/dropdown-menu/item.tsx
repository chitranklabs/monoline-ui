"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import { cn } from "../../lib/utils"
import type { DropdownMenuItemProps } from "./types"

export function DropdownMenuItem({
	className,
	destructive = false,
	inset = false,
	ref,
	...props
}: DropdownMenuItemProps): React.ReactElement {
	return (
		<DropdownPrimitive.Item
			ref={ref}
			data-destructive={destructive || undefined}
			data-inset={inset || undefined}
			className={cn("ml-dropdown-menu__item", className)}
			{...props}
		/>
	)
}
