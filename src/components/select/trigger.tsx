"use client"

import { cn } from "../../lib/utils"
import { useSelectContext } from "./root"
import type { SelectSize, SelectTriggerProps } from "./types"

const triggerSizeClasses: Record<SelectSize, string> = {
	sm: "min-h-ml-8 gap-ml-2 px-ml-3 text-xs",
	md: "min-h-ml-9 gap-ml-3 px-ml-4 text-sm",
	lg: "min-h-ml-10 gap-ml-3 px-ml-5 text-base",
}

const caretSizeClasses: Record<SelectSize, string> = {
	sm: "text-xs",
	md: "text-sm",
	lg: "text-base",
}

export function SelectTrigger({
	className,
	children,
	type,
	...props
}: SelectTriggerProps) {
	const { label, listboxId, open, selectedOption, setOpen, size, placeholder } =
		useSelectContext()

	return (
		<button
			type={type ?? "button"}
			aria-expanded={open}
			aria-haspopup="listbox"
			aria-controls={listboxId}
			className={cn(
				"inline-flex min-w-[13rem] select-none items-center justify-between rounded-[var(--radius-2xl)] border border-border bg-surface text-body transition-[background-color,border-color,color,box-shadow] duration-(--duration-micro) ease-out hover:border-border-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
				triggerSizeClasses[size],
				className
			)}
			onClick={() => setOpen(!open)}
			{...props}
		>
			{children ?? (
				<>
					<span className="flex min-w-0 items-baseline gap-ml-2">
						{label ? (
							<span className="text-body opacity-55">{label}:</span>
						) : null}
						<span className="truncate font-medium text-primary">
							{selectedOption?.label ?? placeholder}
						</span>
					</span>
					<span
						aria-hidden="true"
						className={cn(
							"font-mono text-muted transition-transform duration-(--duration-short) ease-out",
							caretSizeClasses[size],
							open && "rotate-180"
						)}
					>
						⌄
					</span>
				</>
			)}
		</button>
	)
}
