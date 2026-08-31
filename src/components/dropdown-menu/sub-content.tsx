"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import { anchoredFloatingDefaults } from "../../lib/floating"
import { cn } from "../../lib/utils"
import type { DropdownMenuSubContentProps } from "./types"

export function DropdownMenuSubContent({
	className,
	avoidCollisions = anchoredFloatingDefaults.avoidCollisions,
	collisionPadding = anchoredFloatingDefaults.collisionPadding,
	hideWhenDetached = anchoredFloatingDefaults.hideWhenDetached,
	ref,
	sticky = anchoredFloatingDefaults.sticky,
	...props
}: DropdownMenuSubContentProps): React.ReactElement {
	return (
		<DropdownPrimitive.SubContent
			ref={ref}
			avoidCollisions={avoidCollisions}
			collisionPadding={collisionPadding}
			hideWhenDetached={hideWhenDetached}
			sticky={sticky}
			className={cn(
				"ml-dropdown-menu__content ml-dropdown-menu__sub-content",
				className
			)}
			{...props}
		/>
	)
}
