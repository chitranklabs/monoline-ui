"use client"

import { Command } from "cmdk"

import { cn } from "@chitrank2050/monoline-ui/lib/utils"

import { useCommandSearch } from "./root"
import type { CommandSearchInputProps } from "./types"

function SearchIcon() {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="size-4"
		>
			<path
				d="M7.25 12.5C10.1495 12.5 12.5 10.1495 12.5 7.25C12.5 4.35051 10.1495 2 7.25 2C4.35051 2 2 4.35051 2 7.25C2 10.1495 4.35051 12.5 7.25 12.5Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M10.9624 10.9625L13.9999 14.0001"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

export function CommandSearchInput({
	className,
	size,
}: CommandSearchInputProps) {
	const { rawSearch, setRawSearch, placeholder, close } = useCommandSearch()

	return (
		<div className={cn("ml-command-search__input-row", className)}>
			<span className="ml-command-search__search-icon" aria-hidden="true">
				<SearchIcon />
			</span>
			<Command.Input
				className={cn(
					"ml-command-search__input",
					size === "lg" && "ml-command-search__input--lg"
				)}
				placeholder={placeholder}
				value={rawSearch}
				onValueChange={setRawSearch}
				autoComplete="off"
				autoCorrect="off"
				spellCheck={false}
				/* eslint-disable-next-line jsx-a11y/no-autofocus */
				autoFocus
			/>
			<button
				type="button"
				className="ml-command-search__esc"
				onClick={close}
				aria-label="Close search"
			>
				esc
			</button>
		</div>
	)
}
