import { cn } from "../../lib/utils"
import type { FieldProps } from "./types"

export function FieldRoot({
	className,
	invalid = false,
	disabled = false,
	ref,
	...props
}: FieldProps): React.ReactElement {
	return (
		<div
			ref={ref}
			data-invalid={invalid || undefined}
			data-disabled={disabled || undefined}
			className={cn("ml-field", className)}
			{...props}
		/>
	)
}
