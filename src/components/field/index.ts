/** @module Field */
import { FieldDescription } from "./description"
import { FieldError } from "./error"
import { FieldRoot } from "./root"

export * from "./types"

export const Field: typeof FieldRoot & {
	displayName: string
	Description: typeof FieldDescription
	Error: typeof FieldError
} = Object.assign(FieldRoot, {
	displayName: "Field",
	Description: FieldDescription,
	Error: FieldError,
})

export { FieldDescription, FieldError }
