import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { TagProps, TagSize } from "./types"

const tagSizeClasses: Record<TagSize, string> = {
	sm: "min-h-ml-7 px-ml-2 text-xs",
	md: "min-h-ml-8 px-ml-3 text-sm",
	lg: "min-h-ml-9 px-ml-4 text-base",
}

const prefixSizeClasses: Record<TagSize, string> = {
	sm: "mr-ml-1-5 text-xs",
	md: "mr-ml-2 text-sm",
	lg: "mr-ml-2-5 text-base",
}

const suffixSizeClasses: Record<TagSize, string> = {
	sm: "ml-ml-1-5 text-xs",
	md: "ml-ml-2 text-sm",
	lg: "ml-ml-2-5 text-base",
}

const valueSizeClasses: Record<TagSize, string> = {
	sm: "text-xs",
	md: "text-sm",
	lg: "text-base",
}

const dismissSizeClasses: Record<TagSize, string> = {
	sm: "size-3.5 ml-ml-1 p-0.5",
	md: "size-4 ml-ml-1-5 p-0.5",
	lg: "size-5 ml-ml-2 p-1",
}

export function TagRoot({
	className,
	active = false,
	selected,
	prefix,
	suffix,
	onDismiss,
	dismissAriaLabel = "Remove filter",
	size = "md",
	asChild = false,
	type = "button",
	children,
	ref,
	...props
}: TagProps): React.ReactElement {
	const isSelected = selected ?? active

	const sharedClassName = cn(
		"ml-tag inline-flex select-none items-center rounded-(--radius-pill) font-sans cursor-pointer transition-[background-color,border-color,color,box-shadow,opacity] duration-(--duration-micro) ease-out disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-[0.48] focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
		tagSizeClasses[size],
		className
	)

	if (asChild) {
		return (
			<Slot
				ref={ref as React.Ref<HTMLElement>}
				data-active={isSelected ? "true" : "false"}
				className={sharedClassName}
				{...(props as React.ComponentProps<typeof Slot>)}
			>
				{children}
			</Slot>
		)
	}

	const handleDismiss = (e: React.MouseEvent) => {
		if (onDismiss) {
			e.stopPropagation()
			onDismiss(e)
		}
	}

	return (
		<button
			ref={ref as React.Ref<HTMLButtonElement>}
			type={type}
			aria-pressed={isSelected}
			data-active={isSelected ? "true" : "false"}
			className={sharedClassName}
			{...props}
		>
			{prefix && (
				<span className={cn("ml-tag__prefix", prefixSizeClasses[size])}>
					{prefix}
				</span>
			)}
			<span className={cn("ml-tag__value", valueSizeClasses[size])}>
				{children}
			</span>
			{suffix && (
				<span className={cn("ml-tag__suffix", suffixSizeClasses[size])}>
					{suffix}
				</span>
			)}
			{isSelected && onDismiss && (
				<span
					role="button"
					tabIndex={0}
					aria-label={dismissAriaLabel}
					onClick={handleDismiss}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault()
							handleDismiss(e as unknown as React.MouseEvent)
						}
					}}
					className={cn("ml-tag__dismiss", dismissSizeClasses[size])}
				>
					<svg
						className="size-full"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2.5}
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M18 6 6 18" />
						<path d="m6 6 12 12" />
					</svg>
				</span>
			)}
		</button>
	)
}

TagRoot.displayName = "Tag"
