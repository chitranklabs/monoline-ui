import { cn } from "../../lib/utils"
import type { EyebrowProps, EyebrowSize } from "./types"

const eyebrowSizeClasses: Record<EyebrowSize, string> = {
	xs: "text-[10px] tracking-[0.18em]",
	sm: "text-[11px] tracking-[0.16em]",
	md: "text-[13px] tracking-[0.14em]",
}

export function EyebrowRoot({
	className,
	size = "sm",
	...props
}: EyebrowProps) {
	return (
		<span
			className={cn(
				"font-mono uppercase text-muted-foreground",
				eyebrowSizeClasses[size],
				className
			)}
			{...props}
		/>
	)
}
