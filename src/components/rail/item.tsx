import { cn } from "../../lib/utils"
import type { RailItemProps } from "./types"

export function RailItem({
	className,
	active = false,
	children,
	...props
}: RailItemProps) {
	return (
		<li
			data-active={active}
			className={cn(
				"flex cursor-pointer items-center gap-2.5 py-2 text-[13px] text-text-secondary transition-colors duration-(--duration-micro)",
				"hover:text-text data-[active=true]:text-text",
				className
			)}
			{...props}
		>
			<span
				aria-hidden
				className={cn(
					"size-1 shrink-0 rounded-[var(--radius-pill)]",
					active ? "bg-accent opacity-100" : "bg-text-muted opacity-40"
				)}
			/>
			<span className="flex flex-1 items-center justify-between">
				{children}
			</span>
		</li>
	)
}
