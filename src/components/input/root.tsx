import { cn } from "../../lib/utils"
import type { InputProps, InputSize, InputVariant } from "./types"

const inputVariantClasses: Record<InputVariant, string> = {
	default: "ml-input--default",
	error: "ml-input--error",
}

const inputSizeClasses: Record<InputSize, string> = {
	sm: "h-ml-8 px-ml-2-5 text-xs",
	md: "h-ml-9 px-ml-3 text-[13px]",
	lg: "h-ml-11 px-ml-3-5 text-sm",
}

export function InputRoot({
	className,
	wrapperClassName,
	variant = "default",
	size = "md",
	prefix,
	suffix,
	ref,
	...props
}: InputProps) {
	return (
		<label
			className={cn(
				"ml-input flex items-center gap-2.5 rounded-md border transition-[border-color,box-shadow,background-color] duration-(--duration-micro)",
				inputVariantClasses[variant],
				inputSizeClasses[size],
				wrapperClassName
			)}
		>
			{prefix && (
				<span className="grid shrink-0 place-items-center text-text-muted">
					{prefix}
				</span>
			)}
			<input
				ref={ref}
				className={cn(
					"min-w-0 flex-1 border-none bg-transparent font-sans text-inherit outline-none placeholder:text-text-muted",
					className
				)}
				{...props}
			/>
			{suffix && <span className="shrink-0 text-text-muted">{suffix}</span>}
		</label>
	)
}
