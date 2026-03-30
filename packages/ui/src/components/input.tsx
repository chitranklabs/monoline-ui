import type * as React from "react"

import { cn } from "../lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {}

function Input({ className, type = "text", ...props }: InputProps) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"border-input bg-background/70 placeholder:text-muted-foreground flex h-11 w-full rounded-2xl border px-4 py-2 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring",
				className
			)}
			{...props}
		/>
	)
}

export { Input }
