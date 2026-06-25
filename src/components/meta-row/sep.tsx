import { cn } from "../../lib/utils"
import type { MetaRowSepProps } from "./types"

export function MetaRowSep({ className, ref, ...props }: MetaRowSepProps) {
	return (
		<span
			ref={ref}
			aria-hidden
			className={cn("opacity-50", className)}
			{...props}
		>
			·
		</span>
	)
}
