import { cn } from "../../lib/utils"
import type { RailProps } from "./types"

export function RailRoot({
	className,
	title,
	children,
	ref,
	...props
}: RailProps): React.ReactElement {
	return (
		<div ref={ref} className={cn("ml-rail", className)} {...props}>
			{title ? (
				<header className="ml-rail__header">
					<span className="ml-rail__title">{title}</span>
				</header>
			) : null}
			<ul className="ml-rail__list">{children}</ul>
		</div>
	)
}
