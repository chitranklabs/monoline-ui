import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Field, FieldDescription, FieldError } from "./index"

describe("Field", () => {
	it("exposes description and error semantics", () => {
		render(
			<Field invalid>
				<Field.Description id="hint">Use a work address.</Field.Description>
				<Field.Error id="error">Enter a valid email.</Field.Error>
			</Field>
		)

		expect(screen.getByText("Use a work address.")).toHaveAttribute(
			"id",
			"hint"
		)
		expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email.")
		expect(screen.getByRole("alert").parentElement).toHaveAttribute(
			"data-invalid",
			"true"
		)
	})

	it("also exports the named field helpers", () => {
		expect(Field.Description).toBe(FieldDescription)
		expect(Field.Error).toBe(FieldError)
	})
})
