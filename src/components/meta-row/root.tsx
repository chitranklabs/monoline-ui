import { cn } from "../../lib/utils"
import type { MetaRowProps } from "./types"

export function MetaRowRoot({
	className,
	strong = false,
	ref,
	...props
}: MetaRowProps) {
	return (
		<div
			ref={ref}
			className={cn(
				"inline-flex items-center gap-2 font-mono text-xs",
				strong ? "text-(--text-secondary)" : "text-(--text-muted)",
				className
			)}
			{...props}
		/>
	)
}
