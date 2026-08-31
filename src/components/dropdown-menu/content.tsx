"use client"

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"

import { anchoredFloatingDefaults } from "../../lib/floating"
import { cn } from "../../lib/utils"
import type { DropdownMenuContentProps } from "./types"

export function DropdownMenuContent({
	className,
	avoidCollisions = anchoredFloatingDefaults.avoidCollisions,
	collisionPadding = anchoredFloatingDefaults.collisionPadding,
	hideWhenDetached = anchoredFloatingDefaults.hideWhenDetached,
	sideOffset = 4,
	sticky = anchoredFloatingDefaults.sticky,
	portalContainer,
	ref,
	...props
}: DropdownMenuContentProps): React.ReactElement {
	return (
		<DropdownPrimitive.Portal container={portalContainer}>
			<DropdownPrimitive.Content
				ref={ref}
				avoidCollisions={avoidCollisions}
				collisionPadding={collisionPadding}
				hideWhenDetached={hideWhenDetached}
				sideOffset={sideOffset}
				sticky={sticky}
				className={cn("ml-dropdown-menu__content", className)}
				{...props}
			/>
		</DropdownPrimitive.Portal>
	)
}
