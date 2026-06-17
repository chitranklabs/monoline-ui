"use client"

import { useCallback, useEffect, useRef } from "react"

import { cn } from "../../lib/utils"
import { SelectItem } from "./item"
import { useSelectContext } from "./root"
import type { SelectContentProps } from "./types"

export function SelectContent({
	children,
	className,
	...props
}: SelectContentProps) {
	const {
		activeIndex,
		isMobile,
		listboxId,
		open,
		options,
		onChange,
		setActiveIndex,
		setOpen,
		sheetLabel,
	} = useSelectContext()
	const listboxRef = useRef<HTMLDivElement>(null)
	const searchBuffer = useRef("")
	const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

	const findNextEnabled = useCallback(
		(from: number, direction: 1 | -1) => {
			let idx = from
			for (let i = 0; i < options.length; i++) {
				idx = (idx + direction + options.length) % options.length
				if (!options[idx]?.disabled) return idx
			}
			return from
		},
		[options]
	)

	const firstEnabled = () => options.findIndex((o) => !o.disabled)
	const lastEnabled = () => {
		for (let i = options.length - 1; i >= 0; i--) {
			if (!options[i]?.disabled) return i
		}
		return -1
	}

	const activeOption =
		activeIndex >= 0 && activeIndex < options.length
			? options[activeIndex]
			: undefined
	const activeOptionId = activeOption
		? `${listboxId}-option-${activeOption.value}`
		: undefined

	useEffect(() => {
		if (open) listboxRef.current?.focus()
	}, [open])

	useEffect(() => {
		if (!open || !isMobile) return

		const handleMobileTab = (e: KeyboardEvent) => {
			if (e.key !== "Tab") return

			const listbox = listboxRef.current
			if (!listbox) return

			const cancelBtn = listbox
				.closest(".ml-select__sheet-stack")
				?.querySelector(".ml-select__sheet-cancel") as HTMLElement | null
			if (!cancelBtn) return

			const focusables = [listbox, cancelBtn]
			const first = focusables[0]
			const last = focusables[1]
			if (!first || !last) return

			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault()
					last.focus()
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault()
					first.focus()
				}
			}
		}

		document.addEventListener("keydown", handleMobileTab)
		return () => {
			document.removeEventListener("keydown", handleMobileTab)
		}
	}, [open, isMobile])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
				case "ArrowDown": {
					e.preventDefault()
					const next =
						activeIndex < 0 ? firstEnabled() : findNextEnabled(activeIndex, 1)
					if (next >= 0) setActiveIndex(next)
					break
				}
				case "ArrowUp": {
					e.preventDefault()
					const prev =
						activeIndex < 0 ? lastEnabled() : findNextEnabled(activeIndex, -1)
					if (prev >= 0) setActiveIndex(prev)
					break
				}
				case "Home": {
					e.preventDefault()
					const first = firstEnabled()
					if (first >= 0) setActiveIndex(first)
					break
				}
				case "End": {
					e.preventDefault()
					const last = lastEnabled()
					if (last >= 0) setActiveIndex(last)
					break
				}
				case "Enter":
				case " ": {
					e.preventDefault()
					const opt = activeIndex >= 0 ? options[activeIndex] : undefined
					if (opt && !opt.disabled) {
						onChange(opt.value)
						setOpen(false)
					}
					break
				}
				case "Tab": {
					if (!isMobile) {
						setOpen(false)
					}
					break
				}
				default: {
					if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
						e.preventDefault()
						clearTimeout(searchTimeout.current)
						searchBuffer.current += e.key.toLowerCase()
						searchTimeout.current = setTimeout(
							() => (searchBuffer.current = ""),
							350
						)
						const match = options.findIndex(
							(o) =>
								!o.disabled &&
								o.label.toLowerCase().startsWith(searchBuffer.current)
						)
						if (match >= 0) setActiveIndex(match)
					}
				}
			}
		},
		[
			activeIndex,
			findNextEnabled,
			firstEnabled,
			lastEnabled,
			onChange,
			options,
			setActiveIndex,
			setOpen,
			isMobile,
		]
	)

	if (!open) return null

	const contentChildren =
		children ??
		options.map((option, idx) => (
			<SelectItem
				key={option.value}
				id={`${listboxId}-option-${option.value}`}
				value={option.value}
				description={option.description}
				disabled={option.disabled}
				data-active={idx === activeIndex || undefined}
				onPointerMove={() => setActiveIndex(idx)}
			>
				{option.label}
			</SelectItem>
		))

	if (isMobile) {
		return (
			<div className="ml-select__mobile-layer fixed inset-0 z-50 sm:hidden">
				<button
					type="button"
					aria-label="Close select"
					className="ml-select__backdrop absolute inset-0"
					onClick={() => setOpen(false)}
				/>
				<div className="ml-select__sheet-stack absolute inset-x-ml-3 bottom-ml-3">
					<div
						ref={listboxRef}
						id={listboxId}
						role="listbox"
						tabIndex={0}
						aria-activedescendant={activeOptionId}
						data-state="open"
						className={cn("ml-select__sheet", className)}
						onKeyDown={handleKeyDown}
						{...props}
					>
						<div className="ml-select__sheet-handle-wrap">
							<div className="ml-select__sheet-handle" />
						</div>
						<div className="ml-select__sheet-label">{sheetLabel}</div>
						<div className="ml-select__list">{contentChildren}</div>
					</div>
					<button
						type="button"
						className="ml-select__sheet-cancel"
						onClick={() => setOpen(false)}
					>
						Cancel
					</button>
				</div>
			</div>
		)
	}

	return (
		<div
			ref={listboxRef}
			id={listboxId}
			role="listbox"
			tabIndex={0}
			aria-activedescendant={activeOptionId}
			data-state="open"
			className={cn("ml-select__content", className)}
			onKeyDown={handleKeyDown}
			{...props}
		>
			<div className="ml-select__list">{contentChildren}</div>
		</div>
	)
}
