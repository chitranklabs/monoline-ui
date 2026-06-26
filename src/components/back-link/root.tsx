import { cn } from "../../lib/utils"
import type { BackLinkProps } from "./types"

export function BackLinkRoot({
	as: Comp = "a",
	children,
	className,
	ref,
	...props
}: BackLinkProps): React.ReactElement {
	return (
		<Comp ref={ref} className={cn("ml-back-link group", className)} {...props}>
			<span className="ml-back-link__line" aria-hidden="true" />
			{children}
		</Comp>
	)
}
