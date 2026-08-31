"use client"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import type { TooltipProps } from "./types"

export function TooltipRoot(props: TooltipProps): React.ReactElement {
	return <TooltipPrimitive.Root {...props} />
}
