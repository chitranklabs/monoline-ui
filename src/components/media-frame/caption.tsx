import { cn } from "../../lib/utils"
import type { MediaFrameCaptionProps } from "./types"

export function MediaFrameCaption({
	className,
	ref,
	...props
}: MediaFrameCaptionProps): React.ReactElement {
	return (
		<div
			ref={ref}
			className={cn("ml-media-frame__caption", className)}
			{...props}
		/>
	)
}
