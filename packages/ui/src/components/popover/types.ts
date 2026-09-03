import type * as React from "react"

import type * as PopoverPrimitive from "@radix-ui/react-popover"

export type PopoverRootProps = React.ComponentProps<
	typeof PopoverPrimitive.Root
>
export type PopoverTriggerProps = React.ComponentProps<
	typeof PopoverPrimitive.Trigger
>
export type PopoverAnchorProps = React.ComponentProps<
	typeof PopoverPrimitive.Anchor
>
export type PopoverCloseProps = React.ComponentProps<
	typeof PopoverPrimitive.Close
>
export type PopoverArrowProps = React.ComponentProps<
	typeof PopoverPrimitive.Arrow
>

export interface PopoverContentProps extends React.ComponentProps<
	typeof PopoverPrimitive.Content
> {
	container?: HTMLElement | null
	portalled?: boolean
}
