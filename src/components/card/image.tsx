import { cn } from "../../lib/utils"
import type { CardImageProps, CardImageRatio } from "./types"

const cardImageRatioClasses: Record<CardImageRatio, string> = {
	square: "aspect-square",
	portrait: "aspect-[3/4]",
	landscape: "aspect-[4/3]",
	wide: "aspect-[16/9]",
}

export function CardImage({
	className,
	placeholder = false,
	ratio = "landscape",
	ref,
	...props
}: CardImageProps): React.ReactElement {
	return (
		<div
			ref={ref}
			data-placeholder={placeholder || undefined}
			data-ratio={ratio}
			className={cn(
				"ml-card__image relative overflow-hidden",
				cardImageRatioClasses[ratio],
				placeholder && "img-placeholder",
				className
			)}
			{...props}
		/>
	)
}
