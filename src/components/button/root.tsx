import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { ButtonProps, ButtonSize, ButtonVariant } from "./types"

const buttonVariantClasses: Record<ButtonVariant, string> = {
	primary: "ml-btn--primary",
	secondary: "ml-btn--secondary",
	ghost: "ml-btn--ghost",
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
	ref,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button"
	const isUnavailable = disabled || loading
	const content =
		loading && !asChild ? (
			<>
				<span aria-hidden="true" className="ml-button-spinner size-ml-3" />
				{children}
			</>
		) : (
			children
		)

	return (
		<Comp
			ref={ref}
			type={asChild ? undefined : (type ?? "button")}
			disabled={asChild ? undefined : isUnavailable}
			aria-busy={loading || undefined}
			aria-disabled={isUnavailable ? true : undefined}
			data-disabled={disabled || undefined}
			data-loading={loading || undefined}
			data-size={size}
			className={cn(
				"group/btn inline-flex select-none items-center justify-center whitespace-nowrap rounded-md border font-medium transition-[background-color,border-color,color,box-shadow,opacity] duration-(--duration-micro) ease-out disabled:pointer-events-none disabled:cursor-not-allowed data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[loading=true]:pointer-events-none data-[loading=true]:cursor-wait focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
				buttonVariantClasses[variant],
				buttonSizeClasses[size],
				icon && "aspect-square",
				icon && buttonIconSizeClasses[size],
				pill && "rounded-pill",
				className
			)}
			{...props}
		>
			{content}
		</Comp>
	)
}
