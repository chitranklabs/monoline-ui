import { cn } from "../../lib/utils"
import type { TagProps, TagSize } from "./types"

const tagSizeClasses: Record<TagSize, string> = {
	sm: "min-h-ml-7 gap-ml-1 px-ml-2 text-xs",
	md: "min-h-ml-8 gap-ml-1-5 px-ml-3 text-sm",
	lg: "min-h-ml-9 gap-ml-2 px-ml-4 text-base",
}

export function TagRoot({
	className,
	active = false,
	size = "md",
	type,
	...props
}: TagProps) {
	return (
		<button
			type={type ?? "button"}
			aria-pressed={active}
			data-active={active}
			className={cn(
				"inline-flex cursor-pointer select-none items-center rounded-pill border border-border-strong bg-transparent font-medium text-body transition-[background-color,border-color,color,box-shadow] duration-(--duration-micro) ease-out hover:border-primary hover:bg-surface-2 hover:text-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
				tagSizeClasses[size],
				className
			)}
			{...props}
		/>
	)
}
