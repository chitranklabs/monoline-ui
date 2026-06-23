"use client"

import { Command } from "cmdk"

import { cn } from "@chitrank2050/monoline-ui/lib/utils"

import type { CommandSearchGroupProps } from "./types"

export function CommandSearchGroup({
	heading,
	className,
	children,
	...props
}: CommandSearchGroupProps) {
	return (
		<Command.Group
			heading={heading}
			className={cn("ml-command-search__group", className)}
			{...props}
		>
			{children}
		</Command.Group>
	)
}
