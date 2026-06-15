import { cn } from "../../lib/utils"
import type { CardHeadingProps } from "./types"

export function CardTitle({ className, ...props }: CardHeadingProps) {
	return (
		<h3
			className={cn(
				"m-0 text-xl leading-tight font-semibold text-primary [[data-card-size=sm]>&]:text-lg [[data-card-size=lg]>&]:text-2xl",
				className
			)}
			{...props}
		/>
	)
}
