import { cn } from "../../lib/utils"
import type { CardSlotProps } from "./types"

export function CardImage({ className, ...props }: CardSlotProps) {
	return (
		<div
			className={cn(
				"relative overflow-hidden *:transition-[filter,transform] *:duration-(--duration-long) *:ease-out-expo group-hover/card:*:scale-[1.06] group-hover/card:*:grayscale-0",
				className
			)}
			{...props}
		/>
	)
}
