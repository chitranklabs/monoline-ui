"use client"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import type { TooltipProviderProps } from "./types"

export function TooltipProvider({
	delayDuration = 350,
	skipDelayDuration = 100,
	...props
}: TooltipProviderProps): React.ReactElement {
	return (
		<TooltipPrimitive.Provider
			delayDuration={delayDuration}
			skipDelayDuration={skipDelayDuration}
			{...props}
		/>
	)
}
