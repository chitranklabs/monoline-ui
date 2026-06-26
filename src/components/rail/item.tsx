import { cn } from "../../lib/utils"
import type { RailItemProps } from "./types"

export function RailItem({
	className,
	active = false,
	children,
	ref,
	...props
}: RailItemProps): React.ReactElement {
	return (
		<li
			ref={ref}
			data-active={active || undefined}
			className={cn("ml-rail__item", className)}
			{...props}
		>
			<span aria-hidden className="ml-rail__dot" />
			<span className="ml-rail__content">{children}</span>
		</li>
	)
}
