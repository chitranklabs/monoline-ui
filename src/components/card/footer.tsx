import { cn } from "../../lib/utils"
import type { CardSlotProps } from "./types"

export function CardFooter({ className, ...props }: CardSlotProps) {
	return (
		<div
			className={cn(
				"mt-auto flex items-center justify-between border-t border-border px-ml-5 pt-ml-3 pb-ml-5 [[data-card-size=lg]>&]:px-ml-7 [[data-card-size=lg]>&]:pb-ml-7 [[data-card-size=sm]>&]:px-ml-4 [[data-card-size=sm]>&]:pb-ml-4",
				className
			)}
			{...props}
		/>
	)
}
