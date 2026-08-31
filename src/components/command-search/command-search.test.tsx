import { useState } from "react"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

import { CommandSearch } from "./index"

class ResizeObserverStub {
	disconnect() {}
	observe() {}
	unobserve() {}
}

const originalScrollIntoView = Element.prototype.scrollIntoView

beforeAll(() => {
	vi.stubGlobal("ResizeObserver", ResizeObserverStub)
	Object.defineProperty(Element.prototype, "scrollIntoView", {
		configurable: true,
		value: vi.fn(),
	})
})

afterAll(() => {
	vi.unstubAllGlobals()
	if (originalScrollIntoView) {
		Object.defineProperty(Element.prototype, "scrollIntoView", {
			configurable: true,
			value: originalScrollIntoView,
		})
	} else {
		Reflect.deleteProperty(Element.prototype, "scrollIntoView")
	}
})

function CommandSearchExample({ onSelect = () => {} }) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				Open search
			</button>
			<CommandSearch
				open={open}
				onOpenChange={setOpen}
				placeholder="Search documentation"
			>
				<CommandSearch.Input />
				<CommandSearch.List>
					<CommandSearch.Item value="Button" onSelect={onSelect}>
						Button
					</CommandSearch.Item>
				</CommandSearch.List>
			</CommandSearch>
		</>
	)
}

describe("CommandSearch", () => {
	it("behaves as a labelled modal and returns focus after dismissal", async () => {
		const user = userEvent.setup()
		render(<CommandSearchExample />)

		const trigger = screen.getByRole("button", { name: "Open search" })
		await user.click(trigger)

		expect(
			screen.getByRole("dialog", { name: "Search documentation" })
		).toBeInTheDocument()
		expect(screen.getByRole("combobox")).toHaveFocus()

		await user.keyboard("{Escape}")
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
		await waitFor(() => expect(trigger).toHaveFocus())
	})

	it("selects a result and closes the modal", async () => {
		const user = userEvent.setup()
		const onSelect = vi.fn()
		render(<CommandSearchExample onSelect={onSelect} />)

		await user.click(screen.getByRole("button", { name: "Open search" }))
		await user.click(screen.getByRole("option", { name: "Button" }))

		expect(onSelect).toHaveBeenCalledOnce()
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
	})

	it("opens from the configured keyboard shortcut", async () => {
		const user = userEvent.setup()
		render(<CommandSearchExample />)

		await user.keyboard("{Control>}K{/Control}")

		expect(
			screen.getByRole("dialog", { name: "Search documentation" })
		).toBeInTheDocument()
	})
})
