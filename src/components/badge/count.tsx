import { cn } from "../../lib/utils"
import type { BadgeCountProps } from "./types"

export function BadgeCount({ className, ...props }: BadgeCountProps) {
	return (
		<span
			className={cn(
				"ml-0.5 font-mono text-[0.85em] font-normal opacity-55",
				className
			)}
			{...props}
		/>
	)
}
