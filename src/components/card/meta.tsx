import { cn } from "../../lib/utils"
import type { CardSlotProps } from "./types"

export function CardMeta({ className, ...props }: CardSlotProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between gap-ml-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-body opacity-70 [[data-card-size=lg]>&]:text-[0.72rem]",
				className
			)}
			{...props}
		/>
	)
}
