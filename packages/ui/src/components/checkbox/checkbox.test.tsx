import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Checkbox } from "./index"

describe("Checkbox", () => {
	it("supports uncontrolled keyboard interaction", async () => {
		const user = userEvent.setup()
		render(<Checkbox aria-label="Include archived" defaultChecked={false} />)
		const checkbox = screen.getByRole("checkbox", { name: "Include archived" })

		checkbox.focus()
		await user.keyboard(" ")

		expect(checkbox).toBeChecked()
	})

	it("reports controlled changes without mutating its own value", async () => {
		const user = userEvent.setup()
		const onCheckedChange = vi.fn()
		render(
			<Checkbox
				aria-label="Pinned"
				checked={false}
				onCheckedChange={onCheckedChange}
			/>
		)

		await user.click(screen.getByRole("checkbox", { name: "Pinned" }))

		expect(onCheckedChange).toHaveBeenCalledWith(true)
		expect(screen.getByRole("checkbox", { name: "Pinned" })).not.toBeChecked()
	})
})
