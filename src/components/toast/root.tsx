import { cn } from "../../lib/utils"
import type { ToastProps, ToastVariant } from "./types"

const dotVariantClasses: Record<ToastVariant, string> = {
	accent: "ml-toast-dot--accent",
	success: "ml-toast-dot--success",
	warn: "ml-toast-dot--warn",
}

export function ToastRoot({
	className,
	variant = "accent",
	children,
	onDismiss,
	ref,
	...props
}: ToastProps) {
	return (
		<div
			ref={ref}
			role="status"
			className={cn(
				"ml-toast flex max-w-[320px] items-center gap-3 rounded-md border px-3.5 py-2.5",
				className
			)}
			{...props}
		>
			<span
				aria-hidden
				className={cn(
					"size-2 shrink-0 rounded-[var(--radius-pill)]",
					dotVariantClasses[variant]
				)}
			/>
			<span className="flex-1 text-[13px] text-(--text-primary)">
				{children}
			</span>
			{onDismiss && (
				<button
					type="button"
					onClick={onDismiss}
					aria-label="Dismiss"
					className="cursor-pointer border-none bg-transparent font-mono text-xs text-(--text-muted) hover:text-(--text-primary)"
				>
					✕
				</button>
			)}
		</div>
	)
}
