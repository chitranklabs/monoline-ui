import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { NavbarLinkProps } from "./types"

export function NavbarLink({
	asChild,
	active,
	external,
	className,
	children,
	ref,
	...props
}: NavbarLinkProps) {
	const Comp = asChild ? Slot : "a"

	if (asChild) {
		return (
			<Comp
				ref={ref}
				aria-current={active ? "page" : undefined}
				data-active={active || undefined}
				className={cn("ml-navbar__link", className)}
				{...props}
			>
				{children}
			</Comp>
		)
	}

	return (
		<Comp
			ref={ref}
			aria-current={active ? "page" : undefined}
			data-active={active || undefined}
			className={cn("ml-navbar__link", className)}
			{...props}
		>
			<span>{children}</span>
			{external ? (
				<span className="ml-navbar__link-arrow" aria-hidden="true">
					↗
				</span>
			) : null}
		</Comp>
	)
}
