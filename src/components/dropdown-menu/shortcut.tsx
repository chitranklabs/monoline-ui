import { cn } from "../../lib/utils"
import type { DropdownMenuShortcutProps } from "./types"

export function DropdownMenuShortcut({
	className,
	ref,
	...props
}: DropdownMenuShortcutProps): React.ReactElement {
	return (
		<span
			ref={ref}
			className={cn("ml-dropdown-menu__shortcut", className)}
			{...props}
		/>
	)
}
