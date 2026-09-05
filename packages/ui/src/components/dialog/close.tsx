"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"

import type { DialogCloseProps } from "./types"

export function DialogClose(props: DialogCloseProps): React.ReactElement {
	return <DialogPrimitive.Close {...props} />
}
