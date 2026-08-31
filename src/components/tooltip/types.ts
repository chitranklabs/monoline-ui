import type * as React from "react"

import type * as TooltipPrimitive from "@radix-ui/react-tooltip"

export type TooltipProviderProps = React.ComponentProps<
	typeof TooltipPrimitive.Provider
>
export type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>
export type TooltipTriggerProps = React.ComponentProps<
	typeof TooltipPrimitive.Trigger
>
export interface TooltipContentProps extends React.ComponentProps<
	typeof TooltipPrimitive.Content
> {
	portalContainer?: HTMLElement | null
}
