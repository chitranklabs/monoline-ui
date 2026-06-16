import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { MediaFrameProps, MediaFrameRatio, MediaFrameSize } from "./types"

const mediaFrameRatioClasses: Record<MediaFrameRatio, string> = {
	square: "aspect-square",
	portrait: "aspect-[3/4]",
	landscape: "aspect-[4/3]",
	wide: "aspect-[16/9]",
	cinematic: "aspect-[21/9]",
}

const mediaFrameSizeClasses: Record<MediaFrameSize, string> = {
	sm: "rounded-lg",
	md: "rounded-xl",
	lg: "rounded-2xl",
}

export function MediaFrameRoot({
	asChild = false,
	className,
	placeholder = false,
	ratio = "wide",
	size = "md",
	...props
}: MediaFrameProps) {
	const Comp = asChild ? Slot : "div"

	return (
		<Comp
			data-placeholder={placeholder || undefined}
			data-ratio={ratio}
			data-size={size}
			className={cn(
				"ml-media-frame relative block overflow-hidden border border-border bg-surface",
				mediaFrameRatioClasses[ratio],
				mediaFrameSizeClasses[size],
				placeholder && "img-placeholder",
				className
			)}
			{...props}
		/>
	)
}
