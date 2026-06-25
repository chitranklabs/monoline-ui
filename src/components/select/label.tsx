"use client"

import { cn } from "../../lib/utils"
import { useSelectContext } from "./root"
import type { SelectLabelProps } from "./types"

export function SelectLabel({ className, ref, ...props }: SelectLabelProps) {
	const { label } = useSelectContext()

	return (
		<span
			ref={ref}
			className={cn("text-body opacity-55", className)}
			{...props}
		>
			{props.children ?? (label ? `${label}:` : null)}
		</span>
	)
}
