import { cn } from "../../lib/utils"
import type { RailCountProps } from "./types"

export function RailCount({ className, ref, ...props }: RailCountProps) {
	return (
		<span
			ref={ref}
			className={cn("font-mono text-[11px] text-text-muted", className)}
			{...props}
		/>
	)
}
