import { cn } from "../../lib/utils"
import type { RailCountProps } from "./types"

export function RailCount({ className, ...props }: RailCountProps) {
	return (
		<span
			className={cn("font-mono text-[11px] text-text-muted", className)}
			{...props}
		/>
	)
}
