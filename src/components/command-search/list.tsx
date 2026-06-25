"use client"

import { Command } from "cmdk"

import { cn } from "../../lib/utils"
import { useCommandSearch } from "./root"
import type { CommandSearchListProps } from "./types"

export function CommandSearchList({
	className,
	children,
	ref,
	...props
}: CommandSearchListProps): React.ReactElement {
	const { search, minChars } = useCommandSearch()

	const belowThreshold = search.length < minChars && minChars > 0

	return (
		<Command.List
			ref={ref}
			className={cn("ml-command-search__list", className)}
			{...props}
		>
			{belowThreshold ? (
				<div className="ml-command-search__threshold">
					Type at least {minChars} character{minChars > 1 ? "s" : ""} to search…
				</div>
			) : (
				children
			)}
		</Command.List>
	)
}
