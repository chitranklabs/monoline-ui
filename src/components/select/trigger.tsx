"use client"

import { cn } from "../../lib/utils"
import { useSelectContext } from "./root"
import type { SelectTriggerProps, SelectVariant } from "./types"

const triggerVariantClasses: Record<SelectVariant, string> = {
	default: "ml-control-surface--secondary",
	ghost: "ml-control-surface--ghost",
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
				"ml-select__trigger inline-flex min-w-[13rem] select-none items-center justify-between whitespace-nowrap rounded-md border font-medium focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
				triggerVariantClasses[variant],
				className
			)}
			onClick={() => setOpen(!open)}
			{...props}
		>
			{children ?? (
				<>
					<span className="flex min-w-0 items-center gap-(--ml-select-trigger-gap) leading-none">
						{label ? (
							<span className="ml-select__label font-normal">{label}:</span>
						) : null}
						<span className="truncate font-medium text-primary">
							{selectedOption?.label ?? placeholder}
						</span>
					</span>
					<span
						aria-hidden="true"
						className={cn("ml-select__caret", open && "rotate-180")}
					>
						<ChevronDownIcon />
					</span>
				</>
			)}
		</button>
	)
}

function ChevronDownIcon() {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="size-full"
		>
			<path
				d="M4 6.5L8 10L12 6.5"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
