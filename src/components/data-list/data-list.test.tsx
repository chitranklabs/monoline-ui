import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { DataList } from "./index"

describe("DataList", () => {
	it("renders static items as non-interactive rows", () => {
		render(
			<DataList>
				<DataList.Item title="Static row" description="Read-only content" />
			</DataList>
		)

		expect(screen.queryByRole("button", { name: /static row/i })).toBeNull()
		expect(screen.getByText("Static row")).toBeInTheDocument()
	})

	it("renders clickable items as native buttons", async () => {
		const user = userEvent.setup()
		const onClick = vi.fn()
		render(
			<DataList>
				<DataList.Item title="Open details" onClick={onClick} />
			</DataList>
		)

		const button = screen.getByRole("button", { name: "Open details" })
		expect(button.tagName).toBe("BUTTON")
		expect(button).toHaveAttribute("type", "button")

		await user.click(button)
		expect(onClick).toHaveBeenCalledTimes(1)
	})
})
