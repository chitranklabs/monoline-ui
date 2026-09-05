import { cn } from "../../lib/utils"
import type { CardArrowProps } from "./types"

export function CardArrow({
	children = "→",
	className,
	ref,
	...props
}: CardArrowProps): React.ReactElement {
	return (
		<span
			ref={ref}
			aria-hidden="true"
			className={cn("ml-card__arrow text-accent", className)}
			{...props}
		>
			{children}
		</span>
	)
}
