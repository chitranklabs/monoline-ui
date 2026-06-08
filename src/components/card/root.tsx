import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { CardProps, CardSize, CardVariant } from "./types"

const cardVariantClasses: Record<CardVariant, string> = {
	default: "",
	hover:
		"cursor-pointer transition-[border-color,box-shadow,transform] duration-(--duration-short) ease-out-expo hover:-translate-y-ml-1 hover:border-border-strong hover:shadow-card",
	interactive:
		"cursor-pointer transition-colors duration-(--duration-micro) ease-out hover:bg-surface-2",
}

const cardSizeClasses: Record<CardSize, string> = {
	sm: "rounded-lg",
	md: "rounded-xl",
	lg: "rounded-2xl",
}

export function CardRoot({
	className,
	variant = "default",
	size = "md",
	asChild = false,
	...props
}: CardProps) {
	const Comp = asChild ? Slot : "div"

	return (
		<Comp
			data-card-size={size}
			className={cn(
				"group/card relative flex flex-col overflow-hidden border border-border bg-surface",
				cardVariantClasses[variant],
				cardSizeClasses[size],
				className
			)}
			{...props}
		/>
	)
}
