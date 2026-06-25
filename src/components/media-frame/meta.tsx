import { cn } from "../../lib/utils"
import type { MediaFrameMetaProps } from "./types"

export function MediaFrameMeta({
	className,
	ref,
	...props
}: MediaFrameMetaProps) {
	return (
		<div
			ref={ref}
			className={cn("ml-media-frame__meta", className)}
			{...props}
		/>
	)
}
