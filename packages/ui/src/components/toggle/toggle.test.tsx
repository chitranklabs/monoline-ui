import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Toggle } from "./index"

describe("Toggle", () => {
	it("renders as a switch", () => {
		render(<Toggle aria-label="Test toggle" />)
		expect(screen.getByRole("switch")).toBeInTheDocument()
	})

	it("forwards ref", () => {
		const ref = { current: null } as React.RefObject<HTMLButtonElement | null>
		render(<Toggle ref={ref} aria-label="Test toggle" />)
		expect(ref.current).toBeInstanceOf(HTMLButtonElement)
	})

	it("toggles between on and off (uncontrolled)", async () => {
		const user = userEvent.setup()
		render(<Toggle aria-label="Test toggle" />)
		const toggle = screen.getByRole("switch")
		expect(toggle).toHaveAttribute("aria-checked", "false")

		await user.click(toggle)
		expect(toggle).toHaveAttribute("aria-checked", "true")

		await user.click(toggle)
		expect(toggle).toHaveAttribute("aria-checked", "false")
	})

	it("calls onCheckedChange", async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()
		render(<Toggle aria-label="Test toggle" onCheckedChange={onChange} />)
		await user.click(screen.getByRole("switch"))
		expect(onChange).toHaveBeenCalledWith(true)
	})

	it("respects controlled checked prop", () => {
		render(
			<Toggle checked={true} onCheckedChange={() => {}} aria-label="Toggle" />
		)
		expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true")
	})

	it("does not fire onChange when disabled", () => {
		const onChange = vi.fn()
		const { container } = render(
			<Toggle disabled onCheckedChange={onChange} aria-label="Toggle" />
		)
		const toggle = container.querySelector("button")!
		toggle.click()
		expect(onChange).not.toHaveBeenCalled()
	})
})
