"use client"

import { useCallback, useEffect, useRef } from "react"

import { anchoredFloatingDefaults } from "../../lib/floating"
import { cn, composeRefs } from "../../lib/utils"
import { Dialog } from "../dialog"
import { Popover } from "../popover"
import { SelectItem } from "./item"
import { useSelectContext } from "./root"
import type { SelectContentProps } from "./types"

export function SelectContent({
	align = "start",
	alignOffset = 0,
	avoidCollisions = anchoredFloatingDefaults.avoidCollisions,
	children,
	className,
	collisionBoundary,
	collisionPadding = anchoredFloatingDefaults.collisionPadding,
	container,
	hideWhenDetached = anchoredFloatingDefaults.hideWhenDetached,
	onKeyDown,
	ref,
	side = "bottom",
	sideOffset = 6,
	sticky = anchoredFloatingDefaults.sticky,
	...props
}: SelectContentProps): React.ReactElement | null {
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
		size,
		triggerRef,
	} = useSelectContext()
	const listboxRef = useRef<HTMLDivElement>(null)
	const searchBuffer = useRef("")
	const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

	const findEnabled = useCallback(
		(from: number, direction: 1 | -1) => {
			for (let i = 0; i < options.length; i++) {
				const idx =
					(from + direction * (i + 1) + options.length) % options.length
				if (!options[idx]?.disabled) return idx
			}
			return from
		},
		[options]
	)

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

	useEffect(() => () => clearTimeout(searchTimeout.current), [])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			onKeyDown?.(e)
			if (e.defaultPrevented) return

			switch (e.key) {
				case "ArrowDown": {
					e.preventDefault()
					const next =
						activeIndex < 0
							? options.findIndex((o) => !o.disabled)
							: findEnabled(activeIndex, 1)
					if (next >= 0) setActiveIndex(next)
					break
				}
				case "ArrowUp": {
					e.preventDefault()
					if (activeIndex < 0) {
						for (let i = options.length - 1; i >= 0; i--) {
							if (!options[i]?.disabled) {
								setActiveIndex(i)
								break
							}
						}
					} else {
						const prev = findEnabled(activeIndex, -1)
						if (prev >= 0) setActiveIndex(prev)
					}
					break
				}
				case "Home": {
					e.preventDefault()
					const first = options.findIndex((o) => !o.disabled)
					if (first >= 0) setActiveIndex(first)
					break
				}
				case "End": {
					e.preventDefault()
					for (let i = options.length - 1; i >= 0; i--) {
						if (!options[i]?.disabled) {
							setActiveIndex(i)
							break
						}
					}
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
					if (!isMobile) setOpen(false)
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
			findEnabled,
			onChange,
			options,
			setActiveIndex,
			setOpen,
			isMobile,
			onKeyDown,
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
			<Dialog.Content
				asChild
				aria-describedby={undefined}
				overlayClassName="ml-select__backdrop"
			>
				<div className="ml-select__mobile-layer fixed inset-0 z-50 sm:hidden">
					<div className="ml-select__sheet-stack absolute inset-x-ml-3 bottom-ml-3">
						<div
							ref={composeRefs(listboxRef, ref)}
							id={listboxId}
							role="listbox"
							tabIndex={0}
							aria-activedescendant={activeOptionId}
							data-state="open"
							data-size={size}
							className={cn("ml-select__sheet", className)}
							onKeyDown={handleKeyDown}
							{...props}
						>
							<div className="ml-select__sheet-handle-wrap">
								<div className="ml-select__sheet-handle" />
							</div>
							<Dialog.Title asChild>
								<div className="ml-select__sheet-label">{sheetLabel}</div>
							</Dialog.Title>
							<div className="ml-select__list">{contentChildren}</div>
						</div>
						<Dialog.Close asChild>
							<button type="button" className="ml-select__sheet-cancel">
								Cancel
							</button>
						</Dialog.Close>
					</div>
				</div>
			</Dialog.Content>
		)
	}

	return (
		<Popover.Content
			asChild
			align={align}
			alignOffset={alignOffset}
			avoidCollisions={avoidCollisions}
			collisionBoundary={collisionBoundary}
			collisionPadding={collisionPadding}
			container={container}
			hideWhenDetached={hideWhenDetached}
			side={side}
			sideOffset={sideOffset}
			sticky={sticky}
			onOpenAutoFocus={(event) => {
				event.preventDefault()
				listboxRef.current?.focus()
			}}
			onCloseAutoFocus={(event) => {
				event.preventDefault()
				triggerRef.current?.focus()
			}}
		>
			<div
				ref={composeRefs(listboxRef, ref)}
				id={listboxId}
				role="listbox"
				tabIndex={0}
				aria-activedescendant={activeOptionId}
				data-state="open"
				data-size={size}
				className={cn("ml-select__content", className)}
				onKeyDown={handleKeyDown}
				{...props}
			>
				<div className="ml-select__list">{contentChildren}</div>
			</div>
		</Popover.Content>
	)
}
