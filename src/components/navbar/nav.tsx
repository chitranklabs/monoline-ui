import { cn } from "../../lib/utils"
import type { NavbarNavProps } from "./types"

export function NavbarNav({
	label = "Primary navigation",
	className,
	ref,
	...props
}: NavbarNavProps): React.ReactElement {
	return (
		<nav
			ref={ref}
			aria-label={props["aria-label"] ?? label}
			className={cn("ml-navbar__nav", className)}
			{...props}
		/>
	)
}
