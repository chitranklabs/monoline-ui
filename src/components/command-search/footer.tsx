"use client"

import * as React from "react"

import { cn } from "@chitrank2050/monoline-ui/lib/utils"

import type { CommandSearchFooterProps } from "./types"

export function CommandSearchFooter({
	className,
	children,
	...props
}: CommandSearchFooterProps) {
	return (
		<div className={cn("ml-command-search__footer", className)} {...props}>
			{children || (
				<>
					<span>
						<kbd>↑↓</kbd> Navigate
					</span>
					<span>
						<kbd>↵</kbd> Select
					</span>
					<span>
						<kbd>esc</kbd> Close
					</span>
				</>
			)}
		</div>
	)
}
