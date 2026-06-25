import { cn } from "../../lib/utils"
import type { CardTextProps } from "./types"

export function CardEyebrow({
	className,
	ref,
	...props
}: CardTextProps): React.ReactElement {
	return (
		<p
			ref={ref}
			className={cn(
				"m-0 font-mono text-[0.72rem] leading-normal tracking-[0.05em] text-text-muted [[data-card-size=lg]>&]:text-sm",
				className
			)}
			{...props}
		/>
	)
}
