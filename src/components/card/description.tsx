import { cn } from "../../lib/utils"
import type { CardTextProps } from "./types"

export function CardDescription({ className, ...props }: CardTextProps) {
	return (
		<p
			className={cn(
				"m-0 text-sm leading-relaxed text-body [[data-card-size=lg]>&]:text-base",
				className
			)}
			{...props}
		/>
	)
}
