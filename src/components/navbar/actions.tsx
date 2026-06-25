import { cn } from "../../lib/utils"
import type { NavbarActionsProps } from "./types"

export function NavbarActions({
	className,
	ref,
	...props
}: NavbarActionsProps) {
	return (
		<div ref={ref} className={cn("ml-navbar__actions", className)} {...props} />
	)
}
