import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { NavbarBrandProps } from "./types"

export function NavbarBrand({
	asChild,
	className,
	children,
	mark,
	ref,
	textStyle = "cursive",
	...props
}: NavbarBrandProps) {
	const Comp = asChild ? Slot : "a"

	return (
		<Comp
			ref={ref}
			data-text-style={textStyle}
			className={cn("ml-navbar__brand", className)}
			{...props}
		>
			{mark ? (
				<span className="ml-navbar__brand-mark" aria-hidden="true">
					{mark}
				</span>
			) : null}
			<span className="ml-navbar__brand-label">{children}</span>
		</Comp>
	)
}
