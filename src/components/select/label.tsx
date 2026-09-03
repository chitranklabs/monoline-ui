"use client"

import { cn } from "../../lib/utils"
import { useSelectContext } from "./root"
import type { SelectLabelProps } from "./types"

export function SelectLabel({
	className,
	ref,
	...props
}: SelectLabelProps): React.ReactElement {
	const { label } = useSelectContext()

	return (
		<span ref={ref} className={cn("text-text-secondary", className)} {...props}>
			{props.children ?? (label ? `${label}:` : null)}
		</span>
	)
}
