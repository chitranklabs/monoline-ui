"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { CommandSearchFooterProps } from "./types"

export function CommandSearchFooter({
	className,
	children,
	ref,
	...props
}: CommandSearchFooterProps): React.ReactElement {
	return (
		<div
			ref={ref}
			className={cn("ml-command-search__footer", className)}
			{...props}
		>
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
