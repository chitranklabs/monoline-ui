import { cn } from "../../lib/utils"
import type { CardActionProps } from "./types"

export function CardAction({ className, ...props }: CardActionProps) {
	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center gap-ml-1 text-sm font-medium text-accent [[data-card-size=lg]>&]:text-base",
				className
			)}
			{...props}
		/>
	)
}
