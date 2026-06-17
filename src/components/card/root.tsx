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
			// eslint-disable-next-line jsx-a11y/anchor-has-content -- children forwarded via spread
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

	const handleKeyDown = onClick
		? (e: React.KeyboardEvent<HTMLDivElement>) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault()
					;(onClick as React.MouseEventHandler<HTMLDivElement>)(
						e as unknown as React.MouseEvent<HTMLDivElement>
					)
				}
			}
		: undefined

	return onClick ? (
		<div
			ref={ref as React.Ref<HTMLDivElement>}
			data-card-size={size}
			role="button"
			tabIndex={0}
			onClick={onClick as React.MouseEventHandler<HTMLDivElement>}
			onKeyDown={handleKeyDown}
			className={cardClassName}
			{...props}
		/>
	) : (
		<div
			ref={ref as React.Ref<HTMLDivElement>}
			data-card-size={size}
			className={cardClassName}
			{...props}
		/>
	)
}
