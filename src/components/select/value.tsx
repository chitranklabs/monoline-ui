"use client"

import { cn } from "../../lib/utils"
import { useSelectContext } from "./root"
import type { SelectValueProps } from "./types"

export function SelectValue({
	className,
	ref,
	...props
}: SelectValueProps): React.ReactElement {
	const { placeholder, selectedOption } = useSelectContext()

	return (
		<span
			ref={ref}
			className={cn("truncate font-medium text-primary", className)}
			{...props}
		>
			{props.children ?? selectedOption?.label ?? placeholder}
		</span>
	)
}
