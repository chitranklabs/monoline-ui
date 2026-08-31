import { cn } from "../../lib/utils"
import type { TextareaProps } from "./types"

export function TextareaRoot({
	className,
	size = "md",
	resize = "vertical",
	ref,
	...props
}: TextareaProps): React.ReactElement {
	return (
		<textarea
			ref={ref}
			data-size={size}
			data-resize={resize}
			className={cn("ml-textarea", className)}
			{...props}
		/>
	)
}
