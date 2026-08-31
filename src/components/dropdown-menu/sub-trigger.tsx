"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import { cn } from "../../lib/utils"
import type { DropdownMenuSubTriggerProps } from "./types"

export function DropdownMenuSubTrigger({
	className,
	children,
	inset = false,
	ref,
	...props
}: DropdownMenuSubTriggerProps): React.ReactElement {
	return (
		<DropdownPrimitive.SubTrigger
			ref={ref}
			data-inset={inset || undefined}
			className={cn(
				"ml-dropdown-menu__item ml-dropdown-menu__sub-trigger",
				className
			)}
			{...props}
		>
			{children}
			<svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
				<path
					d="m6 3.5 4.5 4.5L6 12.5"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</DropdownPrimitive.SubTrigger>
	)
}
