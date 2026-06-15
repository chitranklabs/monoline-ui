import type * as React from "react"

import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { FooterLinkProps } from "./types"

export function FooterLink({ asChild, className, ...props }: FooterLinkProps) {
	const Comp = asChild ? Slot : "a"
	return (
		<Comp
			className={cn(
				"group/link inline-flex w-fit items-center leading-none text-body no-underline transition-[color,box-shadow] duration-(--duration-micro) ease-out hover:text-primary focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
				className
			)}
			{...props}
		/>
	)
}
