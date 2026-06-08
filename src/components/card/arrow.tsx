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
			className={cn(
				"-translate-x-ml-1 text-accent opacity-0 transition-[opacity,transform] duration-(--duration-short) ease-out-expo group-hover/card:translate-x-0 group-hover/card:opacity-100",
				className
			)}
			{...props}
		>
			{children}
		</span>
	)
}
