"use client"

import { Command } from "cmdk"

import { cn } from "../../lib/utils"
import { useCommandSearch } from "./root"
import type { CommandSearchEmptyProps } from "./types"

export function CommandSearchEmpty({
	className,
	children,
	ref,
	...props
}: CommandSearchEmptyProps): React.ReactElement | null {
	const { search, minChars } = useCommandSearch()

	if (search.length < minChars && minChars > 0) return null

	return (
		<Command.Empty
			ref={ref}
			className={cn("ml-command-search__empty", className)}
			{...props}
		>
			{children ?? <>No results for &ldquo;{search}&rdquo;</>}
		</Command.Empty>
	)
}
