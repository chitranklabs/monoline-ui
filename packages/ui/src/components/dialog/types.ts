import type * as React from "react"

import type * as DialogPrimitive from "@radix-ui/react-dialog"

export type DialogRootProps = React.ComponentProps<typeof DialogPrimitive.Root>
export type DialogTriggerProps = React.ComponentProps<
	typeof DialogPrimitive.Trigger
>
export type DialogTitleProps = React.ComponentProps<
	typeof DialogPrimitive.Title
>
export type DialogDescriptionProps = React.ComponentProps<
	typeof DialogPrimitive.Description
>
export type DialogCloseProps = React.ComponentProps<
	typeof DialogPrimitive.Close
>
export type DialogOverlayProps = React.ComponentProps<
	typeof DialogPrimitive.Overlay
>

export interface DialogContentProps extends React.ComponentProps<
	typeof DialogPrimitive.Content
> {
	container?: HTMLElement | null
	overlayClassName?: string
	overlayProps?: Omit<DialogOverlayProps, "className">
}
