"use client"

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "../../lib/utils"
import type { RadioGroupProps } from "./types"

export function RadioGroupRoot({
	className,
	ref,
	...props
}: RadioGroupProps): React.ReactElement {
	return (
		<RadioGroupPrimitive.Root
			ref={ref}
			className={cn("ml-radio-group", className)}
			{...props}
		/>
	)
}
