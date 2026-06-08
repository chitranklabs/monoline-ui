import { cn } from "../../lib/utils"
import type { CardSlotProps } from "./types"

export function CardImage({ className, ...props }: CardSlotProps) {
	return (
		<div
			className={cn("ml-card__image relative overflow-hidden", className)}
			{...props}
		/>
	)
}
