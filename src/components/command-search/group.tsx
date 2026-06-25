"use client"

import { Command } from "cmdk"

import { cn } from "../../lib/utils"
import type { CommandSearchGroupProps } from "./types"

export function CommandSearchGroup({
	heading,
	className,
	children,
	ref,
	...props
}: CommandSearchGroupProps) {
	return (
		<Command.Group
			ref={ref}
			heading={heading}
			className={cn("ml-command-search__group", className)}
			{...props}
		>
			{children}
		</Command.Group>
	)
}
