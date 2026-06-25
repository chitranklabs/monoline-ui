import { cn } from "../../lib/utils"
import type { CardDescriptionLines, CardDescriptionProps } from "./types"

const lineClampClasses: Record<CardDescriptionLines, string> = {
	2: "line-clamp-2",
	3: "line-clamp-3",
	4: "line-clamp-4",
}

export function CardDescription({
	className,
	lines,
	ref,
	...props
}: CardDescriptionProps) {
	return (
		<p
			ref={ref}
			className={cn(
				"m-0 text-sm leading-[1.58] text-text-secondary [[data-card-size=lg]>&]:text-base",
				lines ? lineClampClasses[lines] : undefined,
				className
			)}
			{...props}
		/>
	)
}
