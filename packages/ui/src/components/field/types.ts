import type * as React from "react"

export interface FieldProps extends React.ComponentProps<"div"> {
	invalid?: boolean
	disabled?: boolean
}

export type FieldDescriptionProps = React.ComponentProps<"p">
export type FieldErrorProps = React.ComponentProps<"p">
