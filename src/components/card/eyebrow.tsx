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
				"m-0 font-mono text-3xs font-semibold uppercase leading-normal tracking-eyebrow text-text-muted [[data-card-size=lg]>&]:text-2xs",
				className
			)}
			{...props}
		/>
	)
}
