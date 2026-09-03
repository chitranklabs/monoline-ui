import { cn } from "../../lib/utils"
import type { FieldErrorProps } from "./types"

export function FieldError({
	className,
	ref,
	role = "alert",
	...props
}: FieldErrorProps): React.ReactElement {
	return (
		<p
			ref={ref}
			role={role}
			className={cn("ml-field__error", className)}
			{...props}
		/>
	)
}
