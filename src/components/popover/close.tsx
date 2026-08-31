"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"

import type { PopoverCloseProps } from "./types"

export function PopoverClose(props: PopoverCloseProps): React.ReactElement {
	return <PopoverPrimitive.Close {...props} />
}
