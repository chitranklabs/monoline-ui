import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "../lib/utils"

const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
	variants: {
		size: {
			sm: "max-w-3xl",
			md: "max-w-5xl",
			lg: "max-w-7xl",
			full: "max-w-full",
		},
	},
	defaultVariants: {
		size: "lg",
	},
})

interface ContainerProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof containerVariants> {}

function Container({ className, size, ...props }: ContainerProps) {
	return (
		<div
			data-slot="container"
			className={cn(containerVariants({ size }), className)}
			{...props}
		/>
	)
}

export { Container, containerVariants }
