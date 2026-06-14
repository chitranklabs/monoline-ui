"use client"

import { cn } from "../../lib/utils"
import { useSelectContext } from "./root"
import type { SelectSize, SelectTriggerProps, SelectVariant } from "./types"

const triggerSizeClasses: Record<SelectSize, string> = {
	sm: "min-h-ml-8 gap-ml-2 px-ml-3 py-[0.4375rem] text-xs",
	md: "min-h-ml-9 gap-ml-2 px-ml-4 py-[0.5625rem] text-sm",
	lg: "min-h-ml-10 gap-ml-2 px-ml-5 py-[0.6875rem] text-base",
}

const caretSizeClasses: Record<SelectSize, string> = {
	sm: "text-xs",
	md: "text-sm",
	lg: "text-base",
}

const triggerVariantClasses: Record<SelectVariant, string> = {
	default:
		"rounded-md border border-border bg-surface text-body hover:border-border-strong hover:bg-surface-2",
	ghost:
		"rounded-md border border-transparent bg-transparent text-body hover:bg-surface-2 hover:text-primary",
}

export function SelectTrigger({
	className,
	children,
	type,
	...props
}: SelectTriggerProps) {
	const {
		label,
		listboxId,
		open,
		selectedOption,
		setOpen,
		size,
		placeholder,
		variant,
	} = useSelectContext()

	return (
		<button
			type={type ?? "button"}
			aria-expanded={open}
			aria-haspopup="listbox"
			aria-controls={listboxId}
			className={cn(
				"inline-flex min-w-[13rem] select-none items-center justify-between whitespace-nowrap font-medium transition-[background-color,border-color,color,box-shadow] duration-(--duration-micro) ease-out focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
				triggerSizeClasses[size],
				triggerVariantClasses[variant],
				className
			)}
			onClick={() => setOpen(!open)}
			{...props}
		>
			{children ?? (
				<>
					<span className="flex min-w-0 items-baseline gap-ml-2 leading-none">
						{label ? (
							<span className="font-normal text-body opacity-55">{label}:</span>
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
