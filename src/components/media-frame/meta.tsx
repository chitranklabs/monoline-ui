import { cn } from "../../lib/utils"
import type { MediaFrameMetaProps } from "./types"

export function MediaFrameMeta({ className, ...props }: MediaFrameMetaProps) {
	return (
		<div
			className={cn(
				"ml-media-frame__meta absolute inset-x-0 bottom-0 z-10 flex items-end px-ml-4 pb-ml-4 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-body [[data-size=lg]>&]:px-ml-5 [[data-size=lg]>&]:pb-ml-5 [[data-size=sm]>&]:px-ml-3 [[data-size=sm]>&]:pb-ml-3",
				className
			)}
			{...props}
		/>
	)
}
