"use client"

import { useId } from "react"

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "../../lib/utils"
import type { RadioGroupItemProps } from "./types"

export function RadioGroupItem({
	className,
	id,
	label,
	description,
	ref,
	...props
}: RadioGroupItemProps): React.ReactElement {
	const generatedId = useId()
	const itemId = id ?? generatedId
	const control = (
		<RadioGroupPrimitive.Item
			ref={ref}
			id={itemId}
			className={cn("ml-radio-group__item", className)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="ml-radio-group__indicator" />
		</RadioGroupPrimitive.Item>
	)

	if (!label && !description) return control

	return (
		<div className="ml-radio-group__option">
			{control}
			<label htmlFor={itemId} className="ml-radio-group__copy">
				{label ? <span className="ml-radio-group__label">{label}</span> : null}
				{description ? (
					<span className="ml-radio-group__description">{description}</span>
				) : null}
			</label>
		</div>
	)
}
