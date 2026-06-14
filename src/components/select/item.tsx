"use client"

import { cn } from "../../lib/utils"
import { useSelectContext } from "./root"
import type { SelectItemProps, SelectSize } from "./types"

const itemSizeClasses: Record<SelectSize, string> = {
	sm: "gap-ml-3 px-ml-3 py-[0.625rem] text-xs",
	md: "gap-ml-4 px-ml-4 py-[0.8125rem] text-sm",
	lg: "gap-ml-4 px-ml-5 py-[0.9375rem] text-base",
}

const itemDescriptionClasses: Record<SelectSize, string> = {
	sm: "text-[0.7rem]",
	md: "text-xs",
	lg: "text-sm",
}

const checkSizeClasses: Record<SelectSize, string> = {
	sm: "text-sm",
	md: "text-base",
	lg: "text-lg",
}

export function SelectItem({
	className,
	description,
	onClick,
	value,
	disabled,
	children,
	...props
}: SelectItemProps) {
	const { onChange, setOpen, size, value: selectedValue } = useSelectContext()
	const selected = selectedValue === value

	return (
		<button
			type="button"
			role="option"
			aria-selected={selected}
			disabled={disabled}
			data-selected={selected}
			className={cn(
				"flex w-full items-start justify-between border-border text-left font-medium leading-snug text-body transition-[background-color,color,opacity] duration-(--duration-micro) ease-out hover:bg-surface-2 hover:text-primary data-[selected=true]:bg-surface-2 data-[selected=true]:text-primary disabled:pointer-events-none disabled:opacity-45",
				itemSizeClasses[size],
				className
			)}
			onClick={(event) => {
				onClick?.(event)
				if (event.defaultPrevented) return
				onChange(value)
				setOpen(false)
			}}
			{...props}
		>
			<span className="flex min-w-0 flex-1 flex-col gap-ml-0-5">
				<span>{children}</span>
				{description ? (
					<span
						className={cn(
							"font-normal leading-relaxed text-muted",
							itemDescriptionClasses[size]
						)}
					>
						{description}
					</span>
				) : null}
			</span>
			<span
				aria-hidden="true"
				className={cn(
					"font-mono text-accent opacity-0 transition-opacity duration-(--duration-micro) ease-out",
					checkSizeClasses[size],
					selected && "opacity-100"
				)}
			>
				✓
			</span>
		</button>
	)
}
