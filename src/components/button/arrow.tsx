import { cn } from "../../lib/utils"
import type { ButtonArrowProps, ButtonIconProps } from "./types"

export function ButtonIcon({
	children,
	className,
	side = "right",
	reveal = false,
	ref,
	...props
}: ButtonIconProps) {
	return (
		<span
			ref={ref}
			aria-hidden="true"
			data-side={side}
			data-reveal={reveal}
			className={cn("ml-button-icon", className)}
			{...props}
		>
			<span className="ml-button-icon__glyph">{children}</span>
		</span>
	)
}

export function ButtonArrow({ reveal = true, ...props }: ButtonArrowProps) {
	return (
		<ButtonIcon side="right" reveal={reveal} {...props}>
			→
		</ButtonIcon>
	)
}
