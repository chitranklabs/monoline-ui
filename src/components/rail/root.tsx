import { cn } from "../../lib/utils"
import type { RailProps } from "./types"

export function RailRoot({ className, ref, ...props }: RailProps) {
	return (
		<ul
			ref={ref}
			className={cn("m-0 flex list-none flex-col gap-0.5 p-0", className)}
			{...props}
		/>
	)
}
