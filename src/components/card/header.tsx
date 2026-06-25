import { cn } from "../../lib/utils"
import type { CardSlotProps } from "./types"

export function CardHeader({
	className,
	ref,
	...props
}: CardSlotProps): React.ReactElement {
	return (
		<div
			ref={ref}
			className={cn(
				"flex flex-col gap-ml-2 [[data-card-size=lg]>&]:gap-ml-3",
				className
			)}
			{...props}
		/>
	)
}
