"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import { cn } from "../../lib/utils"
import type { DropdownMenuCheckboxItemProps } from "./types"

export function DropdownMenuCheckboxItem({
	className,
	children,
	ref,
	...props
}: DropdownMenuCheckboxItemProps): React.ReactElement {
	return (
		<DropdownPrimitive.CheckboxItem
			ref={ref}
			className={cn(
				"ml-dropdown-menu__item ml-dropdown-menu__item--choice",
				className
			)}
			{...props}
		>
			<DropdownPrimitive.ItemIndicator className="ml-dropdown-menu__indicator">
				<CheckIcon />
			</DropdownPrimitive.ItemIndicator>
			{children}
		</DropdownPrimitive.CheckboxItem>
	)
}

function CheckIcon(): React.ReactElement {
	return (
		<svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
			<path
				d="m3.25 8.25 3 3 6.5-7"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
