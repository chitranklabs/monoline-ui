"use client"

import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "../../lib/utils"
import type { LabelProps } from "./types"

export function LabelRoot({
	className,
	ref,
	...props
}: LabelProps): React.ReactElement {
	return (
		<LabelPrimitive.Root
			ref={ref}
			className={cn("ml-label", className)}
			{...props}
		/>
	)
}
