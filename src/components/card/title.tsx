import { cn } from "../../lib/utils"
import type { CardHeadingProps } from "./types"

export function CardTitle({ className, ...props }: CardHeadingProps) {
	return (
		<h3
			className={cn(
				"m-0 text-xl leading-[1.04] font-[550] tracking-[-0.02em] text-primary [[data-card-size=sm]>&]:text-lg [[data-card-size=lg]>&]:text-2xl",
				className
			)}
			{...props}
		/>
	)
}
