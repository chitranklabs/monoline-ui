import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "../lib/utils"

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				outline:
					"border border-border bg-background/70 hover:bg-accent hover:text-accent-foreground",
				ghost: "hover:bg-accent hover:text-accent-foreground",
			},
			size: {
				default: "h-11 px-5",
				sm: "h-9 px-4 text-sm",
				lg: "h-12 px-6",
				icon: "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button"

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
