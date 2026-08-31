import type * as React from "react"

import type * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

export type RadioGroupProps = React.ComponentProps<
	typeof RadioGroupPrimitive.Root
>
export interface RadioGroupItemProps extends React.ComponentProps<
	typeof RadioGroupPrimitive.Item
> {
	label?: React.ReactNode
	description?: React.ReactNode
}
