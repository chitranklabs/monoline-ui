import { cn } from "../../lib/utils"
import type { EyebrowProps, EyebrowSize } from "./types"

const EYEBROW_SIZE_CLASSES_MAP: Record<EyebrowSize, string> = {
	xs: "text-3xs tracking-[0.18em]",
	sm: "text-2xs tracking-eyebrow",
	md: "text-xs tracking-meta",
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
				EYEBROW_SIZE_CLASSES_MAP[size],
				className
			)}
			{...props}
		/>
	)
}
