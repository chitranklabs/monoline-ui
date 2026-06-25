import { cn } from "../../lib/utils"
import type { BadgeCountProps } from "./types"

export function BadgeCount({
	className,
	ref,
	...props
}: BadgeCountProps): React.ReactElement {
	return (
		<span
			ref={ref}
			className={cn(
				"ml-0.5 font-mono text-[0.85em] font-normal opacity-55",
				className
			)}
			{...props}
		/>
	)
}
