import { cn } from "../../lib/utils"
import type { CardSlotProps } from "./types"

export function CardFooter({ className, ref, ...props }: CardSlotProps) {
	return (
		<div
			ref={ref}
			className={cn(
				"ml-card__footer mt-auto flex items-center justify-between gap-ml-3 border-t border-border px-ml-5 py-ml-4 [[data-card-size=lg]>&]:px-ml-7 [[data-card-size=lg]>&]:py-ml-5 [[data-card-size=sm]>&]:px-ml-4 [[data-card-size=sm]>&]:py-ml-3.5",
				className
			)}
			{...props}
		/>
	)
}
