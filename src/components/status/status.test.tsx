import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Status } from "./index"

describe("Status", () => {
	it("renders with children", () => {
		render(<Status>Online</Status>)
		expect(screen.getByText("Online")).toBeInTheDocument()
	})

	it("forwards ref", () => {
		const ref = { current: null } as React.RefObject<HTMLSpanElement | null>
		render(<Status ref={ref}>Live</Status>)
		expect(ref.current).toBeInstanceOf(HTMLSpanElement)
	})

	it("renders status dot", () => {
		const { container } = render(<Status>Active</Status>)
		const dot = container.querySelector('[data-slot="status-dot"]')
		expect(dot).toBeInTheDocument()
		expect(dot).toHaveAttribute("aria-hidden", "true")
	})

	it("applies animation data attribute", () => {
		const { container } = render(<Status animate>Live</Status>)
		const dot = container.querySelector('[data-slot="status-dot"]')
		expect(dot).toHaveAttribute("data-animate", "true")
	})
})
