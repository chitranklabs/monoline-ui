import { useState } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it } from "vitest"

import { Select } from "./index"

const originalInnerWidth = window.innerWidth

const options = [
	{ value: "alpha", label: "Alpha", disabled: true },
	{ value: "beta", label: "Beta" },
	{ value: "gamma", label: "Gamma" },
] as const

function SelectExample({ positioned = false }: { positioned?: boolean }) {
	const [value, setValue] = useState<(typeof options)[number]["value"]>("alpha")

	return (
		<Select value={value} onChange={setValue} options={[...options]}>
			<Select.Trigger />
			<Select.Content
				{...(positioned
					? {
							align: "end" as const,
							collisionPadding: 24,
							side: "top" as const,
						}
					: {})}
			/>
		</Select>
	)
}

afterEach(() => {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		value: originalInnerWidth,
	})
})

describe("Select", () => {
	it("uses the anchored listbox behavior and skips disabled options", async () => {
		Object.defineProperty(window, "innerWidth", {
			configurable: true,
			value: 1024,
		})
		const user = userEvent.setup()
		render(<SelectExample />)

		const trigger = screen.getByRole("button")
		await user.click(trigger)
		const listbox = screen.getByRole("listbox", { hidden: true })
		expect(listbox).toHaveFocus()
		expect(listbox).toHaveAttribute(
			"aria-activedescendant",
			expect.stringContaining("option-beta")
		)

		await user.keyboard("{Enter}")
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
		expect(trigger).toHaveTextContent("Beta")
		expect(trigger).toHaveFocus()
	})

	it("uses a labelled modal sheet on mobile and restores trigger focus", async () => {
		Object.defineProperty(window, "innerWidth", {
			configurable: true,
			value: 375,
		})
		const user = userEvent.setup()
		render(<SelectExample />)

		const trigger = screen.getByRole("button")
		await user.click(trigger)

		expect(
			screen.getByRole("dialog", { name: "Choose an option" })
		).toBeInTheDocument()
		expect(screen.getByRole("listbox")).toHaveFocus()

		await user.keyboard("{Escape}")
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
		expect(trigger).toHaveFocus()
	})

	it("forwards desktop placement preferences without leaking them to the listbox", async () => {
		Object.defineProperty(window, "innerWidth", {
			configurable: true,
			value: 1024,
		})
		const user = userEvent.setup()
		render(<SelectExample positioned />)

		await user.click(screen.getByRole("button"))
		const listbox = screen.getByRole("listbox", { hidden: true })

		expect(listbox).toHaveAttribute("data-side")
		expect(listbox).not.toHaveAttribute("side")
		expect(listbox).not.toHaveAttribute("align")
		expect(listbox).not.toHaveAttribute("collisionpadding")
	})
})
