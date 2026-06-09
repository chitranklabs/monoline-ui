import { cn } from "../../lib/utils"
import type { NavbarActionsProps } from "./types"

export function NavbarActions({ className, ...props }: NavbarActionsProps) {
	return <div className={cn("ml-navbar__actions", className)} {...props} />
}
