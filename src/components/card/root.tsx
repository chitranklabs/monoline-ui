import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { CardProps, CardSize } from "./types"

type CardButtonProps = Extract<
	CardProps,
	{ onClick: React.MouseEventHandler<HTMLButtonElement> }
>

const cardSizeClasses: Record<CardSize, string> = {
	sm: "rounded-lg",
	md: "rounded-xl",
	lg: "rounded-2xl",
}

function isCardButtonProps(props: CardProps): props is CardButtonProps {
	return (
		!props.asChild &&
		props.href === undefined &&
		"onClick" in props &&
		typeof props.onClick === "function"
	)
}

export function CardRoot(props: CardProps) {
	const { className, size = "md", href } = props
	const isButtonCard = isCardButtonProps(props)
	const cardClassName = cn(
		"group/card ml-card relative flex flex-col overflow-hidden border border-border bg-surface",
		href && "ml-card--hover cursor-pointer",
		isButtonCard && "ml-card--interactive cursor-pointer",
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

	if (isButtonCard) {
		const {
			className: _className,
			size: _size,
			asChild: _asChild,
			onClick,
			ref,
			type = "button",
			...buttonProps
		} = props

		return (
			<button
				ref={ref}
				type={type}
				data-card-size={size}
				onClick={onClick}
				className={cardClassName}
				{...buttonProps}
			/>
		)
	}

	const {
		className: _className,
		size: _size,
		asChild: _asChild,
		ref,
		...divProps
	} = props

	return (
		<div
			ref={ref}
			data-card-size={size}
			className={cardClassName}
			{...divProps}
		/>
	)
}
