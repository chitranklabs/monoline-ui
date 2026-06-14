"use client"

import { cn } from "../../lib/utils"
import { useSelectContext } from "./root"
import type { SelectLabelProps } from "./types"

export function SelectLabel({ className, ...props }: SelectLabelProps) {
	const { label } = useSelectContext()

	return (
		<span className={cn("text-body opacity-55", className)} {...props}>
			{props.children ?? (label ? `${label}:` : null)}
		</span>
	)
}
