"use client"

import { Command } from "cmdk"

import { cn } from "@chitrank2050/monoline-ui/lib/utils"

import { useCommandSearch } from "./root"
import type { CommandSearchListProps } from "./types"

export function CommandSearchList({
	className,
	children,
	...props
}: CommandSearchListProps) {
	const { search, minChars } = useCommandSearch()

	const belowThreshold = search.length < minChars && minChars > 0

	return (
		<Command.List
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
