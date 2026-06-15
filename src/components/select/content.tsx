"use client"

import { cn } from "../../lib/utils"
import { SelectItem } from "./item"
import { useSelectContext } from "./root"
import type { SelectContentProps } from "./types"

export function SelectContent({
	children,
	className,
	...props
}: SelectContentProps) {
	const { isMobile, listboxId, open, options, sheetLabel, value, setOpen } =
		useSelectContext()

	if (!open) return null

	const contentChildren =
		children ??
		options.map((option) => (
			<SelectItem
				key={option.value}
				value={option.value}
				description={option.description}
				disabled={option.disabled}
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
						id={listboxId}
						role="listbox"
						aria-activedescendant={value}
						data-state="open"
						className={cn("ml-select__sheet", className)}
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
			id={listboxId}
			role="listbox"
			aria-activedescendant={value}
			data-state="open"
			className={cn("ml-select__content", className)}
			{...props}
		>
			<div className="ml-select__list">{contentChildren}</div>
		</div>
	)
}
