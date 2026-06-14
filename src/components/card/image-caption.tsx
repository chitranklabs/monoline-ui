import { cn } from "../../lib/utils"
import type { CardSlotProps } from "./types"

export function CardImageCaption({ className, ...props }: CardSlotProps) {
	return (
		<div
			className={cn(
				"ml-card__image-caption absolute inset-x-0 bottom-0 z-10 flex items-end px-ml-4 pb-ml-4 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-body opacity-78 [[data-card-size=lg]>&]:px-ml-5 [[data-card-size=lg]>&]:pb-ml-5 [[data-card-size=sm]>&]:px-ml-3 [[data-card-size=sm]>&]:pb-ml-3",
				className
			)}
			{...props}
		/>
	)
}
