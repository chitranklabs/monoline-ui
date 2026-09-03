"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import { cn } from "../../lib/utils"
import type { DropdownMenuRadioItemProps } from "./types"

export function DropdownMenuRadioItem({
	className,
	children,
	ref,
	...props
}: DropdownMenuRadioItemProps): React.ReactElement {
	return (
		<DropdownPrimitive.RadioItem
			ref={ref}
			className={cn(
				"ml-dropdown-menu__item ml-dropdown-menu__item--choice",
				className
			)}
			{...props}
		>
			<DropdownPrimitive.ItemIndicator className="ml-dropdown-menu__indicator">
				<span className="ml-dropdown-menu__radio-dot" />
			</DropdownPrimitive.ItemIndicator>
			{children}
		</DropdownPrimitive.RadioItem>
	)
}
