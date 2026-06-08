import { cn } from "../../lib/utils"
import type { ButtonArrowProps } from "./types"

export function ButtonArrow({ className, ...props }: ButtonArrowProps) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"inline-block w-0 overflow-hidden whitespace-nowrap transition-[width,margin] duration-(--duration-micro) ease-out group-hover/btn:ml-ml-0-5 group-hover/btn:w-ml-3",
				className
			)}
			{...props}
		>
			→
		</span>
	)
}
