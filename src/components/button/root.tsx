import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { ButtonProps, ButtonSize, ButtonVariant } from "./types"

const buttonVariantClasses: Record<ButtonVariant, string> = {
	primary:
		"border-primary bg-primary text-primary-foreground hover:bg-btn-primary-hover",
	secondary:
		"border-border-strong bg-button text-primary hover:bg-button-hover",
	ghost:
		"border-transparent bg-transparent text-body hover:bg-surface-2 hover:text-primary",
	accent: "border-accent bg-accent-soft text-accent hover:bg-accent-soft/75",
	danger:
		"border-destructive bg-destructive/10 text-destructive hover:bg-destructive/15",
}

const buttonSizeClasses: Record<ButtonSize, string> = {
	sm: "h-ml-8 gap-ml-1-5 px-ml-3 text-xs",
	md: "h-ml-9 gap-ml-2 px-ml-4 text-sm",
	lg: "h-ml-10 gap-ml-2 px-ml-5 text-base",
}

const buttonIconSizeClasses: Record<ButtonSize, string> = {
	sm: "w-ml-8 px-0",
	md: "w-ml-9 px-0",
	lg: "w-ml-10 px-0",
}

export function ButtonRoot({
	className,
	children,
	variant = "primary",
	size = "md",
	icon = false,
	pill = false,
	loading = false,
	asChild = false,
	disabled,
	type,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button"
	const isDisabled = disabled || loading

	return (
		<Comp
			type={asChild ? undefined : (type ?? "button")}
			disabled={asChild ? undefined : isDisabled}
			aria-busy={loading || undefined}
			aria-disabled={asChild && isDisabled ? true : undefined}
			data-loading={loading || undefined}
			className={cn(
				"group/btn inline-flex select-none items-center justify-center whitespace-nowrap rounded-md border font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-(--duration-micro) ease-out active:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-45 focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
				buttonVariantClasses[variant],
				buttonSizeClasses[size],
				icon && "aspect-square",
				icon && buttonIconSizeClasses[size],
				pill && "rounded-pill",
				className
			)}
			{...props}
		>
			{loading && !asChild ? (
				<span
					aria-hidden="true"
					className="size-ml-3 rounded-full border border-current border-t-transparent animate-spin"
				/>
			) : null}
			{children}
		</Comp>
	)
}
