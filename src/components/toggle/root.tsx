"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ToggleProps } from "./types"

export function ToggleRoot({
	className,
	size = "md",
	checked,
	defaultChecked = false,
	onCheckedChange,
	onClick,
	disabled,
	ref,
	...props
}: ToggleProps) {
	const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
	const isControlled = checked !== undefined
	const currentChecked = isControlled ? checked : internalChecked
	const state = currentChecked ? "on" : "off"

	function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
		onClick?.(event)
		if (event.defaultPrevented || disabled) return

		const nextChecked = !currentChecked
		if (!isControlled) {
			setInternalChecked(nextChecked)
		}
		onCheckedChange?.(nextChecked)
	}

	return (
		<button
			ref={ref}
			type="button"
			role="switch"
			aria-checked={currentChecked}
			data-state={state}
			data-size={size}
			disabled={disabled}
			className={cn("ml-toggle", className)}
			onClick={handleClick}
			{...props}
		>
			<span
				aria-hidden="true"
				data-state={state}
				className="ml-toggle__thumb"
			/>
		</button>
	)
}
