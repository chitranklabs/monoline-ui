import { cn } from "../../lib/utils"
import type { CardTextProps } from "./types"

export function CardEyebrow({ className, ...props }: CardTextProps) {
	return (
		<p
			className={cn(
				"m-0 font-mono text-[0.72rem] leading-normal tracking-[0.04em] text-body opacity-65 [[data-card-size=lg]>&]:text-sm",
				className
			)}
			{...props}
		/>
	)
}
