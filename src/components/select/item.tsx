"use client"

import { cn } from "../../lib/utils"
import { useSelectContext } from "./root"
import type { SelectItemProps, SelectSize } from "./types"

const itemSizeClasses: Record<SelectSize, string> = {
	sm: "min-h-ml-8 px-ml-2 text-xs",
	md: "min-h-ml-9 px-ml-3 text-sm",
	lg: "min-h-ml-10 px-ml-4 text-base",
}

const itemDescriptionClasses: Record<SelectSize, string> = {
	sm: "text-[0.68rem]",
	md: "text-xs",
	lg: "text-sm",
}

export function SelectItem({
	className,
	description,
	onClick,
	value,
	disabled,
	children,
	ref,
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
			ref={ref}
			type="button"
			role="option"
			aria-selected={selected}
			disabled={disabled}
			data-selected={selected}
			data-mobile={isMobile || undefined}
			className={cn(
				"ml-select__item flex w-full items-center justify-between rounded-md text-left font-medium leading-snug disabled:pointer-events-none disabled:opacity-45",
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
							"font-normal leading-relaxed text-text-muted",
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
