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
import { cn } from "../../lib/utils"
import type { SelectOption, SelectRootProps, SelectSize } from "./types"

interface SelectContextValue {
	isMobile: boolean
	label?: string
	listboxId: string
	open: boolean
	options: SelectOption[]
	placeholder: string
	selectedOption?: SelectOption
	setOpen: (nextOpen: boolean) => void
	sheetLabel: string
	size: SelectSize
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
	value,
	...props
}: SelectRootProps<T>) {
	const [internalOpen, setInternalOpen] = useState(defaultOpen)
	const rootRef = useRef<HTMLDivElement>(null)
	const listboxId = useId()
	const breakpoint = useBreakpoint()
	const isMobile = breakpoint === "mobile"
	const open = openProp ?? internalOpen

	const setOpen = useCallback(
		(nextOpen: boolean) => {
			if (openProp === undefined) {
				setInternalOpen(nextOpen)
			}
			onOpenChange?.(nextOpen)
		},
		[onOpenChange, openProp]
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

	useEffect(() => {
		setOpen(false)
	}, [breakpoint, setOpen])

	const contextValue = useMemo<SelectContextValue>(
		() => ({
			isMobile,
			label,
			listboxId,
			open,
			options: options as SelectOption[],
			placeholder,
			selectedOption: selectedOption as SelectOption | undefined,
			setOpen,
			sheetLabel,
			size,
			value,
			onChange: (nextValue) => onChange(nextValue as T),
		}),
		[
			isMobile,
			label,
			listboxId,
			onChange,
			open,
			options,
			placeholder,
			selectedOption,
			setOpen,
			sheetLabel,
			size,
			value,
		]
	)

	return (
		<SelectContext.Provider value={contextValue}>
			<div
				ref={rootRef}
				data-open={open}
				data-size={size}
				className={cn("relative inline-flex", className)}
				{...props}
			>
				{children}
			</div>
		</SelectContext.Provider>
	)
}
