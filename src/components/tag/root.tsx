import { cn } from "../../lib/utils"
import type { TagProps, TagSize, TagVariant } from "./types"

const tagSizeClasses: Record<TagSize, string> = {
	sm: "min-h-ml-7 gap-ml-1 whitespace-nowrap px-ml-2 text-xs",
	md: "min-h-ml-8 gap-ml-1-5 whitespace-nowrap px-ml-3 text-sm",
	lg: "min-h-ml-9 gap-ml-2 whitespace-nowrap px-ml-4 text-base",
}

const tagVariantClasses: Record<TagVariant, string> = {
	filter: "ml-control-surface--secondary font-medium",
	chip: "ml-control-surface--secondary text-body",
}

const interactiveVariantClasses: Record<TagVariant, string> = {
	filter:
		"cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
	chip: "cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
}

export function TagRoot({
	className,
	active = false,
	size = "md",
	variant = "filter",
	interactive,
	...props
}: TagProps) {
	const isInteractive = interactive ?? variant === "filter"

	const sharedClassName = cn(
		"ml-tag inline-flex select-none items-center rounded-[var(--radius-pill)] border transition-[background-color,border-color,color,box-shadow,opacity] duration-(--duration-micro) ease-out",
		tagSizeClasses[size],
		tagVariantClasses[variant],
		isInteractive ? interactiveVariantClasses[variant] : "cursor-default",
		className
	)

	if (!isInteractive) {
		const { ...spanProps } = props as Omit<
			Extract<TagProps, { interactive?: false }>,
			"active" | "interactive" | "size" | "variant"
		>

		return (
			<span
				data-active={active}
				data-interactive="false"
				className={sharedClassName}
				{...spanProps}
			/>
		)
	}

	const { type, ...buttonProps } = props as Omit<
		Extract<TagProps, { interactive?: true }>,
		"active" | "interactive" | "size" | "variant"
	>

	return (
		<button
			type={type ?? "button"}
			aria-pressed={active}
			data-active={active}
			data-interactive="true"
			className={sharedClassName}
			{...buttonProps}
		/>
	)
}
