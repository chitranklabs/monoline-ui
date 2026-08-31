"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"

import { anchoredFloatingDefaults } from "../../lib/floating"
import { cn } from "../../lib/utils"
import type { PopoverArrowProps, PopoverContentProps } from "./types"

export function PopoverContent({
	align = "center",
	avoidCollisions = anchoredFloatingDefaults.avoidCollisions,
	asChild = false,
	children,
	className,
	collisionPadding = anchoredFloatingDefaults.collisionPadding,
	container,
	hideWhenDetached = anchoredFloatingDefaults.hideWhenDetached,
	portalled = true,
	ref,
	sideOffset = 8,
	sticky = anchoredFloatingDefaults.sticky,
	...props
}: PopoverContentProps): React.ReactElement {
	const content = (
		<PopoverPrimitive.Content
			ref={ref}
			align={align}
			avoidCollisions={avoidCollisions}
			asChild={asChild}
			collisionPadding={collisionPadding}
			hideWhenDetached={hideWhenDetached}
			sideOffset={sideOffset}
			sticky={sticky}
			className={cn(!asChild && "ml-popover__content", className)}
			{...props}
		>
			{children}
		</PopoverPrimitive.Content>
	)

	return portalled ? (
		<PopoverPrimitive.Portal container={container}>
			{content}
		</PopoverPrimitive.Portal>
	) : (
		content
	)
}

export function PopoverArrow({
	className,
	ref,
	...props
}: PopoverArrowProps): React.ReactElement {
	return (
		<PopoverPrimitive.Arrow
			ref={ref}
			className={cn("ml-popover__arrow", className)}
			{...props}
		/>
	)
}
