"use client"

import { Command } from "cmdk"

import { cn } from "../../lib/utils"
import { useCommandSearch } from "./root"
import type { CommandSearchItemProps } from "./types"

export function CommandSearchItem({
	value,
	onSelect,
	disabled = false,
	className,
	children,
	ref,
	...props
}: CommandSearchItemProps): React.ReactElement {
	const { close } = useCommandSearch()

	return (
		<Command.Item
			ref={ref}
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
