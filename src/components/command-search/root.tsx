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

import { Command } from "cmdk"

import { cn } from "../../lib/utils"
import { Dialog } from "../dialog"
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

function findFocusableTarget(target: HTMLElement): HTMLElement | null {
	return target.closest<HTMLElement>(
		'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
	)
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
}: CommandSearchProps): React.ReactElement {
	const [rawSearch, setRawSearchState] = useState("")
	const [search, setSearch] = useState("")
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)
	const prevOpen = useRef(false)
	const openRef = useRef(open)
	const returnFocusRef = useRef<HTMLElement | null>(null)
	openRef.current = open

	useEffect(() => {
		const rememberFocus = (event: FocusEvent) => {
			if (!openRef.current && event.target instanceof HTMLElement) {
				returnFocusRef.current = event.target
			}
		}
		const rememberPointerTarget = (event: PointerEvent) => {
			if (!openRef.current && event.target instanceof HTMLElement) {
				const focusableTarget = findFocusableTarget(event.target)
				if (focusableTarget) returnFocusRef.current = focusableTarget
			}
		}

		if (document.activeElement instanceof HTMLElement) {
			returnFocusRef.current = document.activeElement
		}
		document.addEventListener("focusin", rememberFocus)
		document.addEventListener("pointerdown", rememberPointerTarget)
		return () => {
			document.removeEventListener("focusin", rememberFocus)
			document.removeEventListener("pointerdown", rememberPointerTarget)
		}
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
			if (
				(e.metaKey || e.ctrlKey) &&
				e.key.toLowerCase() === shortcut.toLowerCase()
			) {
				e.preventDefault()
				if (!open && document.activeElement instanceof HTMLElement) {
					returnFocusRef.current = document.activeElement
				}
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

	const ctxValue: CommandSearchContextValue = {
		search,
		rawSearch,
		setRawSearch,
		minChars,
		placeholder,
		close,
	}

	return (
		<CommandSearchContext.Provider value={ctxValue}>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<Dialog.Content
					asChild
					aria-describedby={undefined}
					overlayClassName="ml-command-search__backdrop"
					onCloseAutoFocus={(event) => {
						event.preventDefault()
						const returnTarget = returnFocusRef.current
						queueMicrotask(() => returnTarget?.focus())
					}}
				>
					<Command
						ref={ref}
						label={placeholder}
						shouldFilter={shouldFilter}
						filter={cmdkFilter}
						className={cn("ml-command-search__panel", className)}
					>
						<Dialog.Title className="sr-only">{placeholder}</Dialog.Title>
						{children}
						{showFooter && <CommandSearchFooter />}
					</Command>
				</Dialog.Content>
			</Dialog>
		</CommandSearchContext.Provider>
	)
}
