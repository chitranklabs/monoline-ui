"use client"

import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "../../lib/utils"
import type { SeparatorProps } from "./types"

export function SeparatorRoot({
	className,
	decorative = true,
	orientation = "horizontal",
	ref,
	...props
}: SeparatorProps): React.ReactElement {
	return (
		<SeparatorPrimitive.Root
			ref={ref}
			decorative={decorative}
			orientation={orientation}
			className={cn("ml-separator", className)}
			{...props}
		/>
	)
}
