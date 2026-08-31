import { cn } from "../../lib/utils"
import type { FooterStatusProps } from "./types"

export function FooterStatus({
	children = "Open to work",
	className,
	ref,
	...props
}: FooterStatusProps): React.ReactElement {
	return (
		<span
			ref={ref}
			className={cn(
				"inline-flex items-center gap-ml-2 rounded-full border border-accent bg-accent-soft px-ml-3 py-ml-1 font-mono text-(length:--ml-footer-status-text) font-semibold tracking-(--ml-footer-status-tracking) text-accent uppercase transition-[background-color,border-color] duration-(--duration-micro) ease-(--ease-out) sm:text-(length:--ml-footer-status-text-tablet)",
				className
			)}
			{...props}
		>
			<span className="size-ml-1-5 shrink-0 rounded-full bg-accent" />
			{children}
		</span>
	)
}
