"use client"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import type { TooltipTriggerProps } from "./types"

export function TooltipTrigger({
	asChild = true,
	...props
}: TooltipTriggerProps): React.ReactElement {
	return <TooltipPrimitive.Trigger asChild={asChild} {...props} />
}
