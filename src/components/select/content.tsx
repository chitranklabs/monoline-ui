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
			<div className="fixed inset-0 z-50 sm:hidden">
				<button
					type="button"
					aria-label="Close select"
					className="absolute inset-0 bg-black/30"
					onClick={() => setOpen(false)}
				/>
				<div className="absolute inset-x-ml-4 bottom-ml-4 space-y-ml-3">
					<div
						id={listboxId}
						role="listbox"
						aria-activedescendant={value}
						className={cn("ml-select__sheet", className)}
						{...props}
					>
						<div className="flex justify-center pt-ml-3">
							<div className="h-1 w-ml-10 rounded-full bg-border-strong/65" />
						</div>
						<div className="px-ml-5 pt-ml-4 pb-ml-2 font-mono text-[0.68rem] tracking-[0.22em] text-muted uppercase">
							{sheetLabel}
						</div>
						<div className="flex flex-col gap-ml-2 px-ml-3 pb-ml-3">
							{contentChildren}
						</div>
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
			className={cn("ml-select__content", className)}
			{...props}
		>
			<div className="flex flex-col gap-ml-1 p-ml-1.5">{contentChildren}</div>
		</div>
	)
}
