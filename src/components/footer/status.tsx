import type { FooterStatusProps } from "./types"
import { cn } from "../../lib/utils"

export function FooterStatus({
	children = "Open to work",
	className,
	...props
}: FooterStatusProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-ml-2 rounded-full border border-accent bg-accent-soft px-ml-4 py-ml-2 font-mono text-(length:--ml-footer-status-text) font-semibold tracking-(--ml-footer-status-tracking) text-accent uppercase transition-[background-color,border-color] duration-(--duration-micro) ease-out sm:text-(length:--ml-footer-status-text-tablet)",
				className
			)}
			{...props}
		>
			<span className="size-ml-1-5 shrink-0 rounded-full bg-accent" />
			{children}
		</span>
	)
}
