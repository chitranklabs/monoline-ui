import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { DropdownMenu } from "./index"

describe("DropdownMenu", () => {
	it("opens from the keyboard and selects an item", async () => {
		const user = userEvent.setup()
		const onSelect = vi.fn()
		render(
			<DropdownMenu>
				<DropdownMenu.Trigger>
					<button type="button">Project actions</button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item onSelect={onSelect}>Duplicate</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu>
		)

		const trigger = screen.getByRole("button", { name: "Project actions" })
		trigger.focus()
		await user.keyboard("{Enter}")
		await user.keyboard("{Enter}")

		expect(onSelect).toHaveBeenCalledTimes(1)
		expect(trigger).toHaveFocus()
	})

	it("does not select disabled items", async () => {
		const user = userEvent.setup()
		const onSelect = vi.fn()
		render(
			<DropdownMenu defaultOpen>
				<DropdownMenu.Trigger>
					<button type="button">Actions</button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item disabled onSelect={onSelect}>
						Unavailable
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu>
		)

		await user.click(screen.getByRole("menuitem", { name: "Unavailable" }))
		expect(onSelect).not.toHaveBeenCalled()
	})
})
