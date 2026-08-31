"use client"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { anchoredFloatingDefaults } from "../../lib/floating"
import { cn } from "../../lib/utils"
import type { TooltipContentProps } from "./types"

export function TooltipContent({
	className,
	avoidCollisions = anchoredFloatingDefaults.avoidCollisions,
	collisionPadding = anchoredFloatingDefaults.collisionPadding,
	hideWhenDetached = anchoredFloatingDefaults.hideWhenDetached,
	sideOffset = 4,
	sticky = anchoredFloatingDefaults.sticky,
	portalContainer,
	ref,
	children,
	...props
}: TooltipContentProps): React.ReactElement {
	return (
		<TooltipPrimitive.Portal container={portalContainer}>
			<TooltipPrimitive.Content
				ref={ref}
				avoidCollisions={avoidCollisions}
				collisionPadding={collisionPadding}
				hideWhenDetached={hideWhenDetached}
				sideOffset={sideOffset}
				sticky={sticky}
				className={cn("ml-tooltip__content", className)}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow
					className="ml-tooltip__arrow"
					width={10}
					height={5}
				/>
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	)
}
