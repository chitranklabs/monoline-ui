"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"

import type { PopoverRootProps } from "./types"

export function PopoverRoot(props: PopoverRootProps): React.ReactElement {
	return <PopoverPrimitive.Root {...props} />
}
