"use client"

import { Fragment } from "react"

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
		options.map((option, index) => (
			<Fragment key={option.value}>
				{index > 0 ? (
					<div aria-hidden="true" className="border-t border-border" />
				) : null}
				<SelectItem
					value={option.value}
					description={option.description}
					disabled={option.disabled}
				>
					{option.label}
				</SelectItem>
			</Fragment>
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
						className={cn(
							"overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-[0_24px_60px_rgba(17,17,17,0.24)]",
							className
						)}
						{...props}
					>
						<div className="flex justify-center pt-ml-3">
							<div className="h-1 w-ml-10 rounded-full bg-border-strong/60" />
						</div>
						<div className="px-ml-5 pt-ml-4 pb-ml-2 text-xs tracking-[0.22em] text-muted uppercase">
							{sheetLabel}
						</div>
						<div>{contentChildren}</div>
					</div>
					<button
						type="button"
						className="flex min-h-ml-11 w-full items-center justify-center rounded-[1.25rem] border border-border bg-surface text-sm font-medium text-primary shadow-[0_10px_30px_rgba(17,17,17,0.18)] transition-[background-color,border-color,color] duration-(--duration-micro) ease-out hover:bg-surface-2"
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
			className={cn(
				"absolute top-full left-0 z-40 mt-ml-2 min-w-full overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-[0_18px_50px_rgba(17,17,17,0.14)]",
				className
			)}
			{...props}
		>
			<div>{contentChildren}</div>
		</div>
	)
}
