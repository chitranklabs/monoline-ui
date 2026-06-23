"use client"

import { Command } from "cmdk"

import { cn } from "@chitrank2050/monoline-ui/lib/utils"

import { useCommandSearch } from "./root"
import type { CommandSearchEmptyProps } from "./types"

export function CommandSearchEmpty({
	className,
	children,
	...props
}: CommandSearchEmptyProps) {
	const { search, minChars } = useCommandSearch()

	if (search.length < minChars && minChars > 0) return null

	return (
		<Command.Empty
			className={cn("ml-command-search__empty", className)}
			{...props}
		>
			{children ?? <>No results for &ldquo;{search}&rdquo;</>}
		</Command.Empty>
	)
}
