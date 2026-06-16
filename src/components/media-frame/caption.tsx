import { cn } from "../../lib/utils"
import type { MediaFrameCaptionProps } from "./types"

export function MediaFrameCaption({
	className,
	...props
}: MediaFrameCaptionProps) {
	return <div className={cn("ml-media-frame__caption", className)} {...props} />
}
