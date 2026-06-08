"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ToggleProps, ToggleSize } from "./types"

const toggleTrackSizeClasses: Record<ToggleSize, string> = {
	sm: "h-ml-6 w-ml-10",
	md: "h-ml-7 w-ml-12",
	lg: "h-ml-8 w-ml-14",
}

const toggleThumbSizeClasses: Record<ToggleSize, string> = {
	sm: "h-ml-4 w-ml-4 data-[state=on]:translate-x-ml-4",
	md: "h-ml-5 w-ml-5 data-[state=on]:translate-x-ml-5",
	lg: "h-ml-6 w-ml-6 data-[state=on]:translate-x-ml-6",
}

export function ToggleRoot({
	className,
	size = "md",
	checked,
	defaultChecked = false,
	onCheckedChange,
	onClick,
	disabled,
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
			type="button"
			role="switch"
			aria-checked={currentChecked}
			data-state={state}
			disabled={disabled}
			className={cn(
				"relative inline-flex shrink-0 cursor-pointer rounded-pill border border-border-strong bg-button p-ml-1 transition-[background-color,border-color,box-shadow] duration-(--duration-medium) ease-out data-[state=on]:border-accent data-[state=on]:bg-accent-soft disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
				toggleTrackSizeClasses[size],
				className
			)}
			onClick={handleClick}
			{...props}
		>
			<span
				aria-hidden="true"
				data-state={state}
				className={cn(
					"block rounded-pill bg-primary transition-[background-color,transform] duration-(--duration-medium) ease-spring data-[state=on]:bg-accent",
					toggleThumbSizeClasses[size]
				)}
			/>
		</button>
	)
}
