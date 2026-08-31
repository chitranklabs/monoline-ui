"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "../../lib/utils"
import type { CheckboxProps } from "./types"

export function CheckboxRoot({
	className,
	ref,
	...props
}: CheckboxProps): React.ReactElement {
	return (
		<CheckboxPrimitive.Root
			ref={ref}
			className={cn("ml-checkbox", className)}
			{...props}
		>
			<CheckboxPrimitive.Indicator className="ml-checkbox__indicator">
				<StateIcon />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
}

function StateIcon(): React.ReactElement {
	return (
		<svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
			<path
				className="ml-checkbox__check"
				d="m3.25 8.25 3 3 6.5-7"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				className="ml-checkbox__indeterminate"
				d="M3.5 8h9"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
			/>
		</svg>
	)
}
