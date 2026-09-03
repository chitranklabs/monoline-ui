import { cn } from "../../lib/utils"
import type { RailCountProps } from "./types"

export function RailCount({
	className,
	ref,
	...props
}: RailCountProps): React.ReactElement {
	return (
		<span ref={ref} className={cn("ml-rail__count", className)} {...props} />
	)
}
