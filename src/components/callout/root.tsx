import { cn } from "../../lib/utils"
import type { CalloutProps, CalloutVariant } from "./types"

const calloutVariantClasses: Record<CalloutVariant, string> = {
	note: "ml-callout--note",
	tip: "ml-callout--tip",
	warn: "ml-callout--warn",
}

const labelVariantClasses: Record<CalloutVariant, string> = {
	note: "text-text-muted",
	tip: "text-callout-tip-accent",
	warn: "text-callout-warn-text",
}

export function CalloutRoot({
	className,
	variant = "note",
	label,
	children,
	ref,
	role = "note",
	...props
}: CalloutProps): React.ReactElement {
	return (
		<aside
			ref={ref}
			role={role}
			className={cn(
				"ml-callout my-6 rounded-md border border-l-2 p-4",
				calloutVariantClasses[variant],
				className
			)}
			{...props}
		>
			<div
				className={cn(
					"mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em]",
					labelVariantClasses[variant]
				)}
			>
				{label ?? variant}
			</div>
			<div className="text-sm leading-[1.6] text-text-secondary">
				{children}
			</div>
		</aside>
	)
}
