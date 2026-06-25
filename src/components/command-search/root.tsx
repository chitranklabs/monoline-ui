"use client"

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import { createPortal } from "react-dom"

import { Command } from "cmdk"

import { cn } from "../../lib/utils"
import { CommandSearchFooter } from "./footer"
import type { CommandSearchContextValue, CommandSearchProps } from "./types"

const CommandSearchContext = createContext<CommandSearchContextValue | null>(
	null
)

export function useCommandSearch() {
	const ctx = useContext(CommandSearchContext)
	if (!ctx)
		throw new Error(
			"CommandSearch compound components must be used within CommandSearch"
		)
	return ctx
}

function defaultFilter(query: string, value: string) {
	return value.toLowerCase().includes(query.toLowerCase())
}

export function CommandSearchRoot({
	open,
	onOpenChange,
	shortcut = "k",
	debounce: debounceProp = false,
	minChars = 0,
	placeholder = "Search…",
	onQueryChange,
	filter = defaultFilter,
	shouldFilter = true,
	className,
	ref,
	children,
	showFooter = false,
}: CommandSearchProps): React.ReactElement | null {
	const [rawSearch, setRawSearchState] = useState("")
	const [search, setSearch] = useState("")
	const [isBrowser, setIsBrowser] = useState(false)
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)
	const prevOpen = useRef(false)

	useEffect(() => {
		setIsBrowser(true)
	}, [])

	useEffect(() => {
		if (open && !prevOpen.current) {
			setRawSearchState("")
			setSearch("")
		}
		prevOpen.current = open
	}, [open])

	const close = useCallback(() => onOpenChange(false), [onOpenChange])

	const setRawSearch = useCallback(
		(q: string) => {
			setRawSearchState(q)
			onQueryChange?.(q)

			const delay =
				typeof debounceProp === "number" && debounceProp > 0 ? debounceProp : 0

			if (delay > 0) {
				clearTimeout(debounceRef.current)
				debounceRef.current = setTimeout(() => setSearch(q), delay)
			} else {
				setSearch(q)
			}
		},
		[debounceProp, onQueryChange]
	)

	useEffect(() => {
		return () => clearTimeout(debounceRef.current)
	}, [])

	useEffect(() => {
		if (!shortcut) return
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === shortcut) {
				e.preventDefault()
				onOpenChange(!open)
			}
		}
		document.addEventListener("keydown", handler)
		return () => document.removeEventListener("keydown", handler)
	}, [shortcut, open, onOpenChange])

	const cmdkFilter = useMemo(() => {
		if (!shouldFilter) return () => 1
		if (!filter) return undefined
		return (value: string, searchVal: string) => {
			return filter(searchVal, value) ? 1 : 0
		}
	}, [filter, shouldFilter])

	if (!isBrowser || !open) return null

	const ctxValue: CommandSearchContextValue = {
		search,
		rawSearch,
		setRawSearch,
		minChars,
		placeholder,
		close,
	}

	return createPortal(
		<CommandSearchContext.Provider value={ctxValue}>
			{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
			<div
				className="ml-command-search__backdrop"
				onMouseDown={(e) => {
					if (e.target === e.currentTarget) close()
				}}
			>
				<Command
					ref={ref}
					label={placeholder}
					shouldFilter={shouldFilter}
					filter={cmdkFilter}
					className={cn("ml-command-search__panel", className)}
					onKeyDown={(e) => {
						if (e.key === "Escape") close()
					}}
				>
					{children}
					{showFooter && <CommandSearchFooter />}
				</Command>
			</div>
		</CommandSearchContext.Provider>,
		document.body
	)
}
