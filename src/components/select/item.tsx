"use client"

import { cn } from "../../lib/utils"
import { useSelectContext } from "./root"
import type { SelectItemProps, SelectSize } from "./types"

const itemSizeClasses: Record<SelectSize, string> = {
	sm: "px-ml-3 py-ml-2.5 text-xs",
	md: "px-ml-4 py-ml-3 text-sm",
	lg: "px-ml-5 py-ml-3.5 text-base",
}

const itemDescriptionClasses: Record<SelectSize, string> = {
	sm: "text-[0.68rem]",
	md: "text-xs",
	lg: "text-sm",
}

const checkSizeClasses: Record<SelectSize, string> = {
	sm: "size-ml-3.5",
	md: "size-ml-4",
	lg: "size-ml-4.5",
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
	const {
		isMobile,
		onChange,
		setOpen,
		size,
		value: selectedValue,
	} = useSelectContext()
	const selected = selectedValue === value

	return (
		<button
			type="button"
			role="option"
			aria-selected={selected}
			disabled={disabled}
			data-selected={selected}
			data-mobile={isMobile || undefined}
			className={cn(
				"ml-select__item flex w-full items-start justify-between rounded-lg border text-left font-medium leading-snug transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-(--duration-micro) ease-out disabled:pointer-events-none disabled:opacity-45",
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
				<span className="truncate">{children}</span>
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
					"ml-select__check shrink-0 text-accent opacity-0 transition-opacity duration-(--duration-micro) ease-out",
					checkSizeClasses[size],
					selected && "opacity-100"
				)}
			>
				<CheckIcon />
			</span>
		</button>
	)
}

function CheckIcon() {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="size-full"
		>
			<path
				d="M3.5 8.25L6.5 11.25L12.5 4.75"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
