import { cn } from "../../lib/utils"
import type { MetaRowSepProps } from "./types"

export function MetaRowSep({ className, ...props }: MetaRowSepProps) {
	return (
		<span aria-hidden className={cn("opacity-50", className)} {...props}>
			·
		</span>
	)
}
