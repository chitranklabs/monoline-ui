"use client"

import { Command } from "cmdk"

import { cn } from "@chitrank2050/monoline-ui/lib/utils"

import { useCommandSearch } from "./root"
import type { CommandSearchItemProps } from "./types"

export function CommandSearchItem({
	value,
	onSelect,
	disabled = false,
	className,
	children,
	...props
}: CommandSearchItemProps) {
	const { close } = useCommandSearch()

	return (
		<Command.Item
			value={value}
			disabled={disabled}
			onSelect={() => {
				onSelect?.()
				close()
			}}
			className={cn("ml-command-search__item", className)}
			{...props}
		>
			{children}
		</Command.Item>
	)
}
