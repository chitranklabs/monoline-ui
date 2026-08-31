"use client"

import { cn } from "../../lib/utils"
import { useSelectContext } from "./root"
import type { SelectItemProps } from "./types"

const SIZE_CLASSES = {
	sm: "min-h-ml-7 px-ml-2 text-xs",
	md: "min-h-ml-8 px-ml-2-5 text-sm",
	lg: "min-h-ml-10 px-ml-3-5 text-base",
} as const

const DESC_CLASSES = {
	sm: "text-[0.68rem]",
	md: "text-xs",
	lg: "text-sm",
} as const

export function SelectItem({
	className,
	description,
	id,
	onClick,
	value,
	disabled,
	children,
	ref,
	...props
}: SelectItemProps): React.ReactElement {
	const {
		isMobile,
		listboxId,
		onChange,
		setOpen,
		size,
		value: selectedValue,
	} = useSelectContext()
	const selected = selectedValue === value

	return (
		<button
			ref={ref}
			id={id ?? `${listboxId}-option-${value}`}
			type="button"
			role="option"
			aria-selected={selected}
			aria-disabled={disabled || undefined}
			disabled={disabled}
			data-selected={selected}
			data-mobile={isMobile || undefined}
			className={cn(
				"ml-select__item flex w-full items-center justify-between rounded-md text-left font-medium leading-snug disabled:pointer-events-none disabled:opacity-[0.48]",
				SIZE_CLASSES[size],
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
							DESC_CLASSES[size]
						)}
					>
						{description}
					</span>
				) : null}
			</span>
			<span
				aria-hidden="true"
				className={cn(
					"ml-select__check shrink-0 opacity-0 transition-opacity duration-(--duration-micro) ease-(--ease-out)",
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
