"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"

import type { PopoverAnchorProps, PopoverTriggerProps } from "./types"

export function PopoverTrigger(props: PopoverTriggerProps): React.ReactElement {
	return <PopoverPrimitive.Trigger {...props} />
}

export function PopoverAnchor(props: PopoverAnchorProps): React.ReactElement {
	return <PopoverPrimitive.Anchor {...props} />
}
