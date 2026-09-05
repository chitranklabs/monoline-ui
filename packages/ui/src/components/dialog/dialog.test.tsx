import { useState } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Dialog } from "./index"

function DialogExample() {
	const [open, setOpen] = useState(false)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Trigger>Open profile</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Edit profile</Dialog.Title>
				<Dialog.Description>Update your public details.</Dialog.Description>
				<input aria-label="Display name" />
				<Dialog.Close>Save</Dialog.Close>
			</Dialog.Content>
		</Dialog>
	)
}

describe("Dialog", () => {
	it("labels the modal and returns focus after Escape", async () => {
		const user = userEvent.setup()
		render(<DialogExample />)

		const trigger = screen.getByRole("button", { name: "Open profile" })
		await user.click(trigger)

		const dialog = screen.getByRole("dialog", { name: "Edit profile" })
		expect(dialog).toHaveAttribute("aria-modal", "true")
		expect(screen.getByText("Update your public details.")).toBeInTheDocument()
		expect(dialog).toContainElement(document.activeElement as HTMLElement)

		await user.keyboard("{Escape}")

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
		expect(trigger).toHaveFocus()
	})

	it("keeps Tab navigation inside the modal", async () => {
		const user = userEvent.setup()
		render(<DialogExample />)

		await user.click(screen.getByRole("button", { name: "Open profile" }))
		const input = screen.getByRole("textbox", { name: "Display name" })
		const close = screen.getByRole("button", { name: "Save" })

		input.focus()
		await user.tab()
		expect(close).toHaveFocus()
		await user.tab()
		expect(input).toHaveFocus()
	})
})
