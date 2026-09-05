"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "../../lib/utils"
import type {
	DialogContentProps,
	DialogDescriptionProps,
	DialogOverlayProps,
	DialogTitleProps,
} from "./types"

export function DialogOverlay({
	className,
	ref,
	...props
}: DialogOverlayProps): React.ReactElement {
	return (
		<DialogPrimitive.Overlay
			ref={ref}
			className={cn("ml-dialog__overlay", className)}
			{...props}
		/>
	)
}

export function DialogContent({
	asChild = false,
	children,
	className,
	container,
	overlayClassName,
	overlayProps,
	ref,
	...props
}: DialogContentProps): React.ReactElement {
	return (
		<DialogPrimitive.Portal container={container}>
			<DialogOverlay className={overlayClassName} {...overlayProps} />
			<DialogPrimitive.Content
				ref={ref}
				asChild={asChild}
				aria-modal="true"
				className={cn(!asChild && "ml-dialog__content", className)}
				{...props}
			>
				{children}
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	)
}

export function DialogTitle({
	className,
	ref,
	...props
}: DialogTitleProps): React.ReactElement {
	return (
		<DialogPrimitive.Title
			ref={ref}
			className={cn("ml-dialog__title", className)}
			{...props}
		/>
	)
}

export function DialogDescription({
	className,
	ref,
	...props
}: DialogDescriptionProps): React.ReactElement {
	return (
		<DialogPrimitive.Description
			ref={ref}
			className={cn("ml-dialog__description", className)}
			{...props}
		/>
	)
}
