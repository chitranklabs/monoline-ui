import { cn } from "../../lib/utils"
import type { CardSlotProps } from "./types"

export function CardBody({ className, ref, ...props }: CardSlotProps) {
	return (
		<div
			ref={ref}
			className={cn(
				"ml-card__body flex flex-1 flex-col gap-ml-3.5 p-ml-5 [[data-card-size=lg]>&]:gap-ml-4 [[data-card-size=lg]>&]:p-ml-7 [[data-card-size=sm]>&]:gap-ml-2.5 [[data-card-size=sm]>&]:p-ml-4",
				className
			)}
			{...props}
		/>
	)
}
