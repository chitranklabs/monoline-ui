"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"

import type { DialogTriggerProps } from "./types"

export function DialogTrigger(props: DialogTriggerProps): React.ReactElement {
	return <DialogPrimitive.Trigger {...props} />
}
