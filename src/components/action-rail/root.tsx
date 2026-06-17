import { cn } from "../../lib/utils"
import type { ActionRailProps } from "./types"

export function ActionRailRoot({
	className,
	orientation = "vertical",
	ref,
	...props
}: ActionRailProps) {
	return (
		<div
			ref={ref}
			className={cn(
				"flex items-center gap-3",
				orientation === "vertical" && "flex-col",
				className
			)}
			{...props}
		/>
	)
}
