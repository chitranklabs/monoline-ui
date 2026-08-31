import { useState } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Popover } from "./index"

function PopoverExample() {
	const [open, setOpen] = useState(false)

	return (
		<>
			<Popover open={open} onOpenChange={setOpen}>
				<Popover.Trigger>Open details</Popover.Trigger>
				<Popover.Content>
					<label>
						Project name
						<input />
					</label>
					<Popover.Close>Done</Popover.Close>
				</Popover.Content>
			</Popover>
			<button type="button">Outside</button>
		</>
	)
}

describe("Popover", () => {
	it("opens anchored content and returns focus on Escape", async () => {
		const user = userEvent.setup()
		render(<PopoverExample />)

		const trigger = screen.getByRole("button", { name: "Open details" })
		await user.click(trigger)
		expect(screen.getByLabelText("Project name")).toHaveFocus()

		await user.keyboard("{Escape}")

		expect(screen.queryByLabelText("Project name")).not.toBeInTheDocument()
		expect(trigger).toHaveFocus()
	})

	it("dismisses when focus moves outside", async () => {
		const user = userEvent.setup()
		render(<PopoverExample />)

		await user.click(screen.getByRole("button", { name: "Open details" }))
		await user.click(screen.getByRole("button", { name: "Outside" }))

		expect(screen.queryByLabelText("Project name")).not.toBeInTheDocument()
	})
})
