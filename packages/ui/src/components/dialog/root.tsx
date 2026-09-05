"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"

import type { DialogRootProps } from "./types"

export function DialogRoot(props: DialogRootProps): React.ReactElement {
	return <DialogPrimitive.Root {...props} />
}
