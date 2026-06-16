import { cn } from "../../lib/utils"
import type { MediaFrameMetaProps } from "./types"

export function MediaFrameMeta({ className, ...props }: MediaFrameMetaProps) {
	return <div className={cn("ml-media-frame__meta", className)} {...props} />
}
