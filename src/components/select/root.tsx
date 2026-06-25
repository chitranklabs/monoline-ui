"use client"

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react"

import { useBreakpoint } from "../../foundations/use-breakpoint"
import { cn, composeRefs } from "../../lib/utils"
import type {
	SelectOption,
	SelectRootProps,
	SelectSize,
	SelectVariant,
} from "./types"

interface SelectContextValue {
	activeIndex: number
	isMobile: boolean
	label?: string
	listboxId: string
	open: boolean
	options: SelectOption[]
	placeholder: string
	selectedOption?: SelectOption
	setActiveIndex: (index: number) => void
	setOpen: (nextOpen: boolean) => void
	sheetLabel: string
	size: SelectSize
	triggerRef: React.RefObject<HTMLButtonElement | null>
	variant: SelectVariant
	value: string
	onChange: (value: string) => void
}

const SelectContext = createContext<SelectContextValue | null>(null)

export function useSelectContext() {
	const context = useContext(SelectContext)

	if (!context) {
		throw new Error(
			"Select compound components must be used within Select.Root"
		)
	}

	return context
}

export function SelectRoot<T extends string>({
	children,
	className,
	defaultOpen = false,
	label,
	onChange,
	onOpenChange,
	open: openProp,
	options,
	placeholder = "Select",
	sheetLabel = "Choose an option",
	size = "md",
	variant = "default",
	value,
	ref,
	...props
}: SelectRootProps<T>): React.ReactElement {
	const [internalOpen, setInternalOpen] = useState(defaultOpen)
	const [activeIndex, setActiveIndex] = useState(-1)
	const breakpoint = useBreakpoint("desktop")
	const rootRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const listboxId = useId()
	const isMobile = breakpoint === "mobile"
	const open = openProp ?? internalOpen

	const onChangeRef = useRef(onChange)
	onChangeRef.current = onChange
	const onOpenChangeRef = useRef(onOpenChange)
	onOpenChangeRef.current = onOpenChange

	const stableOnChange = useCallback(
		(nextValue: string) => onChangeRef.current(nextValue as T),
		[]
	)

	const setOpen = useCallback(
		(nextOpen: boolean) => {
			if (nextOpen) {
				const idx = (options as SelectOption[]).findIndex(
					(o) => o.value === value
				)
				setActiveIndex(idx >= 0 ? idx : 0)
			} else if (open) {
				triggerRef.current?.focus()
			}
			if (openProp === undefined) {
				setInternalOpen(nextOpen)
			}
			onOpenChangeRef.current?.(nextOpen)
		},
		[open, openProp, options, value]
	)

	const selectedOption = useMemo(
		() => options.find((option) => option.value === value),
		[options, value]
	)

	useEffect(() => {
		if (!open) return

		const handlePointerDown = (event: PointerEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) {
				setOpen(false)
			}
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false)
			}
		}

		document.addEventListener("pointerdown", handlePointerDown)
		document.addEventListener("keydown", handleEscape)

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown)
			document.removeEventListener("keydown", handleEscape)
		}
	}, [open, setOpen])

	const prevBreakpointRef = useRef(breakpoint)
	useEffect(() => {
		if (prevBreakpointRef.current !== breakpoint) {
			setInternalOpen(false)
			onOpenChangeRef.current?.(false)
			prevBreakpointRef.current = breakpoint
		}
	}, [breakpoint])

	const contextValue = useMemo<SelectContextValue>(
		() => ({
			activeIndex,
			isMobile,
			label,
			listboxId,
			open,
			options: options as SelectOption[],
			placeholder,
			selectedOption: selectedOption as SelectOption | undefined,
			setActiveIndex,
			setOpen,
			sheetLabel,
			size,
			triggerRef,
			variant,
			value,
			onChange: stableOnChange,
		}),
		[
			activeIndex,
			isMobile,
			label,
			listboxId,
			open,
			options,
			placeholder,
			selectedOption,
			setOpen,
			sheetLabel,
			size,
			stableOnChange,
			variant,
			value,
		]
	)

	return (
		<SelectContext.Provider value={contextValue}>
			<div
				ref={composeRefs(rootRef, ref)}
				data-open={open}
				data-size={size}
				className={cn("ml-select relative inline-flex", className)}
				{...props}
			>
				{children}
			</div>
		</SelectContext.Provider>
	)
}
