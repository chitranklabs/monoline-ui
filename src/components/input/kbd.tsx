import { cn } from "../../lib/utils"
import type { InputKbdProps } from "./types"

export function InputKbd({ className, ref, ...props }: InputKbdProps) {
	return (
		<span
			ref={ref}
			className={cn(
				"ml-input-kbd rounded-xs border border-border bg-transparent px-1.5 py-0.5 font-mono text-[10px] text-text-muted",
				className
			)}
			{...props}
		/>
	)
}
