import { cn } from "../../lib/utils"
import type { FieldDescriptionProps } from "./types"

export function FieldDescription({
	className,
	ref,
	...props
}: FieldDescriptionProps): React.ReactElement {
	return (
		<p
			ref={ref}
			className={cn("ml-field__description", className)}
			{...props}
		/>
	)
}
