import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { CardProps, CardSize } from "./types"

const cardSizeClasses: Record<CardSize, string> = {
	sm: "rounded-lg",
	md: "rounded-xl",
	lg: "rounded-2xl",
}

export function CardRoot(props: CardProps) {
	const { className, size = "md", href } = props
	const cardClassName = cn(
		"group/card ml-card relative flex flex-col overflow-hidden border border-border bg-surface",
		href && "ml-card--hover cursor-pointer",
		cardSizeClasses[size],
		className
	)

	if (props.asChild) {
		const {
			className: _className,
			size: _size,
			asChild: _asChild,
			ref,
			...slotProps
		} = props
		return (
			<Slot
				ref={ref}
				data-card-size={size}
				className={cardClassName}
				{...slotProps}
			/>
		)
	}

	if (props.href !== undefined) {
		const {
			className: _className,
			size: _size,
			asChild: _asChild,
			href: propsHref,
			target,
			rel,
			download,
			referrerPolicy,
			onClick,
			ref,
			...anchorProps
		} = props
		const resolvedRel =
			target === "_blank" && !rel ? "noopener noreferrer" : rel

		return (
			// eslint-disable-next-line jsx-a11y/anchor-has-content -- children forwarded via spread
			<a
				ref={ref}
				data-card-size={size}
				href={propsHref}
				target={target}
				rel={resolvedRel}
				download={download}
				referrerPolicy={referrerPolicy}
				onClick={onClick}
				className={cardClassName}
				{...anchorProps}
			/>
		)
	}

	const {
		className: _className,
		size: _size,
		asChild: _asChild,
		onClick,
		ref,
		...divProps
	} = props

	const handleKeyDown = onClick
		? (e: React.KeyboardEvent<HTMLDivElement>) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault()
					onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
				}
			}
		: undefined

	return onClick ? (
		<div
			ref={ref}
			data-card-size={size}
			role="button"
			tabIndex={0}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			className={cardClassName}
			{...divProps}
		/>
	) : (
		<div
			ref={ref}
			data-card-size={size}
			className={cardClassName}
			{...divProps}
		/>
	)
}
