import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "../lib/utils"

const badgeVariants = cva(
	"inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
	{
		variants: {
			variant: {
				default: "border-primary/20 bg-primary/12 text-foreground",
				secondary: "border-border bg-muted text-muted-foreground",
				outline: "border-border bg-transparent text-foreground",
				destructive: "border-destructive/20 bg-destructive/12 text-destructive",
				ghost: "border-transparent bg-transparent text-foreground",
				link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
)

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	)
}

export { Badge, badgeVariants }
