import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Tag } from "./index"

describe("Tag", () => {
	it("renders prefix, value, and suffix correctly in default state", () => {
		render(
			<Tag prefix="Status" suffix="(3)">
				Error
			</Tag>
		)
		expect(screen.getByText("Status")).toBeInTheDocument()
		expect(screen.getByText("Error")).toBeInTheDocument()
		expect(screen.getByText("(3)")).toBeInTheDocument()
	})

	it("renders cross icon when selected and handles onDismiss", () => {
		const onDismiss = vi.fn()
		render(
			<Tag
				prefix="Status"
				selected
				onDismiss={onDismiss}
				dismissAriaLabel="Remove status filter"
			>
				Error
			</Tag>
		)

		const tagBtn = screen.getByRole("button", { name: /StatusError/ })
		expect(tagBtn).toHaveAttribute("data-active", "true")

		const dismissBtn = screen.getByRole("button", {
			name: "Remove status filter",
		})
		expect(dismissBtn).toBeInTheDocument()

		fireEvent.click(dismissBtn)
		expect(onDismiss).toHaveBeenCalledTimes(1)
	})

	it("handles standard click events on the tag", () => {
		const onClick = vi.fn()
		render(<Tag onClick={onClick}>6 errors</Tag>)

		const tagBtn = screen.getByRole("button", { name: "6 errors" })
		fireEvent.click(tagBtn)
		expect(onClick).toHaveBeenCalledTimes(1)
	})

	it("maintains size tokens", () => {
		const { container } = render(<Tag size="sm">Active</Tag>)
		expect(container.firstChild).toHaveClass("text-xs")
		expect(container.firstChild).toHaveClass("rounded-(--radius-pill)")
	})

	it("does not force button-only ARIA semantics onto an asChild element", () => {
		const { container } = render(
			<Tag asChild active>
				<span>React</span>
			</Tag>
		)

		expect(container.firstChild).toHaveAttribute("data-active", "true")
		expect(container.firstChild).not.toHaveAttribute("aria-pressed")
	})
})
