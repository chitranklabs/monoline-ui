import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { CardProps, CardSize } from "./types"

const cardSizeClasses: Record<CardSize, string> = {
	sm: "rounded-lg",
	md: "rounded-xl",
	lg: "rounded-2xl",
}

export function CardRoot({
	className,
	size = "md",
	asChild = false,
	href,
	download,
	onClick,
	referrerPolicy,
	rel,
	target,
	ref,
	...props
}: CardProps) {
	const isLink = Boolean(href)
	const resolvedRel = target === "_blank" && !rel ? "noopener noreferrer" : rel
	const cardClassName = cn(
		"group/card ml-card relative flex flex-col overflow-hidden border border-border bg-surface",
		isLink && "ml-card--hover cursor-pointer",
		cardSizeClasses[size],
		className
	)

	if (asChild) {
		return (
			<Slot
				ref={ref}
				data-card-size={size}
				className={cardClassName}
				{...props}
			/>
		)
	}

	if (isLink) {
		return (
			<a
				ref={ref as React.Ref<HTMLAnchorElement>}
				data-card-size={size}
				href={href}
				target={target}
				rel={resolvedRel}
				download={download}
				referrerPolicy={referrerPolicy}
				onClick={
					onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined
				}
				className={cardClassName}
				{...(props as React.ComponentProps<"a">)}
			/>
		)
	}

	return (
		<div
			ref={ref as React.Ref<HTMLDivElement>}
			data-card-size={size}
			onClick={onClick as React.MouseEventHandler<HTMLDivElement> | undefined}
			className={cardClassName}
			{...props}
		/>
	)
}
