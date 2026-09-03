import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Textarea } from "./index"

describe("Textarea", () => {
	it("preserves native form behavior and exposes visual attributes", async () => {
		const user = userEvent.setup()
		render(<Textarea aria-label="Notes" size="lg" resize="none" />)
		const textarea = screen.getByRole("textbox", { name: "Notes" })

		await user.type(textarea, "Release notes")

		expect(textarea).toHaveValue("Release notes")
		expect(textarea).toHaveAttribute("data-size", "lg")
		expect(textarea).toHaveAttribute("data-resize", "none")
	})
})
