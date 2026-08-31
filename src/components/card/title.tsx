import { cn } from "../../lib/utils"
import type { CardHeadingProps } from "./types"

export function CardTitle({
	className,
	ref,
	...props
}: CardHeadingProps): React.ReactElement {
	return (
		// eslint-disable-next-line jsx-a11y/heading-has-content -- children forwarded via spread
		<h3
			ref={ref}
			className={cn(
				"m-0 text-xl leading-tight font-semibold text-primary transition-colors duration-(--duration-micro) ease-(--ease-out) group-hover/card:text-accent [[data-card-size=sm]>&]:text-lg [[data-card-size=lg]>&]:text-2xl",
				className
			)}
			{...props}
		/>
	)
}
