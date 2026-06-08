import { cn } from "../../lib/utils"
import type { CardArrowProps } from "./types"

export function CardArrow({
	children = "→",
	className,
	...props
}: CardArrowProps) {
	return (
		<span
			aria-hidden="true"
			className={cn("ml-card__arrow text-accent", className)}
			{...props}
		>
			{children}
		</span>
	)
}
