import { cn } from "../../lib/utils"
import type { TagCountProps } from "./types"

export function TagCount({ className, ...props }: TagCountProps) {
	return (
		<span
			className={cn(
				"ml-0.5 font-mono text-[0.72em] font-normal opacity-60",
				className
			)}
			{...props}
		/>
	)
}
